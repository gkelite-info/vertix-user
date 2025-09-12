import React from "react"
import { usePreRegisterTableData } from "../../../../Hooks/pre-register/preRegister.table.data"
import { usePreRegisterClient } from "../../../../Hooks/pre-register/pre-register-client.hook"
import Table from "@/app/(components)/Table/Table"

const PreRegisterClient = () => {
  const { colums } = usePreRegisterTableData()
  const { data } = usePreRegisterClient()
  return (
    <div className="w-full p-4">
      <Table columns={colums} data={data} />
    </div>
  )
}

export default PreRegisterClient
