export const dynamic = "force-dynamic"

import { Suspense } from "react"
import ManageTax from "./ManageTax"

export default function ManageTaxPage() {
  return (
    <Suspense fallback={<div>Loading Manage Tax...</div>}>
      <ManageTax />
    </Suspense>
  )
}
