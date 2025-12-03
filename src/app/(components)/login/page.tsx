"use client"
import { useAuth } from "../AuthContext"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"
import { supabase } from "@/api-requests/supabaseClient"

function Page() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleEmailChange = (e: { target: { value: string } }) => {
    const value = e.target.value
    setEmail(value)

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address")
    } else {
      setEmailError("")
    }
  }

  const handlePasswordChange = (e: { target: { value: string } }) => {
    const value = e.target.value
    setPassword(value)

    if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters long")
    } else {
      setPasswordError("")
    }
  }

  const { login } = useAuth()

  const handleLogin = async () => {
    try {
      setIsSubmitted(true)

      if (!email) {
        toast.error("Email is required.")
        return
      } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        toast.error("Please enter a valid email address.")
        return
      }

      if (!password) {
        toast.error("Password is required.")
        return
      } else if (password.length < 6) {
        toast.error("Password must be at least 6 characters.")
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error?.message)
        return
      }

      if (data?.session && data?.user) {
        login(data.session?.access_token)
        router.push("/view-clients")
        setTimeout(() => toast.success("Login successful"), 1000)
      }
    } catch (error: unknown) {
      console.log("login error", error)

      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."

      toast.error(message)
      return
    } finally {
      setIsSubmitted(false)
    }
  }

  return (
    <>
      <div className="bg-white lg:h-[100vh] w-[100vw] flex justify-center items-center">
        <div className="flex lg:h-[100%] lg:w-[100%]">
          <div className="bg-[url('/images/login.png')] bg-cover bg-center lg:w-[50%] flex justify-center items-center lg:h-[100%] lg:rounded-4xl">
          </div>
          <div className="bg-red-00 lg:w-[50%] lg:h-[100%] lg:p-4 flex flex-col items-center justify-end">
            <h1 className="lg:text-3xl font-semibold text-black">Login</h1>
            <div className="bg-green-00 lg:h-[85%] lg:w-[95%] lg:p-3 flex flex-col items-center">
              <div className="bg-pink-00 lg:h-[90%] lg:w-[80%] flex flex-col justify-center">
                <div className="lg:w-[100%] lg:h-[10%] flex items-center border border-b-2 border-l-0 border-t-0 border-r-0 border-[#D0D0D0] lg:gap-2">
                  <Icon
                    icon="line-md:email-filled"
                    className="text-[#979797] w-6 h-6"
                  />
                  <input
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your Email Id"
                    className="lg:h-[100%] text-black lg:w-[100%] font-medium lg:p-2 lg:ml-2 border-none focus:outline-none focus:ring-0"
                  />
                </div>
                {emailError && (
                  <p className="text-red-500 text-xs lg:mt-1">{emailError}</p>
                )}
                <div className="lg:w-[100%] lg:h-[10%] flex items-center border border-b-2 border-l-0 border-t-0 border-r-0 border-[#D0D0D0] lg:pr-2 lg:gap-2 lg:mt-8">
                  <Icon
                    icon="weui:lock-filled"
                    className="text-[#979797] w-6 h-6"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your password"
                    className="lg:h-[100%] lg:w-[100%] text-black font-medium lg:p-2 lg:ml-2 border-none focus:outline-none focus:ring-0"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleLogin()
                      }
                    }}
                  />
                  <Icon
                    icon={showPassword ? "ri:eye-line" : "ri:eye-close-line"}
                    className="text-[#979797] w-6 h-6 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
                {passwordError && (
                  <p className="text-red-500 text-xs lg:mt-1">
                    {passwordError}
                  </p>
                )}
                <div className="bg-green-00 lg:h-[20%] flex flex-col lg:gap-2 lg:mt-8 items-center">
                  <button
                    className="text-white lg:h-[65%] lg:w-[100%] text-lg font-medium lg:rounded-full bg-[#1D2B48] cursor-pointer flex items-center justify-center"
                    onClick={handleLogin}
                    disabled={isSubmitted}
                  >
                    {isSubmitted ? (
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "Login"
                    )}
                  </button>
                  <div className="flex lg:gap-2 items-end justify-center lg:h-[35%] lg:w-[80%]">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Page
