# 🛒 eBay Price Tracker

A full-stack application that allows users to track product prices from eBay, monitor changes over time, and stay updated with market trends.

---

## 🚀 Overview

Prices on eBay fluctuate frequently due to demand, competition, and seller strategies. A price tracker helps users monitor these changes and make better buying or selling decisions. ([Visualping][1])

This project provides a simple and efficient way to:

* Track product prices
* Store historical price data
* Monitor trends over time

---

## ✨ Features

* 📦 Track products using eBay URLs
* 📉 Store and analyze price history
* 🔄 Automated price updates (scheduler-based)
* 🧠 Structured backend for scalable tracking
* 🌐 REST API for managing tracked products

---

## 🏗️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB

### Other Tools

* REST APIs
* Scheduler (for periodic tracking)

---

## 📁 Project Structure

```
server/
│── src/
│   ├── config/        # Environment & database config
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API routes
│   ├── services/      # Business logic & tracking logic
│   └── index.js       # Entry point
│
├── package.json
└── package-lock.json
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/awais-yousaf75/ebay-price-tracker.git
cd ebay-price-tracker
```

### 2. Install dependencies

```
cd server
npm install
```

### 3. Setup environment variables

Create a `.env` file inside `server/` and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

---

### 4. Run the server

```
npm start
```

---

## 🔗 API Endpoints

### Products

* `POST /track` → Add product to track
* `GET /products` → Get all tracked products

### Scheduler

* `GET /scheduler/run` → Trigger price tracking manually

---

## 🧠 How It Works

1. User submits an eBay product URL
2. Backend fetches product data
3. Price is stored in the database
4. Scheduler updates price periodically
5. Historical data is maintained for analysis

---

## 🔐 Security Note

Make sure **not to commit your `.env` file**.
Sensitive data like API keys and database URIs should always remain private.

---

## 📌 Future Improvements

* 📊 Price history graphs
* 🔔 Price drop notifications
* 👤 User authentication system
* 🌍 Multi-platform support (Amazon, etc.)

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Author

**Muhammad Awais**

* GitHub: https://github.com/awais-yousaf75

---

[1]: https://visualping.io/blog/ebay-price-tracking?utm_source=chatgpt.com "How to Create an eBay Price Tracker for Any Product - Visualping"
