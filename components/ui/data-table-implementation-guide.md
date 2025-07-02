# Advanced Data Table Implementation Guide

This guide explains how to implement the shadcn-table pattern with infinite scroll (from https://github.com/sadmann7/shadcn-table) in your application.

## Key Components

### 1. `DataTableInfinite` Component
Located at: `components/ui/data-table-infinite.tsx`

This is the core table component that provides:
- **Infinite scroll** instead of pagination
- **Advanced filtering** with faceted filters
- **Column sorting** and visibility controls
- **Row selection** with checkboxes
- **Sticky header** for better UX

### 2. `DataTableToolbar` Component
Located at: `components/ui/data-table-toolbar.tsx`

Provides:
- **Search input** for global filtering
- **Faceted filters** with badge display
- **Column visibility** controls
- **Reset filters** button

## Implementation Steps

### Step 1: Define Your Data Type

```typescript
export interface YourDataType {
  id: number
  // ... other fields
}
```

### Step 2: Create Column Definitions

```typescript
import { ColumnDef } from "@tanstack/react-table"
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CaretSortIcon,
} from "@radix-ui/react-icons"

export const columns: ColumnDef<YourDataType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || 
          (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        {column.getIsSorted() === "asc" ? (
          <ArrowUpIcon className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDownIcon className="ml-2 h-4 w-4" />
        ) : (
          <CaretSortIcon className="ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("name")}</div>
    },
    filterFn: (row, id, value) => {
      // Custom filter logic
      return row.getValue(id).toString().toLowerCase().includes(value.toLowerCase())
    },
  },
  // ... more columns
]
```

### Step 3: Implement the Table Component

```typescript
export function YourTableComponent() {
  const [data, setData] = React.useState<YourDataType[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [hasMore, setHasMore] = React.useState(true)
  const [page, setPage] = React.useState(0)
  const [selectedItem, setSelectedItem] = React.useState<YourDataType | null>(null)

  const ITEMS_PER_PAGE = 50

  // Load initial data
  React.useEffect(() => {
    loadInitialData()
  }, [])

  // Load more data function
  const loadMore = React.useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    
    // Replace with your API call
    fetchMoreData(page * ITEMS_PER_PAGE, ITEMS_PER_PAGE)
      .then((newData) => {
        setData((prev) => [...prev, ...newData])
        setPage((prev) => prev + 1)
        setHasMore(newData.length === ITEMS_PER_PAGE)
      })
      .finally(() => setIsLoading(false))
  }, [page, isLoading, hasMore])

  // Filter configuration
  const filters = [
    {
      column: "status",
      title: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
    // ... more filters
  ]

  return (
    <div className="space-y-4">
      <DataTableInfinite
        columns={columns}
        data={data}
        searchPlaceholder="Search..."
        filters={filters}
        onLoadMore={loadMore}
        isLoading={isLoading}
        hasMore={hasMore}
        virtualHeight="calc(100vh - 250px)"
        onRowClick={(item) => setSelectedItem(item)}
      />
      
      {/* Details drawer/sheet */}
      {selectedItem && (
        <Sheet open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
          <SheetContent>
            {/* Your details content */}
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
```

## Key Features

### Infinite Scroll
- Uses `react-intersection-observer` to detect when user scrolls near bottom
- Automatically triggers `onLoadMore` callback
- Shows loading skeleton while fetching

### Advanced Filtering
- **Faceted filters**: Show counts and allow multiple selections
- **Search filter**: Global text search across specified columns
- **Filter persistence**: Maintains filter state during scrolling

### Performance Optimizations
- **Virtual scrolling**: Only renders visible rows
- **Sticky headers**: Headers remain visible while scrolling
- **Debounced search**: Prevents excessive filtering

### Responsive Design
- **Mobile-friendly**: Adapts to smaller screens
- **Touch support**: Works well on touch devices
- **Keyboard navigation**: Full keyboard support

## Customization Options

### Virtual Height
Adjust the table height based on your layout:
```typescript
virtualHeight="calc(100vh - 250px)" // Adjust based on header/footer
```

### Items Per Page
Control how many items load at once:
```typescript
const ITEMS_PER_PAGE = 50 // Adjust based on performance needs
```

### Custom Cell Renderers
Create rich cell content:
```typescript
cell: ({ row }) => {
  const item = row.original
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarFallback>{item.name[0]}</AvatarFallback>
      </Avatar>
      <span>{item.name}</span>
    </div>
  )
}
```

### Custom Filter Functions
Implement complex filtering logic:
```typescript
filterFn: (row, id, value) => {
  // Array includes filter
  if (Array.isArray(value)) {
    return value.includes(row.getValue(id))
  }
  // Text search filter
  return row.getValue(id).toString().toLowerCase().includes(value.toLowerCase())
}
```

## Best Practices

1. **Memoize expensive operations**: Use `React.useMemo` for column definitions
2. **Handle errors gracefully**: Show error states when data loading fails
3. **Provide loading feedback**: Use skeletons or spinners during data fetching
4. **Optimize API calls**: Implement proper pagination on the backend
5. **Cache data**: Consider caching loaded pages to improve performance

## Migration from Existing Tables

To migrate existing tables:

1. Extract your data fetching logic
2. Convert column definitions to the new format
3. Replace pagination with infinite scroll logic
4. Add filtering configuration
5. Update the UI to use `DataTableInfinite`

## Example Tables to Convert

Based on your application, these tables would benefit from this pattern:
- Companies Table
- Investments Table
- Entities Table
- Tasks Table
- Documents Table
- Notes Table
- Opportunities Table 