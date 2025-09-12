import React from "react"
import { TableColumn } from "./types"

type Props<T> = {
  row: T
  columns: TableColumn<T>[]
}

function TableItem<T>({ row, columns }: Props<T>) {
  return (
    <div className="w-full flex items-center bg-[#E9E9E9] border-b border-gray-300">
      {columns.map((column, index) => (
        <div
          key={index}
          style={{ width: column.width }}
          className="flex items-center px-2 py-3 border-r border-gray-300 last:border-r-0"
        >
          {column.render ? column.render(row) : null}
        </div>
      ))}
    </div>
  )
}

export default TableItem
