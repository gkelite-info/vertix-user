import Table from "@/app/(components)/Table/Table"
import React from "react"
import { useManageClientTableData } from "../../../../Hooks/Manage-Client/manageClient.table.data"

const ManageClient = () => {
  const { colums } = useManageClientTableData()

  const data = [
    {
      name: "Priya mehta",
      assignees: ["Anna Becker", "priya mehta"],
      assign: "assign",
    },
    {
      name: "Carlos Ruiz",
      assignees: ["Priya Mehta", "Carlos Ruiz"],
      assign: "Assign",
    },
    {
      name: "Anna Becker",
      assignees: ["Carlos Ruiz", "Carlos Ruiz"],
      assign: "Assign",
    },
  ]

  return (
    <div className="w-full p-4">
      <Table columns={colums} data={data} />
    </div>
  )
}

export default ManageClient
