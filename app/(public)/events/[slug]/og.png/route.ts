import OgImage from "../opengraph-image";

// A stable address for the event image (/events/<slug>/og.png). The
// opengraph-image convention adds a build hash to its URL, which the
// structured data on the page can't know, so Google's Event "image" points
// here. Same image as the social share preview.
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  return OgImage({ params });
}
