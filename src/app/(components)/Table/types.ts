import { ReactNode } from "react"

export type TableColumn<T> = {
  name: string
  width?: string
  render?: (row: T) => ReactNode
}

export type TableProps<T> = {
  columns: TableColumn<T>[]
  data: T[]
}
