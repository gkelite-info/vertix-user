import { TableColumn } from "@/app/(components)/Table/types"
import { rePaymentType } from "./payments.hooks"

export const usePreparationTableData = () => {
  const colums: TableColumn<rePaymentType>[] = [
    {
      name: "Name",
      width: "25%",
      render: (row: rePaymentType) => (
        <span className="w-full flex flex-col gap-0.5 overflow-y-hidden">
          {row.name}
        </span>
      ),
    },
    {
      name: "Email",
      width: "25%",
      render: (row: rePaymentType) => (
        <span className="w-full flex flex-col gap-0.5 overflow-y-hidden">
          {row.name}
        </span>
      ),
    },
    {
      name: "Phone",
      width: "25%",
      render: (row: rePaymentType) => (
        <span className="w-full flex flex-col gap-0.5 overflow-y-hidden">
          {row.name}
        </span>
      ),
    },
    {
      name: "Country",
      width: "25%",
      render: (row: rePaymentType) => (
        <span className="w-full flex flex-col gap-0.5 overflow-y-hidden">
          {row.name}
        </span>
      ),
    },
  ]

  return {
    colums,
  }
}
