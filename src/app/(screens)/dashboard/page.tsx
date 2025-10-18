/* eslint-disable @typescript-eslint/no-explicit-any */
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
  firstname: string
  lastname: string
  email: string
  phone: string
  dob: string
  occupation: string
  country: string
}

const PAGE_SIZE = 10

export default function Dashboard() {
  const [search, setSearch] = useState("")
  const [data, setData] = useState<Customer[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const isFirstRender = useRef<boolean>(true)

  const columns: TableColumn<Customer>[] = [
    { name: "First Name", width: "20%", render: (row) => row.firstname },
    { name: "Last Name", width: "20%", render: (row) => row.lastname },
    { name: "Email", width: "48%", render: (row) => row.email },
    { name: "Phone", width: "12%", render: (row) => row.phone },
    {
      name: "Date of Birth",
      width: "25%",
      render: (row) => formatDateMMDDYYYY(row.dob),
    },
    { name: "Occupation", width: "34%", render: (row) => row.occupation },
    { name: "Country", render: (row) => row.country },
  ]
  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const data = await getAllCustomers(search)
      setData(data)
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch clients")
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    fetchUsers()
  }, [search])

  const paginatedData = data.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  return (
    <>
      <div className="bg-[#EBEBEB] flex justify-center items-center w-full flex-col">
        <div className="flex items-center bg-[#1D2B48] rounded-full px-3 py-2 w-[60%] max-w-3xl">
          <Search className="text-[#FFFFFF] w-5 h-5 mr-2" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search here..."
            className="bg-transparent outline-none text-[#FFFFFF] placeholder-[#FFFFFF] w-full"
          />
        </div>

        {/* Table */}
        <div className="mt-10 w-full flex flex-col h-[70%] min-h-[400px]">
          <div className="flex-grow overflow-auto scrollbar-hide">
            <Table
              columns={columns}
              data={paginatedData}
              isLoading={isLoading}
            />
          </div>
          <div className="mt-auto py-2">
            {data.length > 0 && (
              <Pagination
                totalItems={data.length} // total data from API
                currentPage={currentPage}
                pageSize={10} // items per page
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
