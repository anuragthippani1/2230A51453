
---

## How to Run

### 1. Backend

- Go to the backend folder:
  ```bash
  cd backend
  ```
- Create a `.env` file with the following variables (sample below, use your real info):
  ```
  EMAIL=your@email.com
  NAME=Your Name
  MOBILE_NO=1234567890
  GITHUB_USERNAME=yourgithubusername
  ROLL_NO=yourrollno
  COLLEGE_NAME=Your College Name
  ACCESS_CODE=your-access-code
  ```
- Run the setup script:
  ```bash
  npm run setup
  ```
- Start the backend:
  ```bash
  npm start
  ```
- The backend should run on [http://localhost:7000](http://localhost:7000)

### 2. Frontend

- Go to the frontend folder:
  ```bash
  cd stock-frontend
  ```
- Install dependencies:
  ```bash
  npm install
  ```
- Start the frontend:
  ```bash
  npm start
  ```
- The frontend will run on [http://localhost:3000](http://localhost:3000) or [http://localhost:3001](http://localhost:3001)

---

## What Works

- The frontend UI is fully implemented with Material UI and charting.<img width="1512" alt="Screenshot 2025-06-12 at 2 15 03 PM" src="https://github.com/user-attachments/assets/edc33413-5d8d-4de6-9aa4-209febf8c87d" />

- Routing, dropdowns, and page structure are complete.
- Backend is set up with all required routes and authentication logic.

---<img width="1509" alt="Screenshot 2025-06-12 at 2 14 46 PM" src="https://github.com/user-attachments/assets/f6df0b18-5025-4a53-b499-bfc3ed52b616" />


## Issue Faced

**IMPORTANT:**  
I was unable to complete the backend registration and authentication because the provided access code was rejected by the evaluation service with the error:
