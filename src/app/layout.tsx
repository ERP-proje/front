// src/app/layout.tsx
"use client";

import "./globals.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { usePathname } from "next/navigation";
import Alert from "./components/ui/Alert";
import Providers from "./providers";
import LoadingOverlay from "./components/LoadingOverlay"; // Import it

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/") {
      router.push("/");
    }
  }, [isAuthenticated, pathname, router]);

  return (
    <html lang="ko">
      <body
        style={{
          backgroundColor: pathname.startsWith("/admin")
            ? "white"
            : "hsl(96, 43%, 73%)",
        }}
        className="antialiased overflow-hidden h-screen m-0 flex items-center justify-center w-full"
      >
        <main className="flex-1 w-full max-w-[1820px] h-fit">
          <Providers>{children}</Providers>
          <Alert />
          {/* LoadingOverlay를 여기에 배치하여 전역으로 작동하도록 함 */}
          <LoadingOverlay />
        </main>
      </body>
    </html>
  );
}
