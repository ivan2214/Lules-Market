"use server";
import { PROJECT_KEY } from "../constants";

const MEDIA_SERVICE_URL = process.env.NEXT_PUBLIC_MEDIA_SERVICE_URL;

export async function deleteImageFromMediaService(
  key: string,
  projectKey: string
) {
  try {
    await fetch(
      `${MEDIA_SERVICE_URL}/files/${encodeURIComponent(
        key
      )}?projectKey=${projectKey}`, // <-- enviamos projectKey
      {
        method: "DELETE",
      }
    );
  } catch (error) {
    console.error("Error deleting image from media service:", error);
  }
}

export async function confirmImages(
  images: {
    url: string;
    key: string;
    name?: string | undefined;
    isMainImage?: boolean | undefined;
    size?: number | undefined;
  }[]
) {
  for (const image of images) {
    await fetch(`${MEDIA_SERVICE_URL}/files/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: image.key,
        url: image.url,
        isMain: false,
        name: image.name,
        size: image.size,
        projectKey: PROJECT_KEY,
      }),
    });
  }
}
