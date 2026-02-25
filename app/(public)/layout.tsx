import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { PublicShell } from "./public-shell";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicShell>
      <Navbar />
      <main id="main-content">
        {children}
      </main>
      <Footer />
    </PublicShell>
  );
}
