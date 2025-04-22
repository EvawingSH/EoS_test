"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { DateInput } from "@/components/ui/date-input"
import { AlertTriangle, X, Save, ChevronDown, ChevronUp } from "lucide-react"

interface BulkUpdateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedItems: string[]
  onBulkUpdate: (data: BulkUpdateData) => Promise<void>
}

export interface BulkUpdateData {
  // General Information
  businessRisk: string

  // EoS Remediation Plan
  plannedAddressDate: string
  riskFY: string
  riskFYPlus1: string
  riskFYPlus2: string
  riskFYPlus3: string
  additionalTreatmentCommentary: string
  riskAcceptanceRationale: string
  eosConditionsForNonOnboardedAssets: string
  impactIfCompromised: string

  // Tech & Cyber
  techCyberReviewStatus: boolean
  reviewDate: string
  suggestedAction: string
  riskStewardComments: string
  nfrc: string
  evidenceUrl: string
}

const BulkUpdateDialog: React.FC<BulkUpdateDialogProps> = ({ open, onOpenChange, selectedItems, onBulkUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [dateErrors, setDateErrors] = useState({
    plannedAddressDate: "",
    reviewDate: "",
  })

  // State for collapsible sections
  const [generalInfoExpanded, setGeneralInfoExpanded] = useState(true)
  const [remediationPlanExpanded, setRemediationPlanExpanded] = useState(true)
  const [techCyberExpanded, setTechCyberExpanded] = useState(true)

  // Bulk update form state
  const [bulkUpdateData, setBulkUpdateData] = useState<BulkUpdateData>({
    // General Information
    businessRisk: "",

    // EoS Remediation Plan
    plannedAddressDate: "",
    riskFY: "",
    riskFYPlus1: "",
    riskFYPlus2: "",
    riskFYPlus3: "",
    additionalTreatmentCommentary: "",
    riskAcceptanceRationale: "",
    eosConditionsForNonOnboardedAssets: "",
    impactIfCompromised: "",

    // Tech & Cyber
    techCyberReviewStatus: false,
    reviewDate: "",
    suggestedAction: "",
    riskStewardComments: "",
    nfrc: "",
    evidenceUrl: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBulkUpdateData({ ...bulkUpdateData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setBulkUpdateData({ ...bulkUpdateData, [name]: value })
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setBulkUpdateData({ ...bulkUpdateData, [name]: checked })
  }

  const handleSubmit = async () => {
    setIsUpdating(true)

    try {
      await onBulkUpdate(bulkUpdateData)
      onOpenChange(false)
      resetBulkUpdateForm()
    } catch (error) {
      console.error("Error during bulk update:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const resetBulkUpdateForm = () => {
    setBulkUpdateData({
      // General Information
      businessRisk: "",

      // EoS Remediation Plan
      plannedAddressDate: "",
      riskFY: "",
      riskFYPlus1: "",
      riskFYPlus2: "",
      riskFYPlus3: "",
      additionalTreatmentCommentary: "",
      riskAcceptanceRationale: "",
      eosConditionsForNonOnboardedAssets: "",
      impactIfCompromised: "",

      // Tech & Cyber
      techCyberReviewStatus: false,
      reviewDate: "",
      suggestedAction: "",
      riskStewardComments: "",
      nfrc: "",
      evidenceUrl: "",
    })
    setDateErrors({
      plannedAddressDate: "",
      reviewDate: "",
    })
  }

  // Toggle section expansion
  const toggleGeneralInfo = () => {
    setGeneralInfoExpanded(!generalInfoExpanded)
  }

  const toggleRemediationPlan = () => {
    setRemediationPlanExpanded(!remediationPlanExpanded)
  }

  const toggleTechCyber = () => {
    setTechCyberExpanded(!techCyberExpanded)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <span className="mr-2">Bulk Update {selectedItems.length} Services</span>
            {selectedItems.length > 0 && (
              <span className="bg-theme-100 text-theme-800 text-sm py-1 px-2 rounded-full">
                {selectedItems.length} selected
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-6 flex items-start">
            <AlertTriangle className="text-amber-500 h-5 w-5 mr-2 mt-0.5" />
            <p className="text-sm text-amber-800">
              Only fields you modify will be updated. Leave fields empty to keep their current values.
            </p>
          </div>

          {/* Section 1: General Information (Collapsible) */}
          <div className="mb-6 border rounded-lg overflow-hidden">
            <div
              className="p-4 border-b flex justify-between items-center bg-gray-50 cursor-pointer"
              onClick={toggleGeneralInfo}
            >
              <h3 className="font-medium text-gray-700">General Information</h3>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                aria-label={generalInfoExpanded ? "Collapse section" : "Expand section"}
              >
                {generalInfoExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>

            {generalInfoExpanded && (
              <div className="p-6 transition-all duration-300 animate-in fade-in-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessRisk" className="text-sm font-medium">
                      Business Risk
                    </Label>
                    <Select
                      value={bulkUpdateData.businessRisk}
                      onValueChange={(value) => handleSelectChange("businessRisk", value)}
                    >
                      <SelectTrigger id="businessRisk">
                        <SelectValue placeholder="No change" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no_change">No change</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: EoS Remediation Plan (Collapsible) */}
          <div className="mb-6 border rounded-lg overflow-hidden">
            <div
              className="p-4 border-b flex justify-between items-center bg-gray-50 cursor-pointer"
              onClick={toggleRemediationPlan}
            >
              <h3 className="font-medium text-gray-700">EoS Remediation Plan</h3>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                aria-label={remediationPlanExpanded ? "Collapse section" : "Expand section"}
              >
                {remediationPlanExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>

            {remediationPlanExpanded && (
              <div className="p-6 transition-all duration-300 animate-in fade-in-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plannedAddressDate" className="text-sm font-medium">
                      Planned to be addressed by
                    </Label>
                    <DateInput
                      id="plannedAddressDate"
                      name="plannedAddressDate"
                      value={bulkUpdateData.plannedAddressDate}
                      onChange={handleInputChange}
                      error={dateErrors.plannedAddressDate}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="riskFY" className="text-sm font-medium">
                      Risk FY
                    </Label>
                    <Select
                      value={bulkUpdateData.riskFY}
                      onValueChange={(value) => handleSelectChange("riskFY", value)}
                    >
                      <SelectTrigger id="riskFY">
                        <SelectValue placeholder="No change" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no_change">No change</SelectItem>
                        <SelectItem value="Managed">Managed</SelectItem>
                        <SelectItem value="Retired">Retired</SelectItem>
                        <SelectItem value="Corrective">Corrective</SelectItem>
                        <SelectItem value="Decommissioned">Decommissioned</SelectItem>
                        <SelectItem value="Preventive">Preventive</SelectItem>
                        <SelectItem value="Risk Accepted">Risk Accepted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="riskFYPlus1" className="text-sm font-medium">
                      Risk FY+1
                    </Label>
                    <Select
                      value={bulkUpdateData.riskFYPlus1}
                      onValueChange={(value) => handleSelectChange("riskFYPlus1", value)}
                    >
                      <SelectTrigger id="riskFYPlus1">
                        <SelectValue placeholder="No change" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no_change">No change</SelectItem>
                        <SelectItem value="Managed">Managed</SelectItem>
                        <SelectItem value="Retired">Retired</SelectItem>
                        <SelectItem value="Corrective">Corrective</SelectItem>
                        <SelectItem value="Decommissioned">Decommissioned</SelectItem>
                        <SelectItem value="Preventive">Preventive</SelectItem>
                        <SelectItem value="Risk Accepted">Risk Accepted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="riskFYPlus2" className="text-sm font-medium">
                      Risk FY+2
                    </Label>
                    <Select
                      value={bulkUpdateData.riskFYPlus2}
                      onValueChange={(value) => handleSelectChange("riskFYPlus2", value)}
                    >
                      <SelectTrigger id="riskFYPlus2">
                        <SelectValue placeholder="No change" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no_change">No change</SelectItem>
                        <SelectItem value="Managed">Managed</SelectItem>
                        <SelectItem value="Retired">Retired</SelectItem>
                        <SelectItem value="Corrective">Corrective</SelectItem>
                        <SelectItem value="Decommissioned">Decommissioned</SelectItem>
                        <SelectItem value="Preventive">Preventive</SelectItem>
                        <SelectItem value="Risk Accepted">Risk Accepted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="riskFYPlus3" className="text-sm font-medium">
                      Risk FY+3
                    </Label>
                    <Select
                      value={bulkUpdateData.riskFYPlus3}
                      onValueChange={(value) => handleSelectChange("riskFYPlus3", value)}
                    >
                      <SelectTrigger id="riskFYPlus3">
                        <SelectValue placeholder="No change" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no_change">No change</SelectItem>
                        <SelectItem value="Managed">Managed</SelectItem>
                        <SelectItem value="Retired">Retired</SelectItem>
                        <SelectItem value="Corrective">Corrective</SelectItem>
                        <SelectItem value="Decommissioned">Decommissioned</SelectItem>
                        <SelectItem value="Preventive">Preventive</SelectItem>
                        <SelectItem value="Risk Accepted">Risk Accepted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="additionalTreatmentCommentary" className="text-sm font-medium">
                      Additional Treatment Commentary
                    </Label>
                    <Textarea
                      id="additionalTreatmentCommentary"
                      name="additionalTreatmentCommentary"
                      value={bulkUpdateData.additionalTreatmentCommentary}
                      onChange={handleInputChange}
                      placeholder="Enter additional treatment commentary"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="riskAcceptanceRationale" className="text-sm font-medium">
                      Risk Acceptance Rationale
                    </Label>
                    <Textarea
                      id="riskAcceptanceRationale"
                      name="riskAcceptanceRationale"
                      value={bulkUpdateData.riskAcceptanceRationale}
                      onChange={handleInputChange}
                      placeholder="Enter risk acceptance rationale"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="eosConditionsForNonOnboardedAssets" className="text-sm font-medium">
                      Specify known EoS conditions for assets not on-boarded to the EoS tool
                    </Label>
                    <Textarea
                      id="eosConditionsForNonOnboardedAssets"
                      name="eosConditionsForNonOnboardedAssets"
                      value={bulkUpdateData.eosConditionsForNonOnboardedAssets}
                      onChange={handleInputChange}
                      placeholder="Specify known EoS conditions"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="impactIfCompromised" className="text-sm font-medium">
                      Impact if asset is compromised due to the EoS event
                    </Label>
                    <Textarea
                      id="impactIfCompromised"
                      name="impactIfCompromised"
                      value={bulkUpdateData.impactIfCompromised}
                      onChange={handleInputChange}
                      placeholder="Describe potential impact"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Tech & Cyber (Collapsible) */}
          <div className="mb-4 border rounded-lg overflow-hidden">
            <div
              className="p-4 border-b flex justify-between items-center bg-gray-50 cursor-pointer"
              onClick={toggleTechCyber}
            >
              <h3 className="font-medium text-gray-700">Tech & Cyber</h3>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
                aria-label={techCyberExpanded ? "Collapse section" : "Expand section"}
              >
                {techCyberExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>

            {techCyberExpanded && (
              <div className="p-6 transition-all duration-300 animate-in fade-in-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 flex items-center">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="techCyberReviewStatus"
                        checked={bulkUpdateData.techCyberReviewStatus}
                        onCheckedChange={(checked) => handleCheckboxChange("techCyberReviewStatus", checked as boolean)}
                      />
                      <Label htmlFor="techCyberReviewStatus" className="text-sm font-medium">
                        Review Status
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reviewDate" className="text-sm font-medium">
                      Review Date
                    </Label>
                    <DateInput
                      id="reviewDate"
                      name="reviewDate"
                      value={bulkUpdateData.reviewDate}
                      onChange={handleInputChange}
                      error={dateErrors.reviewDate}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="suggestedAction" className="text-sm font-medium">
                      Suggested Action
                    </Label>
                    <Input
                      id="suggestedAction"
                      name="suggestedAction"
                      value={bulkUpdateData.suggestedAction}
                      onChange={handleInputChange}
                      placeholder="Enter suggested action"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="riskStewardComments" className="text-sm font-medium">
                      Risk Steward Comments
                    </Label>
                    <Textarea
                      id="riskStewardComments"
                      name="riskStewardComments"
                      value={bulkUpdateData.riskStewardComments}
                      onChange={handleInputChange}
                      placeholder="Enter risk steward comments"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nfrc" className="text-sm font-medium">
                      NFRC
                    </Label>
                    <Input
                      id="nfrc"
                      name="nfrc"
                      value={bulkUpdateData.nfrc}
                      onChange={handleInputChange}
                      placeholder="Enter NFRC"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="evidenceUrl" className="text-sm font-medium">
                      Evidence URL
                    </Label>
                    <Input
                      id="evidenceUrl"
                      name="evidenceUrl"
                      value={bulkUpdateData.evidenceUrl}
                      onChange={handleInputChange}
                      placeholder="Enter evidence URL"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {selectedItems.length} {selectedItems.length === 1 ? "service" : "services"} will be updated
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-theme-500 text-black hover:bg-theme-600" disabled={isUpdating}>
              {isUpdating ? (
                <>Processing...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BulkUpdateDialog
