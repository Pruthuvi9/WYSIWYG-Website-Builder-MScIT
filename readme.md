# 🧩 WYSIWYG Website Builder

---

## 🚀 Getting Started

### 🔧 Requirements

- [Node.js](https://nodejs.org/) (latest LTS version recommended)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (Free tier is sufficient)

---

### 📦 Installation & Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

#### 2. Start the Frontend

```bash
cd frontend
npm install       # Install frontend dependencies
npm run dev       # Start the frontend dev server
```

This will start the editor at: http://localhost:5173

#### 3. Start the Backend

Open a second terminal and run:

```bash
cd backend
npm install       # Install backend dependencies
```

⚠️ Before starting the backend server, you must set up a MongoDB connection.

---

### 🗂️ MongoDB Configuration

#### 1. Create a free account at MongoDB Atlas.

#### 2. Set up a cluster and get your connection string.

#### 3. In /backend/index.js, replace the following line (around line 33):

```bash
.connect("mongodb+srv://userId:pw@cluster0.e2yqvqx.mongodb.net/WYSIWYG?retryWrites=true&w=majority&appName=Cluster0")
```

with your own:

```bash
.connect("mongodb+srv://<your-username>:<your-password>@cluster0.xxxxxx.mongodb.net/WYSIWYG?retryWrites=true&w=majority&appName=Cluster0")
```

Make sure to allow access from your IP in MongoDB Atlas security settings.

#### 4. Run the Backend Server

```bash
npm run dev
```

The backend will run on: http://localhost:5000

### ✅ You're Done!
Once both servers are running:

- Visit http://localhost:5173 to access the editor.

- Uploaded images and saved projects will persist via MongoDB and your local /uploads folder.

### 📌 Notes
- All uploaded images are stored locally under the /uploads directory.

- Project and page data are stored in MongoDB.

- Tailwind CSS is dynamically compiled on export.

### 📁 Project Structure
- /frontend    → React + GrapesJS editor
- /backend     → Express server, MongoDB connection, API routes
- /uploads     → Folder for storing uploaded images
