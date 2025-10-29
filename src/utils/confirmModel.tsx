"use client"
import React from "react"

type Props = {
  isOpen: boolean
  message: string // 🔹 Changed: use message instead of comment
  onClose: () => void
  onConfirm: () => void // 🔹 Changed: renamed from onSave to onConfirm
}

const ConfirmModal = ({ isOpen, message, onClose, onConfirm }: Props) => {
  // 🔹 Removed state and useEffect — no need to track text

  if (!isOpen) return null

  // Handle closing the modal when clicking outside
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-white p-6 rounded-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 🔸 Updated heading */}
        <h2 className="text-lg font-semibold mb-4 text-center">
          Are you sure you want to do this?
        </h2>

        {/* 🔸 Message body */}
        <p className="text-gray-700 mb-6 text-center">{message}</p>

        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
