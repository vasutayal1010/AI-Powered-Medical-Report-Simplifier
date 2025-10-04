import { createWorker } from "tesseract.js";
import { Report } from "../models/reportModel.js";

// --- Helper Functions (Business Logic) ---
const getRefRange = (testName) => {
  const ranges = {
    Hemoglobin: { low: 12.0, high: 15.0 },
    WBC: { low: 4000, high: 11000 },
    Platelets: { low: 150000, high: 450000 },
    "Serum Creatinine": { low: 0.6, high: 1.2 },
    Sodium: { low: 135, high: 145 },
    Potassium: { low: 3.5, high: 5.0 },
    // Add other test ranges here
  };
  return ranges[testName.trim()] || { low: null, high: null };
};


// export const normalizeText = (text) => {
//   // CORRECTED LOGIC: Process text line by line to prevent greedy matching across newlines.
//   const lines = text.split("\n");
//   const tests = [];
//   // This regex is designed to find a result within a single line.
//   const regex =
//     /([\w\s-]+?):\s*([\d,.]+)\s*([a-zA-Z\/%µL\s]+?)\s*\((High|Low|Normal)\)/i;

//   for (const line of lines) {
//     const match = line.match(regex);

//     if (match) {
//       const status = match[4].toLowerCase();
//       if (status === "normal") {
//         continue; // Skip normal results
//       }

//       const name = match[1].trim();
//       const value = parseFloat(match[2].replace(/,/g, ""));
//       const unit = match[3].trim().replace("/uL", "/µL");

//       const normalizedTest = {
//         name: name,
//         value: value,
//         unit: unit,
//         status: status,
//         ref_range: getRefRange(name),
//       };
//       tests.push(normalizedTest);
//     }
//   }
//   return tests;
// };

export const normalizeText = (text) => {
  const lines = text.split("\n");
  const tests = [];

  // More robust regex
  const regex =
    /([\w\s-]+)\s*[:\-]?\s*([\d,.]+)\s*([a-zA-Z\/%µL]+)?\s*(?:\((High|Low|Normal)\)|\b(H|L|N)\b)?/i;

  for (const line of lines) {
    const match = line.match(regex);
    if (!match) continue;

    let rawValue = match[2];
    let value = parseFloat(rawValue.replace(/,/g, ""));
    if (isNaN(value)) continue; // skip bad matches

    // Normalize status
    let status = (match[4] || match[5] || "").toLowerCase();
    if (status === "h") status = "high";
    if (status === "l") status = "low";
    if (status === "n" || status === "normal") status = "normal";

    if (!status || status === "normal") continue; // skip if no status or normal

    const name = match[1].trim();
    const unit = (match[3] || "").trim().replace("/uL", "/µL");

    // Final guard: only push valid entries
    if (!name || !value || !status) continue;

    tests.push({
      name,
      value,
      unit: unit || null,
      status,
      ref_range: getRefRange(name),
    });
  }
  return tests;
};


export const generateSummary = (tests) => {
  if (!tests || tests.length === 0) {
    return { summary: "No test results requiring attention were identified." };
  }

  const summaryParts = tests.map((test) => `${test.status} ${test.name}`);
  let summary = summaryParts.join(", ");
  const lastComma = summary.lastIndexOf(",");
  if (lastComma !== -1) {
    summary =
      summary.substring(0, lastComma) +
      " and" +
      summary.substring(lastComma + 1);
  }
  summary += " levels.";

  return { summary };
};


// --- Controller Functions (Unchanged from previous version) ---
export const uploadAndProcessReport = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ status: "error", reason: "No file uploaded." });
  }

  try {
    const worker = await createWorker("eng");
    const ret = await worker.recognize(req.file.path);
    await worker.terminate();
    const rawText = ret.data.text;
    const normalizedTests = normalizeText(rawText);

    if (normalizedTests.length === 0) {
      return res
        .status(200)
        .json({
          status: "ok",
          summary: "All test results are within the normal range.",
          tests: [],
        });
    }

    const { summary } = generateSummary(normalizedTests);
    const report = new Report({
      tests: normalizedTests,
      summary: summary,
      status: "ok",
    });
    const savedReport = await report.save();

    res.status(201).json({
      tests: savedReport.tests,
      summary: savedReport.summary,
      status: savedReport.status,
      reportId: savedReport._id,
      createdAt: savedReport.createdAt,
    });
  } catch (error) {
    console.error("Error processing report:", error);
    res
      .status(500)
      .json({ status: "error", reason: "An internal server error occurred." });
  }
};

export const processTextReport = async (req, res) => {
  console.log("Hello vasu");
  const { text } = req.body;

  if (!text) {
    return res
      .status(400)
      .json({
        status: "error",
        reason: "No text provided in the request body.",
      });
  }

  try {
    const rawText = text;
    const normalizedTests = normalizeText(rawText);

    if (normalizedTests.length === 0) {
      return res
        .status(200)
        .json({
          status: "ok",
          summary: "All test results are within the normal range.",
          tests: [],
        });
    }

    const { summary } = generateSummary(normalizedTests);
    const report = new Report({
      tests: normalizedTests,
      summary: summary,
      status: "ok",
    });
    const savedReport = await report.save();

    res.status(201).json({
      tests: savedReport.tests,
      summary: savedReport.summary,
      status: savedReport.status,
      reportId: savedReport._id,
      createdAt: savedReport.createdAt,
    });
  } catch (error) {
    console.error("Error processing text report:", error);
    res
      .status(500)
      .json({ status: "error", reason: "An internal server error occurred." });
  }
};

