"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function EditItem({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    serviceCI: params.id,
    serviceName: "Service A",
    category: "Critical",
    businessRisk: "Medium",
    eosDate: "2023-12-31",
    rasScore: "Extreme",
    remediationPlan: "Plan A",
    residualScore: "Medium",
    incompletePlan: false,
    remediationExpired: false,
    invalidSelection: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated data to your backend
    console.log("Updated data:", formData)
    router.push("/")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-black mb-4">Edit Item: {params.id}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="serviceCI" className="text-sm font-medium">
              Service CI
            </Label>
            <Input id="serviceCI" name="serviceCI" value={formData.serviceCI} disabled />
          </div>
          <div className="space-y-1">
            <Label htmlFor="serviceName" className="text-sm font-medium">
              Service Name
            </Label>
            <Input id="serviceName" name="serviceName" value={formData.serviceName} disabled />
          </div>
          <div className="space-y-1">
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="Non-critical">Non-critical</SelectItem>
                <SelectItem value="SaaS">SaaS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="businessRisk" className="text-sm font-medium">
              Business Risk
            </Label>
            <Select value={formData.businessRisk} onValueChange={(value) => handleSelectChange("businessRisk", value)}>
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
          <div className="space-y-1">
            <Label htmlFor="eosDate" className="text-sm font-medium">
              EoS Date
            </Label>
            <Input id="eosDate" name="eosDate" value={formData.eosDate} disabled />
          </div>
          <div className="space-y-1">
            <Label htmlFor="rasScore" className="text-sm font-medium">
              RAS Score
            </Label>
            <Select value={formData.rasScore} onValueChange={(value) => handleSelectChange("rasScore", value)}>
              <SelectTrigger id="rasScore">
                <SelectValue placeholder="Select RAS Score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Extreme">Extreme</SelectItem>
                <SelectItem value="Very High">Very High</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Insignificant">Insignificant</SelectItem>
                <SelectItem value="Compliant">Compliant</SelectItem>
                <SelectItem value="SaaS-Compliant">SaaS-Compliant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="remediationPlan" className="text-sm font-medium">
              Remediation Plan
            </Label>
            <Input
              id="remediationPlan"
              name="remediationPlan"
              value={formData.remediationPlan}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="residualScore" className="text-sm font-medium">
              Residual Score
            </Label>
            <Select
              value={formData.residualScore}
              onValueChange={(value) => handleSelectChange("residualScore", value)}
            >
              <SelectTrigger id="residualScore">
                <SelectValue placeholder="Select Residual Score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Extreme">Extreme</SelectItem>
                <SelectItem value="Very High">Very High</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Insignificant">Insignificant</SelectItem>
                <SelectItem value="Compliant">Compliant</SelectItem>
                <SelectItem value="SaaS-Compliant">SaaS-Compliant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* New boolean fields */}
          <div className="space-y-1 flex items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="incompletePlan"
                checked={formData.incompletePlan}
                onCheckedChange={(checked) => handleCheckboxChange("incompletePlan", checked as boolean)}
              />
              <Label htmlFor="incompletePlan" className="text-sm font-medium">
                Incomplete Plan
              </Label>
            </div>
          </div>

          <div className="space-y-1 flex items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remediationExpired"
                checked={formData.remediationExpired}
                onCheckedChange={(checked) => handleCheckboxChange("remediationExpired", checked as boolean)}
              />
              <Label htmlFor="remediationExpired" className="text-sm font-medium">
                Remediation Expired
              </Label>
            </div>
          </div>

          <div className="space-y-1 flex items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="invalidSelection"
                checked={formData.invalidSelection}
                onCheckedChange={(checked) => handleCheckboxChange("invalidSelection", checked as boolean)}
              />
              <Label htmlFor="invalidSelection" className="text-sm font-medium">
                Invalid Selection
              </Label>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push("/")}>
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

