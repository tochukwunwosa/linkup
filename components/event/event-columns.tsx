import type { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown, Edit, MoreHorizontal, Trash } from "lucide-react"
import { Event } from "@/lib/validations/event"
import { EventTypeCell } from "@/components/event/event-type-cell"
import { EventStatusCell } from "@/components/event/event-status-cell"
import { formatDateRange } from "@/lib/utils"

export function getEventColumns(
  onEdit: (event: Event) => void,
  onDelete: (event: Event) => void
): ColumnDef<Event>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
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
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="whitespace-normal break-words max-w-[500px]">
          {row.getValue("title")}
        </div>
      ),
    },
    {
      id: "date",
      header: "Date",
      accessorFn: (row) => formatDateRange(row.start_date, row.end_date || ""),
      cell: ({ getValue }) => (
        <div className="text-sm text-muted-foreground max-w-fit">{getValue() as string}</div>
      ),
      sortingFn: (a, b) =>
        new Date(a.original.start_date).getTime() - new Date(b.original.start_date).getTime(),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="whitespace-normal break-words max-w-[500px]">
          {row.getValue("location")}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <EventTypeCell value={row.getValue("type")} />,
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: "publish_status",
      header: "Status",
      cell: ({ row }) => <EventStatusCell value={row.getValue("publish_status")} />,
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const event = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(event)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(event)} className="text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}