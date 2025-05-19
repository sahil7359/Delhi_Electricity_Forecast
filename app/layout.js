import { Geist } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata = {
  title: "Delhi Electricity Demand Forecast",
  description:
    "A dashboard for monitoring and forecasting electricity demand in Delhi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geist.className} bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen`}
      >
        <Navigation />
        <div className="pb-16 md:pt-16 md:pb-0">{children}</div>
      </body>
    </html>
  );
}
