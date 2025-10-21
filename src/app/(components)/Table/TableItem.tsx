import React from "react"
import { TableColumn } from "./types"

type Props<T> = {
  row: T
  columns: TableColumn<T>[]
}


function TableItem<T>({ row, columns }: Props<T>) {
  return (
    <tr className="even:bg-[#E9E9E9]">
      {columns.map((column, index) => (
        <td
          key={index}
          style={{ width: column.width }}
          className="px-3 py-3 border border-gray-300 whitespace-nowrap"
        >
          {column.render ? column.render(row) : "-"}
        </td>
      ))}
    </tr>
  )
}

export default TableItem
