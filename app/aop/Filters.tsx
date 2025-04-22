"use client"

import type React from "react"
import { useMemo } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { MultiSelect } from "@/components/ui/multi-select"
import servicesData from "@/data/services.json"

interface FiltersProps {
  filters: Record<string, string[]>
  onFilterChange: (key: string, value: string[]) => void
  onRetrieve: () => void
  isLoading: boolean
}

const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange, onRetrieve, isLoading }) => {
  // Create options for each filter category - memoize to prevent recalculation on every render
  const filterOptions = useMemo(
    () => ({
      division: [
        { value: "all", label: "All" },
        ...Array.from(new Set(servicesData.services.map((service) => service.division))).map((value) => ({
          value,
          label: value,
        })),
      ],
      serviceOwner: [
        { value: "all", label: "All" },
        ...Array.from(new Set(servicesData.services.map((service) => service.serviceOwner))).map((value) => ({
          value,
          label: value,
        })),
      ],
      serviceManager: [
        { value: "all", label: "All" },
        ...Array.from(new Set(servicesData.services.map((service) => service.serviceManager))).map((value) => ({
          value,
          label: value,
        })),
      ],
      name: [
        { value: "all", label: "All" },
        ...Array.from(new Set(servicesData.services.map((service) => service.name))).map((value) => ({
          value,
          label: value,
        })),
      ],
      id: [
        { value: "all", label: "All" },
        ...Array.from(new Set(servicesData.services.map((service) => service.id))).map((value) => ({
          value,
          label: value,
        })),
      ],
      risk: [
        { value: "all", label: "All" },
        ...Array.from(new Set(servicesData.services.map((service) => service.risk))).map((value) => ({
          value,
          label: value,
        })),
      ],
      category: [
        { value: "all", label: "All" },
        ...Array.from(new Set(servicesData.services.map((service) => service.category))).map((value) => ({
          value,
          label: value,
        })),
      ],
      rasScore: [
        { value: "all", label: "All" },
        ...Array.from(new Set(servicesData.services.map((service) => service.rasScore))).map((value) => ({
          value,
          label: value,
        })),
      ],
      residualScore: [
        { value: "all", label: "All" },
        ...Array.from(new Set(servicesData.services.map((service) => service.residualScore))).map((value) => ({
          value,
          label: value,
        })),
      ],
      sensitivityTier: [
        { value: "all", label: "All" },
        ...Array.from(new Set(servicesData.services.map((service) => service.sensitivityTier))).map((value) => ({
          value,
          label: value,
        })),
      ],
      techCyberReviewStatus: [
        { value: "all", label: "All" },
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      incompletePlan: [
        { value: "all", label: "All" },
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      remediationExpired: [
        { value: "all", label: "All" },
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
      invalidSelection: [
        { value: "all", label: "All" },
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
    }),
    [],
  )

  // Helper function to get the selected values for a filter
  const getSelectedValues = (key: string): string[] => {
    const value = filters[key]
    if (Array.isArray(value) && value.length > 0) {
      return value
    }
    return ["all"]
  }

  return (
    <div className="bg-theme-50 p-4 rounded-lg shadow-md relative">
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-theme-500 rounded-l-lg"></div>
      <div className="pl-2">
        <h3 className="text-xl font-semibold mb-4 text-black">Filters</h3>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(filterOptions).map(([key, options]) => (
            <div key={key} className="space-y-1">
              <Label htmlFor={key} className="text-sm font-medium">
                {key === "rasScore"
                  ? "Risk Score"
                  : key === "residualScore"
                    ? "Residual Score"
                    : key === "incompletePlan"
                      ? "Incomplete Plan"
                      : key === "remediationExpired"
                        ? "Remediation Expired"
                        : key === "invalidSelection"
                          ? "Invalid Selection"
                          : key === "name"
                            ? "ServiceName"
                            : key === "id"
                              ? "Service CI"
                              : key === "sensitivityTier"
                                ? "Sensitivity Tier"
                                : key === "techCyberReviewStatus"
                                  ? "Tech & Cyber Review Status"
                                  : key === "category"
                                    ? "Critical/SaaS"
                                    : key.charAt(0).toUpperCase() + key.slice(1)}
              </Label>
              <MultiSelect
                id={key}
                options={options}
                selected={getSelectedValues(key)}
                onChange={(selected) => onFilterChange(key, selected)}
                placeholder={`Select ${key === "name" ? "ServiceName" : key === "id" ? "Service CI" : key === "category" ? "Critical/SaaS" : key.charAt(0).toUpperCase() + key.slice(1)}`}
              />
            </div>
          ))}
        </div>
        <Button
          className="mt-4 bg-theme-500 text-black hover:bg-theme-600 px-4 py-2"
          onClick={onRetrieve}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Retrieve"}
        </Button>
      </div>
    </div>
  )
}

export default Filters
