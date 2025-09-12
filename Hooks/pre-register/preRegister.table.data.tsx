import { TableColumn } from "@/app/(components)/Table/types"
import { reRegisterClientType } from "./pre-register-client.hook"

export const usePreRegisterTableData = () => {
  const colums: TableColumn<reRegisterClientType>[] = [
    {
      name: "Name",
      width: "25%",
      render: (row: reRegisterClientType) => (
        <span className="w-full flex flex-col gap-0.5 overflow-y-hidden">
          {row.name}
        </span>
      ),
    },
    {
      name: "Email",
      width: "25%",
      render: (row: reRegisterClientType) => (
        <span className="w-full flex flex-col gap-0.5 overflow-y-hidden">
          {row.name}
        </span>
      ),
    },
    {
      name: "Phone",
      width: "25%",
      render: (row: reRegisterClientType) => (
        <span className="w-full flex flex-col gap-0.5 overflow-y-hidden">
          {row.name}
        </span>
      ),
    },
    {
      name: "Country",
      width: "25%",
      render: (row: reRegisterClientType) => (
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
