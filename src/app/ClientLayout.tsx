"use client"

import { usePathname } from "next/navigation"
import Header from "./(components)/header/page"
import { useEffect, useState } from "react"

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
    return <main className="overflow-y-auto scrollbar-hide">{children}</main>
  }

  const hideLayoutRoutes = ["/login", "/signup", "/consent"]

  const shouldHideLayout = hideLayoutRoutes.includes(pathname)

  return (
    <>
      {!shouldHideLayout && <Header />}
      <main className="overflow-y-auto scrollbar-hide">{children}</main>
      {/* {!shouldHideLayout && <Footer />} */}
    </>
  )
}
