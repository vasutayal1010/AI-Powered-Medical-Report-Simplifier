import mongoose from "mongoose";

// Define a schema for a single test result
const testResultSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    value: { type: Number, required: true },
    unit: { type: String, required: true },
    status: { type: String, enum: ["low", "high", "normal"], required: true },
    ref_range: {
      low: { type: Number },
      high: { type: Number },
    },
  },
  { _id: false }
); // _id: false prevents creating separate IDs for subdocuments

// Define the main schema for the entire medical report
const reportSchema = new mongoose.Schema(
  {
    tests: [testResultSchema],
    summary: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["ok", "unprocessed"],
      default: "ok",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export const Report = mongoose.model("Report", reportSchema);


