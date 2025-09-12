"use client";
 
import { usePathname } from "next/navigation";
import Header from "./(components)/header/page";
import { useEffect, useState } from "react";
import Navbar from "./(components)/navbar/page";
import SearchBar from "./(components)/searchbar/page";
 
export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
 
    useEffect(() => {
        setMounted(true);
    }, []);
 
    if (!mounted) {
        return <main className="overflow-y-auto scrollbar-hide flex">{children}</main>;
    }
 
    const hideLayoutRoutes = ["/login", "/signup", "/consent"];
    const shouldHideLayout = hideLayoutRoutes.includes(pathname);
 
    return (
        <div className="h-screen flex flex-col bg-white">
            {!shouldHideLayout && (
                <div className="sticky top-0 z-50">
                    <Header />
                </div>
            )}
 
            <div className="flex flex-1 gap-5 bg-white rounded-lg">
                {!shouldHideLayout && (
                    <div className="w-55 bg-[#1D2B48] sticky top-0 rounded-lg shadow-xl">
                        <Navbar />
                    </div>
                )}
 
                <main className="flex-1 flex flex-col h-144 overflow-y-auto scrollbar-hide bg-[#EBEBEB] p-4 rounded-lg mr-5">
                    <SearchBar />
                    {children}
                </main>
            </div>
        </div>
    );
}
 