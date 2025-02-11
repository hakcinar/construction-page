import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast'

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Admin Panel",
  description: "Construction Company Admin Panel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} font-poppins antialiased`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
