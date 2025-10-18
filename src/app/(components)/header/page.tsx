"use Client"

import { getUser } from "@/app/api/supabaseApi/userApi"
import { useEffect, useState } from "react"

export default function Header() {
  const [user, setUser] = useState<any>(null)
  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUser()
      console.log("userData", data)
      setUser(data)
    }
    //fetchUser()
  }, [])
  return (
    <>
      <div className="sticky top-0 z-50 bg-white h-14 w-full flex items-center justify-between px-5">
        <h1 className="font-medium text-black">Vertix Tax</h1>
        <div className="bg-[#1D2B48] h-[80%] w-[9%] flex items-center justify-center rounded-md">
          <p className="text-white">{user || "UserName"}</p>
        </div>
      </div>
    </>
  )
}
