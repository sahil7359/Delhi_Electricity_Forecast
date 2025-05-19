"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ChartBarIcon,
  ChartPieIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/", icon: HomeIcon },
    { name: "Forecast", href: "/forecast", icon: ChartPieIcon },
    { name: "Trends", href: "/trends", icon: ChartBarIcon },
    { name: "About", href: "/about", icon: InformationCircleIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-sm border-t border-slate-700 md:top-0 md:bottom-auto z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around md:justify-start md:space-x-8 h-16">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "text-blue-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <link.icon className="h-6 w-6" />
                <span className="text-xs md:text-sm">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
