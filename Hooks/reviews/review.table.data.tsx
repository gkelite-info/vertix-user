import { TableColumn } from "@/app/(components)/Table/types"
import { reviewType } from "./review.hook"

export const useReviewTableData = () => {
  const colums: TableColumn<reviewType>[] = [
    {
      name: "Client Name",
      width: "33%",
      render: (row: reviewType) => (
        <span className="w-full flex flex-col gap-0.5 overflow-y-hidden">
          {row.clientName}
        </span>
      ),
    },
    {
      name: "Empty 1",
      width: "33%",
      render: (row: reviewType) => (
        <select className="w-full flex flex-col gap-0.5 overflow-y-hidden outline-none border-none">
          {row.empty1?.map((item, index) => (
            <option key={index}>{item}</option>
          ))}
        </select>
      ),
    },
    {
      name: "Empty 2",
      width: "33%",
      render: (row: reviewType) => (
        <span className="w-full flex flex-col gap-0.5 overflow-y-hidden">
          {row.empty2}
        </span>
      ),
    },
  ]

  return { colums }
}
