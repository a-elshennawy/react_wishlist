# Clarity Tasks

A minimalist, cloud-synced task management application built with React and Firebase. Focus on getting things done without the complexity of traditional task managers.

## Features

- **Simple Task Management**: Create, edit, and complete tasks with minimal friction
- **Automatic Status Tracking**: Tasks automatically transition between Pending, In Progress, Done, and Overdue states
- **Real-time Sync**: All changes sync instantly across devices using Firebase
- **Activity Tracking**: Add updates and notes to tasks to track progress
- **Sub-tasks**: Break down complex tasks into manageable steps
- **Progress Visualization**: Weekly progress tracking with circular progress indicators
- **Leaderboard**: Gamified scoring system to motivate task completion
- **Dark/Light Theme**: Toggle between themes for comfortable viewing
- **Category Organization**: Organize tasks by Work, Study, Personal, Workout, Entertainment, or Daily
- **Pin Important Tasks**: Keep priority tasks at the top of your list

## Tech Stack

- **Frontend**: React 19 with Vite
- **Routing**: React Router DOM v7
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Styling**: Bootstrap 5 + Custom CSS
- **Icons**: React Icons
- **Progress Charts**: React Circular Progressbar

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account and project

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd react_wishlist
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── Components/
│   ├── Contexts/
│   │   ├── AuthContext.jsx       # Firebase authentication context
│   │   └── ThemeProvider.jsx     # Light/dark theme management
│   ├── Layout/
│   │   ├── Layout.jsx            # Main layout wrapper
│   │   └── NavBar.jsx            # Navigation component
│   ├── Pages/
│   │   ├── LandingPage.jsx       # Landing/home page
│   │   ├── Login.jsx             # Login page
│   │   ├── Signup.jsx            # Registration page
│   │   ├── ForgotPassword.jsx    # Password reset
│   │   ├── Home.jsx              # Main task dashboard
│   │   └── Docs.jsx              # Documentation page
│   ├── TaskComponents/
│   │   ├── AddTask.jsx           # Task creation modal
│   │   ├── PendingTasks.jsx      # Pending tasks view
│   │   ├── InProgressTasks.jsx   # In-progress tasks view
│   │   ├── DoneTasks.jsx         # Completed tasks view
│   │   ├── OverDueTasks.jsx      # Overdue tasks view
│   │   ├── TaskDetails.jsx       # Task edit/detail modal
│   │   ├── Progress.jsx          # Progress visualization
│   │   ├── CategoryTab.jsx       # Category filter tabs
│   │   └── DateFilter.jsx        # Date filtering component
│   └── ReusableComponents/
│       ├── LeaderBoard.jsx       # Leaderboard modal
│       ├── LoaderSpinner.jsx     # Loading spinner
│       ├── OverdueChecker.jsx    # Auto-update overdue tasks
│       ├── Portal.js             # React portal for modals
│       └── ToHomeBtn.jsx         # Home navigation button
├── App.jsx                       # Main app component
├── App.css                       # Global styles
├── firebase.js                   # Firebase configuration
├── fonts.css                     # Custom fonts
└── main.jsx                      # App entry point
```

## Firebase Configuration

### Firestore Collections

The app uses a single `tasks` collection with documents structured as:

```javascript
{
  title: string,
  description: string | null,
  category: string,
  links: string[] | null,
  dueDate: string | null,
  status: "pending" | "inProgress" | "done" | "overdue",
  user: string,              // User email
  timestamp: Timestamp,      // Creation time
  completedAt: Timestamp,    // Completion time (done tasks only)
  pinned: boolean,
  daysOverdue: number,       // Calculated field for overdue tasks
  activities: [{
    text: string,
    timestamp: Date
  }],
  subTasks: [{
    text: string,
    status: "pending" | "done"
  }]
}
```

### Firestore Rules

Ensure you have appropriate security rules set up:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if request.auth != null 
        && request.auth.token.email == resource.data.user;
      allow create: if request.auth != null 
        && request.auth.token.email == request.resource.data.user;
    }
  }
}
```

## Key Features Explained

### Automatic Status Management

Tasks automatically transition between statuses:
- **Pending**: Newly created tasks without activities
- **In Progress**: Tasks with at least one activity added
- **Overdue**: Tasks past their due date (checked daily at midnight)
- **Done**: Manually marked as complete

### Scoring System

The leaderboard uses the following scoring:
- +5 points per task submitted
- +15 points per task completed
- -2 points per overdue task

### Real-time Updates

All task operations use Firebase's `onSnapshot` for real-time synchronization across devices and users.

### Theme Persistence

Theme preference is stored in localStorage and persists across sessions.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

Modern browsers with ES6+ support:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Bootstrap for responsive UI components
- Firebase for backend infrastructure
- React Icons for icon library
- React Circular Progressbar for progress visualization
