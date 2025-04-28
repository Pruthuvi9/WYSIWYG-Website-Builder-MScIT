import mongoose from "mongoose";
import { pageSchema } from "./page.js";

const { Schema, model } = mongoose;

const projectSchema = new Schema({
  name: String,
  pages: [pageSchema],
  createdAt: { type: Date, default: Date.now },
});

const Project = model("Project", projectSchema);
export default Project;
