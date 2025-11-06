/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"
import { Icon } from "@iconify/react"
// import { supabase } from "../../../../utils/supabase/client"
// import { insertCustomer } from "@/app/api/SupabaseAPI/customer/customerApi"

export default function CreateUser() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [, setLoading] = useState(false)
  const [, setEmail] = useState("")
  const [, setEmailError] = useState("")
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [phoneCode, setPhoneCode] = useState("")
  const [phone, setPhone] = useState("")

  const handlePhoneCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (/^[+0-9]*$/.test(val)) {
      setPhoneCode(val)
      setFormData((prev) => ({ ...prev, phone: val + phone }))
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleEmailChange = (e: { target: { value: string } }) => {
    const value = e.target.value
    setEmail(value)
    setFormData((prev) => ({ ...prev, email: value }))

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(value))
      setEmailError("Please enter a valid email address")
    else setEmailError("")
  }

  const handlePhoneChange = (e: { target: { value: string } }) => {
    let value = e.target.value.replace(/[^0-9]/g, "")
    if (value.length > 10) value = value.substring(0, 10)
    setPhone(value)
    setFormData((prev) => ({ ...prev, phone: value }))
  }

  const handleSignup = async () => {
    if (!formData.firstname) return toast.error("First name is required!")
    if (!formData.lastname) return toast.error("Last name is required!")
    if (!formData.email) return toast.error("Email is required!")
    if (!formData.phone) return toast.error("Phone number is required!")
    if (!formData.password) return toast.error("Password is required!")
    if (!formData.confirmPassword)
      return toast.error("Confirm Password is required!")
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!")
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }))
      return
    }

    try {
      setLoading(true)
      toast.success(
        "Registration successful! Please check your email to confirm."
      )
    } catch (err: any) {
      console.error(err)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className=" flex items-center justify-center">
      <div className="w-[90%] max-w-sm bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-semibold text-center text-[#1D2B48] mb-5">
          Create an account
        </h1>

        <div className="space-y-4">
          {/* First & Last Name */}
          <div className="flex gap-3">
            <input
              id="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="First Name"
              className="w-1/2 border-b-2 border-gray-300 text-black font-medium focus:outline-none focus:border-[#1D2B48] px-1 py-2"
            />
            <input
              id="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-1/2 border-b-2 border-gray-300 text-black font-medium focus:outline-none focus:border-[#1D2B48] px-1 py-2"
            />
          </div>

          {/* Email */}
          <div className="flex items-center border-b-2 border-gray-300">
            <Icon
              icon="line-md:email-filled"
              className="text-gray-400 w-5 h-5 mr-2"
            />
            <input
              id="email"
              value={formData.email}
              onChange={handleEmailChange}
              placeholder="Enter your Email Id"
              className="w-full p-2 text-black font-medium focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div className="flex items-center border-b-2 border-gray-300 gap-3">
            <input
              type="text"
              placeholder="+1"
              value={phoneCode}
              onChange={handlePhoneCodeChange}
              className="w-[25%] border rounded-md px-2 py-1 text-black focus:outline-none"
              maxLength={4}
            />
            <input
              type="number"
              placeholder="Enter your Phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              className="flex-1 text-black px-2 py-2 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="flex items-center border-b-2 border-gray-300">
            <Icon
              icon="weui:lock-filled"
              className="text-gray-400 w-5 h-5 mr-2"
            />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full p-2 text-black font-medium focus:outline-none"
            />
            <Icon
              icon={showPassword ? "ri:eye-line" : "ri:eye-close-line"}
              className="text-gray-400 w-5 h-5 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          {/* Confirm Password */}
          <div className="flex items-center border-b-2 border-gray-300">
            <Icon
              icon="weui:lock-filled"
              className="text-gray-400 w-5 h-5 mr-2"
            />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full p-2 text-black font-medium focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleSignup()}
            />
            <Icon
              icon={showConfirmPassword ? "ri:eye-line" : "ri:eye-close-line"}
              className="text-gray-400 w-5 h-5 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 mt-1">
            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 accent-[#1D2B48] cursor-pointer"
            />
            <label htmlFor="remember" className="text-sm text-gray-600">
              Remember Password
            </label>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 items-center mt-3">
            <button
              type="button"
              className="w-full bg-[#1D2B48] text-white py-2.5 rounded-full font-medium hover:bg-[#27385E] transition"
              onClick={handleSignup}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
