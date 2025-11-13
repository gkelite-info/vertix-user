"use client";

import { useEffect, useState } from "react";
import Table from "@/app/(components)/Table/Table";
import Pagination from "@/app/(components)/Table/pagination";
import { TableColumn } from "@/app/(components)/Table/types";
import { getAllMessages } from "@/app/api/supabaseApi/messages";

type Message = {
    messageId: number;
    content: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    customer?: {
        firstname: string;
        lastname: string;
        email: string;
    };
    filing_year?: {
        year: string;
    };
};

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 25;

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            const { data, totalCount } = await getAllMessages(currentPage, pageSize);
            setMessages(data);
            setTotalCount(totalCount);
            setLoading(false);
        };

        fetchMessages();
    }, [currentPage]);

    const columns: TableColumn<Message>[] = [
        { name: "S.No", width: "80px" },
        {
            name: "Customer Name",
            render: (row) =>
                row.customer
                    ? `${row.customer.firstname ?? ""} ${row.customer.lastname ?? ""}`
                    : "-",
            width: "180px",
        },
        {
            name: "Email",
            render: (row) => row.customer?.email ?? "-",
            width: "220px",
        },
        {
            name: "Message Content",
            render: (row) => row.content ?? "-",
            width: "400px",
        },
        {
            name: "Status",
            render: (row) => row.status ?? "-",
            width: "120px",
        },
        {
            name: "Filing Year",
            render: (row) => row.filing_year?.year ?? "-",
            width: "120px",
        },
        {
            name: "Created At",
            render: (row) =>
                new Date(row.createdAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                }),
            width: "180px",
        },
    ];

    return (
        <div className="p-2 w-full h-full">
            <h1 className="text-[#1D2B48] font-medium text-lg mb-3">
                Messages
            </h1>

            <Table<Message>
                columns={columns}
                data={messages}
                isLoading={loading}
                currentPage={currentPage}
                pageSize={pageSize}
            />

            <Pagination
                totalItems={totalCount}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
}
