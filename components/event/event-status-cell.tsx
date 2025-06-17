import { Badge } from "@/components/ui/badge"

interface Eventpublish_statusCellProps {
  value: string
}

export function Eventpublish_statusCell({ value }: Eventpublish_statusCellProps) {
  return (
    <Badge
      variant={value === "Published" ? "default" : "outline"}
      className={value === "Published" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
    >
      {value}
    </Badge>
  )
}
