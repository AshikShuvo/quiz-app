import {ReactNode} from "react";
import Navbar from "@/components/layouts/Navbar.tsx";

export default function LogedinPageLayout({children}: { children: ReactNode }) {
    return (
        <div className="min-h-screen w-full flex flex-col">
            <Navbar/>
            <main className="flex-1 page-container">
                {children}
            </main>
        </div>
    )

}