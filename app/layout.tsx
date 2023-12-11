import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Provider } from "@/components/Providers";
import {Toaster,toast} from "sonner"

const lexend = Lexend({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Generated Course",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(lexend.className, "antialiased min-h-screen pt-16")}>
        <Provider>
          <Navbar />
          {children}
          <Toaster/>
        </Provider>
      </body>
    </html>
  );
}
