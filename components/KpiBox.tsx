"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"

interface KpiBoxProps {
  title: string
  value: number
  icon: ReactNode
  filterKey?: string
  filterValue?: string
}

const KpiBox = ({ title, value, icon, filterKey, filterValue }: KpiBoxProps) => {
  const router = useRouter()

  const handleClick = () => {
    if (filterKey && filterValue) {
      router.push(`/aop?${filterKey}=${encodeURIComponent(filterValue)}`)
    }
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 flex items-center border-l-4 border-theme-500 ${filterKey ? "cursor-pointer hover:shadow-lg transition-shadow" : ""}`}
      onClick={handleClick}
    >
      <div className="mr-4 text-2xl text-theme-500">{icon}</div>
      <div>
        <h3 className="text-lg font-medium text-gray-500">{title}</h3>
        <p className="text-3xl font-bold text-black">{value}</p>
      </div>
    </div>
  )
}

export default KpiBox
