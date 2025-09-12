


export default function Navbar() {
    return (
        <>
            <div className="bg-[#1D2B48] w-55 p-3 pl-5 pt-7 flex flex-col gap-5 items-start rounded-lg">
                <h3 className="text-white font-medium cursor-pointer text-sm hover:text-red-400">View Clients</h3>
                <h3 className="text-white font-medium cursor-pointer text-sm hover:text-red-400">Pre-Register Clients</h3>
                <h3 className="text-white font-medium cursor-pointer text-sm hover:text-red-400">Manage Clients</h3>
                <h3 className="text-white font-medium cursor-pointer text-sm hover:text-red-400">Manage Tax Organizer</h3>
                <h3 className="text-white font-medium cursor-pointer text-sm hover:text-red-400">Manage Preparations</h3>
                <h3 className="text-white font-medium cursor-pointer text-sm hover:text-red-400">Manage Reviews</h3>
                <h3 className="text-white font-medium cursor-pointer text-sm hover:text-red-400">Manage payments</h3>
            </div>
        </>
    )
}