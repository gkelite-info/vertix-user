import React from "react"
import { useReviewTableData } from "../../../../Hooks/reviews/review.table.data"
import { useReview } from "../../../../Hooks/reviews/review.hook"
import Table from "@/app/(components)/Table/Table"

const Reviews = () => {
  const { colums } = useReviewTableData()
  const { data } = useReview()
  return (
    <div className="w-full p-4">
      <Table columns={colums} data={data} />
    </div>
  )
}

export default Reviews
