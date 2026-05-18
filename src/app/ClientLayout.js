'use client'

import { useSearchParams } from 'next/navigation'
import Navbar from './components/Navbar'

const ClientLayout = ({ children }) => {
    const searchParams = useSearchParams()
    // sanitize values
    const navbar = searchParams.get('navbar') === '0' ? '0' : '1'

    const footer = searchParams.get('footer') === '0' ? '0' : '1'

    const showNavbar = navbar === '1'
    const showFooter = footer === '1'

    return (

        <div className="min-h-screen flex flex-col overflow-hidden bg-gradient-to-b from-[#fff8e1] to-[#ffffff]">

            {/* Navbar */}
            {showNavbar && <Navbar navbar={navbar} footer={footer} />}

            {/* Main */}
            <main className="flex-1 flex flex-col">
                {children}
            </main>

            {/* Footer */}
            {showFooter && (

                <footer className="border-t border-[#e7dcc2] bg-[#fffdf8] shrink-0">

                    <div className="max-w-7xl mx-auto px-4 py-4">

                        <p className="text-center font-work text-[13px] md:text-[14px] text-[#666] tracking-wide">

                            © 2026 Designed & Developed by{" "}

                            <span className="text-[#be8c2f] font-semibold">
                                Sharaan Infosystems (R)
                            </span>

                        </p>

                    </div>

                </footer>

            )}

        </div>
    )
}

export default ClientLayout