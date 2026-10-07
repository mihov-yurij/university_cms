import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

// The public half of the app. There is no app/layout.tsx — the admin route
// group carries its own root layout — so this group needs one too, otherwise
// /submit has no <html> to sit in.
export const metadata: Metadata = {
  title: "Збір профілів кафедр — ОНМУ",
  description:
    "Форма для завідувачів кафедр і викладачів: заповніть поля — документ буде згенеровано та надіслано організатору.",
  robots: { index: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
