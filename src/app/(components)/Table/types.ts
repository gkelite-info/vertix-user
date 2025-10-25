import { ReactNode } from "react"

export type TableColumn<T> = {
  name: string | React.ReactNode
  width?: string
  render?: (row: T) => ReactNode
}

export type TableProps<T> = {
  columns: TableColumn<T>[]
  data: T[]
  isLoading?: boolean
  currentPage?: number
  pageSize?: number
}

export type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}
