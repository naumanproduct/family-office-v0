"use client"

import { useState } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChevronLeftIcon,
  TrendingUpIcon,
  BuildingIcon,
  CreditCardIcon,
  HomeIcon,
  BarChart3Icon,
  WalletIcon,
  BitcoinIcon,
  ShieldIcon,
  MoreHorizontalIcon,
} from "lucide-react"

const assetTypes = [
  {
    id: "public-equity",
    name: "Public Equity",
    description: "Listed stocks, ETFs, mutual funds",
    icon: TrendingUpIcon,
    assetClass: "Equity",
  },
  {
    id: "fixed-income",
    name: "Fixed Income",
    description: "Bonds, treasuries, structured notes",
    icon: CreditCardIcon,
    assetClass: "Debt",
  },
  {
    id: "private-equity",
    name: "Private Equity",
    description: "Direct investments, PE funds, co-invests",
    icon: BuildingIcon,
    assetClass: "Alternatives",
  },
  {
    id: "venture-capital",
    name: "Venture Capital",
    description: "Early-stage startups, VC funds",
    icon: BarChart3Icon,
    assetClass: "Alternatives",
  },
  {
    id: "real-estate",
    name: "Real Estate",
    description: "Properties, REITs, real estate funds",
    icon: HomeIcon,
    assetClass: "Real Estate",
  },
  {
    id: "hedge-funds",
    name: "Hedge Funds",
    description: "Single-strategy or fund-of-funds",
    icon: BarChart3Icon,
    assetClass: "Alternatives",
  },
  {
    id: "cash-bank",
    name: "Cash / Bank Accounts",
    description: "Checking, savings, money market",
    icon: WalletIcon,
    assetClass: "Cash",
  },
  {
    id: "digital-assets",
    name: "Digital Assets",
    description: "Crypto holdings, wallets",
    icon: BitcoinIcon,
    assetClass: "Alternatives",
  },
  {
    id: "insurance-annuities",
    name: "Insurance / Annuities",
    description: "Investment-linked policies",
    icon: ShieldIcon,
    assetClass: "Alternatives",
  },
  {
    id: "other",
    name: "Other",
    description: "Art, collectibles, or uncategorized assets",
    icon: MoreHorizontalIcon,
    assetClass: "Alternatives",
  },
]

const assetClasses = ["Equity", "Debt", "Real Estate", "Alternatives", "Cash"]

const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY"]

const jurisdictions = [
  "United States",
  "Cayman Islands",
  "Luxembourg",
  "United Kingdom",
  "Canada",
  "Australia",
  "Singapore",
  "Hong Kong",
  "Switzerland",
  "Netherlands",
  "Ireland",
  "Other",
]

const liquidityProfiles = [
  "Liquid",
  "30-day notice",
  "90-day notice",
  "1-year lockup",
  "2-year lockup",
  "3+ year lockup",
  "Illiquid",
]

interface AddAssetDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function AddAssetDialog({ isOpen, onClose }: AddAssetDialogProps) {
  const [selectedAssetType, setSelectedAssetType] = useState<any>(null)
  const [formData, setFormData] = useState({
    assetName: "",
    assetType: "",
    assetClass: "",
    owningEntity: "",
    acquisitionDate: "",
    costBasis: "",
    currentValue: "",
    currency: "USD",
    ownershipPercent: "",
    managerCustodian: "",
    jurisdiction: "",
    liquidityProfile: "",
    accountVehicleName: "",
    tags: "",
  })

  const handleAssetTypeSelect = (assetType: any) => {
    setSelectedAssetType(assetType)
    setFormData((prev) => ({
      ...prev,
      assetType: assetType.name,
      assetClass: assetType.assetClass,
    }))
  }

  const handleBackToSelection = () => {
    setSelectedAssetType(null)
    setFormData({
      assetName: "",
      assetType: "",
      assetClass: "",
      owningEntity: "",
      acquisitionDate: "",
      costBasis: "",
      currentValue: "",
      currency: "USD",
      ownershipPercent: "",
      managerCustodian: "",
      jurisdiction: "",
      liquidityProfile: "",
      accountVehicleName: "",
      tags: "",
    })
  }

  const handleSave = () => {
    // This would typically save to your backend
    console.log("Saving asset:", formData)
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
            <Button variant="ghost" size="icon" onClick={selectedAssetType ? handleBackToSelection : handleClose}>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className="bg-background">
              {selectedAssetType ? "Asset Details" : "Asset Type"}
            </Badge>
          </div>
        </div>

        {/* Record Header */}
        <div className="border-b bg-background px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
              A
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                {selectedAssetType ? `Add ${selectedAssetType.name}` : "Add New Asset"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedAssetType ? "Fill in the asset details below" : "Select the type of asset you want to add"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!selectedAssetType ? (
            // Asset Type Selection
            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Asset Types</h3>
                {assetTypes.map((assetType) => (
                  <Card
                    key={assetType.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
                    onClick={() => handleAssetTypeSelect(assetType)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <assetType.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base font-medium">{assetType.name}</CardTitle>
                          <CardDescription className="text-sm mt-1">{assetType.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Asset Class: {assetType.assetClass}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            // Asset Form
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {/* Asset Name */}
                <div className="space-y-2">
                  <Label htmlFor="assetName">Asset Name *</Label>
                  <Input
                    id="assetName"
                    placeholder="e.g., Apple Inc., Fund III"
                    value={formData.assetName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, assetName: e.target.value }))}
                  />
                </div>

                {/* Asset Type (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="assetType">Asset Type</Label>
                  <Input id="assetType" value={formData.assetType} readOnly className="bg-muted" />
                </div>

                {/* Asset Class */}
                <div className="space-y-2">
                  <Label htmlFor="assetClass">Asset Class *</Label>
                  <Select
                    value={formData.assetClass}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, assetClass: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset class" />
                    </SelectTrigger>
                    <SelectContent>
                      {assetClasses.map((assetClass) => (
                        <SelectItem key={assetClass} value={assetClass}>
                          {assetClass}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Owning Entity */}
                <div className="space-y-2">
                  <Label htmlFor="owningEntity">Owning Entity</Label>
                  <Input
                    id="owningEntity"
                    placeholder="e.g., Trust, LLC, Individual"
                    value={formData.owningEntity}
                    onChange={(e) => setFormData((prev) => ({ ...prev, owningEntity: e.target.value }))}
                  />
                </div>

                {/* Acquisition Date */}
                <div className="space-y-2">
                  <Label htmlFor="acquisitionDate">Acquisition Date</Label>
                  <Input
                    id="acquisitionDate"
                    type="date"
                    value={formData.acquisitionDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, acquisitionDate: e.target.value }))}
                  />
                </div>

                {/* Cost Basis and Currency */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="costBasis">Cost Basis</Label>
                    <Input
                      id="costBasis"
                      type="number"
                      placeholder="0.00"
                      value={formData.costBasis}
                      onChange={(e) => setFormData((prev) => ({ ...prev, costBasis: e.target.value }))}
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

                {/* Current Value */}
                <div className="space-y-2">
                  <Label htmlFor="currentValue">Current Value</Label>
                  <Input
                    id="currentValue"
                    type="number"
                    placeholder="0.00"
                    value={formData.currentValue}
                    onChange={(e) => setFormData((prev) => ({ ...prev, currentValue: e.target.value }))}
                  />
                </div>

                {/* Ownership Percentage */}
                <div className="space-y-2">
                  <Label htmlFor="ownershipPercent">Ownership %</Label>
                  <Input
                    id="ownershipPercent"
                    type="number"
                    placeholder="100"
                    min="0"
                    max="100"
                    value={formData.ownershipPercent}
                    onChange={(e) => setFormData((prev) => ({ ...prev, ownershipPercent: e.target.value }))}
                  />
                </div>

                {/* Manager / Custodian */}
                <div className="space-y-2">
                  <Label htmlFor="managerCustodian">Manager / Custodian</Label>
                  <Input
                    id="managerCustodian"
                    placeholder="e.g., JPMorgan, Fidelity, Sequoia"
                    value={formData.managerCustodian}
                    onChange={(e) => setFormData((prev) => ({ ...prev, managerCustodian: e.target.value }))}
                  />
                </div>

                {/* Jurisdiction */}
                <div className="space-y-2">
                  <Label htmlFor="jurisdiction">Jurisdiction</Label>
                  <Select
                    value={formData.jurisdiction}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, jurisdiction: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select jurisdiction" />
                    </SelectTrigger>
                    <SelectContent>
                      {jurisdictions.map((jurisdiction) => (
                        <SelectItem key={jurisdiction} value={jurisdiction}>
                          {jurisdiction}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Liquidity Profile */}
                <div className="space-y-2">
                  <Label htmlFor="liquidityProfile">Liquidity Profile</Label>
                  <Select
                    value={formData.liquidityProfile}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, liquidityProfile: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select liquidity profile" />
                    </SelectTrigger>
                    <SelectContent>
                      {liquidityProfiles.map((profile) => (
                        <SelectItem key={profile} value={profile}>
                          {profile}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Account / Vehicle Name */}
                <div className="space-y-2">
                  <Label htmlFor="accountVehicleName">Account / Vehicle Name</Label>
                  <Input
                    id="accountVehicleName"
                    placeholder="Optional - if nested under a fund or account"
                    value={formData.accountVehicleName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, accountVehicleName: e.target.value }))}
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="e.g., AI, Emerging Markets, Growth (comma-separated)"
                    value={formData.tags}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={handleBackToSelection} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleSave} className="flex-1" disabled={!formData.assetName}>
                  Create Asset
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
