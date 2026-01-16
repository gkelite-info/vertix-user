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

  const getSerialNumber = (rowIndex: number) => {
    return (currentPage - 1) * PAGE_SIZE + rowIndex + 1
  }

  const columns: TableColumn<Customer>[] = [
    {
      name: "S.No",
      render: (_row, rowIndex?: number) => getSerialNumber(rowIndex ?? 0),
    },
    { name: "ClientId", render: (row) => row.customerId },
    { name: "First Name", render: (row) => row.firstname },
    { name: "Last Name", render: (row) => row.lastname },
    { name: "Email", render: (row) => row.email },
    { name: "Phone", render: (row) => row.phone },
    {
      name: "Action",
      render: (row: Customer) => (
        <button
          onClick={async () => {
            try {
              toast.loading("Generating secure login link...", { id: "taxorg" })

              const customerEmail =
                (row as unknown as { customer?: { email?: string }, email?: string })
                  .customer?.email ??
                (row as unknown as { email?: string }).email
              console.log("Customer email is", customerEmail);
              console.log("Rows are", row);


              if (!customerEmail) {
                toast.error("Customer email not found", { id: "taxorg" })
                return
              }


              const { generateCustomerLoginLink } = await import(
                "@/app/api/supabaseApi/tax-organizer"
              )

              const magicLink = await generateCustomerLoginLink(customerEmail)
              if (!magicLink) throw new Error("Failed to generate login link")

              toast.success("Redirecting to customer portal...", { id: "taxorg" })
              window.open(magicLink, "_blank")
            } catch (err: unknown) {
              const message =
                err instanceof Error ? err.message : "Failed to open customer portal"

              toast.error(message, { id: "taxorg" })
            }
          }}
          className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer"
        >
          Add Service Year
        </button>
      ),
    },
    { name: "Timezone", render: (row) => row.timezone },
    {
      name: "Date of Birth",
      render: (row) => formatDateMMDDYYYY(row.dob),
    },
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
    fetchUsers()
    // if (debouncedSearch.trim().length > 0) {
    //   fetchUsers()
    // } else {
    //   setData([])
    //   setTotalCount(0)
    // }
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

        {/* {search.trim().length > 0 && ( */}
        <div className="mt-10 w-full flex flex-col justify-between h-[100%]">
          <div className="flex-grow overflow-auto scrollbar-hide">
            <Table
              columns={columns}
              data={data}
              isLoading={isLoading}
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
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
        {/* )} */}
      </div>
    </>
  )
}