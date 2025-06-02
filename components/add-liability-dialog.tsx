"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, CreditCardIcon, BuildingIcon, DollarSignIcon, TrendingDownIcon } from "lucide-react"

const liabilityCategories = [
  {
    id: "operating-debt",
    name: "Operating Debt",
    description: "Short-term debt for operations",
    icon: CreditCardIcon,
    types: ["Credit Line", "Working Capital Loan", "Trade Payables", "Accrued Expenses", "Short-term Notes"],
  },
  {
    id: "investment-debt",
    name: "Investment Debt",
    description: "Debt used for investment purposes",
    icon: TrendingDownIcon,
    types: ["Acquisition Financing", "Bridge Loan", "Mezzanine Debt", "Convertible Debt", "Investment Notes"],
  },
  {
    id: "capital-call-facility",
    name: "Capital Call Facility",
    description: "Credit facilities for capital calls",
    icon: DollarSignIcon,
    types: [
      "Subscription Credit Line",
      "LP Facility",
      "Capital Call Bridge",
      "Commitment Facility",
      "Draw-down Facility",
    ],
  },
  {
    id: "asset-based-debt",
    name: "Asset-Based Debt",
    description: "Debt secured by specific assets",
    icon: BuildingIcon,
    types: [
      "Real Estate Mortgage",
      "Equipment Financing",
      "Asset-Backed Securities",
      "Collateralized Loan",
      "Secured Notes",
    ],
  },
]

interface AddLiabilityDialogProps {
  children: React.ReactNode
}

export function AddLiabilityDialog({ children }: AddLiabilityDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState<"category" | "type" | "details">("category")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("")
  const [selectedType, setSelectedType] = React.useState<string>("")
  const [formData, setFormData] = React.useState({
    name: "",
    principalAmount: "",
    currentBalance: "",
    interestRate: "",
    maturityDate: "",
    entity: "",
    lender: "",
    purpose: "",
    description: "",
  })

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setStep("type")
  }

  const handleTypeSelect = (type: string) => {
    setSelectedType(type)
    setStep("details")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Liability data:", {
      category: selectedCategory,
      type: selectedType,
      ...formData,
    })
    setOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setStep("category")
    setSelectedCategory("")
    setSelectedType("")
    setFormData({
      name: "",
      principalAmount: "",
      currentBalance: "",
      interestRate: "",
      maturityDate: "",
      entity: "",
      lender: "",
      purpose: "",
      description: "",
    })
  }

  const handleBack = () => {
    if (step === "type") {
      setStep("category")
      setSelectedCategory("")
    } else if (step === "details") {
      setStep("type")
      setSelectedType("")
    }
  }

  const selectedCategoryData = liabilityCategories.find((cat) => cat.id === selectedCategory)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {step === "category" && "Add New Liability"}
            {step === "type" && "Select Liability Type"}
            {step === "details" && "Liability Details"}
          </DialogTitle>
          <DialogDescription>
            {step === "category" && "Choose the category of liability you want to add."}
            {step === "type" && `Select the specific type of ${selectedCategoryData?.name.toLowerCase()} liability.`}
            {step === "details" && "Enter the details for your new liability."}
          </DialogDescription>
        </DialogHeader>

        {step === "category" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {liabilityCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <Card
                  key={category.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base">{category.name}</CardTitle>
                    </div>
                    <CardDescription className="text-sm">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1">
                      {category.types.slice(0, 3).map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                      {category.types.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{category.types.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {step === "type" && selectedCategoryData && (
          <div className="py-4">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <selectedCategoryData.icon className="h-5 w-5 text-primary" />
                <h3 className="font-medium">{selectedCategoryData.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{selectedCategoryData.description}</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {selectedCategoryData.types.map((type) => (
                <Card
                  key={type}
                  className="cursor-pointer hover:shadow-sm transition-shadow p-3"
                  onClick={() => handleTypeSelect(type)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{type}</span>
                    <PlusIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === "details" && (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                {selectedCategoryData?.icon && <selectedCategoryData.icon className="h-4 w-4" />}
                <span className="font-medium">{selectedCategoryData?.name}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{selectedType}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Liability Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter liability name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="principalAmount">Principal Amount</Label>
                <Input
                  id="principalAmount"
                  value={formData.principalAmount}
                  onChange={(e) => setFormData({ ...formData, principalAmount: e.target.value })}
                  placeholder="$0.00"
                />
              </div>

              <div>
                <Label htmlFor="currentBalance">Current Balance</Label>
                <Input
                  id="currentBalance"
                  value={formData.currentBalance}
                  onChange={(e) => setFormData({ ...formData, currentBalance: e.target.value })}
                  placeholder="$0.00"
                />
              </div>

              <div>
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  value={formData.interestRate}
                  onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="maturityDate">Maturity Date</Label>
                <Input
                  id="maturityDate"
                  type="date"
                  value={formData.maturityDate}
                  onChange={(e) => setFormData({ ...formData, maturityDate: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="entity">Entity</Label>
                <Select value={formData.entity} onValueChange={(value) => setFormData({ ...formData, entity: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meridian-capital-fund-iii">Meridian Capital Fund III</SelectItem>
                    <SelectItem value="innovation-ventures-llc">Innovation Ventures LLC</SelectItem>
                    <SelectItem value="global-growth-partners">Global Growth Partners</SelectItem>
                    <SelectItem value="real-estate-investment-trust">Real Estate Investment Trust</SelectItem>
                    <SelectItem value="sustainable-infrastructure-fund">Sustainable Infrastructure Fund</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="lender">Lender</Label>
                <Input
                  id="lender"
                  value={formData.lender}
                  onChange={(e) => setFormData({ ...formData, lender: e.target.value })}
                  placeholder="Enter lender name"
                />
              </div>

              <div>
                <Label htmlFor="purpose">Purpose</Label>
                <Select
                  value={formData.purpose}
                  onValueChange={(value) => setFormData({ ...formData, purpose: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acquisition">Acquisition</SelectItem>
                    <SelectItem value="working-capital">Working Capital</SelectItem>
                    <SelectItem value="expansion">Expansion</SelectItem>
                    <SelectItem value="refinancing">Refinancing</SelectItem>
                    <SelectItem value="bridge-financing">Bridge Financing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter liability description..."
                  rows={3}
                />
              </div>
            </div>
          </form>
        )}

        <DialogFooter>
          {step !== "category" && (
            <Button type="button" variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          {step === "details" && (
            <Button type="submit" onClick={handleSubmit}>
              Add Liability
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
