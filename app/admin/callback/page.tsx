"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const extractHashSession = () => {
  const rawHash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash;
  const hash = new URLSearchParams(rawHash);
  const query = new URLSearchParams(window.location.search);

  return {
    access_token: hash.get("access_token") || query.get("access_token"),
    refresh_token: hash.get("refresh_token") || query.get("refresh_token"),
    expires_in: Number(hash.get("expires_in") || query.get("expires_in") || 3600),
    error: hash.get("error_description") || query.get("error_description") || hash.get("error") || query.get("error")
  };
};

export default function AdminCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Completing secure admin sign in...");

  useEffect(() => {
    const run = async () => {
      const session = extractHashSession();
      if (session.error) {
        setStatus("error");
        setMessage(session.error);
        return;
      }

      if (!session.access_token) {
        setStatus("error");
        setMessage("This sign-in link did not include a valid session. Request a new admin link.");
        return;
      }

      try {
        const res = await fetch("/api/admin/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(session)
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error || "Unable to create admin session");
        }

        setStatus("success");
        setMessage("Admin session secured. Redirecting...");
        window.history.replaceState({}, document.title, "/admin/callback");
        window.setTimeout(() => {
          window.location.replace("/admin");
        }, 700);
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Unable to complete admin sign in");
      }
    };

    void run();
  }, []);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center px-6 py-16">
      <Card>
        <CardContent className="text-center">
          <Badge variant={status === "error" ? "warm" : "trust"}>Internal Admin</Badge>
          <h1 className="mt-5 font-display text-4xl text-foreground">
            {status === "success" ? "Signed in" : status === "error" ? "Sign in failed" : "Securing session"}
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">{message}</p>
          {status === "error" ? (
            <div className="mt-6">
              <Button asChild>
                <Link href="/admin">Back to admin sign in</Link>
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
