"use client"

import Pagination from "@/app/(components)/Table/pagination"
import Table from "@/app/(components)/Table/Table"
import { TableColumn } from "@/app/(components)/Table/types"
import { getAllCustomers } from "@/app/api/supabaseApi/userApi"
import { formatDateMMDDYYYY } from "@/utils/formatData"
import { Search } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

type Customer = {
  customerId: string
  firstname: string
  lastname: string
  email: string
  phone: string
  timezone: string
  dob: string
  occupation: string
  country: string
}

const PAGE_SIZE = 25

export default function Dashboard() {
  const [search, setSearch] = useState("")
  const [data, setData] = useState<Customer[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const isFirstRender = useRef<boolean>(true)
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const columns: TableColumn<Customer>[] = [
    { name: "ClientId", render: (row) => row.customerId },
    { name: "First Name", render: (row) => row.firstname },
    { name: "Last Name", render: (row) => row.lastname },
    { name: "Email", render: (row) => row.email },
    { name: "Phone", render: (row) => row.phone },
    { name: "Timezone", render: (row) => row.timezone },
    {
      name: "Date of Birth",
      render: (row) => formatDateMMDDYYYY(row.dob),
    },
    { name: "Occupation", render: (row) => row.occupation },
    { name: "Country", render: (row) => row.country },
  ]

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      setCurrentPage(1)
    }, 500)

    return () => clearTimeout(handler)
  }, [search])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }

    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const res = await getAllCustomers(
          debouncedSearch,
          currentPage,
          PAGE_SIZE
        )
        setData(res.data)
        setTotalCount(res.count)
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch clients"
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    }

    if (debouncedSearch.trim().length > 0) {
      fetchUsers()
    } else {
      setData([])
      setTotalCount(0)
    }
  }, [debouncedSearch, currentPage])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  return (

    <>
      <div className="bg-[#EBEBEB] flex  items-center w-full flex-col h-[100%]">
        <div className="flex items-center bg-[#1D2B48] rounded-full px-3 py-2.5 w-[60%] max-w-3xl">
          <Search className="text-[#FFFFFF] w-5 h-5 mr-2" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search here..."
            className="bg-transparent outline-none text-[#FFFFFF] placeholder-[#FFFFFF] w-full"
          />
        </div>

        {search.trim().length > 0 && (
          <div className="mt-10 w-full flex flex-col justify-between h-[100%]">
            <div className="flex-grow overflow-auto scrollbar-hide">
              <Table
                columns={columns}
                data={data}
                isLoading={isLoading}
              />
            </div>
            <div className="mt-auto py-2">
              {totalCount > 0 && (
                <Pagination
                  totalItems={totalCount}
                  currentPage={currentPage}
                  pageSize={PAGE_SIZE}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}