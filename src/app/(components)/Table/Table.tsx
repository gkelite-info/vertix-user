import React from "react"
import TableHeader from "./TableHeader"
import TableItem from "./TableItem"
import { TableProps } from "./types"

function Table<T>({ columns, data }: TableProps<T>) {
  return (
    <div className="w-full flex flex-col shadow-medium rounded-md overflow-hidden">
      <TableHeader columns={columns} />
      {data?.map((row, index) => (
        <TableItem key={index} row={row} columns={columns} />
      ))}
    </div>
  )
}

export default Table
