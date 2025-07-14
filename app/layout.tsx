import type { Metadata } from "next";
import { Inter, Abril_Fatface } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import NotificationToast from "./components/ui/NotificationToast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const abrilFatface = Abril_Fatface({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-abril",
});

export const metadata: Metadata = {
  title: "My Beer Dashboard",
  description: "Track your beer consumption and keep a record of your tastes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${abrilFatface.variable} font-sans`}>
        <ThemeProvider>
          <NotificationProvider>
            {children}
            <NotificationToast />
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
