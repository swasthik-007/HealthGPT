// src/components/Footer.tsx
export default function Footer() {
    return (
      <footer className="w-full border-t border-border bg-background text-muted-foreground py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          &copy; {new Date().getFullYear()} HealthGPT. All rights reserved. |{" "}
          <a href="/policy" className="underline">Privacy</a> |{" "}
          <a href="/terms" className="underline">Terms</a>
        </div>
      </footer>
    );
  }
  