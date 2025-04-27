import mongoose from "mongoose";
import { pageSchema } from "./page.js"; // make sure you export it

const { Schema, model } = mongoose;

const projectSchema = new Schema({
  name: String,
  pages: [pageSchema], // use schema here, not the model
  createdAt: { type: Date, default: Date.now },
});

const Project = model("Project", projectSchema);
export default Project;
