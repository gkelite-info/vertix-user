import React from "react"
import { TableColumn } from "./types"

type Props<T> = {
  columns: TableColumn<T>[]
}

// function TableHeader<T>({ columns }: Props<T>) {
//   return (
//     <div className="w-full h-[45px] overflow-hidden flex items-center  bg-[#4B5873] gap-2">
//       {columns.map((column, index) => (
//         <span
//           key={index}
//           style={{ width: column.width || "auto" }}
//           className="text-[17px] font-medium text-[#FFFEFE]  px-2 py-3"
//         >
//           {column.name}
//         </span>
//       ))}
//     </div>
//   )
// }

// export default TableHeader

function TableHeader<T>({ columns }: Props<T>) {
  return (
    // ✅ CHANGE: added min-w-max for scrollable container
    <div className="w-full flex min-w-max bg-[#4B5873]">
      {columns.map((column, index) => (
        <div
          key={index}
          // ✅ CHANGE: use flex-grow if width not provided for auto sizing
          style={{ width: column.width || "auto", minWidth: "120px" }}
          className="px-3 py-3 font-medium text-white border-r border-gray-300 last:border-r-0 break-words"
        >
          {column.name}
        </div>
      ))}
    </div>
  )
}

export default TableHeader
