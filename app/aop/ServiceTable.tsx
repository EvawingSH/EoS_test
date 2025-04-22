"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowUpDown, Pencil, Download, Columns } from "lucide-react"
import BulkUpdateDialog, { type BulkUpdateData } from "./BulkUpdateDialog"

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

interface ColumnDefinition {
  key: keyof Service
  label: string
  sortable: boolean
  filterable: boolean
}

interface ServiceTableProps {
  services: Service[]
  sortColumn: string
  sortDirection: string
  tableFilters: Record<string, string>
  selectedItems: string[]
  onSort: (column: string) => void
  onTableFilterChange: (column: string, value: string) => void
  onSelectItem: (id: string) => void
  onSelectAll: () => void
  onBulkUpdate: () => Promise<void>
  onDownload: () => void
}

const ServiceTable: React.FC<ServiceTableProps> = ({
  services,
  sortColumn,
  sortDirection,
  tableFilters,
  selectedItems,
  onSort,
  onTableFilterChange,
  onSelectItem,
  onSelectAll,
  onBulkUpdate,
  onDownload,
}) => {
  const [bulkUpdateOpen, setBulkUpdateOpen] = useState(false)
  const [showColumnSelector, setShowColumnSelector] = useState(false)
  const columnSelectorRef = useRef<HTMLDivElement>(null)

  // Define all possible columns
  const allColumns: ColumnDefinition[] = [
    { key: "id", label: "Service CI", sortable: true, filterable: true },
    { key: "name", label: "ServiceName", sortable: true, filterable: true },
    { key: "division", label: "Division", sortable: true, filterable: true },
    { key: "serviceOwner", label: "Service Owner", sortable: true, filterable: true },
    { key: "serviceManager", label: "Service Manager", sortable: true, filterable: true },
    { key: "category", label: "Critical/SaaS", sortable: true, filterable: true },
    { key: "risk", label: "Business Risk", sortable: true, filterable: true },
    // Removed EoS Date column
    { key: "rasScore", label: "Risk Score", sortable: true, filterable: true },
    { key: "plan", label: "Remediation Plan", sortable: true, filterable: true },
    { key: "residualScore", label: "Residual Score", sortable: true, filterable: true },
    { key: "sensitivityTier", label: "Sensitivity Tier", sortable: true, filterable: true },
    { key: "techCyberReviewStatus", label: "Tech & Cyber Review Status", sortable: true, filterable: true },
    { key: "incompletePlan", label: "Incomplete Plan", sortable: true, filterable: true },
    { key: "remediationExpired", label: "Remediation Expired", sortable: true, filterable: true },
    { key: "invalidSelection", label: "Invalid Selection", sortable: true, filterable: true },
  ]

  // State to track visible columns
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    allColumns
      .filter(
        (col) =>
          !["incompletePlan", "remediationExpired", "invalidSelection", "techCyberReviewStatus", "eosDate"].includes(
            col.key.toString(),
          ),
      )
      .map((col) => col.key.toString()),
  )

  // Get only the columns that should be visible
  const columns = allColumns.filter((col) => visibleColumns.includes(col.key.toString()))

  // Close the column selector when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (columnSelectorRef.current && !columnSelectorRef.current.contains(event.target as Node)) {
        setShowColumnSelector(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [columnSelectorRef])

  const handleBulkUpdate = async (data: BulkUpdateData) => {
    // Here you would typically send the updated data to your backend
    console.log("Bulk update data:", {
      selectedItems,
      ...data,
    })

    // Call the parent's onBulkUpdate
    await onBulkUpdate()
  }

  const toggleColumnVisibility = useCallback((columnKey: string) => {
    setVisibleColumns((prev) => {
      if (prev.includes(columnKey)) {
        // Don't allow removing all columns
        if (prev.length === 1) return prev
        return prev.filter((key) => key !== columnKey)
      } else {
        return [...prev, columnKey]
      }
    })
  }, [])

  // Helper function to format boolean values for display
  const formatBooleanValue = (value: boolean): string => {
    return value ? "Yes" : "No"
  }

  // Memoize the checkbox change handler to prevent re-renders
  const handleColumnCheckChange = useCallback(
    (columnKey: string, checked: boolean) => {
      if (checked) {
        if (!visibleColumns.includes(columnKey)) {
          toggleColumnVisibility(columnKey)
        }
      } else {
        if (visibleColumns.includes(columnKey) && visibleColumns.length > 1) {
          toggleColumnVisibility(columnKey)
        }
      }
    },
    [visibleColumns, toggleColumnVisibility],
  )

  return (
    <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-500">
            {services.length} {services.length === 1 ? "Service" : "Services"} displayed
          </p>
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            disabled={selectedItems.length === 0}
            onClick={() => setBulkUpdateOpen(true)}
          >
            Bulk Update ({selectedItems.length})
          </Button>

          {/* Simple Column Selector Dropdown */}
          <div className="relative">
            <Button variant="outline" size="sm" onClick={() => setShowColumnSelector(!showColumnSelector)}>
              <Columns className="h-4 w-4 mr-2" />
              Columns
            </Button>

            {showColumnSelector && (
              <div
                ref={columnSelectorRef}
                className="absolute right-0 top-full mt-2 w-56 bg-white border rounded-md shadow-lg z-50 p-3"
              >
                <h4 className="font-medium text-sm mb-2">Toggle Columns</h4>
                <div className="space-y-2">
                  {allColumns.map((column) => {
                    const columnKey = column.key.toString()
                    // Skip the eosDate column entirely
                    if (columnKey === "eosDate") return null

                    const isChecked = visibleColumns.includes(columnKey)
                    const isDisabled = isChecked && visibleColumns.length === 1

                    return (
                      <div key={columnKey} className="flex items-center space-x-2">
                        <Checkbox
                          id={`column-${columnKey}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => handleColumnCheckChange(columnKey, checked as boolean)}
                          disabled={isDisabled}
                        />
                        <Label htmlFor={`column-${columnKey}`} className="text-sm cursor-pointer">
                          {column.label}
                        </Label>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-theme-100">
            {/* Checkbox column */}
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedItems.length === services.length && services.length > 0}
                onCheckedChange={onSelectAll}
              />
            </TableHead>

            {/* Dynamic columns */}
            {columns.map((column) => (
              <TableHead key={column.key.toString()} className="py-3 px-4">
                {column.label}
                {column.sortable && (
                  <Button variant="ghost" size="sm" onClick={() => onSort(column.key.toString())}>
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                )}
              </TableHead>
            ))}

            {/* Actions column */}
            <TableHead className="py-3 px-4">Actions</TableHead>
          </TableRow>

          {/* Filter row */}
          <TableRow className="bg-gray-50">
            {/* Empty cell for checkbox column */}
            <TableCell />

            {/* Dynamic filter inputs */}
            {columns.map((column) => (
              <TableCell key={column.key.toString()} className="p-2">
                {column.filterable && (
                  <Input
                    placeholder={`Filter ${column.label}`}
                    value={tableFilters[column.key.toString()]}
                    onChange={(e) => onTableFilterChange(column.key.toString(), e.target.value)}
                    className="w-full"
                    aria-label={`Filter by ${column.label}`}
                  />
                )}
              </TableCell>
            ))}

            {/* Empty cell for actions column */}
            <TableCell className="p-2" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {services.length > 0 ? (
            services.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-100">
                {/* Checkbox cell */}
                <TableCell>
                  <Checkbox checked={selectedItems.includes(item.id)} onCheckedChange={() => onSelectItem(item.id)} />
                </TableCell>

                {/* Dynamic data cells */}
                {columns.map((column) => (
                  <TableCell key={`${item.id}-${column.key}`} className="py-3 px-4">
                    {typeof item[column.key] === "boolean"
                      ? formatBooleanValue(item[column.key] as boolean)
                      : item[column.key]}
                  </TableCell>
                ))}

                {/* Actions cell */}
                <TableCell className="py-3 px-4">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/edit/${item.id}`}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 2} className="text-center py-4">
                No services found matching your filters
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Use the new BulkUpdateDialog component */}
      <BulkUpdateDialog
        open={bulkUpdateOpen}
        onOpenChange={setBulkUpdateOpen}
        selectedItems={selectedItems}
        onBulkUpdate={handleBulkUpdate}
      />
    </div>
  )
}

export default ServiceTable
