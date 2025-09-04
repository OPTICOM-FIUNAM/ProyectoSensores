'use client'
import { SessionProvider } from "next-auth/react";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
        {children}
    </SessionProvider>  );
}