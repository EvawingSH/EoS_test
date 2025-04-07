"use client"

import { useEffect, useState } from "react"
import HeatMap from "@/components/HeatMap"
import KpiBox from "@/components/KpiBox"
import { AlertTriangle, Clock, XCircle } from "lucide-react"
import servicesData from "@/data/services.json"

interface KpiData {
  incompletePlan: number
  remediationExpired: number
  invalidSelection: number
}

// Export the component with a different name for importing elsewhere
export function LandingPageContent() {
  const [kpiData, setKpiData] = useState<KpiData>({
    incompletePlan: 0,
    remediationExpired: 0,
    invalidSelection: 0,
  })

  useEffect(() => {
    // Calculate KPI data from services
    const incompletePlanCount = servicesData.services.filter((service) => service.incompletePlan).length
    const remediationExpiredCount = servicesData.services.filter((service) => service.remediationExpired).length
    const invalidSelectionCount = servicesData.services.filter((service) => service.invalidSelection).length

    setKpiData({
      incompletePlan: incompletePlanCount,
      remediationExpired: remediationExpiredCount,
      invalidSelection: invalidSelectionCount,
    })
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <h1 className="text-4xl font-bold mb-4">Welcome to EoS Software Management</h1>
      <p className="text-xl mb-8">Manage your End of Support software inventory efficiently</p>

      {/* KPI Section */}
      <div className="w-full max-w-4xl mb-8">
        <h2 className="text-2xl font-semibold mb-4">EoS AOP Record Issues</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiBox title="Incomplete Plan" value={kpiData.incompletePlan} icon={<AlertTriangle />} />
          <KpiBox title="Remediation Expired" value={kpiData.remediationExpired} icon={<Clock />} />
          <KpiBox title="Invalid Selection" value={kpiData.invalidSelection} icon={<XCircle />} />
        </div>
      </div>

      {/* Data Visualization Section */}
      <div className="w-full max-w-4xl mb-10">
        <h2 className="text-2xl font-semibold mb-4">Risk Assessment Overview</h2>
        <div className="flex flex-col space-y-6">
          <HeatMap title="RAS Score" scoreType="rasScore" />
          <HeatMap title="Residual Score" scoreType="residualScore" />
        </div>
      </div>

      {/* Original Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2">Annual Operating Plan</h2>
          <p>View and manage your software inventory</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2">Software Categorisation</h2>
          <p>Categorize and organize your software</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2">Delta Review</h2>
          <p>Review changes in your software inventory</p>
        </div>
      </div>
    </div>
  )
}

// Default export for the route
export default function LandingPage() {
  return <LandingPageContent />
}

