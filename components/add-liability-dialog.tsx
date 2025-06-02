"use client"

import { useState } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  ChevronLeftIcon,
  CreditCardIcon,
  BuildingIcon,
  TrendingUpIcon,
  HomeIcon,
  BanknoteIcon,
  ClockIcon,
  ShieldIcon,
  MoreHorizontalIcon,
  LandmarkIcon,
} from "lucide-react"

const liabilityTypes = [
  {
    id: "credit-line",
    name: "Credit Line",
    description: "Revolving credit facilities, operating lines",
    icon: CreditCardIcon,
    category: "Operating Debt",
  },
  {
    id: "term-loan",
    name: "Term Loan",
    description: "Fixed-term loans, acquisition financing",
    icon: BanknoteIcon,
    category: "Investment Debt",
  },
  {
    id: "bridge-financing",
    name: "Bridge Financing",
    description: "Short-term bridge loans, interim financing",
    icon: ClockIcon,
    category: "Development Debt",
  },
  {
    id: "subscription-credit",
    name: "Subscription Credit Line",
    description: "Capital call facilities, LP commitment-backed",
    icon: LandmarkIcon,
    category: "Capital Call Facility",
  },
  {
    id: "equipment-financing",
    name: "Equipment Financing",
    description: "Asset-based loans, equipment purchases",
    icon: BuildingIcon,
    category: "Asset-Based Debt",
  },
  {
    id: "real-estate-debt",
    name: "Real Estate Debt",
    description: "Property mortgages, construction loans",
    icon: HomeIcon,
    category: "Real Estate Debt",
  },
  {
    id: "mezzanine-debt",
    name: "Mezzanine Debt",
    description: "Subordinated debt, convertible instruments",
    icon: TrendingUpIcon,
    category: "Hybrid Debt",
  },
  {
    id: "trade-finance",
    name: "Trade Finance",
    description: "Letters of credit, trade facilities",
    icon: LandmarkIcon,
    category: "Trade Debt",
  },
  {
    id: "guarantees",
    name: "Guarantees & Contingent",
    description: "Performance bonds, guarantees, contingent liabilities",
    icon: ShieldIcon,
    category: "Contingent Liabilities",
  },
  {
    id: "other",
    name: "Other",
    description: "Miscellaneous debt instruments",
    icon: MoreHorizontalIcon,
    category: "Other Debt",
  },
]

const liabilityCategories = [
  "Operating Debt",
  "Investment Debt",
  "Development Debt",
  "Capital Call Facility",
  "Asset-Based Debt",
  "Real Estate Debt",
  "Hybrid Debt",
  "Trade Debt",
  "Contingent Liabilities",
  "Other Debt",
]

const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY"]

const interestRateTypes = [
  "Fixed",
  "Variable - SOFR",
  "Variable - LIBOR",
  "Variable - Prime",
  "Variable - Fed Funds",
  "Variable - Other",
]

const paymentFrequencies = [
  "Monthly",
  "Quarterly",
  "Semi-annually",
  "Annually",
  "Interest Only",
  "Bullet Payment",
  "On Demand",
]

const liabilityStatuses = ["Current", "Past Due", "Undrawn", "Matured", "In Default", "Restructured"]

const collateralTypes = [
  "Unsecured",
  "Fund Assets",
  "Real Estate",
  "Equipment",
  "Securities Portfolio",
  "LP Commitments",
  "Cash Collateral",
  "Personal Guarantee",
  "Corporate Guarantee",
  "Other",
]

interface AddLiabilityDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function AddLiabilityDialog({ isOpen, onClose }: AddLiabilityDialogProps) {
  const [selectedLiabilityType, setSelectedLiabilityType] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    category: "",
    originalAmount: "",
    currentBalance: "",
    interestRate: "",
    interestRateType: "Fixed",
    maturityDate: "",
    nextPaymentDate: "",
    paymentAmount: "",
    paymentFrequency: "Monthly",
    currency: "USD",
    entity: "",
    lender: "",
    collateralType: "Unsecured",
    collateralDescription: "",
    status: "Current",
    covenants: "",
    notes: "",
  })

  const handleLiabilityTypeSelect = (liabilityType: any) => {
    setSelectedLiabilityType(liabilityType)
    setFormData((prev) => ({
      ...prev,
      type: liabilityType.name,
      category: liabilityType.category,
    }))
  }

  const handleBackToSelection = () => {
    setSelectedLiabilityType(null)
    setFormData({
      name: "",
      type: "",
      category: "",
      originalAmount: "",
      currentBalance: "",
      interestRate: "",
      interestRateType: "Fixed",
      maturityDate: "",
      nextPaymentDate: "",
      paymentAmount: "",
      paymentFrequency: "Monthly",
      currency: "USD",
      entity: "",
      lender: "",
      collateralType: "Unsecured",
      collateralDescription: "",
      status: "Current",
      covenants: "",
      notes: "",
    })
  }

  const handleSave = () => {
    // This would typically save to your backend
    console.log("Saving liability:", formData)
    onClose()
    handleBackToSelection()
  }

  const handleClose = () => {
    onClose()
    handleBackToSelection()
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="right" className="flex w-full max-w-2xl flex-col p-0 sm:max-w-2xl [&>button]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-muted px-6 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={selectedLiabilityType ? handleBackToSelection : handleClose}>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className="bg-background">
              {selectedLiabilityType ? "Liability Details" : "Liability Type"}
            </Badge>
          </div>
        </div>

        {/* Record Header */}
        <div className="border-b bg-background px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white text-sm font-medium">
              L
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                {selectedLiabilityType ? `Add ${selectedLiabilityType.name}` : "Add New Liability"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedLiabilityType
                  ? "Fill in the liability details below"
                  : "Select the type of liability you want to add"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!selectedLiabilityType ? (
            // Liability Type Selection
            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Liability Types</h3>
                {liabilityTypes.map((liabilityType) => (
                  <Card
                    key={liabilityType.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
                    onClick={() => handleLiabilityTypeSelect(liabilityType)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 border border-red-200">
                          <liabilityType.icon className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base font-medium">{liabilityType.name}</CardTitle>
                          <CardDescription className="text-sm mt-1">{liabilityType.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Category: {liabilityType.category}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            // Liability Form
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {/* Liability Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Liability Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Credit Facility - Fund Operations"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                {/* Liability Type (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="type">Liability Type</Label>
                  <Input id="type" value={formData.type} readOnly className="bg-muted" />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {liabilityCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Original Amount and Currency */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="originalAmount">Original Amount *</Label>
                    <Input
                      id="originalAmount"
                      type="number"
                      placeholder="0.00"
                      value={formData.originalAmount}
                      onChange={(e) => setFormData((prev) => ({ ...prev, originalAmount: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Current Balance */}
                <div className="space-y-2">
                  <Label htmlFor="currentBalance">Current Balance</Label>
                  <Input
                    id="currentBalance"
                    type="number"
                    placeholder="0.00"
                    value={formData.currentBalance}
                    onChange={(e) => setFormData((prev) => ({ ...prev, currentBalance: e.target.value }))}
                  />
                </div>

                {/* Interest Rate and Type */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.interestRate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, interestRate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interestRateType">Rate Type</Label>
                    <Select
                      value={formData.interestRateType}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, interestRateType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {interestRateTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Maturity Date */}
                <div className="space-y-2">
                  <Label htmlFor="maturityDate">Maturity Date</Label>
                  <Input
                    id="maturityDate"
                    type="date"
                    value={formData.maturityDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, maturityDate: e.target.value }))}
                  />
                </div>

                {/* Payment Details */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="nextPaymentDate">Next Payment Date</Label>
                    <Input
                      id="nextPaymentDate"
                      type="date"
                      value={formData.nextPaymentDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, nextPaymentDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentAmount">Payment Amount</Label>
                    <Input
                      id="paymentAmount"
                      type="number"
                      placeholder="0.00"
                      value={formData.paymentAmount}
                      onChange={(e) => setFormData((prev) => ({ ...prev, paymentAmount: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Payment Frequency */}
                <div className="space-y-2">
                  <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                  <Select
                    value={formData.paymentFrequency}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentFrequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentFrequencies.map((frequency) => (
                        <SelectItem key={frequency} value={frequency}>
                          {frequency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Entity */}
                <div className="space-y-2">
                  <Label htmlFor="entity">Owning Entity</Label>
                  <Input
                    id="entity"
                    placeholder="e.g., Meridian Capital Fund III"
                    value={formData.entity}
                    onChange={(e) => setFormData((prev) => ({ ...prev, entity: e.target.value }))}
                  />
                </div>

                {/* Lender */}
                <div className="space-y-2">
                  <Label htmlFor="lender">Lender / Creditor *</Label>
                  <Input
                    id="lender"
                    placeholder="e.g., First National Bank"
                    value={formData.lender}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lender: e.target.value }))}
                  />
                </div>

                {/* Collateral */}
                <div className="space-y-2">
                  <Label htmlFor="collateralType">Collateral Type</Label>
                  <Select
                    value={formData.collateralType}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, collateralType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {collateralTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Collateral Description */}
                {formData.collateralType !== "Unsecured" && (
                  <div className="space-y-2">
                    <Label htmlFor="collateralDescription">Collateral Description</Label>
                    <Input
                      id="collateralDescription"
                      placeholder="Describe the collateral securing this liability"
                      value={formData.collateralDescription}
                      onChange={(e) => setFormData((prev) => ({ ...prev, collateralDescription: e.target.value }))}
                    />
                  </div>
                )}

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {liabilityStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Covenants */}
                <div className="space-y-2">
                  <Label htmlFor="covenants">Covenants & Restrictions</Label>
                  <Textarea
                    id="covenants"
                    placeholder="Describe any financial covenants, restrictions, or special terms"
                    value={formData.covenants}
                    onChange={(e) => setFormData((prev) => ({ ...prev, covenants: e.target.value }))}
                    rows={3}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information about this liability"
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={handleBackToSelection} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1"
                  disabled={!formData.name || !formData.lender || !formData.originalAmount}
                >
                  Create Liability
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
