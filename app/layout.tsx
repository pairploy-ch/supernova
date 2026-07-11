import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-kanit",
});

export const metadata: Metadata = {
  title: "Supernova Gaming Community",
  description: "ชุมชนเกมเมอร์ระดับโลก - AOV, Mobile Legends, Valorant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={kanit.variable}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
