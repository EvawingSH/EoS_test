"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Minus, RefreshCw } from "lucide-react"
import { DateInput } from "@/components/ui/date-input"
import servicesData from "@/data/services.json"

export default function EditItem({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [service, setService] = useState<any>(null)
  const [formData, setFormData] = useState({
    // General Information
    serviceCI: params.id,
    serviceName: "",
    serviceManager: "",
    serviceOwner: "",
    division: "",
    sensitivityTier: "",
    category: "",
    businessRisk: "",

    // End of Support
    rasScore: "",
    residualScore: "",

    // EoS Remediation Plan
    eosDate: "",
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

    // Other fields
    incompletePlan: false,
    remediationExpired: false,
    invalidSelection: false,
  })

  // State for date validation errors
  const [dateErrors, setDateErrors] = useState({
    plannedAddressDate: "",
    reviewDate: "",
  })

  // State for collapsible sections
  const [generalInfoExpanded, setGeneralInfoExpanded] = useState(true)
  const [endOfSupportExpanded, setEndOfSupportExpanded] = useState(true)
  const [remediationPlanExpanded, setRemediationPlanExpanded] = useState(true)
  const [techCyberExpanded, setTechCyberExpanded] = useState(true)
  const [isRecalculating, setIsRecalculating] = useState(false)

  // Helper function to format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return ""

    try {
      const [year, month, day] = dateString.split("-")
      return `${day}/${month}/${year}`
    } catch (error) {
      return dateString
    }
  }

  // Helper function to format date from DD/MM/YYYY to YYYY-MM-DD
  const formatDateForStorage = (dateString: string): string => {
    if (!dateString) return ""

    try {
      const [day, month, year] = dateString.split("/")
      return `${year}-${month}-${day}`
    } catch (error) {
      return dateString
    }
  }

  // Find the service data for this ID
  useEffect(() => {
    // Find the service in the JSON data
    const foundService = servicesData.services.find((s) => s.id === params.id)

    if (foundService) {
      // Store the original service data
      setService(foundService)

      // Format dates for display
      const plannedDate = formatDateForDisplay(foundService.eosDate)
      const reviewDateFormatted = formatDateForDisplay("2023-10-15") // Default date

      // Set the form data with the service information
      setFormData({
        // General Information
        serviceCI: foundService.id,
        serviceName: foundService.name,
        serviceManager: foundService.serviceManager,
        serviceOwner: foundService.serviceOwner,
        division: foundService.division,
        sensitivityTier: foundService.sensitivityTier,
        category: foundService.category,
        businessRisk: foundService.risk,

        // End of Support
        rasScore: foundService.rasScore,
        residualScore: foundService.residualScore,

        // EoS Remediation Plan
        eosDate: foundService.eosDate,
        plannedAddressDate: plannedDate, // Format as DD/MM/YYYY
        riskFY: foundService.plan, // Use the plan value from the service data
        riskFYPlus1: "Managed", // Default values
        riskFYPlus2: "Managed",
        riskFYPlus3: "Managed",
        additionalTreatmentCommentary: "",
        riskAcceptanceRationale: "",
        eosConditionsForNonOnboardedAssets: "",
        impactIfCompromised: "",

        // Tech & Cyber - using default values since these are new fields
        techCyberReviewStatus: foundService.techCyberReviewStatus,
        reviewDate: reviewDateFormatted, // Format as DD/MM/YYYY
        suggestedAction: "Upgrade to latest version",
        riskStewardComments: "No comments",

        // Other fields
        incompletePlan: foundService.incompletePlan,
        remediationExpired: foundService.remediationExpired,
        invalidSelection: foundService.invalidSelection,
      })
    }
  }, [params.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Convert dates back to YYYY-MM-DD format for storage
    const formattedData = {
      ...formData,
      plannedAddressDate: formatDateForStorage(formData.plannedAddressDate),
      reviewDate: formatDateForStorage(formData.reviewDate),
    }

    // Here you would typically send the updated data to your backend
    console.log("Updated data:", formattedData)
    router.push("/aop")
  }

  // Toggle section expansion
  const toggleGeneralInfo = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    e.stopPropagation() // Prevent event bubbling
    setGeneralInfoExpanded(!generalInfoExpanded)
  }

  const toggleEndOfSupport = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    e.stopPropagation() // Prevent event bubbling
    setEndOfSupportExpanded(!endOfSupportExpanded)
  }

  const toggleRemediationPlan = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    e.stopPropagation() // Prevent event bubbling
    setRemediationPlanExpanded(!remediationPlanExpanded)
  }

  const toggleTechCyber = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    e.stopPropagation() // Prevent event bubbling
    setTechCyberExpanded(!techCyberExpanded)
  }

  // Handle recalculation of residual score
  const handleRecalculateScore = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsRecalculating(true)

    // Simulate a calculation process
    setTimeout(() => {
      // This is where you would implement the actual recalculation logic
      // For now, we'll just simulate a change in the residual score
      const scores = ["Medium", "Low", "High", "Insignificant", "Compliant"]
      const randomScore = scores[Math.floor(Math.random() * scores.length)]

      setFormData((prev) => ({
        ...prev,
        residualScore: randomScore,
      }))

      setIsRecalculating(false)
    }, 1000)
  }

  // If service is not found, show a message
  if (!service) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Service Not Found</h2>
          <p className="mb-4">The service with ID {params.id} could not be found.</p>
          <Button onClick={() => router.push("/aop")}>Return to AOP</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main title with Annual Operating Plan in gray */}
      <h2 className="text-3xl font-bold mb-2">
        <span className="text-gray-500">Annual Operating Plan</span>/Edit Service
      </h2>

      {/* Service name subtitle with vertical line */}
      <div className="flex items-center mb-6 bg-white p-4 rounded-lg shadow-sm relative">
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-theme-500 rounded-l-lg"></div>
        <div className="pl-4">
          <h3 className="text-xl font-semibold">Service Name: {service.name}</h3>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: General Information (Collapsible) */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold">General Information</h3>
              <button
                type="button"
                onClick={toggleGeneralInfo}
                className="ml-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none"
                aria-label={generalInfoExpanded ? "Collapse section" : "Expand section"}
              >
                {generalInfoExpanded ? (
                  <Minus size={18} className="text-gray-600" />
                ) : (
                  <Plus size={18} className="text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {generalInfoExpanded && (
            <div className="p-6 transition-all duration-300">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="serviceCI" className="text-sm font-medium">
                    Service CI
                  </Label>
                  <Input id="serviceCI" name="serviceCI" value={service.id} disabled />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="serviceName" className="text-sm font-medium">
                    ServiceName
                  </Label>
                  <Input id="serviceName" name="serviceName" value={service.name} disabled />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="serviceManager" className="text-sm font-medium">
                    Service Manager
                  </Label>
                  <Input id="serviceManager" name="serviceManager" value={service.serviceManager} disabled />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="serviceOwner" className="text-sm font-medium">
                    Service Owner
                  </Label>
                  <Input id="serviceOwner" name="serviceOwner" value={service.serviceOwner} disabled />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="division" className="text-sm font-medium">
                    Division
                  </Label>
                  <Input id="division" name="division" value={service.division} disabled />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="sensitivityTier" className="text-sm font-medium">
                    Sensitivity Tier
                  </Label>
                  <Input id="sensitivityTier" name="sensitivityTier" value={service.sensitivityTier} disabled />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Critical/SaaS
                  </Label>
                  <Input id="category" name="category" value={service.category} disabled />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="businessRisk" className="text-sm font-medium">
                    Business Risk
                  </Label>
                  <Select
                    value={formData.businessRisk}
                    onValueChange={(value) => handleSelectChange("businessRisk", value)}
                  >
                    <SelectTrigger id="businessRisk">
                      <SelectValue placeholder="Select Risk" />
                    </SelectTrigger>
                    <SelectContent>
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

        {/* Section 2: End of Support (Collapsible) */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold">End of Support</h3>
              <button
                type="button"
                onClick={toggleEndOfSupport}
                className="ml-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none"
                aria-label={endOfSupportExpanded ? "Collapse section" : "Expand section"}
              >
                {endOfSupportExpanded ? (
                  <Minus size={18} className="text-gray-600" />
                ) : (
                  <Plus size={18} className="text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {endOfSupportExpanded && (
            <div className="p-6 transition-all duration-300">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="rasScore" className="text-sm font-medium">
                    Risk Score
                  </Label>
                  <Input id="rasScore" name="rasScore" value={service.rasScore} disabled />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="residualScore" className="text-sm font-medium">
                    Residual Score
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="residualScore"
                      name="residualScore"
                      value={formData.residualScore}
                      className="flex-grow"
                      disabled
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleRecalculateScore}
                      disabled={isRecalculating}
                      className="flex items-center bg-theme-500 text-black hover:bg-theme-600"
                    >
                      <RefreshCw size={16} className={`mr-1 ${isRecalculating ? "animate-spin" : ""}`} />
                      {isRecalculating ? "Calculating..." : "Recalculate"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: EoS Remediation Plan (Collapsible) */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold">EoS Remediation Plan</h3>
              <button
                type="button"
                onClick={toggleRemediationPlan}
                className="ml-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none"
                aria-label={remediationPlanExpanded ? "Collapse section" : "Expand section"}
              >
                {remediationPlanExpanded ? (
                  <Minus size={18} className="text-gray-600" />
                ) : (
                  <Plus size={18} className="text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {remediationPlanExpanded && (
            <div className="p-6 transition-all duration-300">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="plannedAddressDate" className="text-sm font-medium">
                    Planned to be addressed by
                  </Label>
                  <DateInput
                    id="plannedAddressDate"
                    name="plannedAddressDate"
                    value={formData.plannedAddressDate}
                    onChange={handleInputChange}
                    error={dateErrors.plannedAddressDate}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="riskFY" className="text-sm font-medium">
                    Risk FY
                  </Label>
                  <Select value={formData.riskFY} onValueChange={(value) => handleSelectChange("riskFY", value)}>
                    <SelectTrigger id="riskFY">
                      <SelectValue placeholder="Select Plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Managed">Managed</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                      <SelectItem value="Corrective">Corrective</SelectItem>
                      <SelectItem value="Decommissioned">Decommissioned</SelectItem>
                      <SelectItem value="Preventive">Preventive</SelectItem>
                      <SelectItem value="Risk Accepted">Risk Accepted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="riskFYPlus1" className="text-sm font-medium">
                    Risk FY+1
                  </Label>
                  <Select
                    value={formData.riskFYPlus1}
                    onValueChange={(value) => handleSelectChange("riskFYPlus1", value)}
                  >
                    <SelectTrigger id="riskFYPlus1">
                      <SelectValue placeholder="Select Plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Managed">Managed</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                      <SelectItem value="Corrective">Corrective</SelectItem>
                      <SelectItem value="Decommissioned">Decommissioned</SelectItem>
                      <SelectItem value="Preventive">Preventive</SelectItem>
                      <SelectItem value="Risk Accepted">Risk Accepted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="riskFYPlus2" className="text-sm font-medium">
                    Risk FY+2
                  </Label>
                  <Select
                    value={formData.riskFYPlus2}
                    onValueChange={(value) => handleSelectChange("riskFYPlus2", value)}
                  >
                    <SelectTrigger id="riskFYPlus2">
                      <SelectValue placeholder="Select Plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Managed">Managed</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                      <SelectItem value="Corrective">Corrective</SelectItem>
                      <SelectItem value="Decommissioned">Decommissioned</SelectItem>
                      <SelectItem value="Preventive">Preventive</SelectItem>
                      <SelectItem value="Risk Accepted">Risk Accepted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="riskFYPlus3" className="text-sm font-medium">
                    Risk FY+3
                  </Label>
                  <Select
                    value={formData.riskFYPlus3}
                    onValueChange={(value) => handleSelectChange("riskFYPlus3", value)}
                  >
                    <SelectTrigger id="riskFYPlus3">
                      <SelectValue placeholder="Select Plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Managed">Managed</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                      <SelectItem value="Corrective">Corrective</SelectItem>
                      <SelectItem value="Decommissioned">Decommissioned</SelectItem>
                      <SelectItem value="Preventive">Preventive</SelectItem>
                      <SelectItem value="Risk Accepted">Risk Accepted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* New fields for EoS Remediation Plan */}
                <div className="space-y-1 col-span-3">
                  <Label htmlFor="additionalTreatmentCommentary" className="text-sm font-medium">
                    Additional Treatment Commentary
                  </Label>
                  <Input
                    id="additionalTreatmentCommentary"
                    name="additionalTreatmentCommentary"
                    value={formData.additionalTreatmentCommentary}
                    onChange={handleInputChange}
                    placeholder="Enter additional treatment commentary"
                  />
                </div>

                <div className="space-y-1 col-span-3">
                  <Label htmlFor="riskAcceptanceRationale" className="text-sm font-medium">
                    Risk Acceptance Rationale
                  </Label>
                  <Input
                    id="riskAcceptanceRationale"
                    name="riskAcceptanceRationale"
                    value={formData.riskAcceptanceRationale}
                    onChange={handleInputChange}
                    placeholder="Enter risk acceptance rationale"
                  />
                </div>

                <div className="space-y-1 col-span-3">
                  <Label htmlFor="eosConditionsForNonOnboardedAssets" className="text-sm font-medium">
                    Specify known EoS conditions for assets not on-boarded to the EoS tool
                  </Label>
                  <Input
                    id="eosConditionsForNonOnboardedAssets"
                    name="eosConditionsForNonOnboardedAssets"
                    value={formData.eosConditionsForNonOnboardedAssets}
                    onChange={handleInputChange}
                    placeholder="Specify known EoS conditions"
                  />
                </div>

                <div className="space-y-1 col-span-3">
                  <Label htmlFor="impactIfCompromised" className="text-sm font-medium">
                    Impact if asset is compromised due to the EoS event
                  </Label>
                  <Input
                    id="impactIfCompromised"
                    name="impactIfCompromised"
                    value={formData.impactIfCompromised}
                    onChange={handleInputChange}
                    placeholder="Describe potential impact"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Tech & Cyber (Collapsible) */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold">Tech & Cyber</h3>
              <button
                type="button"
                onClick={toggleTechCyber}
                className="ml-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none"
                aria-label={techCyberExpanded ? "Collapse section" : "Expand section"}
              >
                {techCyberExpanded ? (
                  <Minus size={18} className="text-gray-600" />
                ) : (
                  <Plus size={18} className="text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {techCyberExpanded && (
            <div className="p-6 transition-all duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 flex items-center">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="techCyberReviewStatus"
                      checked={formData.techCyberReviewStatus}
                      onCheckedChange={(checked) => handleCheckboxChange("techCyberReviewStatus", checked as boolean)}
                    />
                    <Label htmlFor="techCyberReviewStatus" className="text-sm font-medium">
                      Review Status
                    </Label>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="reviewDate" className="text-sm font-medium">
                    Review Date
                  </Label>
                  <DateInput
                    id="reviewDate"
                    name="reviewDate"
                    value={formData.reviewDate}
                    onChange={handleInputChange}
                    error={dateErrors.reviewDate}
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <Label htmlFor="suggestedAction" className="text-sm font-medium">
                    Suggested Action
                  </Label>
                  <Input
                    id="suggestedAction"
                    name="suggestedAction"
                    value={formData.suggestedAction}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <Label htmlFor="riskStewardComments" className="text-sm font-medium">
                    Risk Steward Comments
                  </Label>
                  <Input
                    id="riskStewardComments"
                    name="riskStewardComments"
                    value={formData.riskStewardComments}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push("/aop")}>
            Cancel
          </Button>
          <Button type="submit" className="bg-theme-500 text-black hover:bg-theme-600">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
