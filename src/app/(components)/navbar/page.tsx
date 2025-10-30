"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useState } from "react"

const navItems = [
  { label: "View Clients", href: "/dashboard" },
  { label: "Pre-Registered Clients", href: "/pre-register" },
  //{ label: "Manage Tax Organizer", href: "/manage-tax" },
  {
    label: "Manage Tax Organizer",
    href: "#",
    subItems: [
      {
        label: "Registered Clients",
        href: "/manage-tax?tab=registered-clients",
      },
      { label: "Documents Pending", href: "/manage-tax?tab=documents-pending" },
    ],
  },
  { label: "Manage Preparations", href: "/preparations" },
  { label: "Manage Reviews", href: "/reviews" },
  { label: "Manage Payments", href: "/payments" },
  { label: "Revert Clients", href: "/revert-client" },
]

export default function Navbar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const isManageTaxActive = () => {
    const tab = searchParams.get("tab")
    return (
      pathname === "/manage-tax" ||
      tab === "registered-clients" ||
      tab === "documents-pending"
    )
  }

  return (
    <div className="bg-[#1D2B48] w-55 p-3 pt-6 flex flex-col gap-3 items-start rounded-lg relative">
      {navItems.map((item) => {
        const isActive =
          item.label === "Manage Tax Organizer"
            ? isManageTaxActive()
            : pathname === item.href ||
              (item.subItems &&
                item.subItems.some((sub) =>
                  pathname.startsWith(sub.href.split("?")[0])
                ))
        const isDropdownOpen = openDropdown === item.label

        return (
          <div
            key={item.href}
            className="relative w-full"
            onMouseEnter={() => setOpenDropdown(item.label)}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <Link
              // style={{
              //   backgroundColor: isActive ? "#ebebeb" : "",
              // }}
              key={item.href}
              href={item.href}
              //className="w-full p-2.5 rounded-md"
              className={`w-full p-2.5 rounded-md flex justify-between items-center transition-colors ${
                isActive ? "bg-[#ebebeb]" : "hover:bg-[#2e3c5d]"
              }`}
            >
              <h3
                className={`text-sm font-medium cursor-pointer transition-colors ${
                  isActive ? "text-black" : "text-white hover:text-red-400"
                }`}
              >
                {item.label}
              </h3>
            </Link>
            {item.subItems && isDropdownOpen && (
              <div className="absolute top-0 left-full ml-0.5 w-48 bg-[#2e3c5d] rounded-md shadow-lg z-50">
                {item.subItems.map((sub) => (
                  <Link
                    key={sub.label}
                    href={sub.href}
                    className="block px-4 py-2 text-sm text-white hover:bg-[#3a4b70] hover:text-red-400 rounded-md"
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
