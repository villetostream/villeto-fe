"use client";

export default function SettingsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Each settings page manages its own tab bar / header.
  // The layout just provides a clean wrapper.
  return (
    <div className="min-h-screen bg-muted/20">
      {children}
    </div>
  );
}
