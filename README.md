# UmbraTsm

A task management application with a React frontend and an Express/MongoDB backend.

## Installation

1. Install [Node.js](https://nodejs.org/) and npm.
2. Install dependencies for both the client and server:

```bash
cd server && npm install
cd ../client && npm install
```

## Environment Setup

The server requires several environment variables. Copy the example file and provide your own values:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` and set the following keys:

- `PORT` – Port for the Express server (e.g. `5000`)
- `MONGODB_URI` – Connection string for MongoDB
- `JWT_SECRET` – Secret key used to sign JWT tokens
- `EMAIL_USER` – Email account used for notifications
- `EMAIL_PASS` – Password for the email account
- `RESEND_API_KEY` – API key for the Resend service

The client has its own `.env` file (`client/.env`) where you can adjust the API base URL and Firebase key if necessary.

## Usage

Run the development servers in two separate terminals:

```bash
# Start the backend
cd server && npm start

# Start the frontend
cd client && npm run dev
```

The React app will be available at `http://localhost:3000` and will proxy API requests to the backend.
