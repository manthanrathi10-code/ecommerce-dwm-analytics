# E-Commerce DWM Analytics Dashboard

A comprehensive Data Warehousing and Data Mining (DWM) analytics platform built for e-commerce data. This project provides a full-stack solution for ingesting raw data, processing it through ETL pipelines, and visualizing it via interactive OLAP operations and data mining models.

## Features

- **Interactive Dashboard**: Modern SaaS-style interface with light/dark theme support.
- **ETL Pipeline**: End-to-end Extract, Transform, Load processes to clean and load raw CSV data into a relational schema.
- **OLAP Operations**: Perform multi-dimensional analysis with real-time dynamic querying:
  - **Slice & Dice**: Filter data dynamically across verified dimensions (Location, Category, Time, Payment Method).
  - **Pivot**: Generate dynamic aggregation tables.
  - **Roll-Up & Drill-Down**: Navigate hierarchical data dynamically.
- **Data Mining Models**:
  - Customer Segmentation (Clustering)
  - Sales Prediction & Classification
  - Attribute Relevance (Feature Importance)
- **Role-Based Access (Mock)**:
  - **Admin**: Full access, including triggering ETL pipelines.
  - **Analyst**: Read-only access to analytics and visualizations.

## Tech Stack

- **Frontend**: React (Vite), JavaScript, Vanilla CSS
- **Backend**: FastAPI (Python), SQLAlchemy, Pandas, Scikit-learn
- **Database**: PostgreSQL (Docker)

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js & npm
- Docker Desktop (for PostgreSQL)

### 1. Database Setup
Ensure Docker is running, then start the PostgreSQL container:
```bash
docker-compose up -d
```

### 2. Backend Setup
Navigate to the project root and create a virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
```
Install dependencies and run the server:
```bash
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```
*Note: Binding to `0.0.0.0` ensures the backend can be reached correctly across network interfaces.*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```

### 4. Application Access
Open your browser and navigate to the local server (typically `http://localhost:5173`). 
Use the following mock credentials to log in:
- **Admin**: `admin` / `admin`
- **Analyst**: `Analyst` / `Analyst`

## Project Structure
- `/app` - FastAPI backend application (routers, services, models, ETL logic)
- `/frontend` - React application (components, pages, services)
- `/data` - Raw and processed datasets
- `/scripts` - Reusable utility scripts for database and data validation

## License
MIT
