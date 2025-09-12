import React from "react"
import { useManageTaxTableData } from "../../../../Hooks/Manage-Tax/manage-tax.table.data"
import { useManageTax } from "../../../../Hooks/Manage-Tax/manage-tax.hook"
import Table from "@/app/(components)/Table/Table"

const ManageTax = () => {
  const { colums } = useManageTaxTableData()
  const { data } = useManageTax()
  return (
    <div className="w-full p-4">
      <Table columns={colums} data={data} />
    </div>
  )
}

export default ManageTax
