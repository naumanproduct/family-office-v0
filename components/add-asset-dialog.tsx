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
import { PlusIcon, TrendingUpIcon, BuildingIcon, DollarSignIcon, BarChart3Icon } from "lucide-react"

const assetCategories = [
  {
    id: "private-equity",
    name: "Private Equity",
    description: "Direct investments in private companies",
    icon: TrendingUpIcon,
    types: [
      "Growth Capital Investment",
      "Buyout Investment",
      "Venture Capital Investment",
      "Distressed Investment",
      "Secondary Investment",
    ],
  },
  {
    id: "real-estate",
    name: "Real Estate",
    description: "Property and real estate investments",
    icon: BuildingIcon,
    types: ["Commercial Property", "Residential Property", "Industrial Property", "Land Investment", "REIT Investment"],
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    description: "Infrastructure and utility investments",
    icon: BarChart3Icon,
    types: [
      "Energy Infrastructure",
      "Transportation Infrastructure",
      "Telecommunications Infrastructure",
      "Water Infrastructure",
      "Social Infrastructure",
    ],
  },
  {
    id: "fund-investment",
    name: "Fund Investment",
    description: "Investments in other funds",
    icon: DollarSignIcon,
    types: ["Private Equity Fund", "Venture Capital Fund", "Real Estate Fund", "Infrastructure Fund", "Hedge Fund"],
  },
]

interface AddAssetDialogProps {
  children: React.ReactNode
}

export function AddAssetDialog({ children }: AddAssetDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState<"category" | "type" | "details">("category")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("")
  const [selectedType, setSelectedType] = React.useState<string>("")
  const [formData, setFormData] = React.useState({
    name: "",
    originalCost: "",
    currentValue: "",
    acquisitionDate: "",
    entity: "",
    sector: "",
    geography: "",
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
    console.log("Asset data:", {
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
      originalCost: "",
      currentValue: "",
      acquisitionDate: "",
      entity: "",
      sector: "",
      geography: "",
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

  const selectedCategoryData = assetCategories.find((cat) => cat.id === selectedCategory)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {step === "category" && "Add New Asset"}
            {step === "type" && "Select Asset Type"}
            {step === "details" && "Asset Details"}
          </DialogTitle>
          <DialogDescription>
            {step === "category" && "Choose the category of asset you want to add."}
            {step === "type" && `Select the specific type of ${selectedCategoryData?.name.toLowerCase()} asset.`}
            {step === "details" && "Enter the details for your new asset."}
          </DialogDescription>
        </DialogHeader>

        {step === "category" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {assetCategories.map((category) => {
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
                <Label htmlFor="name">Asset Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter asset name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="originalCost">Original Cost</Label>
                <Input
                  id="originalCost"
                  value={formData.originalCost}
                  onChange={(e) => setFormData({ ...formData, originalCost: e.target.value })}
                  placeholder="$0.00"
                />
              </div>

              <div>
                <Label htmlFor="currentValue">Current Value</Label>
                <Input
                  id="currentValue"
                  value={formData.currentValue}
                  onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                  placeholder="$0.00"
                />
              </div>

              <div>
                <Label htmlFor="acquisitionDate">Acquisition Date</Label>
                <Input
                  id="acquisitionDate"
                  type="date"
                  value={formData.acquisitionDate}
                  onChange={(e) => setFormData({ ...formData, acquisitionDate: e.target.value })}
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
                <Label htmlFor="sector">Sector</Label>
                <Input
                  id="sector"
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  placeholder="e.g., Technology, Healthcare"
                />
              </div>

              <div>
                <Label htmlFor="geography">Geography</Label>
                <Select
                  value={formData.geography}
                  onValueChange={(value) => setFormData({ ...formData, geography: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select geography" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="north-america">North America</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="emerging-markets">Emerging Markets</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter asset description..."
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
              Add Asset
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
