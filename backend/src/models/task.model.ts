import mongoose, { Schema, Types } from "mongoose";

export interface ITask {
  title: string;
  description: string;
  status: "todo" | "doing" | "done";
  assignedUser: Types.ObjectId | null;
  teamId: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["todo", "doing", "done"],
      default: "todo"
    },
    assignedUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;