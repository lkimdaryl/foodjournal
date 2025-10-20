import type { Metadata } from "next";
import '@/app/ui/global.css'
import {inter} from '@/app/ui/fonts';
import SideNav from "@/app/components/sidenav";

export const metadata: Metadata = {
  title: "Food Journal",
  description: "This web app empowers food lovers to review meals, share their culinary experiences, and explore what others have tasted. It's a community-driven platform that brings food enthusiasts together, helping each other explore the world of cuisine from the comfort of home.",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`} suppressHydrationWarning={true}> {/*hydration warning supressed due to grammarly extension */}
        <SideNav />  
        {children}
      </body>
    </html>
  );
}

