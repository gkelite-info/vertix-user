"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("sb-support-auth")
    const publicRoutes = ["/login"]
    if (!token) {
      if (!publicRoutes.includes(pathname)) {
        router.replace("/login")
        setIsAllowed(false)
        return
      }
      setIsAllowed(true)
      return
    }

    if (pathname === "/login") {
      router.replace("/dashboard")
      setIsAllowed(false)
      return
    }

    setIsAllowed(true)
  }, [pathname, router])

  if (isAllowed === null) {
    return (
      <div className="flex justify-center items-center h-screen text-[#1D2B48]">
        Loading...
      </div>
    )
  }

  if (isAllowed === false) {
    return null
  }

  return <>{children}</>
}
