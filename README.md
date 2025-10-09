<<<<<<< HEAD
# 🧠 MindCare - AI-Powered Mental Health Care System

A modern, interactive web application for tracking and improving mental well-being through weekly assessments, progress analytics, and AI-powered assistance.

## ✨ Features

- **Weekly Mental Health Quiz**: 10 scientifically-backed questions to assess mental state
- **Progress Tracking**: Visual analytics and trend monitoring over time
- **AI Assistant Chatbot**: Personalized advice on diet, exercise, stress management, and relaxation
- **Secure User Authentication**: JWT-based authentication with encrypted data storage
- **Responsive Design**: Modern UI that works on desktop and mobile devices
- **Real-time Analytics**: Dashboard with charts and personalized insights

## 🚀 Tech Stack

- **Frontend**: React.js with modern hooks and Chart.js for visualizations
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with secure data storage
- **Authentication**: JWT tokens with bcrypt password hashing
- **Styling**: Modern CSS with responsive design

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Database Setup**:
   - Create a PostgreSQL database named `mental_health_db`
   - Update database credentials in `.env` file
   - The application will automatically create required tables on first run

3. **Environment Configuration**:
   - Copy `.env` file and update with your database credentials
   - Set a secure JWT secret key

4. **Start the backend server**:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to client directory**:
   ```bash
   cd client
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Start the React development server**:
   ```bash
   npm start
   ```

## 🎯 Usage

1. **Registration**: Create a new account with username, email, and password
2. **Weekly Quiz**: Take the 10-question mental health assessment
3. **Dashboard**: View your progress, analytics, and personalized recommendations
4. **AI Assistant**: Chat with the AI for mental wellness advice and tips
5. **Progress Tracking**: Monitor your mental health trends over time

## 📊 Quiz Scoring System

- **0-10 points**: Good mental health
- **11-20 points**: Moderate attention needed
- **21-30 points**: Requires immediate attention

## 🤖 AI Assistant Capabilities

- Stress management techniques
- Sleep improvement tips
- Nutrition advice for mental health
- Exercise recommendations
- Relaxation and mindfulness techniques

## 🔒 Security Features

- Password encryption with bcrypt
- JWT token-based authentication
- Secure database storage
- Input validation and sanitization

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🛠️ Development

### Project Structure
```
mental_health_care_system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Main pages
│   │   └── utils/          # Utility functions
├── config/                 # Database configuration
├── routes/                 # API routes
├── server.js              # Main server file
└── package.json           # Dependencies
```

### Available Scripts

**Backend**:
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

**Frontend**:
- `npm start` - Start development server
- `npm run build` - Build for production

## 🚀 Deployment

1. **Build the React app**:
   ```bash
   cd client && npm run build
   ```

2. **Set production environment variables**

3. **Deploy to your preferred hosting platform** (Heroku, AWS, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**MindCare** - Your journey to better mental health starts here! 🌟
=======
# Mental-Health-Care-System
AI-powered Mental Health Care System that leverages machine learning and NLP to provide early detection of stress, anxiety, and depression. It offers mood tracking, personalized support, and resources, aiming to improve accessibility and awareness in mental health care.
>>>>>>> 5be9c7b1491feeca6cf95d8aefb6901d9f708085
