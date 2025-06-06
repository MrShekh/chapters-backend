An Express.js backend API for managing subject chapters with advanced features like Redis caching, rate limiting, and admin-only upload functionality.

Tech Stack
Backend: Node.js, Express

Database: MongoDB

Caching & Rate Limiting: Redis + express-rate-limit

File Upload: Multer

Security: Token-based admin auth

Validation & Parsing: JSON, Multer

📦 Project Structure
chapterdashboardapi/
├── config/
│   ├── db.js           // MongoDB connection
│   └── redis.js        // Redis connection
├── controllers/
│   └── chapterController.js
├── middlewares/
│   ├── adminAuth.js
│   └── rateLimiter.js
├── models/
│   └── Chapter.js
├── routes/
│   └── chapterRoutes.js
├── uploads/
│   └── sample-chapters.json
├── .env
├── server.js
└── README.md
⚙️ Setup Instructions
1. Clone the Repository
git clone https://github.com/MrShekh/chapters-backend.git
cd chapterdashboardapi
2. Install Dependencies
npm install
3. Environment Variables
Create a .env file:

env
PORT=5000
MONGO_URI=mongodb://localhost:27017/chapterDashboard
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
ADMIN_SECRET=supersecretadmintoken
4. Run Redis
 Required for caching and rate limiting.

Install Redis on Windows:
https://github.com/microsoftarchive/redis/releases
Then run:


net start Redis
Or with WSL/Linux:

sudo service redis-server start
5. Start the Server
npm run dev
# OR
node server.js
 Admin Authentication
All upload routes require an Authorization header:

makefile
Authorization: supersecretadmintoken
 Upload Format (JSON)
json
[
  {
    "subject": "Physics",
    "chapter": "Kinematics",
    "class": "Class 12",
    "unit": "1",
    "yearWiseQuestionCount": {
      "2022": 10,
      "2023": 8
    },
    "questionSolved": 7,
    "status": "active",
    "isWeakChapter": true
  }
]
 API Endpoints
GET /api/v1/chapters
Returns a paginated list of chapters with filters.

Example:
http
GET /api/v1/chapters?page=1&limit=10&subject=Physics&class=Class 12&unit=1&status=active&isWeakChapter=true
 Caching:
Cached in Redis for 1 hour

Cache invalidated on new uploads

 Response:
json
{
  "total": 12,
  "page": 1,
  "limit": 10,
  "data": [ ...chapters ]
}
GET /api/v1/chapters/:id
Fetch a single chapter by its MongoDB ID.

 Example:
http
GET /api/v1/chapters/665f83bbbc4d7a3ffed2f4e1
 Response:
json
{
  "_id": "665f83bbbc4d7a3ffed2f4e1",
  "subject": "Physics",
  ...
}
POST /api/v1/chapters (Admin Only)
Uploads a .json file containing an array of chapters.

 Headers:
http
Authorization: supersecretadmintoken
 Form-Data (Body):
makefile
Key: file
Type: File
Value: sample-chapters.json
🧾 Response:
json
{
  "insertedCount": 10,
  "failedCount": 2,
  "failedChapters": [
    {
      "chapter": { ... },
      "error": "Validation error"
    }
  ]
}


Rate Limiting
Maximum 30 requests/minute/IP

Implemented using Redis + express-rate-limit

Response on limit exceed:
json
{
  "message": "Too many requests, please try again later."
}
Test Rate Limit
Use this loop in Git Bash or WSL
 

 Author
Shekh Asif
 B.Tech CSE @ Rai University Ahmedabad
 Passionate about Full Stack & AI