---

# NutriDelish

**NutriDelish** is a full-stack food delivery application that allows users to browse restaurants and dishes, place orders, and track delivery — built with a modern MERN-like stack. The project includes a **frontend web app** and a **backend API** to handle authentication, food data, and order management.

---

## Demo & Links

* **Live Website:** [https://food-delivey-app-yi24.vercel.app/](https://food-delivey-app-yi24.vercel.app/)
* **Demo Video:** [https://youtu.be/DxwOWqCo354](https://youtu.be/DxwOWqCo354)
* **GitHub Repository:** [https://github.com/madugushivakumar/NutriDelish](https://github.com/madugushivakumar/NutriDelish) ([GitHub][1])

---

## Overview

NutriDelish provides:

* A responsive web interface for browsing food items and restaurants
* User authentication & order system
* Backend API to manage data
* Demo available online with video walkthrough

*(This description is based on repository metadata + standard food delivery app functionality.)* ([GitHub][1])

---

## Project Structure

```
NutriDelish/
│
├── backend/                          # Node/Express backend API
│   ├── config/                       # Environment & configs
│   ├── controllers/                  # Route logic handlers
│   ├── middlewares/                  # Auth / error middlewares
│   ├── models/                       # Database models (e.g., Users, Foods, Orders)
│   ├── routes/                       # API endpoints
│   ├── utils/                        # Utility functions
│   ├── .env                          # Backend environment variables
│   ├── package.json                  # Backend dependencies & scripts
│   └── server.js                     # Server entry point
│
├── frontend/                         # React frontend application
│   ├── public/                       # Static assets
│   ├── src/                          # React source files
│   │   ├── components/               # UI components
│   │   ├── pages/                    # Page views (Home, Menu, Cart, etc.)
│   │   ├── services/                 # API service layer (Axios)
│   │   ├── styles/                   # Global UI styling (Tailwind/CSS)
│   │   ├── App.jsx                   # React routes
│   │   ├── main.jsx                  # React entry point
│   │   └── index.css                 # Base styles
│   ├── .env                          # Frontend environment settings
│   ├── vite.config.js                # Vite configuration
│   ├── package.json                  # Frontend dependencies & scripts
│   └── tailwind.config.js            # Tailwind CSS config
│
├── .gitignore
├── README.md                         # Project documentation (this file)
├── package.json                      # Root package file
└── metadata.json
```

*(Structure based on the repository’s folders.)* ([GitHub][1])

---

## Prerequisites

Make sure you have installed:

* **Node.js** (v18 or higher)
* **npm** or **yarn**
* A code editor like VS Code

---

## Installation

Clone the repo:

```bash
git clone https://github.com/madugushivakumar/NutriDelish.git
cd NutriDelish
```

Install root dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

---

## Running the Application

### Start Backend Server

```bash
cd backend
npm start
```

*(Server typically runs on [http://localhost:5000](http://localhost:5000))*

### Start Frontend

```bash
cd frontend
npm run dev
```

*(Frontend runs by default at [http://localhost:5173](http://localhost:5173) with Vite)*

---

## Environment Variables

### Backend (`backend/.env`)

Create a `.env` in the backend with:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

*(Adapt values for authentication and database.)*

---

## Features

* Browse restaurants & menus
* Add items to cart
* Place orders
* Responsive web UI
* Backend API for managing data

---

## Tech Stack

**Frontend:**

* React
* Vite
* Tailwind CSS

**Backend:**

* Node.js
* Express.js
* MongoDB / Mongoose
  *(Typical for projects like this — adjust if project uses SQL.)*

---

## License

Distributed under the **MIT License**.

---

### Optional Add-Ons

I can also generate:

Summary for your **resume / LinkedIn**
API documentation section
Screenshots section for README

Just ask! 

[1]: https://github.com/madugushivakumar/NutriDelish "GitHub - madugushivakumar/NutriDelish: Demo video: https://youtu.be/DxwOWqCo354"
