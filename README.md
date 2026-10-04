# Polling / Voting App 🗳️

Project 3 from the MERN Beginner Projects guide — create simple polls and let users vote, with
live results shown as percentage bars.

## Tech Stack

React (React Router), Node.js, Express, MongoDB (Mongoose), JWT authentication, bcrypt for
password hashing. No chart library — results use plain CSS bar widths.

## Project Structure

```
poll-app/
├── server/
│   ├── config/db.js
│   ├── models/User.js
│   ├── models/Poll.js
│   ├── middleware/auth.js
│   ├── routes/auth.js
│   ├── routes/polls.js
│   └── server.js
└── client/
    └── src/
        ├── api/axios.js
        ├── context/AuthContext.jsx
        ├── components/PollCard.jsx
        ├── components/ResultBar.jsx
        ├── pages/Login.jsx, Register.jsx, Polls.jsx, PollDetail.jsx, NewPoll.jsx
        └── App.jsx
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create an account |
| POST | `/api/auth/login` | No | Log in, returns a JWT |
| GET | `/api/auth/me` | Yes | Get the logged-in user's profile |
| POST | `/api/polls` | Yes | Create a new poll (question + options array) |
| GET | `/api/polls` | No | List all polls |
| GET | `/api/polls/:id` | No | Get one poll's detail |
| POST | `/api/polls/:id/vote` | Yes | Vote on an option (blocked if already voted) |

## Setup

### 1. Backend

```bash
cd server
cp .env.example .env     # fill in MONGO_URI and a real JWT_SECRET
npm install
npm run dev
```

### 2. Frontend

```bash
cd client
cp .env.example .env
npm install
npm start
```

App runs at `http://localhost:3000`, API at `http://localhost:5000/api`.

## How "vote only once" works

Each `Poll` document stores a `votedUsers` array of user IDs. In `routes/polls.js`, the
`/:id/vote` route first checks whether `req.userId` is already in that array — if so, it rejects
with a 409 error before touching the vote count. Only after that check passes does it increment
the chosen option's `votes` and push the user into `votedUsers`. This is the "check-before-update"
pattern mentioned in the guide.

## How percentages are calculated

`ResultBar.jsx` computes `Math.round((votes / totalVotes) * 100)` for each option, and sets that
as the CSS `width` of a filled bar — no charting library needed, just a styled `div`.

## What to Explain to Your Mentor

- Why `votedUsers` is checked before allowing a vote, and what would break if that check were removed
- How `poll.options.id(optionId)` finds the right sub-document inside the options array
- How percentages are computed and rendered without a chart library
- How the JWT flow (register/login → token → `middleware/auth.js`) protects the vote route

## Next Steps / Ideas to Extend

- Let the poll creator close/reopen voting
- Show a countdown/expiry date for each poll
- Add a "most popular polls" sort
