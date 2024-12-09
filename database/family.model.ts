import { model, models, Schema, Document, Types } from "mongoose";

export interface IFamily {
  title: string;
  creator: Types.ObjectId;
  members: Types.ObjectId[];
  image?: string;
  description?: string;
}

export interface IFamilyDoc extends IFamily, Document {}
const FamilySchema = new Schema<IFamily>(
  {
    title: { type: String, required: true, trim: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: { type: [Schema.Types.ObjectId], ref: "User", required: true },
    image: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

const Family = models?.Family || model<IFamily>("Family", FamilySchema);

export default Family;
