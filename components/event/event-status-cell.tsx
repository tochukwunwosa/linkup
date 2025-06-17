import { Badge } from "@/components/ui/badge"

interface EventStatusCellProps {
  value: string
}

export function EventStatusCell({ value }: EventStatusCellProps) {
  return (
    <Badge
      variant={value === "Published" ? "default" : "outline"}
      className={value === "Published" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
    >
      {value}
    </Badge>
  )
}
