# Project Report: IoT Device Monitoring RESTful API

---

### **Table of Contents**

1. [Introduction](#1-introduction)
2. [Project Objectives](#2-project-objectives)
3. [Tech Stack](#3-tech-stack)
4. [API Endpoints](#4-api-endpoints)
5. [CSV Upload Feature](#5-csv-upload-feature)
6. [Database Schema](#6-database-schema)
7. [Project Setup](#7-project-setup)
8. [Conclusion](#8-conclusion)

---

### **1. Introduction**

This project is a backend-only API designed to monitor IoT device data such as packet sizes and timestamps. The data is received via CSV uploads or manual API requests and is stored in a MySQL database. This API enables data retrieval, insertion, analysis, and device management.

---

### **2. Project Objectives**

* Monitor IoT device health and traffic metrics.
* Upload data via CSV files.
* Perform CRUD operations on the data.
* Calculate real-time statistics.
* Structure the codebase using **MVC architecture**.

---

### **3. Tech Stack**

| Technology        | Purpose             |
| ----------------- | ------------------- |
| Node.js + Express | Backend server      |
| MySQL             | Relational database |
| Multer            | File uploads (CSV)  |
| CSV-Parser        | Parsing CSV content |
| Git & GitHub      | Version control     |

---

### **4. API Endpoints**

| Method   | Route                         | Purpose                         |
| -------- | ----------------------------- | ------------------------------- |
| `GET`    | `/api/`                       | Get all IoT data                |
| `GET`    | `/api/:id`                    | Get data by ID                  |
| `POST`   | `/api/`                       | Insert new IoT data             |
| `PUT`    | `/api/:id`                    | Update IoT data by ID           |
| `DELETE` | `/api/:id`                    | Delete IoT data by ID           |
| `GET`    | `/api/flows`                  | Get all flow records            |
| `GET`    | `/api/flows/:id`              | Get flow by ID                  |
| `DELETE` | `/api/flows/:id`              | Delete flow by ID               |
| `GET`    | `/api/flows/recent`           | Get flows from last 24 hours    |
| `GET`    | `/api/flows/stats`            | Get aggregated flow stats       |
| `GET`    | `/api/flows/device/:deviceId` | Get flows for specific device   |
| `POST`   | `/api/upload`                 | Upload CSV file and insert data |

---

### **5. CSV Upload Feature**

CSV files containing `id`, `packet_size_avg`, `packet_size_sum`, and `timestamp` are parsed using `csv-parser`, validated, and then inserted into the `iot_flows` table using bulk SQL insert.

---

### **6. Database Schema**

**iot_flows Table**

| Column            | Type          |
| ----------------- | ------------- |
| `id`              | INT (Primary) |
| `packet_size_avg` | FLOAT         |
| `packet_size_sum` | FLOAT         |
| `timestamp`       | DATETIME      |

---

### **7. Project Setup**

```bash
git clone https://github.com/salarsalarsalar/Iot-Device-processing-with-express.js.git
cd Iot-Device-processing-with-express.js
git checkout Iot_project
npm install
```

```bash
npm start
```

---

### **8. Conclusion**

This project serves as a software solution for handling and analyzing IoT device data. It features a clean MVC structure, RESTful APIs, and support for CSV ingestion. The architecture ensures future scalability for real-time dashboards or ML integration.

---
