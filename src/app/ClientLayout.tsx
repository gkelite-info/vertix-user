"use client"

import { usePathname } from "next/navigation"
import Header from "./(components)/header/page"
import { useEffect, useState } from "react"
import Navbar from "./(components)/navbar/page"
import ProtectedRoute from "@/utils/ProtectedRoute"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <main className="overflow-y-auto scrollbar-hide flex">{children}</main>
    )
  }

  const hideLayoutRoutes = ["/login", "/signup", "/consent"]
  const shouldHideLayout = hideLayoutRoutes.includes(pathname)

  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col bg-white">
        {!shouldHideLayout && (
          <div className="sticky top-0 z-50">
            <Header />
          </div>
        )}

        <div className="flex flex-1 w-[100%] mt-0 h-40 gap-5 bg-green-00 rounded-lg">
          {!shouldHideLayout && (
            <div className="w-55 bg-[#1D2B48] sticky top-0 mt-3 rounded-lg shadow-xl">
              <Navbar />
            </div>
          )}

          <main
            className={`flex-1 flex flex-col overflow-y-auto scrollbar-hide bg-[#EBEBEB] rounded-lg
    ${shouldHideLayout ? "mr-0 p-0 mt-0" : "mr-5 p-4 mt-3"}`}
          >
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
