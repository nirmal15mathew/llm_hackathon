import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
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
  title: "LexLlama",
  description: "Your personal study assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="grid grid-rows-6 h-screen">
        <header className="flex w-full p-4">
          <figure className="text-2xl text-white font-bold flex items-center gap-4">
            <div className="w-[50px] h-[50px] overflow-hidden rounded-full">
            <Image src={'/rename.webp'} width={80} height={80} alt="" className="rounded-full object-cover w-[80px] h-[80px]"></Image>
            </div>
            LexLlama
            </figure>
        </header>
        <div className="row-span-5">
        {children}
        </div>
        </div>
      </body>
    </html>
  );
}
