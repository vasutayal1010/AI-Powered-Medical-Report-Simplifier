# About Project and Author : 
### Problem Statement : 7
### Problem Title : AI-Powered Medical Report Simplifier

### Name : Vasu Tayal
### Email : vasutayal1010@gmail.com
### College : Motilal Nehru National Institute of Technology, Prayagraj (MNNIT)



#  AI-Powered Medical Report Simplifier

A backend service built with **Node.js**, **Express**, and **MongoDB** to process medical lab reports and convert them into a standardized, patient-friendly format.  
It supports both **text input** and **image uploads**, applying OCR, normalization, and summarization.



#  1. Project Description & Features

This backend service is designed to process medical lab reports and transform them into a standardized, patient-friendly format. It can accept reports as either direct text input or as image files (e.g., a photo of a printed report), making it flexible for various data sources.

### Core Features
- **Dual Input Modes**:  
  - Raw text (`Content-Type: application/json`)  
  - Image file uploads (`multipart/form-data`)  
- **AI-Powered OCR**: Utilizes Tesseract.js to perform Optical Character Recognition on image-based reports to extract the text content. 
- **Intelligent Data Extraction**:  Parses the text to identify key medical tests, their values, units, and status (High or Low)  
- **Result Filtering**: Intelligently ignores tests that are flagged as "Normal" to focus only on results that may require attention.  
- **Data Normalization**:  Standardizes extracted data into a clean JSON format, including correcting common OCR errors and units (e.g., /uL to /µL). 
- **Patient-Friendly Summary**:  Generates a simple, plain-language summary of the findings.
  
- **Persistent Storage**: Saves the final, processed report data into a MongoDB database for future reference and analysis. 



# 2. Architecture & Working Flow

This project follows a **modular MVC-like architecture**.  

### Core Technologies
- **Backend**: Node.js, Express.js  
- **AI / OCR**: Tesseract.js  
- **Database**: MongoDB with Mongoose
- **File Handling**: Multer for multipart/form-data

### Workflow

The application has two primary data flow paths that converge for processing:
### Path A: Image Upload
Request (Image File) -> Multer Middleware (Saves File) -> Tesseract.js (Performs OCR) -> Extracted Text String

### Path B: Text Input
Request (JSON Body) -> Extracted Text String

### Converged Processing Flow:
Extracted Text String -> Controller -> normalizeText() (Parses lines with Regex) -> generateSummary() (Creates summary sentence) -> Mongoose Model (Validates and structures data) -> MongoDB (Saves report) -> Response (201 Created with JSON data)



# 3. API Endpoints

The service exposes two primary endpoints for report processing:

**Prefix API end point**  - http://localhost3000

| Method | Endpoint             | Description                           |
|--------|--------------------|---------------------------------------|
| POST   | /api/reports/upload | Upload a medical report as an image file. |
| POST   | /api/reports/text   | Submit a medical report as raw text.  |

---


# 4. Postman Guide: How to Test

Ensure your server is running (`npm start`) before testing the endpoints.

### Endpoint 1: Image Upload
- **Method:** POST  
- **URL:** `http://localhost:3000/api/reports/upload`  
- **Body:** `form-data`  
  - Key: `report` (change type from "Text" to "File")  
  - Upload your sample image.

**Sample Success Response (201 Created):**
```json
{
  "tests": [
    {
      "name": "WBC",
      "value": 13500,
      "unit": "/µL",
      "status": "high",
      "ref_range": { "low": 4000, "high": 11000 }
    },
    {
      "name": "Hemoglobin",
      "value": 11.5,
      "unit": "g/dL",
      "status": "low",
      "ref_range": { "low": 12, "high": 15 }
    }
  ],
  "summary": "high WBC and low Hemoglobin levels.",
  "status": "ok",
  "reportId": "68dfa1c9e8b4e7a8f9c12345",
  "createdAt": "2025-10-02T15:30:49.814Z"
}
```

### Endpoint 2: Text Input
- **Method:** POST  
- **URL:** `http://localhost:3000/api/reports/text`  
- **Header** `Set Content-Type to application/json`
- **Body:** `raw with JSON type`  

**Sample Request Body:**
```json
{
    "text": "PATIENT REPORT\n====================\nDATE:      2025-10-02\n\nCHEMISTRY PANEL\nSodium: 148 mEq/L (High)\nPotassium: 3.1 mEq/L (Low)\n\nCOMPLETE BLOOD COUNT\nHCT: 45 % (Normal)\nHemoglobin: 12.0 g/dL (Low)"
}
```


**Sample Success Response (201 Created):**
```json
{
    "tests": [
        {
            "name": "Sodium",
            "value": 148,
            "unit": "mEq/L",
            "status": "high",
            "ref_range": { "low": 135, "high": 145 }
        },
        {
            "name": "Potassium",
            "value": 3.1,
            "unit": "mEq/L",
            "status": "low",
            "ref_range": { "low": 3.5, "high": 5.0 }
        },
        {
            "name": "Hemoglobin",
            "value": 12,
            "unit": "g/dL",
            "status": "low",
            "ref_range": { "low": 12, "high": 15 }
        }
    ],
    "summary": "high Sodium, low Potassium and low Hemoglobin levels.",
    "status": "ok",
    "reportId": "68dfa2e0e8b4e7a8f9c12346",
    "createdAt": "2025-10-02T15:35:28.112Z"
}

```

# 5. Setup and Run the Project

Follow these steps to set up and run the project on your local machine.



### Prerequisites
- **Node.js**:  Make sure you have Node.js installed 
- **npm**: Node Package Manager (comes with Node.js)  
- **MongoDB**: You need a running MongoDB instance, either locally or via a cloud service like MongoDB Atlas. 

---

# Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/vasutayal1010/AI-Powered-Medical-Report-Simplifier.git
cd <repository-folder-name>
```

#### 2. Install Dependencies
```bash
Run the following command in the project's root directory to install all the required packages from package.json :-
npm install
```
#### 3. Set Up Environment Variables
```bash
1. Create a file named .env in the root of the project.
2. Add the following variables:
a) PORT=3000

b) MONGO_URI=your_mongodb_connection_string_here
DB_NAME=medical_reports_db

3. Replace your_mongodb_connection_string_here with your actual MongoDB connection URI.

```

#### 4. Run the Server
```bash
Start the application with the following command:-
npm start
```

**You should see a confirmation message in your console: Server is running on port 3000 and MongoDB Connected: <your_host>**


# 6. Database Schema 
```json
{
"_id": "ObjectId('68de8611a4d2558f1bf3794f')"
"tests":" Array (2)"
    "0": "Object"
      "name": "Hemoglobin"
      "value": "10.2"
      "unit": "g/dL"
      "status": "low"
      "ref_range" : "Object"
        "low": "12"
        "high": "15"

    "1": "Object"
      "name": "WBC"
      "value": "11220"
      "unit": "/µL"
      "status": "high"
      "ref_range" : "Object"
        "low": "4000"
        "high": "11000"

"summary": "low Hemoglobin and high WBC count."
"status": "ok"
"createdAt": "2025-10-02T14:02:57.263+00:00"
"updatedAt": "2025-10-02T14:02:57.263+00:00"
"__v": "0"
}
```

# Images : 

## Text Input :

![Screenshot](images/Screenshot%20(211).png)

## Image Input :

### Input Image -
![Screenshot](images/Screenshot%20(209).png)

### Output Response -  
![Screenshot](images/Screenshot%20(213).png)

## Database Schema :
![Screenshot](images/Screenshot%20(212).png)
