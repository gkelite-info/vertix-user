import React from "react"
import { TableColumn } from "./types"

type Props<T> = {
  columns: TableColumn<T>[]
}


function TableHeader<T>({ columns }: Props<T>) {
  return (
    <thead>
      <tr className="bg-[#4B5873] text-white font-normal">
        {columns.map((column, index) => (
          <th
            key={index}
            style={{ width: column.width }}
            className="px-3 py-3 text-left border border-gray-300 whitespace-nowrap"
          >
            {column.name}
          </th>
        ))}
      </tr>
    </thead>
  )
}

export default TableHeader
