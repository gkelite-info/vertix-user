"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

type LogoutModalProps = {
  isOpen: boolean
  onConfirm: () => Promise<void> | void
  onCancel: () => void
}

export default function LogoutModal({
  isOpen,
  onConfirm,
  onCancel,
}: LogoutModalProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    try {
      setLoading(true)
      await onConfirm()
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] sm:w-[380px] text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="font-semibold text-lg text-gray-800 mb-4">
              Want to logout now?
            </h2>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleConfirm}
                disabled={loading}
                className={`${
                  loading
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                } text-sm text-white font-medium px-6 py-2 rounded-full transition duration-200 flex items-center justify-center gap-2`}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Logging Out...
                  </>
                ) : (
                  "Yes, Logout"
                )}
              </button>

              <button
                onClick={onCancel}
                disabled={loading}
                className="bg-gray-300 hover:bg-gray-400 text-sm text-gray-800 font-medium px-6 py-2 rounded-full transition duration-200 cursor-pointer disabled:opacity-50"
              >
                No, Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
