import React from "react"
import TableHeader from "./TableHeader"
import TableItem from "./TableItem"
import { TableProps } from "./types"

function Table<T>({ columns, data, isLoading }: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full border-collapse">
        <TableHeader columns={columns} />
        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-10 text-center text-gray-500 text-lg whitespace-nowrap"
              >
                Loading...
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((row, index) => (
              <TableItem key={index} row={row} columns={columns} />
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="py-10 text-center text-gray-500 text-lg whitespace-nowrap"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table
