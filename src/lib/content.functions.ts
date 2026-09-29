import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function publicClient() {
  const url = process.env['SUPABASE_URL']!;
  const key = process.env['SUPABASE_PUBLISHABLE_KEY']!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
      headers.set("apikey", key);
      return fetch(input, { ...init, headers });
    } },
  });
}

export const getPublicContent = createServerFn({ method: "GET" }).handler(async () => {
  const client = publicClient();
  const [services, projects, settings] = await Promise.all([
    client.from("services").select("id,slug,title,summary,details,icon,display_order").eq("published", true).order("display_order"),
    client.from("projects").select("id,slug,title,summary,category,location,result,image_url,featured").eq("published", true).order("created_at", { ascending: false }),
    client.from("site_settings").select("company_name,email,phone,location,availability").eq("id", true).maybeSingle(),
  ]);
  if (services.error || projects.error || settings.error) throw new Error("Website content is temporarily unavailable.");
  return { services: services.data ?? [], projects: projects.data ?? [], settings: settings.data };
});

const quoteSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40),
  company: z.string().trim().max(120),
  service: z.string().trim().min(2).max(100),
  equipment: z.string().trim().max(300),
  message: z.string().trim().min(10).max(2000),
  consent: z.literal(true),
  website: z.string().max(0),
});

export const submitQuote = createServerFn({ method: "POST" })
  .inputValidator((data) => quoteSchema.parse(data))
  .handler(async ({ data }) => {
    const forwarded = getRequestHeader("x-forwarded-for") ?? "unknown";
    const requesterIp = forwarded.split(",").at(0)?.trim() ?? "unknown";
    const requesterHash = createHash("sha256").update(requesterIp).digest("hex");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin.from("quote_rate_limits").select("id", { count: "exact", head: true }).eq("requester_hash", requesterHash).gte("created_at", since);
    if ((count ?? 0) >= 4) throw new Error("Too many requests. Please try again later.");
    const { error } = await supabaseAdmin.from("quote_requests").insert({
      full_name: data.fullName, email: data.email, phone: data.phone, company: data.company,
      service: data.service, equipment: data.equipment, message: data.message, consent: true,
    });
    if (error) throw new Error("We could not send your request. Please try again.");
    await supabaseAdmin.from("quote_rate_limits").insert({ requester_hash: requesterHash });
    return { ok: true };
  });

async function requireAdmin(context: { supabase: ReturnType<typeof publicClient>; userId: string }) {
  const { data } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!data) throw new Error("Administrator access required.");
}

export const bootstrapAdmin = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { count } = await supabaseAdmin.from("user_roles").select("id", { count: "exact", head: true });
  if ((count ?? 0) > 0) return { claimed: false };
  const { error } = await supabaseAdmin.from("user_roles").insert({ user_id: context.userId, role: "admin" });
  if (error) throw new Error("Owner access could not be created.");
  return { claimed: true };
});

export const getAdminContent = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  await requireAdmin(context);
  const [services, projects, settings, quotes] = await Promise.all([
    context.supabase.from("services").select("*").order("display_order"),
    context.supabase.from("projects").select("*").order("created_at", { ascending: false }),
    context.supabase.from("site_settings").select("*").eq("id", true).single(),
    context.supabase.from("quote_requests").select("*").order("created_at", { ascending: false }),
  ]);
  if (services.error || projects.error || settings.error || quotes.error) throw new Error("Dashboard content could not be loaded.");
  return { services: services.data, projects: projects.data, settings: settings.data, quotes: quotes.data };
});

const serviceEditSchema = z.object({ id: z.string().uuid().optional(), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), title: z.string().trim().min(2).max(100), summary: z.string().trim().min(10).max(300), details: z.string().trim().max(3000), icon: z.enum(["zap","wrench","battery","shield","activity","settings"]), display_order: z.number().int().min(0), published: z.boolean() });
export const saveService = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => serviceEditSchema.parse(data)).handler(async ({ data, context }) => {
  await requireAdmin(context); const { id, ...values } = data;
  const result = id ? await context.supabase.from("services").update(values).eq("id", id) : await context.supabase.from("services").insert(values);
  if (result.error) throw new Error(result.error.message); return { ok: true };
});

const projectEditSchema = z.object({ id: z.string().uuid().optional(), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), title: z.string().trim().min(2).max(120), summary: z.string().trim().min(10).max(400), category: z.string().trim().min(2).max(80), location: z.string().trim().max(120), result: z.string().trim().max(300), image_url: z.string().trim().max(1000), featured: z.boolean(), published: z.boolean() });
export const saveProject = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => projectEditSchema.parse(data)).handler(async ({ data, context }) => {
  await requireAdmin(context); const { id, ...values } = data;
  const result = id ? await context.supabase.from("projects").update(values).eq("id", id) : await context.supabase.from("projects").insert(values);
  if (result.error) throw new Error(result.error.message); return { ok: true };
});

const settingsSchema = z.object({ company_name: z.string().min(2).max(100), email: z.string().trim().email().or(z.literal("")), phone: z.string().max(40), location: z.string().max(160), availability: z.string().max(240) });
export const saveSettings = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => settingsSchema.parse(data)).handler(async ({ data, context }) => {
  await requireAdmin(context); const { error } = await context.supabase.from("site_settings").update(data).eq("id", true); if (error) throw new Error(error.message); return { ok: true };
});

export const updateQuoteStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => z.object({ id: z.string().uuid(), status: z.enum(["new","contacted","qualified","closed"]) }).parse(data)).handler(async ({ data, context }) => {
  await requireAdmin(context); const { error } = await context.supabase.from("quote_requests").update({ status: data.status }).eq("id", data.id); if (error) throw new Error(error.message); return { ok: true };
});