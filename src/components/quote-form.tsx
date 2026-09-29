import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitQuote } from "@/lib/content.functions";

export function QuoteForm({ services }: { services: { title: string }[] }) {
  const submit = useServerFn(submitQuote);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setState("sending"); setError("");
    const form = new FormData(event.currentTarget);
    try {
      await submit({ data: { fullName: String(form.get("fullName") ?? ""), email: String(form.get("email") ?? ""), phone: String(form.get("phone") ?? ""), company: String(form.get("company") ?? ""), service: String(form.get("service") ?? ""), equipment: String(form.get("equipment") ?? ""), message: String(form.get("message") ?? ""), consent: form.get("consent") === "on", website: String(form.get("website") ?? "") } });
      setState("sent");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Please try again."); setState("error"); }
  }
  if (state === "sent") return <div className="flex min-h-80 flex-col items-start justify-center"><CheckCircle2 className="size-10 text-primary"/><h3 className="mt-5 text-2xl font-semibold">Request received.</h3><p className="mt-3 max-w-md leading-7 text-muted-foreground">Thank you. The UPS Spe team will review your requirements and respond using the contact details you provided.</p></div>;
  return <form onSubmit={onSubmit} className="grid gap-5" noValidate>
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Full name" name="fullName" required maxLength={100}/><Field label="Work email" name="email" type="email" required maxLength={255}/></div>
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Phone" name="phone" type="tel" maxLength={40}/><Field label="Company" name="company" maxLength={120}/></div>
    <div className="grid gap-2"><Label htmlFor="service">Service needed</Label><select id="service" name="service" required defaultValue="" className="h-11 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"><option value="" disabled>Select a service</option>{services.map((service) => <option key={service.title}>{service.title}</option>)}<option>Other / not sure</option></select></div>
    <Field label="UPS model or equipment details (optional)" name="equipment" maxLength={300}/>
    <div className="grid gap-2"><Label htmlFor="message">Tell us about your requirement</Label><Textarea id="message" name="message" required minLength={10} maxLength={2000} rows={6} className="min-h-36" placeholder="Include the issue, desired timeline, or site context."/></div>
    <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
    <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"><input type="checkbox" name="consent" required className="mt-1 size-4 accent-primary"/><span>I agree that UPS Spe may use these details to respond to my request. See the <Link to="/privacy" className="font-semibold text-foreground underline">privacy policy</Link>.</span></label>
    {state === "error" && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <Button type="submit" variant="hero" size="xl" disabled={state === "sending"}>{state === "sending" && <Loader2 className="animate-spin"/>}Send quote request</Button>
  </form>;
}

function Field({ label, name, ...props }: { label: string; name: string } & React.ComponentProps<typeof Input>) { return <div className="grid gap-2"><Label htmlFor={name}>{label}</Label><Input id={name} name={name} className="h-11" {...props}/></div>; }