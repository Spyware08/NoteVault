import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/redux/provider";


import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NoteVault",
  description: "Notes and Files",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>

          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#1f2937",
                color: "#fff",
              },
            }}
          />
        </ReduxProvider>

      </body>
    </html>
  );
}
