import React from "react"
import { TableColumn } from "./types"

type Props<T> = {
  columns: TableColumn<T>[]
}

function TableHeader<T>({ columns }: Props<T>) {
  return (
    <thead>
      <tr className="bg-[#4B5873] text-white">
        {columns.map((column, index) => (
          <th
            key={index}
            style={{
              width: column.width || "auto",
              minWidth: column.width || "auto",
            }}
            className="px-3 py-3 text-center border border-gray-300 whitespace-nowrap"
          >
            {column.name}
          </th>
        ))}
      </tr>
    </thead>
  )
}

export default TableHeader
