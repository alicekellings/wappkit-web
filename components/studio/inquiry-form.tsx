"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { studioConfig } from "@/config/studio";
import { studioInquirySchema, type StudioInquiryInput } from "@/lib/validations/inquiry";

const fieldClasses =
  "w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";

/**
 * 表单提交地址按当前主机决定：
 * - studio.wappkit.com 上，/api/inquiry 会被 next.config.js 改写到 /studio/api/inquiry
 * - 主域上直接访问 /studio 时，走 /studio/api/inquiry
 */
function resolveEndpoint() {
  if (typeof window === "undefined") {
    return "/studio/api/inquiry";
  }

  return window.location.hostname.startsWith("studio.")
    ? "/api/inquiry"
    : "/studio/api/inquiry";
}

export function StudioInquiryForm({ defaultTier }: { defaultTier?: string }) {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<StudioInquiryInput>({
    resolver: zodResolver(studioInquirySchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      tier: defaultTier ?? "not-sure",
      platform: studioConfig.platforms[0],
      problem: "",
      budget: "",
      website: "",
    },
  });

  async function onSubmit(values: StudioInquiryInput) {
    try {
      const response = await fetch(resolveEndpoint(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Something went wrong.");
      }

      setSubmitted(true);
      form.reset();
      toast.success("Thanks — we'll get back to you shortly.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not send your message. Please email us directly.",
      );
    }
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-orange-200 bg-orange-50/70 p-6">
        <p className="font-heading text-xl text-foreground">Message received.</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          We read every inquiry ourselves and usually reply within one business day.
          If it is urgent, email us directly and mention this form.
        </p>
        <Button
          type="button"
          variant="outline"
          rounded="full"
          size="sm"
          className="mt-5 px-4"
          onClick={() => setSubmitted(false)}
        >
          Send another
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your name</FormLabel>
                <FormControl>
                  <Input className="rounded-2xl px-4" placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="rounded-2xl px-4"
                    placeholder="jane@company.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company (optional)</FormLabel>
              <FormControl>
                <Input className="rounded-2xl px-4" placeholder="Acme Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Platform</FormLabel>
                <FormControl>
                  <select className={fieldClasses} {...field}>
                    {studioConfig.platforms.map((platform) => (
                      <option key={platform} value={platform}>
                        {platform}
                      </option>
                    ))}
                    <option value="Other">Other / not sure</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What you need</FormLabel>
                <FormControl>
                  <select className={fieldClasses} {...field}>
                    <option value="not-sure">Not sure yet</option>
                    {studioConfig.tiers.map((tier) => (
                      <option key={tier.slug} value={tier.slug}>
                        {tier.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget (optional)</FormLabel>
                <FormControl>
                  <Input className="rounded-2xl px-4" placeholder="e.g. $200–500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="problem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is going wrong?</FormLabel>
              <FormControl>
                <Textarea
                  rows={6}
                  className="rounded-2xl px-4 py-3"
                  placeholder="What the workflow is supposed to do, what it actually does, and any error message you are seeing."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Please do not paste credentials or API keys. Describe the problem instead —
                we never need them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 蜜罐：对真人隐藏，只有爬虫会填 */}
        <div className="hidden" aria-hidden="true">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" {...form.register("website")} />
          </label>
        </div>

        <Button
          type="submit"
          rounded="full"
          size="lg"
          className="w-full px-8 sm:w-auto"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Sending…" : "Send inquiry"}
        </Button>
      </form>
    </Form>
  );
}
