import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "./(components)/AuthContext"
import ClientLayout from "./ClientLayout"
import { Toaster } from "react-hot-toast"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Vertix Tax Solutions",
  icons: [
    {
      rel: "icon",
      url: "/images/seo_logo_dark.png",
      media: "(prefers-color-scheme: light)",
    },
    {
      rel: "icon",
      url: "/images/seo_logo_light.png",
      media: "(prefers-color-scheme: dark)",
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              className: "",
              style: {
                fontSize: "18px",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
