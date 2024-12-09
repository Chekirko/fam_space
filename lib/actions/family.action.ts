"use server";

import Family from "@/database/family.model";
import User from "@/database/user.model";
import { parseStringify } from "@/lib/utils";

import logger from "../logger";
import dbConnect from "../mongoose";
import { createFamilyParams } from "./shared.types";

export async function createFamily({
  name,
  description,
  image,
  creatorId,
}: createFamilyParams) {
  try {
    dbConnect();
    logger.info(`Creating family with name: ${name}, creatorId: ${creatorId}`);

    const newFamily = await Family.create({
      title: name,
      description,
      image,
      creator: creatorId,
      members: [creatorId],
    });

    await User.findByIdAndUpdate(creatorId, { family: newFamily._id });

    if (!newFamily) {
      throw new Error("Error creating family");
    }
    logger.info("Family created successfully");
    return parseStringify(newFamily);
  } catch (error) {
    logger.error(error);
    throw new Error("Error creating family");
  }
}
