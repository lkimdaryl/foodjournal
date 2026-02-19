import type { Metadata, Viewport } from "next";
import '@/app/ui/global.css'
import {inter, fraunces} from '@/app/ui/fonts';
import SideNav from "@/app/components/sidenav";
import { AuthProvider } from "@/app/lib/auth-context";

export const metadata: Metadata = {
  title: "Food Journal",
  description: "This web app empowers food lovers to review meals, share their culinary experiences, and explore what others have tasted. It's a community-driven platform that brings food enthusiasts together, helping each other explore the world of cuisine from the comfort of home.",
  icons: {
    icon: '/foodjournal.png',
    shortcut: '/foodjournal.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${fraunces.variable}`} suppressHydrationWarning={true}>
        <AuthProvider>
          <SideNav />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
