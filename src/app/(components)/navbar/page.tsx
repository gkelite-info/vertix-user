"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { label: "View Clients", href: "/clients/view" },
  { label: "Pre-Register Clients", href: "/pre-register" },
  { label: "Manage Clients", href: "/manage-client" },
  { label: "Manage Tax Organizer", href: "/manage-tax" },
  { label: "Manage Preparations", href: "/preparations" },
  { label: "Manage Reviews", href: "/reviews" },
  { label: "Manage Payments", href: "/payments" },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <div className="bg-[#1D2B48] w-55 p-3 pt-6 flex flex-col gap-3 items-start rounded-lg">
      {navItems.map((item) => {
        const isActive = pathname === item.href

        return (
          <Link
            style={{
              backgroundColor: isActive ? "#ebebeb" : "",
            }}
            key={item.href}
            href={item.href}
            className="w-full p-2.5 rounded-md"
          >
            <h3
              className={`text-sm font-medium cursor-pointer transition-colors ${
                isActive ? "text-black" : "text-white hover:text-red-400"
              }`}
            >
              {item.label}
            </h3>
          </Link>
        )
      })}
    </div>
  )
}
