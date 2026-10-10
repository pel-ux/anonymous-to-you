import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATY — Anonymous, To You",
  description:
    "A space for honest, anonymous messages. Create your personal link, share it with others, and discover the thoughts people want to share with you.",
  applicationName: "ATY",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
