"use client"
import React, { useEffect, useState } from "react"

type Props = {
  isOpen: boolean
  initialComment: string
  onClose: () => void
  onSave: (comment: string) => void
}

const CommentModal = ({ isOpen, initialComment, onClose, onSave }: Props) => {
  const [comment, setComment] = useState(initialComment || "")

  useEffect(() => {
    if (isOpen) setComment(initialComment || "")
  }, [initialComment, isOpen])

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
      onClick={handleOutsideClick} // Close on outside click
    >
      <div
        className="bg-white p-6 rounded-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Add/Edit Comment</h2>
        <textarea
          className="w-full h-32 border border-gray-300 p-2 rounded mb-4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
            onClick={() => {
              onSave(comment)
              onClose()
            }}
            disabled={comment.trim().length === 0}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default CommentModal
