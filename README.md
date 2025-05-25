# Chit-Chat

A real-time messaging application with core chat functionality. Users can send, edit, delete, and like messages. All active users are visible, enabling instant conversations with anyone.

## Key Features
- **Real-time messaging** powered by Server-Sent Events (SSE)
- **Message management**: Edit or delete your own messages
- **Reactions**: Like messages from other users
- **User list**: See all active users and start a chat with anyone
- **Authentication**: Secure login via OAuth providers (Google, GitHub, Yandex, Facebook)

## Tech Stack
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend API**: tRPC for type-safe endpoints
- **Real-time updates**: Server-Sent Events (SSE)
- **Authentication**: NextAuth.js with OAuth integration

## Setup & Running

1. Clone the repository:
```
git clone https://github.com/kvchvn/chitchat-v2.git
cd chitchat-v2/app
```
2. Install dependencies:
```
yarn install
```
3. Configure environment variables:
```
cp .env.example .env
```
Then fill in required parameters in the `.env` file.
4. Run the application:
```
yarn dev
```
The app will be available at: [http://localhost:3000](http://localhost:3000)

## License
MIT

