import { MagnifyingGlass } from "phosphor-react";



export default function SearchBar() {
    return (
        <>
            <div className="bg-[#1D2B48] h-10 w-[50%] mb-5 rounded-full p-2 pl-4 flex items-center gap-4">
                <MagnifyingGlass size={20} weight="bold" className="text-white cursor-pointer" />
                <input type="text"
                    placeholder="Search here..."
                    className="text-white focus:outline-none"
                />
            </div>
        </>
    )
}