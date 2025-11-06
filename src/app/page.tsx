"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

function Page() {
  const router = useRouter()

  useEffect(() => {
    router.push("/login")
  }, [router])

  const handlebutton = () => {
    router.push("/login")
  }

  return (
    <>
      {/* <div className="flex flex-col bg-blue-300 lg:h-[100vh] overflow-y-auto">
        <div className="flex justify-center items-center bg-yellow-00 lg:h-[91%]">
          <button className="cursor-pointer text-black" onClick={handlebutton}>
            Login
          </button>
        </div>
      </div> */}
    </>
  )
}

export default Page
