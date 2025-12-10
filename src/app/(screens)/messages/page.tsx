"use client";

import { useEffect, useState } from "react";
import Table from "@/app/(components)/Table/Table";
import { TableColumn } from "@/app/(components)/Table/types";
import { getAllMessages } from "@/app/api/supabaseApi/messages";
import { getAllContactInformation } from "@/app/api/supabaseApi/contactAPI";

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

type ContactInfo = {
    contactId: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
    updatedAt: string;
};

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [contacts, setContacts] = useState<ContactInfo[]>([]);
    const [loadingContacts, setLoadingContacts] = useState(true);
    const [contactPage, setContactPage] = useState(1);
    const [contactTotal, setContactTotal] = useState(0);
    const pageSize = 25;

    useEffect(() => {
        let isMounted = true;

        const fetchMessages = async () => {
            setLoading(true);
            const { data, totalCount } = await getAllMessages(currentPage, pageSize);
            if (!isMounted) return;
            setMessages(data);
            setTotalCount(totalCount);
            setLoading(false);
        };

        fetchMessages();

        const interval = setInterval(fetchMessages, 30 * 60 * 1000 );

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [currentPage]);


    useEffect(() => {
        let isMounted = true;

        const fetchContacts = async () => {
            setLoadingContacts(true);
            const { data, totalCount } = await getAllContactInformation(contactPage, pageSize);
            if (!isMounted) return;
            setContacts(data);
            setContactTotal(totalCount);
            setLoadingContacts(false);
        };

        fetchContacts();

        const interval = setInterval(fetchContacts, 30 * 60 * 1000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [contactPage]);


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

    const contactColumns: TableColumn<ContactInfo>[] = [
        { name: "S.No", width: "80px" },
        { name: "Name", render: (row) => row.name, width: "180px" },
        { name: "Email", render: (row) => row.email, width: "220px" },
        { name: "Subject", render: (row) => row.subject, width: "200px" },
        { name: "Message", render: (row) => row.message, width: "350px" },
        { name: "Created At", render: (row) => new Date(row.createdAt).toLocaleString(), width: "180px" },
    ];

    return (
        <div className="p-2 w-full pb-5">
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

            <h1 className="text-[#1D2B48] font-medium text-lg mb-3 mt-5">
                Contact Information
            </h1>
            <Table<ContactInfo>
                columns={contactColumns}
                data={contacts}
                isLoading={loadingContacts}
                currentPage={contactPage}
                pageSize={pageSize}
            />
        </div>
    );
}
