import React from "react"
import TableHeader from "./TableHeader"
import TableItem from "./TableItem"
import { TableProps } from "./types"

// function Table<T>({ columns, data }: TableProps<T>) {
//   return (
//     <div className="w-full flex flex-col shadow rounded-md overflow-hidden">
//       <TableHeader columns={columns} />
//       {data.length > 0 ? (
//         data.map((row, index) => (
//           <TableItem key={index} row={row} columns={columns} />
//         ))
//       ) : (
//         <div className="flex justify-center items-center py-10 text-gray-500 text-lg">
//           No data available
//         </div>
//       )}
//     </div>
//   )
// }

// export default Table

function Table<T>({ columns, data, isLoading }: TableProps<T>) {
  return (
    // ✅ CHANGE: added overflow-x-auto for horizontal scrolling
    <div className="w-full overflow-x-auto">
      <div className="min-w-max">
        {" "}
        {/* ✅ CHANGE: ensures table scrolls if content wide */}
        <TableHeader columns={columns} />
        {/* Table Body */}
        {isLoading ? (
          <div className="flex justify-center items-center py-10 text-gray-500 text-lg">
            Loading...
          </div>
        ) : data.length > 0 ? (
          data.map((row, index) => (
            <TableItem key={index} row={row} columns={columns} />
          ))
        ) : (
          <div className="flex justify-center items-center py-10 text-gray-500 text-lg">
            No data available
          </div>
        )}
      </div>
    </div>
  )
}

export default Table
