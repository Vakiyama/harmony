import { cloudinary } from "~/middleware/cloudinaryConfig";
import { APIEvent } from "@solidjs/start/server";

export const POST = async ({ request }: APIEvent) => {
  try {
    const formData = await request.formData();
    const fileEntry = formData.get("photo");

    if (!fileEntry || !(fileEntry instanceof File)) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
      });
    }

    const file = fileEntry as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
      });
    }

    if (file.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "File size exceeds 5MB" }), {
        status: 400,
      });
    }

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedMimeTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: "Invalid file type" }), {
        status: 400,
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await cloudinary.uploader.upload(
      `data:${file.type};base64,${buffer.toString("base64")}`,
      {
        folder: "harmony",
      }
    );
    return new Response(JSON.stringify({ url: result.secure_url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during file upload:", error.message);
      return new Response(JSON.stringify({ error: "Upload failed" }), {
        status: 500,
      });
    }

    console.error("Unknown error during file upload:", error);
    return new Response(
      JSON.stringify({ error: "Upload failed due to unknown error" }),
      { status: 500 }
    );
  }
};
