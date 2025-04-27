import mongoose from "mongoose";
const { Schema, model } = mongoose;

export const pageSchema = new Schema({
  name: String,
  path: String,
  components: Array,
  html: String,
  css: String,
});

const Page = model("Page", pageSchema);
export default Page;
