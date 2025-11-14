"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Table from "@/app/(components)/Table/Table"
import { TableColumn } from "@/app/(components)/Table/types"
import CommentModal from "@/utils/commentModel"
import Pagination from "@/app/(components)/Table/pagination"
import toast from "react-hot-toast"
import { getUser } from "@/app/api/supabaseApi/userApi"
import {
  getAllRegisteredClients,
  saveComment,
  updateAssignedUser,
  updateLastActor,
  updateStatus,
  updateSubStatus,
} from "@/app/api/supabaseApi/tax-organizer"
import { getFollowupUsersData } from "@/app/api/supabaseApi/pre-register"
import { useSearchParams } from "next/navigation"
import { FaFilter } from "react-icons/fa"
import ConfirmModal from "@/utils/confirmModel"

type ManageTaxType = {
  filingYearId: number
  customerId: number
  firstname: string
  lastname: string
  timezone: string
  status: string
  sub_status: string
  last_actor: string
  action: string
  comments: string
  assigned: string
  updatedAt: string
}

const getStatusOptions = (tab?: string) => {
  if (tab === "documents-pending") {
    return ["Documents Pending", "Not Interested", "Already Filed"]
  }
  return ["Tax Org Pending", "Not Interested", "Already Filed"]
}

const subStatusOptions = [
  "Select Sub-Status",
  "Voicemail",
  "Call Later",
  "Not Interested",
  "DND",
  "Already Filed",
]

const lastActorOptions = [
  "Additional Documents Pending",
  "Rework Needed",
  "Discussion Pending",
]

const PAGE_SIZE = 25

const ManageTax = () => {
  const [data, setData] = useState<ManageTaxType[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [currentCommentRow, setCurrentCommentRow] =
    useState<ManageTaxType | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [assignedUsers, setAssignedUsers] = useState<string[]>([])

  const [userRole, setUserRole] = useState<string>("")
  const [userName, setUserName] = useState<string>("")
  const [isClientsDataLoading, setIsClientsDataLoading] =
    useState<boolean>(true)
  const [assignedFilter, setAssignedFilter] = useState<string>("")
  const [showAssignedDropdown, setShowAssignedDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const tab = tabParam ?? undefined

  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<{
    type: "status" | "subStatus"
    row: ManageTaxType
    value: string
  } | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsClientsDataLoading(true)
        const appUser = await getUser()
        setUserRole(appUser?.role || "")
        setUserName(appUser?.name || "")
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Something went wrong"
        toast.error(message)
      }
    }
    fetchUser()
  }, [])

  const fetchClients = useCallback(
    async (showLoader = true) => {
      if (!userRole) return

      try {
        if (showLoader) setIsClientsDataLoading(true)
        const { data, totalCount } = await getAllRegisteredClients(
          userRole,
          userName,
          tab || undefined,
          currentPage,
          PAGE_SIZE,
          assignedFilter
        )
        setData(data)
        setTotalCount(totalCount)
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch clients data"
        toast.error(message)
        setData([])
      } finally {
        if (showLoader) setIsClientsDataLoading(false)
      }
    },
    [userRole, userName, tab, currentPage, assignedFilter]
  )

  useEffect(() => {
    if (!userRole) return
    fetchClients(true)
  }, [fetchClients, userRole, userName, tab, currentPage])

  useEffect(() => {
    const getAssignedUsers = async () => {
      try {
        const data = await getFollowupUsersData()
        const names = data.map(
          (user: { name?: string }) => user?.name || ""
        )
        setAssignedUsers(names)
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch assigned users"
        toast.error(message)
      }
    }
    getAssignedUsers()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowAssignedDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleStatusChange = async (row: ManageTaxType, value: string) => {
    if (["Not Interested", "Already Filed"].includes(value)) {
      setPendingAction({ type: "status", row, value })
      setConfirmModalOpen(true)
      return
    }
    try {
      setIsClientsDataLoading(true)
      await updateStatus(row.filingYearId, value)
      await fetchClients(false)
      toast.success("Status updated successfully")
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update status"
      toast.error(message)
    } finally {
      setIsClientsDataLoading(false)
    }
  }

  const handleSubStatusChange = async (row: ManageTaxType, value: string) => {
    if (["Not Interested", "Already Filed"].includes(value)) {
      setPendingAction({ type: "subStatus", row, value })
      setConfirmModalOpen(true)
      return
    }
    try {
      setIsClientsDataLoading(true)
      await updateSubStatus(row.filingYearId, value)
      await fetchClients(false)
      toast.success("Sub-Status updated successfully")
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update sub-status"
      toast.error(message)
    } finally {
      setIsClientsDataLoading(false)
    }
  }

  const handleLastActorChange = async (row: ManageTaxType, value: string) => {
    try {
      setIsClientsDataLoading(true)
      await updateLastActor(row.filingYearId, value)
      await fetchClients(false)
      toast.success("Last Actor updated successfully")
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update last actor"
      toast.error(message)
    } finally {
      setIsClientsDataLoading(false)
    }
  }

  const handleConfirmAction = async () => {
    if (!pendingAction) return
    const { type, row, value } = pendingAction

    try {
      setIsClientsDataLoading(true)
      if (type === "status") {
        await updateStatus(row.filingYearId, value)
        await updateSubStatus(row.filingYearId, null as unknown as string)
      } else {
        await updateSubStatus(row.filingYearId, value)
        await updateStatus(row.filingYearId, null as unknown as string)
      }

      await updateLastActor(row.filingYearId, null as unknown as string)
      await updateAssignedUser(row.filingYearId, null as unknown as string)
      await saveComment(row.filingYearId, "")

      toast.success(
        `${type === "status" ? "Status" : "Sub-Status"} updated and cleared`
      )
      await fetchClients(false)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update"
      toast.error(message)
    } finally {
      setPendingAction(null)
      setConfirmModalOpen(false)
      setIsClientsDataLoading(false)
    }
  }

  const handleAssignedChange = async (row: ManageTaxType, value: string) => {
    try {
      setIsClientsDataLoading(true)
      await updateAssignedUser(row.filingYearId, value)
      await fetchClients(false)
      toast.success("Assigned user updated successfully")
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update assigned user"
      toast.error(message)
    } finally {
      setIsClientsDataLoading(false)
    }
  }

  const handleCommentSave = async (comment: string) => {
    if (!currentCommentRow) return
    try {
      setIsClientsDataLoading(true)
      const updatedBy = userName || (await getUser())?.name || "Unknown"
      await saveComment(currentCommentRow.filingYearId, comment, updatedBy)
      await fetchClients(false)
      toast.success("Comment updated successfully")
      setModalOpen(false)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update comment"
      toast.error(message)
    } finally {
      setIsClientsDataLoading(false)
    }
  }

  const columns: TableColumn<ManageTaxType>[] = [
    { name: "S.No", render: (row) => row.filingYearId },
    { name: "First Name", render: (row) => row.firstname },
    { name: "Last Name", render: (row) => row.lastname },
    { name: "Time Zone", render: (row) => row.timezone },
    { name: "Client Id", render: (row) => row.customerId },
    {
      name: "Status",
      render: (row) => (
        <select
          value={row.status || "Select Status"}
          onChange={(e) => handleStatusChange(row, e.target.value)}
          className="border px-2 py-1 rounded cursor-pointer"
        >
          {getStatusOptions(tab ?? undefined).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      ),
    },
    {
      name: "Last Actor",
      render: (row) => (
        <select
          value={row.last_actor || "Select Last Actor"}
          onChange={(e) => handleLastActorChange(row, e.target.value)}
          className="border px-2 py-1 rounded cursor-pointer"
        >
          <option value="">Select Last Actor</option>
          {lastActorOptions.map((actor) => (
            <option key={actor} value={actor}>
              {actor}
            </option>
          ))}
        </select>
      ),
    },
    {
      name: "Action",
      render: (row) => (
        <button
          onClick={async () => {
            try {
              toast.loading("Generating secure login link...", { id: "taxorg" })

              const customerEmail =
                (row as any)?.customer?.email || (row as any)?.email
              if (!customerEmail) {
                toast.error("Customer email not found", { id: "taxorg" })
                return
              }

              const { generateCustomerLoginLink } = await import(
                "@/app/api/supabaseApi/tax-organizer"
              )

              const magicLink = await generateCustomerLoginLink(customerEmail)
              if (!magicLink) throw new Error("Failed to generate login link")

              toast.success("Redirecting to customer portal...", {
                id: "taxorg",
              })
              window.open(magicLink, "_blank")
            } catch (err: any) {
              console.error("Error opening Tax Organizer:", err)
              toast.error(err?.message || "Failed to open customer portal", {
                id: "taxorg",
              })
            }
          }}
          className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer"
        >
          Tax Organizer
        </button>
      ),
    },

    {
      name: "Sub Status",
      render: (row) => (
        <select
          value={row.sub_status || "Select Sub-Status"}
          onChange={(e) => handleSubStatusChange(row, e.target.value)}
          className="border px-2 py-1 rounded cursor-pointer"
        >
          {subStatusOptions.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
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
    ...(userRole === "super_admin"
      ? [
        {
          name: (
            <div
              className="relative flex items-center gap-2"
              ref={dropdownRef}
            >
              Assigned To
              <FaFilter
                className={`cursor-pointer transition-colors duration-150 ${showAssignedDropdown ? "text-white" : "text-white"
                  } hover:text-white`}
                onClick={(e) => {
                  e.stopPropagation()
                  setShowAssignedDropdown((prev) => !prev)
                }}
              />
              {showAssignedDropdown && (
                <div
                  className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                  style={{
                    position: "absolute",
                    zIndex: 100,
                    overscrollBehavior: "contain",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#9CA3AF #F3F4F6",
                  }}
                  onWheel={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 font-medium ${assignedFilter === ""
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-800"
                      }`}
                    onClick={() => {
                      setAssignedFilter("")
                      setShowAssignedDropdown(false)
                    }}
                  >
                    All
                  </div>
                  {assignedUsers.map((user) => (
                    <div
                      key={user}
                      className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${assignedFilter === user
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-800"
                        }`}
                      onClick={() => {
                        setAssignedFilter(user)
                        setShowAssignedDropdown(false)
                      }}
                    >
                      {user}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ),
          render: (row: ManageTaxType) => (
            <select
              value={row?.assigned || ""}
              onChange={(e) => handleAssignedChange(row, e.target.value)}
              className="border px-2 py-1 rounded cursor-pointer"
            >
              <option value="">Select User</option>
              {assignedUsers.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
          ),
        } as TableColumn<ManageTaxType>,
      ]
      : []),

    {
      name: "Timestamps",
      render: (row) => new Date(row.updatedAt).toLocaleString(),
    },
  ]

  return (
    <div className="w-full p-2 bg-[#EBEBEB] h-[100%] flex flex-col justify-between">
      {tab === "registered-clients" && (
        <h1 className="text-[#1D2B48] font-medium text-lg mb-3">
          Registered Clients
        </h1>
      )}
      {tab === "documents-pending" && (
        <h1 className="text-[#1D2B48] font-medium text-lg mb-3">
          Documents Pending
        </h1>
      )}

      <Table
        columns={columns}
        data={data.slice(
          (currentPage - 1) * PAGE_SIZE,
          currentPage * PAGE_SIZE
        )}
        isLoading={isClientsDataLoading}
      />

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

      <ConfirmModal
        isOpen={confirmModalOpen}
        message="This action cannot be undone. Are you sure you want to continue?"
        onClose={() => {
          setConfirmModalOpen(false)
          setPendingAction(null)
        }}
        onConfirm={handleConfirmAction}
      />
    </div>
  )
}

export default ManageTax
