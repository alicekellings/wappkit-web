"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trimInput } from "@/lib/input-utils";

export function LicenseAdminLoginForm() {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: trimInput(token),
        }),
      });

      const payload = (await response.json()) as { success?: boolean; message?: string };

      if (!response.ok || !payload.success) {
        throw new Error(payload.message ?? "Admin login failed.");
      }

      window.location.reload();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Admin login failed.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-[2rem] border bg-card p-8 md:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Internal Admin
      </p>
      <h1 className="mt-3 font-heading text-4xl text-foreground">
        License operations console
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        This page is for internal support work only. Enter the admin access
        token to search orders, inspect device bindings, and manually help
        customers move a license to another computer.
      </p>

      <form className="mt-8 max-w-xl space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Admin access token
          </label>
          <Input
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="Enter INTERNAL_ADMIN_TOKEN"
            autoComplete="current-password"
            required
          />
        </div>
        <Button type="submit" rounded="full" disabled={isLoading}>
          {isLoading ? "Opening..." : "Open Admin Console"}
        </Button>
      </form>

      {error ? (
        <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}
    </div>
  );
}
