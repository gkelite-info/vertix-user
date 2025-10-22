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
          style={{
            width: column.width || "auto",
            minWidth: column.width || "auto",
          }}
          className={`px-3 py-3 border border-gray-300 ${
            column.name === "Comments"
              ? "whitespace-pre-line break-words align-top"
              : "whitespace-nowrap"
          }`}
        >
          {column.render ? column.render(row) : "-"}
        </td>
      ))}
    </tr>
  )
}

export default TableItem
