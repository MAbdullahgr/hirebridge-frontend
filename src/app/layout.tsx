import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./styles/globals.css";
import "aos/dist/aos.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  preload: true,
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Hire Bridge",
    template: "%s | Hire Bridge", // This creates "Login | Hire Bridge" format
  },
  description:
    "Professional software house delivering web, mobile, and cloud solutions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
