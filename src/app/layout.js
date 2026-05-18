
import localFont from "next/font/local";
import '@mantine/core/styles.css';
import "./globals.css";
import { MantineProvider } from '@mantine/core';
import Navbar from "./components/Navbar";
import ClientLayout from "./ClientLayout";

const workSans = localFont({
  src: "../app/fonts/WorkSans-Regular.ttf",
  variable: "--font-work-sans",
});

const quicheSans = localFont({
  src: "../app/fonts/QuicheSans-Regular.otf",
  variable: "--font-quiche-sans",
});

const arialFont = localFont({
  src: "../app/fonts/Arial.ttf",
  variable: "--font-arial",
});


export const metadata = {
  title: "JPP Calculator",
  description: "Calculate JPP scheme benefits instantly including maturity value, monthly contribution, bonus eligibility, and estimated returns with an easy-to-use calculator."
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`
          ${workSans.variable}
          ${quicheSans.variable}
          ${arialFont.variable}
        `}
    >
      <body className="min-h-screen flex flex-col">
        <MantineProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </MantineProvider>
      </body>
    </html>
  );
}
