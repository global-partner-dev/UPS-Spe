import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const quoteSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email.").max(255),
  phone: z.string().trim().max(40),
  company: z.string().trim().max(120),
  service: z.string().trim().min(2, "Please select a service.").max(100),
  equipment: z.string().trim().max(300),
  message: z.string().trim().min(10, "Please add a few more details.").max(2000),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required." }) }),
  website: z.string().max(0),
});

type QuotePayload = z.infer<typeof quoteSchema>;

function buildMailtoBody(data: QuotePayload) {
  return [
    `Name: ${data.fullName}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    data.company ? `Company: ${data.company}` : null,
    `Service: ${data.service}`,
    data.equipment ? `Equipment: ${data.equipment}` : null,
    "",
    data.message,
  ]
    .filter((line): line is string => line != null)
    .join("\n");
}

export function QuoteForm({
  services,
  contactEmail,
}: {
  services: { title: string }[];
  contactEmail?: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setError("");
    const form = new FormData(event.currentTarget);
    const parsed = quoteSchema.safeParse({
      fullName: String(form.get("fullName") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      company: String(form.get("company") ?? ""),
      service: String(form.get("service") ?? ""),
      equipment: String(form.get("equipment") ?? ""),
      message: String(form.get("message") ?? ""),
      consent: form.get("consent") === "on",
      website: String(form.get("website") ?? ""),
    });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Please check the form and try again.");
      setState("error");
      return;
    }

    const recipient = contactEmail?.trim();
    if (recipient) {
      const subject = encodeURIComponent(`UPS Spe quote request — ${parsed.data.service}`);
      const body = encodeURIComponent(buildMailtoBody(parsed.data));
      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    }

    setState("sent");
  }

  if (state === "sent") {
    return (
      <div className="flex min-h-80 flex-col items-start justify-center">
        <CheckCircle2 className="size-10 text-primary" />
        <h3 className="mt-5 text-2xl font-semibold">Request ready to send.</h3>
        <p className="mt-3 max-w-md leading-7 text-muted-foreground">
          {contactEmail?.trim()
            ? "Your email app should open with the message prepared. Send it when you are ready and we will respond using the contact details you provided."
            : "Thank you. Add a contact email in site settings so quote requests can open in the visitor’s mail app, or share direct contact details on this page."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="fullName" required maxLength={100} />
        <Field label="Work email" name="email" type="email" required maxLength={255} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone" name="phone" type="tel" maxLength={40} />
        <Field label="Company" name="company" maxLength={120} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="service">Service needed</Label>
        <select
          id="service"
          name="service"
          required
          defaultValue=""
          className="h-11 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="" disabled>
            Select a service
          </option>
          {services.map((service) => (
            <option key={service.title}>{service.title}</option>
          ))}
          <option>Other / not sure</option>
        </select>
      </div>
      <Field label="UPS model or equipment details (optional)" name="equipment" maxLength={300} />
      <div className="grid gap-2">
        <Label htmlFor="message">Tell us about your requirement</Label>
        <Textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={6}
          className="min-h-36"
          placeholder="Include the issue, desired timeline, or site context."
        />
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
        <input type="checkbox" name="consent" required className="mt-1 size-4 accent-primary" />
        <span>
          I agree that UPS Spe may use these details to respond to my request. See the{" "}
          <Link to="/privacy" className="font-semibold text-foreground underline">
            privacy policy
          </Link>
          .
        </span>
      </label>
      {state === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" variant="hero" size="xl" disabled={state === "sending"}>
        {state === "sending" && <Loader2 className="animate-spin" />}
        Send quote request
      </Button>
    </form>
  );
}

function Field({ label, name, ...props }: { label: string; name: string } & React.ComponentProps<typeof Input>) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} className="h-11" {...props} />
    </div>
  );
}
