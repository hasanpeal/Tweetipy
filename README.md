# Tweetipy - AI Powered Personalized Twitter/X Content Newsletter and Podcast 💭

Tweetipy is an AI-powered personalized Twitter/X daily newsletter and podcast application. The app delivers curated content based on the Twitter profiles you choose to follow, ensuring you never miss out on important updates and tweets from your favorite accounts.

## Features

- **Personalized Newsletters and Podcasts:** Get daily newsletters and podcasts based on the Twitter profiles you follow.
- **User Authentication:** Sign up and sign in with email/password or Twitter OAuth.
- **Profile Management:** Update your first name, last name, and preferred Twitter profiles.
- **Auto-Suggestion for Profiles:** Easily find and follow Twitter profiles with real-time suggestions powered by RAPID API.
- **Admin Dashboard:** Manage followed profiles, update newsletter preferences, and access newsletters and podcasts.
- **Email and Podcast Integration:** Receive newsletters and podcasts via email, playable directly from your email app without downloads.
- **Session Management:** Secure user sessions with Passport and Redis.

## Project Structure

The project is structured with two main directories: `Server` and `Client`.

- **Client:** Frontend built with Vite, TypeScript, and React.
- **Server:** Backend built with Node.js, Express and TypeScript.

## Technologies Used

- **Frontend:**
  - Vite
  - React
  - CSS
  - Tailwind
  - jQuery
  - Axios
  - TypeScript

- **Backend:**
  - Express
  - TypeScript
  - MongoDB
  - Redis
  - Restful API
  - Passport (Local and Twitter strategies)
  - SendGrid API (for email verification)
  - RAPID API (for Twitter profile suggestions and tweet fetching)
  - Google Gemini AI API (for newsletter generation)
  - Text-to-Speech Podcast API (for podcast generation)
  - Node Cron (for scheduling daily newsletters and podcasts)

- **Tools:**
  - Docker
  - Vite
  - Postman
  - Version Control
  - Jest

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/hasanpeal/Tweetipy.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Tweetipy
   ```

3. Install dependencies for both the client and server:

   ```bash
   cd Client
   npm install
   cd ../Server
   npm install
   ```

4. Create a `.env` file in the `Server` directory and add your environment variables:

   ```env
   MONGO_URI=<your_mongo_uri>
   REDIS_URL=<your_redis_url>
   SESSION_SECRET=<your_session_secret>
   SENDGRID_API_KEY=<your_sendgrid_api_key>
   RAPIDAPI_KEY=<your_rapidapi_key>
   GOOGLE_GEMINI_API_KEY=<your_google_gemini_api_key>
   TTS_API_KEY=<your_text_to_speech_api_key>
   TWITTER_CONSUMER_KEY=<your_twitter_consumer_key>
   TWITTER_CONSUMER_SECRET=<your_twitter_consumer_secret>
   TWITTER_CALLBACK_URL=<your_twitter_callback_url>
   ```

5. Start the development server:

   ```bash
   cd ../Client
   npm run dev
   cd ../Server
   npm run dev
   ```

## Usage

1. Visit the deployed application at [Tweetipy](https://tweetipy.onrender.com).
2. Sign up or sign in using your email and password or Twitter account.
3. Configure your daily newsletter preferences and select Twitter profiles to follow.
4. Access your personalized newsletters and podcasts via email or the admin dashboard.

## Contributing

We welcome contributions to enhance Tweetipy! To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive messages.
4. Push your changes to your forked repository.
5. Open a pull request to the main repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For any inquiries or feedback, please contact us at [tweetipyinquires@gmail.com](mailto:tweetipyinquires).
