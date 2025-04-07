"use client"

import type React from "react"

import { useState, useEffect } from "react"
import servicesData from "@/data/services.json"

interface HeatMapProps {
  title: string
  scoreType: "rasScore" | "residualScore"
}

const HeatMap: React.FC<HeatMapProps> = ({ title, scoreType }) => {
  const [scoreCounts, setScoreCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    // Count occurrences of each score category
    const counts: Record<string, number> = {}

    servicesData.services.forEach((service) => {
      const score = service[scoreType]
      counts[score] = (counts[score] || 0) + 1
    })

    setScoreCounts(counts)
  }, [scoreType])

  // Define the order of categories from highest risk to lowest
  const categoryOrder = ["Extreme", "Very High", "High", "Medium", "Insignificant", "Compliant", "SaaS-Compliant"]

  // Define colors for each category with updated color scheme
  const categoryColors: Record<string, string> = {
    Extreme: "bg-gray-800 text-white",
    "Very High": "bg-red-600 text-white",
    High: "bg-orange-500 text-white",
    Medium: "bg-yellow-400 text-black",
    Insignificant: "bg-green-400 text-black",
    Compliant: "bg-blue-200 text-black",
    "SaaS-Compliant": "bg-blue-400 text-black",
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>

      {/* Responsive grid - single row on larger screens, two rows on smaller screens */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
        {categoryOrder.map((category) => {
          const count = scoreCounts[category] || 0

          return (
            <div
              key={category}
              className={`${categoryColors[category]} rounded-lg p-4 flex flex-col items-center justify-center aspect-square shadow-sm transition-all duration-300 hover:shadow-md`}
            >
              <div className="font-semibold text-center text-xs sm:text-sm">{category}</div>
              <div className="text-xl sm:text-2xl font-bold mt-2">{count}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HeatMap

