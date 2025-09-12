import { TableColumn } from "@/app/(components)/Table/types"
import { manageTaxType } from "./manage-tax.hook"

export const useManageTaxTableData = () => {
  const colums: TableColumn<manageTaxType>[] = [
    {
      name: "Client Name",
      width: "33%",
      render: (row: manageTaxType) => (
        <span className="w-full flex flex-col gap-0.5 overflow-y-hidden">
          {row.clientName}
        </span>
      ),
    },
    {
      name: "Empty 1",
      width: "33%",
      render: (row: manageTaxType) => (
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
      render: (row: manageTaxType) => (
        <span className="w-full flex flex-col gap-0.5 overflow-y-hidden">
          {row.empty2}
        </span>
      ),
    },
  ]

  return { colums }
}
