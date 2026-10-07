import config from "@payload-config";
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from "@payloadcms/next/routes";

// A bulk export or import walks every record through this route, and a few
// hundred teachers with their appointment arrays is enough to outlast
// Vercel's default function timeout — which fails as an opaque 504. This is a
// ceiling, not a reservation — billing is by actual duration — so raising it
// for the whole REST surface costs nothing. Plans cap the value; a Hobby
// project cannot go above its own limit whatever is written here.
export const maxDuration = 60;

export const GET = REST_GET(config);
export const POST = REST_POST(config);
export const DELETE = REST_DELETE(config);
export const PATCH = REST_PATCH(config);
export const PUT = REST_PUT(config);
export const OPTIONS = REST_OPTIONS(config);
