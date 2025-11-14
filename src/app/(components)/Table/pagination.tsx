import React from "react"

type Props = {
  totalItems: number
  currentPage: number
  pageSize?: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  totalItems,
  currentPage,
  pageSize = 25,
  onPageChange,
}: Props) {
  const totalPages = Math.ceil(totalItems / pageSize)

  if (totalPages === 0) return null

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i)

  return (
    <div className="flex justify-between items-center mt-3">
      <span>{`${startItem}-${endItem} of ${totalItems} items`}</span>

      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          &lt;&lt;
        </button>

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`px-3 py-1 border rounded ${
              currentPage === num ? "bg-gray-700 text-white" : ""
            }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  )
}
