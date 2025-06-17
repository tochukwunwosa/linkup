import { Badge } from "@/components/ui/badge"

interface EventTypeCellProps {
  value: string
}

export function EventTypeCell({ value }: EventTypeCellProps) {
  return <Badge variant={value === "Online" ? "secondary" : "outline"}>{value}</Badge>
}
