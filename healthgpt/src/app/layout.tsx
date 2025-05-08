import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import AuthSyncWrapper from "@/components/AuthSyncWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "HealthGPT",
  description: "AI-powered health report explainer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ClerkProvider>
        <AuthSyncWrapper>
          <html lang="en">
            <body className={inter.className}>
              <Header />
              <main className="h-screen">{children}</main>
              {/* <Footer /> */}
            </body>
          </html>
        </AuthSyncWrapper>
      </ClerkProvider>
    </ThemeProvider>
  );
}
