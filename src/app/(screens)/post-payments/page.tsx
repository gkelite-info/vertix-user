// ✅ Prevent static rendering issues
export const dynamic = "force-dynamic"

import { Suspense } from "react"
import ManagePostPayments from "./ManagePostPayments"

export default function ManagePostPaymentsPage() {
  return (
    <Suspense fallback={<div>Loading Manage Post Payments...</div>}>
      <ManagePostPayments />
    </Suspense>
  )
}
