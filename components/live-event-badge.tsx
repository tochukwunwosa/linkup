import { isLiveEvent } from "@/lib/utils";
import { useEventContext } from "@/components/context/EventContext";

export const LiveEventBadge = () => {
  const { filteredEvents } = useEventContext();
  const liveEvents = filteredEvents.filter((e) => isLiveEvent({ event: e }));

  return (
    <>
      {liveEvents.length > 0 && (
        <div className="inline-flex items-center space-x-1 rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
          </span>
          <span>Live Now</span>
        </div>
      )}
    </>
  );
};
