"use client"

import { useEffect, useState } from "react"
import HeatMap from "@/components/HeatMap"
import KpiBox from "@/components/KpiBox"
import { AlertTriangle, Clock, XCircle, ExternalLink, Shield } from "lucide-react"
import servicesData from "@/data/services.json"
import Link from "next/link"

interface KpiData {
  incompletePlan: number
  remediationExpired: number
  invalidSelection: number
}

interface CriticalKpiData {
  criticalIncompletePlan: number
  criticalRemediationExpired: number
  criticalInvalidSelection: number
  totalCritical: number
}

// Export the component with a different name for importing elsewhere
export function LandingPageContent() {
  const [kpiData, setKpiData] = useState<KpiData>({
    incompletePlan: 0,
    remediationExpired: 0,
    invalidSelection: 0,
  })

  const [criticalKpiData, setCriticalKpiData] = useState<CriticalKpiData>({
    criticalIncompletePlan: 0,
    criticalRemediationExpired: 0,
    criticalInvalidSelection: 0,
    totalCritical: 0,
  })

  useEffect(() => {
    // Filter critical services
    const criticalServices = servicesData.services.filter((service) => service.category === "Critical")
    const totalCriticalCount = criticalServices.length

    // Calculate KPI data from all services
    const incompletePlanCount = servicesData.services.filter((service) => service.incompletePlan).length
    const remediationExpiredCount = servicesData.services.filter((service) => service.remediationExpired).length
    const invalidSelectionCount = servicesData.services.filter((service) => service.invalidSelection).length

    // Calculate KPI data for critical services only
    const criticalIncompletePlanCount = criticalServices.filter((service) => service.incompletePlan).length
    const criticalRemediationExpiredCount = criticalServices.filter((service) => service.remediationExpired).length
    const criticalInvalidSelectionCount = criticalServices.filter((service) => service.invalidSelection).length

    setKpiData({
      incompletePlan: incompletePlanCount,
      remediationExpired: remediationExpiredCount,
      invalidSelection: invalidSelectionCount,
    })

    setCriticalKpiData({
      criticalIncompletePlan: criticalIncompletePlanCount,
      criticalRemediationExpired: criticalRemediationExpiredCount,
      criticalInvalidSelection: criticalInvalidSelectionCount,
      totalCritical: totalCriticalCount,
    })
  }, [])

  return (
    <div className="flex flex-col items-start py-2">
      <h1 className="text-4xl font-bold mb-4">Welcome to EoS Software Management</h1>
      <p className="text-xl mb-8">Manage your End of Support software inventory efficiently</p>

      {/* Two-column layout for main content */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* KPI Section - All Services */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">EoS AOP Record Issues</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KpiBox
                title="Incomplete Plan"
                value={kpiData.incompletePlan}
                icon={<AlertTriangle />}
                filterKey="incompletePlan"
                filterValue="true"
              />
              <KpiBox
                title="Remediation Expired"
                value={kpiData.remediationExpired}
                icon={<Clock />}
                filterKey="remediationExpired"
                filterValue="true"
              />
              <KpiBox
                title="Invalid Selection"
                value={kpiData.invalidSelection}
                icon={<XCircle />}
                filterKey="invalidSelection"
                filterValue="true"
              />
            </div>
          </div>

          {/* Data Visualization Section - All Services */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Risk Assessment Overview</h2>
            <div className="flex flex-col space-y-6">
              <HeatMap title="Risk Score" scoreType="rasScore" />
              <HeatMap title="Residual Score" scoreType="residualScore" />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* KPI Section - Critical Services */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Shield className="mr-2 text-theme-500" size={24} />
              Critical Services Issues
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KpiBox
                title="Incomplete Plan"
                value={criticalKpiData.criticalIncompletePlan}
                icon={<AlertTriangle />}
                filterKey="incompletePlan"
                filterValue="true"
              />
              <KpiBox
                title="Remediation Expired"
                value={criticalKpiData.criticalRemediationExpired}
                icon={<Clock />}
                filterKey="remediationExpired"
                filterValue="true"
              />
              <KpiBox
                title="Invalid Selection"
                value={criticalKpiData.criticalInvalidSelection}
                icon={<XCircle />}
                filterKey="invalidSelection"
                filterValue="true"
              />
            </div>
          </div>

          {/* Data Visualization Section - Critical Services */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Shield className="mr-2 text-theme-500" size={24} />
              Critical Services Risk Assessment
            </h2>
            <div className="flex flex-col space-y-6">
              <HeatMap title="Critical Services - Risk Score" scoreType="rasScore" categoryFilter="Critical" />
              <HeatMap title="Critical Services - Residual Score" scoreType="residualScore" categoryFilter="Critical" />
            </div>
          </div>
        </div>
      </div>

      {/* Useful Links Section - Full Width */}
      <div className="w-full mt-8">
        <h2 className="text-2xl font-semibold mb-4">Useful Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <Link
              href="https://example.com/eos-documentation"
              className="flex items-center text-theme-600 hover:text-theme-800"
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              <span className="font-medium">EoS Documentation</span>
            </Link>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <Link
              href="https://example.com/remediation-guidelines"
              className="flex items-center text-theme-600 hover:text-theme-800"
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              <span className="font-medium">Remediation Guidelines</span>
            </Link>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <Link
              href="https://example.com/support-portal"
              className="flex items-center text-theme-600 hover:text-theme-800"
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              <span className="font-medium">Support Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Default export for the route
export default function LandingPage() {
  return <LandingPageContent />
}
