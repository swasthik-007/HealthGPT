import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import AuthSyncWrapper from "@/components/AuthSyncWrapper";

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
            <body className="font-sans">
              <Header />
              <main className="h-[895] bg-gradient-to-br from-black to-[#200257]">
                {children}
              </main>
              {/* <Footer />sa */}
            </body>
          </html>
        </AuthSyncWrapper>
      </ClerkProvider>
    </ThemeProvider>
  );
}
