import { isLiveEvent } from "@/lib/utils"
import { Event } from "@/lib/validations/event"

export const LiveEventBadge = ({ event }: { event: Event }) => {
  const isLive = isLiveEvent({ event });

  if (!isLive) return null;

  return (
    <div className="inline-flex items-center space-x-1 rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
      </span>
      <span>Live</span>
    </div>
  );
};
