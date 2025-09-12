import { TableColumn } from "@/app/(components)/Table/types"

export type ClientRow = {
  name: string
  assignees: string[]
  assign: string
}

export const useManageClientTableData = () => {
  const colums: TableColumn<ClientRow>[] = [
    {
      name: "Name",
      width: "33%",
      render: (row: ClientRow) => (
        <span className="w-full flex flex-col gap-0.5 overflow-y-hidden">
          {row.name}
        </span>
      ),
    },
    {
      name: "Assignees",
      width: "33%",
      render: (row: ClientRow) => (
        <select className="w-full flex flex-col gap-0.5 overflow-y-hidden outline-none border-none">
          {row.assignees?.map((item, index) => (
            <option key={index}>{item}</option>
          ))}
        </select>
      ),
    },
    {
      name: "Assign",
      width: "33%",
      render: (row: ClientRow) => (
        <span className="w-full flex flex-col gap-0.5 overflow-y-hidden">
          {row.assign}
        </span>
      ),
    },
  ]

  return { colums }
}
