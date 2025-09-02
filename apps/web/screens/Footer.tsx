'use client';

export function Footer() {
  return (
    <footer className="border-t bg-background py-6">
      <div className="container mx-auto flex flex-col items-center space-y-4 px-4 md:flex-row md:justify-between md:space-y-0">
        <span className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} LaunchKit AI. All rights reserved.
        </span>
        <div className="flex space-x-4">
          <a href="/privacy" className="text-sm hover:underline">
            Privacy Policy
          </a>
          <a href="/terms" className="text-sm hover:underline">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
