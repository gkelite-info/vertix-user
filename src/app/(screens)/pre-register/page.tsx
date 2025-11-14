/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import React, { useState, useEffect } from "react"
import Table from "@/app/(components)/Table/Table"
import { TableColumn } from "@/app/(components)/Table/types"
import {
  getAllPreRegisterClients,
  getFollowupUsersData,
  saveComment,
  updateFollowup,
  updateStatus,
} from "@/app/api/supabaseApi/pre-register"
import CommentModal from "@/utils/commentModel"
import Pagination from "@/app/(components)/Table/pagination"
import toast from "react-hot-toast"
import { getUser } from "@/app/api/supabaseApi/userApi"

type PreRegisterClientType = {
  customerId: number
  firstName: string
  lastName: string
  timezone: string
  referId: number
  status: string
  action: string
  comments: string
  followup: string
  updatedAt: string
}

const statusOptions = [
  "Select Status",
  "Not interested",
  "Voice mail",
  "Call later",
  "Already filed",
]

const PAGE_SIZE = 25

const PreRegisterClient = () => {
  const [data, setData] = useState<PreRegisterClientType[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [currentCommentRow, setCurrentCommentRow] =
    useState<PreRegisterClientType | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [followupUsers, setFollowupUsers] = useState<string[]>([])
  const [isLoadingPreClients, setIsLoadingPreClients] = useState<boolean>(true)
  const [totalCount, setTotalCount] = useState(0)

  const fetchClients = async (page = 1) => {
    try {
      setIsLoadingPreClients(true)
      const res = await getAllPreRegisterClients(page, PAGE_SIZE)
      setData(res.data)
      setTotalCount(res.totalCount)
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch pre-register clients")
    } finally {
      setIsLoadingPreClients(false)
    }
  }

  useEffect(() => {
    const getFollowupUsers = async () => {
      try {
        const data = await getFollowupUsersData()
        const names = data.map((user: any) => user?.name)
        setFollowupUsers(names)
      } catch (error: any) {
        toast.error(error?.message || "Failed to fetch followup users")
      }
    }

    fetchClients(currentPage)
    getFollowupUsers()
  }, [currentPage])

  const handleStatusChange = async (
    row: PreRegisterClientType,
    value: string
  ) => {
    try {
      await updateStatus(row.referId, value)
      toast.success("Status updated successfully")
      await fetchClients(currentPage)
    } catch (err: any) {
      toast.error(err?.message || "Failed to update status. Please try again")
    }
  }

  const handleFollowupChange = async (
    row: PreRegisterClientType,
    value: string
  ) => {
    try {
      await updateFollowup(row.referId, value)
      toast.success("Followup updated successfully")
      await fetchClients(currentPage)
    } catch (err: any) {
      toast.error(err?.message || "Failed to update followup. Please try again")
    }
  }

  const handleCommentSave = async (comment: string) => {
    if (!currentCommentRow) return
    try {
      const appUser = await getUser()
      if (!appUser) {
        toast.error("User not authenticated")
        return
      }
      const updatedBy = appUser?.name
      await saveComment(currentCommentRow.referId, comment, updatedBy)
      toast.success("Comment updated successfully")
      setModalOpen(false)
      await fetchClients(currentPage)
    } catch (err: any) {
      toast.error(err?.message || "Failed to update comment. Please try again")
    }
  }

  const columns: TableColumn<PreRegisterClientType>[] = [
    { name: "S.No", render: (row) => row.referId },
    { name: "First Name", render: (row) => row.firstName },
    { name: "Last Name", render: (row) => row.lastName },
    { name: "Time Zone", render: (row) => row.timezone },
    { name: "Referred Id", render: (row) => row.customerId },
    {
      name: "Status",
      render: (row) => (
        <select
          value={row.status || "Select Status"}
          onChange={(e) => handleStatusChange(row, e.target.value)}
          className="border px-2 py-1 rounded cursor-pointer"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      ),
    },
    {
      name: "Action",
      render: () => (
        <button
          onClick={() => window.open("https://vertixtax.com/signup", "_blank")}
          className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer"
        >
          Register
        </button>
      ),
    },
    {
      name: "Comments",
      width: "400px",
      render: (row) => {
        const baseComment = row.comments
          ? row.comments.replace(/\n*\s*Updated by .* at .*\n*$/i, "").trim()
          : ""
        return (
          <div
            onClick={() => {
              setCurrentCommentRow({ ...row, comments: baseComment })
              setModalOpen(true)
            }}
            className="whitespace-pre-line text-sm text-gray-700 cursor-pointer min-h-[3rem]"
          >
            {row.comments || "Add Comment"}
          </div>
        )
      },
    },
    {
      name: "Followup",
      render: (row) => (
        <select
          value={row.followup || ""}
          onChange={(e) => handleFollowupChange(row, e.target.value)}
          className="border px-2 py-1 rounded cursor-pointer"
        >
          <option value="">Select User</option>
          {followupUsers.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
      ),
    },
    {
      name: "Timestamps",
      render: (row) => new Date(row.updatedAt).toLocaleString(),
    },
  ]

  return (
    <div className="w-full p-2 bg-[#EBEBEB] h-[100%] flex flex-col justify-between">
      <h1 className="text-[#1D2B48] font-medium text-lg mb-3">Pre-Registered Clients</h1>
      <Table columns={columns} data={data} isLoading={isLoadingPreClients} />

      {totalCount > 0 && (
        <div className="mt-4">
          <Pagination
            totalItems={totalCount}
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      <CommentModal
        isOpen={modalOpen}
        initialComment={currentCommentRow?.comments || ""}
        onClose={() => setModalOpen(false)}
        onSave={handleCommentSave}
      />
    </div>
  )
}

export default PreRegisterClient
