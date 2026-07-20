import type { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, CheckCircle, Eye, MoreHorizontal, XCircle } from "lucide-react"
import type { EventSubmission } from "@/lib/validations/event"
import { EventTypeCell } from "@/components/event/event-type-cell"
import { formatDateRange } from "@/lib/utils"

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Pending</Badge>;
    case "approved":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Approved</Badge>;
    case "rejected":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getConfidenceBadge = (score: number | null | undefined) => {
  if (score == null) return null;
  const className =
    score >= 90
      ? "bg-green-50 text-green-700 border-green-300"
      : score >= 70
      ? "bg-yellow-50 text-yellow-700 border-yellow-300"
      : "bg-red-50 text-red-700 border-red-300";
  return (
    <Badge variant="outline" className={className}>
      {Math.round(score)}%
    </Badge>
  );
};

export function getSubmissionColumns(
  onApprove: (submission: EventSubmission) => void,
  onReject: (submission: EventSubmission) => void,
  onView: (submission: EventSubmission) => void
): ColumnDef<EventSubmission>[] {
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
        <div className="whitespace-normal break-words max-w-[300px]">
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "tracking_id",
      header: "Tracking ID",
      cell: ({ row }) => (
        <code className="bg-muted px-2 py-0.5 rounded text-xs font-mono">
          {row.getValue("tracking_id")}
        </code>
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
      accessorKey: "organizer_name",
      header: "Organizer",
      cell: ({ row }) => (
        <div className="whitespace-normal break-words max-w-[200px]">
          <div className="font-medium">{row.getValue("organizer_name") || "Unknown"}</div>
          <div className="text-xs text-muted-foreground">{row.original.organizer_email || "—"}</div>
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="whitespace-normal break-words max-w-[200px]">
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
      accessorKey: "submission_status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("submission_status")),
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: "source_type",
      header: "Source",
      cell: ({ row }) => {
        const submission = row.original;
        const isScraped = submission.source_type === "scraped";
        return (
          <div className="flex flex-col gap-1">
            <Badge variant="outline" className={isScraped ? "bg-blue-50 text-blue-700 border-blue-300 w-fit" : "bg-slate-50 text-slate-700 border-slate-300 w-fit"}>
              {isScraped ? (submission.source_connector || "Scraped") : "User"}
            </Badge>
            {isScraped && getConfidenceBadge(submission.confidence_score)}
          </div>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      id: "submitted_at",
      header: "Submitted",
      accessorFn: (row) => row.submitted_at,
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {new Date(row.original.submitted_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      ),
      sortingFn: (a, b) =>
        new Date(a.original.submitted_at).getTime() - new Date(b.original.submitted_at).getTime(),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const submission = row.original;
        const isPending = submission.submission_status === "pending";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onView(submission)}>
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              {isPending && (
                <>
                  <DropdownMenuItem onClick={() => onApprove(submission)}>
                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onReject(submission)} className="text-destructive">
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </DropdownMenuItem>
                </>
              )}
              {!isPending && (
                <DropdownMenuItem disabled>
                  <span className="text-muted-foreground">Already {submission.submission_status}</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
