# Speech Quest

https://speechquest.vercel.app/

## Overview

Speech Quest is a comprehensive web application designed to support individuals with speech impairments in both English and Spanish. The platform provides interactive tools and activities to help users improve their speech clarity and master specific sounds. 

What makes Speech Quest unique is its focus on Spanish-speaking users, who often lack access to tailored therapeutic resources. Our application bridges this gap by offering a centralized platform with engaging, interactive features for speakers of both languages.

## Features

### For All Users
- **Bilingual Support**: Full functionality in both English and Spanish
- **Interactive Sound Exercises**: Practice specific speech sounds with guided exercises
- **Progress Tracking**: Monitor improvement over time with detailed metrics
- **Audio Feedback**: Receive instant feedback on pronunciation accuracy
- **Customizable Difficulty**: Adjust exercise difficulty based on user's proficiency level

## Tech Stack

- **Frontend Framework**: Angular 17
- **Styling**: Bootstrap 5.3.3, SASS
- **Backend Services**: Firebase (Authentication, Firestore, Storage)
- **Text-to-Speech**: ElevenLabs API
- **Deployment**: Vercel

## Installation

### Prerequisites
- Node.js (version 16 or later)
- npm (version 8 or later)
- Angular CLI (version 17 or later)
- Firebase account with enabled services:
  - Email Authentication
  - Firestore Database
  - Storage
- ElevenLabs account with sufficient credit or subscription

### Setup Steps

1. Clone the repository
```bash
git clone https://github.com/code-crafters/speech-quest.git
cd speech-quest
```

2. Install dependencies
```bash
npm install
```

3. Create environment configuration files
   
Create a folder called `environments` inside the `src` folder if it doesn't exist. Inside this folder, create two files:
- `environment.ts`
- `environment.prod.ts`

Add the following configuration to both files:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
    appId: "YOUR_FIREBASE_APP_ID"
  },
  elevenlabsConfig: {
    apiKey: "YOUR_ELEVENLABS_API_KEY"
  }
};
```

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
    appId: "YOUR_FIREBASE_APP_ID"
  },
  elevenlabsConfig: {
    apiKey: "YOUR_ELEVENLABS_API_KEY"
  }
};
```

Replace placeholders with your actual Firebase and ElevenLabs credentials.

4. Firebase Setup
   
In the Firebase console:
   - Create a new collection called `config`
   - Add a document with ID `codes`
   - Add a string field `admin` with a value that will serve as the admin access code

5. Run the application locally
```bash
ng serve
```

6. Open your browser and navigate to `http://localhost:4200`

## Deployment

### Deploy to Vercel

Ensure you have the Vercel CLI installed:
```bash
npm install -g vercel
```

Then deploy the application:
```bash
npm run deploy
```

This command will build the application and deploy it to Vercel using the production environment settings.

## Contributing

1. Fork the repository
2. Create a feature branch
```bash
git checkout -b feature/amazing-feature
```
3. Make your changes
4. Run tests to ensure everything works
```bash
ng test
```
5. Commit your changes
```bash
git commit -m 'Add some amazing feature'
```
6. Push to the branch
```bash
git push origin feature/amazing-feature
```
7. Open a Pull Request
