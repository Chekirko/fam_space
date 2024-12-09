import { model, models, Schema, Document, Types } from "mongoose";

export interface IUser {
  name: string;
  username: string;
  email: string;
  image?: string;
  family?: Types.ObjectId;
}

export interface IUserDoc extends IUser, Document {}
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    family: { type: Schema.Types.ObjectId, ref: "Family" },
  },
  { timestamps: true }
);

const User = models?.User || model<IUser>("User", UserSchema);

export default User;
