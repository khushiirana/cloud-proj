# VocabMaster - Vocabulary Quiz Application

A comprehensive vocabulary-based quiz application built with React and Firebase, featuring Google OAuth authentication and real-time progress tracking.

## 🚀 Features

- **Google OAuth Authentication** - Secure login/signup with Google
- **Interactive Vocabulary Quiz** - 5 random questions from a database of 20 vocabulary words
- **Real-time Progress Tracking** - Track your scores, averages, and quiz history
- **Beautiful Violet Theme** - Modern, responsive design with smooth animations
- **Instant Feedback** - Detailed explanations for each answer
- **Mobile Responsive** - Optimized for all device sizes

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Backend**: Firebase (Firestore + Authentication)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v18 or higher)
- npm or yarn
- A Firebase project with Firestore and Authentication enabled

## 🔧 Firebase Setup

1. **Create a Firebase Project**:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project" and follow the setup wizard
   - Enable Google Analytics (optional)

2. **Enable Authentication**:
   - In your Firebase project, go to Authentication > Sign-in method
   - Enable "Google" as a sign-in provider
   - Add your domain to authorized domains

3. **Enable Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in production mode"
   - Select a location for your database

4. **Get Configuration**:
   - Go to Project Settings > General
   - Scroll down to "Your apps" and click the web icon (</>)
   - Register your app and copy the configuration object

5. **Update Firebase Config**:
   - Replace the placeholder config in `src/firebase/config.ts` with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com", 
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

## 💻 Installation & Setup

1. **Clone or download the project files**

2. **Install dependencies**:
```bash
npm install
```

3. **Update Firebase configuration** in `src/firebase/config.ts` with your project details

4. **Start the development server**:
```bash
npm run dev
```

5. **Open your browser** and navigate to the development server URL (typically `http://localhost:5173`)

## 🎯 Usage

1. **Login**: Use your Google account to sign in
2. **Home Page**: View your profile and quiz statistics  
3. **Take Quiz**: Click "Start Quiz" to begin a 5-question vocabulary test
4. **Review Results**: See your score and detailed explanations for each question
5. **Track Progress**: Monitor your improvement over time

## 📊 Database Structure

The application automatically creates the following Firestore collections:

- `questions`: Vocabulary questions with multiple choice answers
- `users/{userId}/results`: Individual quiz results
- `userStats`: Aggregated user statistics

## 🎨 Design Features

- **Violet Color Scheme**: Various shades from light violet (#DDA0DD) to deep purple (#8A2BE2)
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Modern UI**: Clean, intuitive interface following current design trends

## 🔒 Security Features

- Firebase Authentication with Google OAuth
- Firestore security rules (configure as needed)
- User data isolation
- Secure API calls

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

## 🚀 Deployment

1. **Build the project**:
```bash
npm run build
```

2. **Deploy to your preferred hosting service** (Firebase Hosting, Netlify, Vercel, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check that your Firebase configuration is correct
2. Ensure all Firebase services are enabled
3. Verify your domain is in Firebase authorized domains
4. Check the browser console for error messages

## 🔄 Updates & Maintenance

- Regularly update dependencies
- Monitor Firebase usage and quotas
- Review and update vocabulary questions as needed
- Test across different browsers and devices

---

Made with ❤️ using React and Firebase