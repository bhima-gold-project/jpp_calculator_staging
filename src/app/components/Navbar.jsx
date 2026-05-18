'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'


const Navbar = ({ navbar, footer }) => {
    const pathname = usePathname()
    const [mobileMenu, setMobileMenu] = useState(false)

    const menuItems = [
        {
            title: "Golden Key",
            path: "/goldenkey"
        },
        {
            title: "Shreyas",
            path: "/shreyas"
        },
        {
            title: "Kubera",
            path: "/kubera"
        },
        {
            title: "Samrudhi",
            path: "/samrudhi"
        },
        {
            title: "Ratna",
            path: "/ratna"
        },
    ]

    return (

        <header className="w-full sticky top-0 z-50 backdrop-blur-xl bg-[#fffdf8]/90 border-b border-[#eadfca] shadow-sm">

            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">

                <div className="flex items-center justify-between h-19.5">

                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-3"
                    >

                        {/* <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#d6b36a] to-[#be8c2f] flex items-center justify-center shadow-md">

                            <span className="text-white font-bold text-lg font-arial">
                                J
                            </span>

                        </div> */}

                        <div className="flex flex-col">

                            <h1 className="font-quiche text-[30px] leading-none text-[#be8c2f]">
                                JPP
                            </h1>

                            <span className="font-work text-[11px] tracking-[3px] uppercase text-[#666]">
                                Scheme Calculator
                            </span>

                        </div>

                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden lg:flex items-center gap-2">

                        {menuItems.map((item, index) => {
                            const isActive = pathname === item.path
                            return (

                                <Link
                                    key={index}
                                    href={`${item.path}?navbar=${navbar}&footer=${footer}`}
                                    className={`
                                        px-5 py-2.5 rounded-full font-work text-[15px]
                                        transition-all duration-300

                                       ${isActive
                                            ? 'bg-[#be8c2f] text-white shadow-md'
                                            : 'text-[#444] hover:bg-[#c9a86c] hover:text-white'
                                        }
                                      `}
                                >
                                    {item.title}
                                </Link>

                            )
                        })}

                    </nav>

                    {/* Contact */}
                    <div className="hidden xl:flex items-center gap-3">

                        <div className="text-right">

                            <p className="font-work text-[12px] text-[#777]">
                                Helpline
                            </p>

                            <a
                                href="tel:1800-121-9076"
                                className="font-arial text-[18px] font-semibold text-[#be8c2f]"
                            >
                                1800-121-9076
                            </a>

                        </div>

                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() =>
                            setMobileMenu(!mobileMenu)
                        }
                        className="lg:hidden w-11 h-11 rounded-full border border-[#e7dcc2] flex items-center justify-center text-[#be8c2f]"
                    >

                        {mobileMenu ? (
                            <X size={22} />
                        ) : (
                            <Menu size={22} />
                        )}

                    </button>

                </div>

            </div>

            {/* Mobile Menu */}
            {mobileMenu && (

                <div className="lg:hidden border-t border-[#eadfca] bg-[#fffdf8]">

                    <div className="px-4 py-5 flex flex-col gap-3">

                        {menuItems.map((item, index) => {

                            return (

                                <Link
                                    key={index}
                                    href={`${item.path}?navbar=${navbar}&footer=${footer}`}
                                    onClick={() =>
                                        setMobileMenu(false)
                                    }
                                    className="px-4 py-3 rounded-2xl font-work text-[#444] hover:bg-[#be8c2f] hover:text-white transition-all duration-300"
                                >
                                    {item.title}
                                </Link>

                            )
                        })}

                        {/* Mobile Contact */}
                        <div className="mt-4 border-t border-[#eadfca] pt-4">

                            <p className="font-work text-sm text-[#666]">
                                Bhima Helpline
                            </p>

                            <a
                                href="tel:1800-121-9076"
                                className="font-arial text-xl font-semibold text-[#be8c2f]"
                            >
                                1800-121-9076
                            </a>

                        </div>

                    </div>

                </div>

            )}

        </header>
    )
}

export default Navbar