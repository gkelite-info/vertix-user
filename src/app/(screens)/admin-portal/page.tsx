"use client"

import { useEffect, useState } from "react"
import Table from "@/app/(components)/Table/Table"
import Pagination from "@/app/(components)/Table/pagination"
import type { TableColumn } from "@/app/(components)/Table/types"
import { getAllUsers } from "@/app/api/supabaseApi/userApi"
import { Eye, EyeSlash } from "phosphor-react"

export type UserItem = {
    id: string
    email: string
    password: string
    full_name: string
    phone: string
    created_at: string
}

export default function AdminPortal() {
    const [users, setUsers] = useState<UserItem[]>([])
    const [page, setPage] = useState(1)
    const [pageSize] = useState(25)
    const [totalCount, setTotalCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [visibility, setVisibility] = useState<Record<string, boolean>>({})

    const togglePassword = (id: string) => {
        setVisibility((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const columns: TableColumn<UserItem>[] = [
        { name: "S.No", width: "80px" },
        { name: "ID", render: (row) => row.id },
        { name: "Email", render: (row) => row.email },
        {
            name: "Password",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <span>
                        {visibility[row.id] ? row.password : "••••••••"}
                    </span>

                    <button onClick={() => togglePassword(row.id)}>
                        {visibility[row.id] ? (
                            <EyeSlash size={18} className="cursor-pointer" />
                        ) : (
                            <Eye size={18} className="cursor-pointer" />
                        )}
                    </button>
                </div>
            ),
        },

        { name: "Name", render: (row) => row.full_name },
        { name: "Phone", render: (row) => row.phone },
        { name: "Created At", render: (row) => row.created_at },
    ]

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const { data, count } = await getAllUsers(page, pageSize)
            setUsers(data)
            setTotalCount(count)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [page])

    return (
        <div className="p-2">
            <h1 className="text-[#1D2B48] font-medium text-lg mb-3">
                Admin Portal
            </h1>

            <Table
                columns={columns}
                data={users}
                isLoading={loading}
                currentPage={page}
                pageSize={pageSize}
            />

            <Pagination
                totalItems={totalCount}
                currentPage={page}
                pageSize={pageSize}
                onPageChange={setPage}
            />
        </div>
    )
}
