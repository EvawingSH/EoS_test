"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, Layers, GitCompare, Home } from "lucide-react"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/aop", label: "Annual Operating Plan", icon: BarChart },
  { href: "/categorisation", label: "EoS Software Categorisation", icon: Layers },
  { href: "/delta-review", label: "EoS Software Delta - Review", icon: GitCompare },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="w-72 bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-8 text-black">EoS Software Management</h1>
      <ul className="space-y-4">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center space-x-4 hover:bg-theme-100 p-3 rounded-lg relative ${
                pathname === item.href ? "bg-theme-100" : ""
              }`}
            >
              {pathname === item.href && <div className="absolute left-0 top-0 bottom-0 w-1 bg-theme-500"></div>}
              <item.icon className="w-6 h-6" />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

