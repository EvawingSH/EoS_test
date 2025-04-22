"use client"

import { useState, useCallback, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Filters from "./Filters"
import ServiceTable from "./ServiceTable"
import servicesData from "@/data/services.json"

interface Service {
  id: string
  name: string
  division: string
  serviceOwner: string
  serviceManager: string
  category: string
  risk: string
  eosDate: string
  rasScore: string
  plan: string
  residualScore: string
  incompletePlan: boolean
  remediationExpired: boolean
  invalidSelection: boolean
  sensitivityTier: string
  techCyberReviewStatus: boolean
}

export default function AOP() {
  const searchParams = useSearchParams()

  // State for all services and filtered services
  const [allServices] = useState<Service[]>(servicesData.services)

  // State for services after dropdown filters are applied
  const [dropdownFilteredServices, setDropdownFilteredServices] = useState<Service[]>(servicesData.services)

  // State for final filtered services (after both dropdown and table filters)
  const [filteredServices, setFilteredServices] = useState<Service[]>(servicesData.services)

  // State for sorting
  const [sortColumn, setSortColumn] = useState("")
  const [sortDirection, setSortDirection] = useState("asc")

  // State for dropdown filters (applied with Retrieve button)
  const [dropdownFilters, setDropdownFilters] = useState<Record<string, string[]>>({
    id: ["all"],
    name: ["all"],
    division: ["all"],
    serviceOwner: ["all"],
    serviceManager: ["all"],
    category: ["all"],
    risk: ["all"],
    eosDate: ["all"],
    rasScore: ["all"],
    plan: ["all"],
    residualScore: ["all"],
    sensitivityTier: ["all"],
    techCyberReviewStatus: ["all"],
    incompletePlan: ["all"],
    remediationExpired: ["all"],
    invalidSelection: ["all"],
  })

  // State for table filters (applied in real-time)
  const [tableFilters, setTableFilters] = useState<Record<string, string>>({
    id: "",
    name: "",
    division: "",
    serviceOwner: "",
    serviceManager: "",
    category: "",
    risk: "",
    eosDate: "",
    rasScore: "",
    plan: "",
    residualScore: "",
    sensitivityTier: "",
    techCyberReviewStatus: "",
    incompletePlan: "",
    remediationExpired: "",
    invalidSelection: "",
  })

  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [initialFilterApplied, setInitialFilterApplied] = useState(false)

  // Read query parameters and set initial filters only once
  useEffect(() => {
    if (initialFilterApplied) return

    const newDropdownFilters = { ...dropdownFilters }
    let hasQueryParams = false

    // Check for rasScore filter
    const rasScore = searchParams.get("rasScore")
    if (rasScore) {
      newDropdownFilters.rasScore = [rasScore]
      hasQueryParams = true
    }

    // Check for residualScore filter
    const residualScore = searchParams.get("residualScore")
    if (residualScore) {
      newDropdownFilters.residualScore = [residualScore]
      hasQueryParams = true
    }

    // Check for boolean filters
    const incompletePlan = searchParams.get("incompletePlan")
    if (incompletePlan === "true") {
      newDropdownFilters.incompletePlan = ["true"]
      hasQueryParams = true
    }

    const remediationExpired = searchParams.get("remediationExpired")
    if (remediationExpired === "true") {
      newDropdownFilters.remediationExpired = ["true"]
      hasQueryParams = true
    }

    const invalidSelection = searchParams.get("invalidSelection")
    if (invalidSelection === "true") {
      newDropdownFilters.invalidSelection = ["true"]
      hasQueryParams = true
    }

    // Check for new boolean filters
    const techCyberReviewStatus = searchParams.get("techCyberReviewStatus")
    if (techCyberReviewStatus === "true") {
      newDropdownFilters.techCyberReviewStatus = ["true"]
      hasQueryParams = true
    }

    // Check for sensitivityTier filter
    const sensitivityTier = searchParams.get("sensitivityTier")
    if (sensitivityTier) {
      newDropdownFilters.sensitivityTier = [sensitivityTier]
      hasQueryParams = true
    }

    if (hasQueryParams) {
      setDropdownFilters(newDropdownFilters)
      // Apply filters immediately if we have query params
      applyFiltersFromParams(newDropdownFilters)
      setInitialFilterApplied(true)
    }
  }, [searchParams, initialFilterApplied])

  // Apply filters from URL parameters (only called once)
  const applyFiltersFromParams = useCallback(
    (filters: Record<string, string[]>) => {
      setIsLoading(true)

      // Apply dropdown filters to get filtered services
      let result = [...allServices]

      // Apply dropdown filters
      Object.entries(filters).forEach(([key, values]) => {
        if (values.length > 0 && !values.includes("all")) {
          if (
            key === "incompletePlan" ||
            key === "remediationExpired" ||
            key === "invalidSelection" ||
            key === "techCyberReviewStatus"
          ) {
            // Handle boolean filters
            const boolValue = values[0] === "true"
            result = result.filter((service) => service[key as keyof Service] === boolValue)
          } else {
            // Handle string filters
            result = result.filter((service) =>
              values.some((value) =>
                String(service[key as keyof Service])
                  .toLowerCase()
                  .includes(value.toLowerCase()),
              ),
            )
          }
        }
      })

      // Update dropdown filtered services
      setDropdownFilteredServices(result)
      setIsLoading(false)
    },
    [allServices],
  )

  // Apply dropdown filters when Retrieve button is clicked
  const applyDropdownFilters = useCallback(() => {
    setIsLoading(true)

    // Apply dropdown filters to get filtered services
    let result = [...allServices]

    // Apply dropdown filters
    Object.entries(dropdownFilters).forEach(([key, values]) => {
      if (values.length > 0 && !values.includes("all")) {
        if (
          key === "incompletePlan" ||
          key === "remediationExpired" ||
          key === "invalidSelection" ||
          key === "techCyberReviewStatus"
        ) {
          // Handle boolean filters
          const boolValue = values[0] === "true"
          result = result.filter((service) => service[key as keyof Service] === boolValue)
        } else {
          // Handle string filters
          result = result.filter((service) =>
            values.some((value) =>
              String(service[key as keyof Service])
                .toLowerCase()
                .includes(value.toLowerCase()),
            ),
          )
        }
      }
    })

    // Update dropdown filtered services
    setDropdownFilteredServices(result)
    setIsLoading(false)
  }, [allServices, dropdownFilters])

  // Apply table filters in real-time
  useEffect(() => {
    // Apply table filters to the dropdown filtered services
    let result = [...dropdownFilteredServices]

    // Apply table input filters
    Object.entries(tableFilters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((service) =>
          String(service[key as keyof Service])
            .toLowerCase()
            .includes(value.toLowerCase()),
        )
      }
    })

    // Apply sorting
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn as keyof Service]
        const bValue = b[sortColumn as keyof Service]

        if (aValue < bValue) {
          return sortDirection === "asc" ? -1 : 1
        }
        if (aValue > bValue) {
          return sortDirection === "asc" ? 1 : -1
        }
        return 0
      })
    }

    // Update final filtered services
    setFilteredServices(result)
  }, [dropdownFilteredServices, tableFilters, sortColumn, sortDirection])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleFilterChange = (key: string, value: string[]) => {
    setDropdownFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleTableFilterChange = (column: string, value: string) => {
    setTableFilters((prev) => ({ ...prev, [column]: value.toLowerCase() }))
  }

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredServices.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredServices.map((service) => service.id))
    }
  }

  const handleBulkUpdate = async () => {
    // Implement the bulk update logic here
    console.log("Bulk update:", { selectedItems })
    // You would typically send this data to your API to update the services
    // After the update is successful, you should refetch the services
    setSelectedItems([])
  }

  const handleDownload = () => {
    const headers = Object.keys(filteredServices[0]).join(",")
    const csv = [
      headers,
      ...filteredServices.map((service) =>
        Object.values(service)
          .map((value) => (typeof value === "string" && value.includes(",") ? `"${value}"` : value))
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "services.csv")
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-black mb-4">Annual Operating Plan</h2>

      <Filters
        filters={dropdownFilters}
        onFilterChange={handleFilterChange}
        onRetrieve={applyDropdownFilters}
        isLoading={isLoading}
      />

      <ServiceTable
        services={filteredServices}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        tableFilters={tableFilters}
        selectedItems={selectedItems}
        onSort={handleSort}
        onTableFilterChange={handleTableFilterChange}
        onSelectItem={handleSelectItem}
        onSelectAll={handleSelectAll}
        onBulkUpdate={handleBulkUpdate}
        onDownload={handleDownload}
      />
    </div>
  )
}
