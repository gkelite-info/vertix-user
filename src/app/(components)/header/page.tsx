"use client"
import { getUser } from "@/app/api/supabaseApi/userApi"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/api-requests/supabaseClient"
import toast from "react-hot-toast"
import LogoutModal from "@/utils/logoutModel"

export default function Header() {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState(null)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const router = useRouter()
  const hasFetchedUser = useRef(false)

  const fetchUser = async () => {
    try {
      if (hasFetchedUser.current) return
      hasFetchedUser.current = true
      const appUser = await getUser()
      setUserName(appUser?.name)
      setUserId(appUser?.userId)
    } catch (err) {
      console.error("Failed to load user:", err)
    }
  }

  useEffect(() => {
    fetchUser()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          hasFetchedUser.current = false
          fetchUser()
        } else {
          setUserName("")
          setUserId(null)
        }
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setIsLogoutModalOpen(false)
      toast.success("Logged out successfully")

      localStorage.removeItem("sb-support-auth")
      localStorage.removeItem("token")
      router.push("/login")
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Error logging out. Please try again."
      console.error("Logout error:", err)
      toast.error(errorMsg)
    }
  }

  return (
    <>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />

      <div className="sticky top-0 z-50 bg-white h-14 w-full flex items-center justify-between px-5">
        <div className="w-[20%] h-full flex items-center">
          <img
            src="/images/vertix-logo.png"
            alt="vertixLogo"
            className="h-12 object-contain"
          />
        </div>

        <div className="flex items-center justify-end gap-4 h-full">
          
          <div
            className="
              bg-[#1D2B48] h-[80%]
              inline-flex items-center    
              min-w-[200px] max-w-[420px]  
              px-4 rounded-lg shadow-lg
            "
          >
            <div className="text-white flex justify-between gap-6 w-full">
              
              <div className="flex flex-col min-w-0">
                <h5 className="font-semibold text-xs">Name</h5>
                <p
                  className="
                    text-xs font-medium
                    whitespace-nowrap truncate  
                  "
                  title={userName}                  
                >
                  {userName || "-"}
                </p>
              </div>

              <div className="flex flex-col text-end min-w-0">
                <h5 className="font-semibold text-xs">User ID</h5>
                <p
                  className="
                    text-xs font-medium
                    whitespace-nowrap truncate
                  "
                  title={userId ?? ""}
                >
                  {userId || "-"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="bg-[#E63946] text-white text-sm font-medium px-6 h-[80%] rounded-md hover:bg-[#d62828] transition-all shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  )
}
