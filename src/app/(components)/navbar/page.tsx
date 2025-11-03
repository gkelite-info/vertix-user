"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"

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
  {
    label: "Manage Post Payments",
    href: "#",
    subItems: [
      {
        label: "Documents Upload Pending",
        href: "/post-payments?tab=documents-upload-pending",
      },
      {
        label: "Efile Pending",
        href: "/post-payments?tab=efile-pending",
      },
    ],
  },
  { label: "Revert Clients", href: "/revert-client" },
]

function NavbarContent() {
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

  const isManagePostPaymentsActive = () => {
    const tab = searchParams.get("tab")
    return (
      pathname === "/post-payments" ||
      tab === "documents-upload-pending" ||
      tab === "efile-pending"
    )
  }

  return (
    <div className="bg-[#1D2B48] w-55 p-3 pt-6 flex flex-col gap-3 items-start rounded-lg relative">
      {navItems.map((item) => {
        const isActive =
          item.label === "Manage Tax Organizer"
            ? isManageTaxActive()
            : item.label === "Manage Post Payments"
            ? isManagePostPaymentsActive()
            : pathname === item.href ||
              (item.subItems &&
                item.subItems.some((sub) =>
                  pathname.startsWith(sub.href.split("?")[0])
                ))
        const isDropdownOpen = openDropdown === item.label

        return (
          <div
            key={`${item.label}-${item.href}`}
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
              <div className="absolute top-0 left-full ml-0.5 bg-[#2e3c5d] rounded-md shadow-lg z-50 min-w-max">
                {item.subItems.map((sub) => (
                  <Link
                    key={`${sub.label}-${sub.href}`}
                    href={sub.href}
                    className="block px-4 py-2 text-sm text-white hover:bg-[#3a4b70] hover:text-red-400 rounded-md whitespace-nowrap"
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

export default function Navbar() {
  return (
    <Suspense
      fallback={<div className="text-white p-3">Loading Navbar...</div>}
    >
      <NavbarContent />
    </Suspense>
  )
}
