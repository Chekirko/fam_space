import { Readable } from "stream";

import cloudinary from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest): Promise<Response> {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const stream = new Readable();
  stream.push(Buffer.from(await file.arrayBuffer()));
  stream.push(null);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(
            NextResponse.json({ error: "Upload failed" }, { status: 500 })
          );
        }
        if (!result) {
          return reject(
            NextResponse.json(
              { error: "No result from Cloudinary" },
              { status: 500 }
            )
          );
        }
        resolve(NextResponse.json({ url: result.secure_url }, { status: 200 }));
      }
    );

    stream.pipe(uploadStream);
  }) as Promise<Response>;
}
