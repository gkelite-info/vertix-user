import { TableColumn } from "@/app/(components)/Table/types"
import { rePreparationType } from "./preparation.hook"

export const usePreparationTableData = () => {
  const colums: TableColumn<rePreparationType>[] = [
    {
      name: "Name",
      width: "25%",
      render: (row: rePreparationType) => (
        <span className="w-full flex flex-col gap-0.5 overflow-y-hidden">
          {row.name}
        </span>
      ),
    },
    {
      name: "Email",
      width: "25%",
      render: (row: rePreparationType) => (
        <span className="w-full flex flex-col gap-0.5 overflow-y-hidden">
          {row.name}
        </span>
      ),
    },
    {
      name: "Phone",
      width: "25%",
      render: (row: rePreparationType) => (
        <span className="w-full flex flex-col gap-0.5 overflow-y-hidden">
          {row.name}
        </span>
      ),
    },
    {
      name: "Country",
      width: "25%",
      render: (row: rePreparationType) => (
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
