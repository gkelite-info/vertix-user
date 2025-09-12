import React from "react"
import { TableColumn } from "./types"

type Props<T> = {
  columns: TableColumn<T>[]
}

function TableHeader<T>({ columns }: Props<T>) {
  return (
    <div className="w-full h-[45px] overflow-hidden flex items-center  bg-[#4B5873] gap-2">
      {columns.map((column, index) => (
        <span
          key={index}
          style={{ width: column.width || "auto" }}
          className="text-[17px] font-medium text-[#FFFEFE]  px-2 py-3"
        >
          {column.name}
        </span>
      ))}
    </div>
  )
}

export default TableHeader
