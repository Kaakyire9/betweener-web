import type { Metadata } from "next";

import { AdminClient } from "@/app/admin/admin-client";

export const metadata: Metadata = {
  title: "Internal Admin | Betweener",
  description: "Restricted Betweener operations dashboard.",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminPage() {
  return <AdminClient />;
}