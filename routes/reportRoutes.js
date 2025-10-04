import express from 'express'
import multer from 'multer';
import {uploadAndProcessReport,processTextReport} from "../controllers/reportController.js";


// Initialize router
const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Define the POST route for uploading and processing a report
// The upload.single('report') middleware handles the file upload
router.post("/upload", upload.single("report"), uploadAndProcessReport);

//Define route for handling Text input
router.post('/text', processTextReport); // No multer middleware needed


export default router;
