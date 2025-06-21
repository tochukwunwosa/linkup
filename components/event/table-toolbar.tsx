"use client"

import type { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/event/data-table-view-options"
import { DataTableFacetedFilter } from "@/components/event/data-table-faceted-filter"

interface TableToolbarProps<TData> {
  table: Table<TData>
}

export function TableToolbar<TData>({ table }: TableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter events..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={[
              { label: "Online", value: "Online" },
              { label: "In-person", value: "In-person" },
            ]}
          />
        )}
        {table.getColumn("publish_status") && (
          <DataTableFacetedFilter
            column={table.getColumn("publish_status")}
            title="Publish Status"
            options={[
              { label: "Published", value: "Published" },
              { label: "Draft", value: "Draft" },
            ]}
          />
        )}
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
