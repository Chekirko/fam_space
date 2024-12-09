import { NextResponse } from "next/server";
import slugify from "slugify";

import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { SignInWithGoogleSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const { user } = await request.json();

  await dbConnect();

  try {
    const validatedData = SignInWithGoogleSchema.safeParse({
      user,
    });

    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    const { name, username, email, image } = user;

    const slugifiedUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    let existingUser = await User.findOne({ email });

    if (!existingUser) {
      existingUser = await User.create({
        name,
        username: slugifiedUsername,
        email,
        image,
      });
    } else {
      const updatedData: { name?: string; image?: string } = {};

      if (existingUser.name !== name) updatedData.name = name;
      if (existingUser.image !== image) updatedData.image = image;

      if (Object.keys(updatedData).length > 0) {
        await User.updateOne({ _id: existingUser._id }, { $set: updatedData });
      }
    }

    return NextResponse.json({ data: existingUser, success: true });
  } catch (error: unknown) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
