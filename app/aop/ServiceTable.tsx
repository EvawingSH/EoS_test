"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowUpDown, Pencil, Download, Columns } from "lucide-react"

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
  const [bulkUpdateRisk, setBulkUpdateRisk] = useState("")
  const [bulkUpdatePlan, setBulkUpdatePlan] = useState("")
  const [showColumnSelector, setShowColumnSelector] = useState(false)
  const columnSelectorRef = useRef<HTMLDivElement>(null)

  // Define all possible columns
  const allColumns: ColumnDefinition[] = [
    { key: "id", label: "Service CI", sortable: true, filterable: true },
    { key: "name", label: "Service Name", sortable: true, filterable: true },
    { key: "division", label: "Division", sortable: true, filterable: true },
    { key: "serviceOwner", label: "Service Owner", sortable: true, filterable: true },
    { key: "serviceManager", label: "Service Manager", sortable: true, filterable: true },
    { key: "category", label: "Category", sortable: true, filterable: true },
    { key: "risk", label: "Business Risk", sortable: true, filterable: true },
    { key: "eosDate", label: "EoS Date", sortable: true, filterable: true },
    { key: "rasScore", label: "RAS Score", sortable: true, filterable: true },
    { key: "plan", label: "Remediation Plan", sortable: true, filterable: true },
    { key: "residualScore", label: "Residual Score", sortable: true, filterable: true },
    { key: "incompletePlan", label: "Incomplete Plan", sortable: true, filterable: true },
    { key: "remediationExpired", label: "Remediation Expired", sortable: true, filterable: true },
    { key: "invalidSelection", label: "Invalid Selection", sortable: true, filterable: true },
  ]

  // State to track visible columns
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    allColumns
      .filter((col) => !["incompletePlan", "remediationExpired", "invalidSelection"].includes(col.key.toString()))
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

  const handleBulkUpdate = async () => {
    // Implement the bulk update logic here
    console.log("Bulk update:", { selectedItems, bulkUpdateRisk, bulkUpdatePlan })
    // Call the parent's onBulkUpdate
    await onBulkUpdate()
    // Reset local state
    setBulkUpdateRisk("")
    setBulkUpdatePlan("")
  }

  const toggleColumnVisibility = (columnKey: string) => {
    setVisibleColumns((prev) => {
      if (prev.includes(columnKey)) {
        // Don't allow removing all columns
        if (prev.length === 1) return prev
        return prev.filter((key) => key !== columnKey)
      } else {
        return [...prev, columnKey]
      }
    })
  }

  // Helper function to format boolean values for display
  const formatBooleanValue = (value: boolean): string => {
    return value ? "Yes" : "No"
  }

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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={selectedItems.length === 0}>
                Bulk Update ({selectedItems.length})
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bulk Update Services</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bulk-risk" className="text-right">
                    Business Risk
                  </Label>
                  <Select value={bulkUpdateRisk} onValueChange={setBulkUpdateRisk}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bulk-plan" className="text-right">
                    Remediation Plan
                  </Label>
                  <Input
                    id="bulk-plan"
                    value={bulkUpdatePlan}
                    onChange={(e) => setBulkUpdatePlan(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={handleBulkUpdate}>Update Services</Button>
            </DialogContent>
          </Dialog>

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
                  {allColumns.map((column) => (
                    <div key={column.key.toString()} className="flex items-center space-x-2">
                      <Checkbox
                        id={`column-${column.key}`}
                        checked={visibleColumns.includes(column.key.toString())}
                        onCheckedChange={() => toggleColumnVisibility(column.key.toString())}
                        disabled={visibleColumns.length === 1 && visibleColumns.includes(column.key.toString())}
                      />
                      <Label htmlFor={`column-${column.key}`} className="text-sm cursor-pointer">
                        {column.label}
                      </Label>
                    </div>
                  ))}
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
              <Checkbox checked={selectedItems.length === services.length} onCheckedChange={onSelectAll} />
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
    </div>
  )
}

export default ServiceTable

