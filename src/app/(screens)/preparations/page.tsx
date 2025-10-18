import React from "react"
import { usePreparationTableData } from "../../../../Hooks/preparation/preparation.table.data"
import { usePreparation } from "../../../../Hooks/preparation/preparation.hook"
import Table from "@/app/(components)/Table/Table"

const Preparations = () => {
  const { colums } = usePreparationTableData()
  const { data } = usePreparation()
  return (
    <div className="w-full p-4">
      <Table columns={colums} data={data} />
    </div>
  )
}

export default Preparations
