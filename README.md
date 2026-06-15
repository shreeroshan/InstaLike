# Insta Clone 📸

A modern Instagram-inspired mobile application built with Expo and React Native. Share photos, connect with others, and explore a beautiful feed with a sleek user interface.

## Features ✨

- **Authentication**
  - Sign up with email and password
  - Secure sign in
  - Session persistence
  - Logout functionality

- **Feed & Posts**
  - Beautiful FlatList-based feed
  - View posts from all users
  - See post images, descriptions, and timestamps
  - User information displayed on each post (avatar, name, username)

- **Profile Management**
  - View your profile with avatar and user information
  - Edit profile (name, username, profile picture)
  - Image picker integration for profile photo changes
  - Real-time profile updates stored in Supabase

- **Image Handling**
  - Image picker for selecting from gallery
  - Image cropping and editing support
  - Optimized image uploads to Supabase storage
  - Responsive image display throughout the app

- **Modern UI/UX**
  - Clean, minimalist design
  - Smooth animations and transitions
  - Dark mode compatible styles
  - Floating action button (FAB) for creating posts
  - Modal-based forms for editing

## Tech Stack 🛠️

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (File-based routing)
- **State Management**: React Context API
- **Backend**: Supabase (Auth + Database + Storage)
- **Language**: TypeScript
- **UI Library**: React Native built-in components

## Project Structure 📁

```
src/
├── app/
│   ├── (auth)/           # Authentication screens
│   │   ├── signIn.tsx
│   │   ├── signUp.tsx
│   │   └── onBoarding.tsx
│   ├── (tabs)/           # Main app screens
│   │   ├── index.tsx     # Feed screen
│   │   └── profile.tsx   # Profile screen
│   └── _layout.tsx
├── context/
│   └── AuthContext.tsx   # Authentication state management
├── hooks/
│   └── usePosts.ts       # Posts fetching and creation
├── lib/
│   └── supabase/
│       ├── client.ts     # Supabase client initialization
│       └── storage.ts    # Image upload utilities
```

## Getting Started 🚀

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI installed globally (`npm install -g expo-cli`)
- Supabase account (for backend services)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd insta_clone
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Supabase**
   - Create a Supabase project
   - Set up your authentication and storage buckets
   - Add your Supabase URL and anon key to your environment

4. **Start the app**

   ```bash
   npx expo start
   ```

5. **Run on your device/emulator**
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app on your physical device

## Usage 📱

### Creating an Account

1. Tap the "Sign Up" button on the login screen
2. Enter your email and password
3. Complete the onboarding to set your name and username

### Browsing the Feed

1. Navigate to the "Home" tab
2. View posts from all users
3. Each post displays the user's avatar, name, post image, description, and timestamp

### Managing Your Profile

1. Navigate to the "Profile" tab
2. Tap "Edit Profile" to modify your information
3. Upload or change your profile picture
4. Tap "Save" to persist changes
5. Use "Logout" to sign out

### Creating Posts

1. Tap the floating action button (+) on the feed screen
2. Select an image from your gallery
3. Add a description
4. Tap "Post" to publish

## Key Components 🔧

### PostCard Component

- Displays individual posts in the feed
- Shows user information (avatar, name, username)
- Displays post image and description
- Shows creation timestamp
- Responsive design

### Authentication Flow

- Sign in/Sign up with Supabase Auth
- Protected routes using Expo Router
- Session persistence across app restarts
- Context-based user state management

### Image Management

- Gallery image picker integration
- Image compression and optimization
- Supabase storage integration
- Automatic URL generation for uploaded images

## Styling & Theme 🎨

The app uses a clean, modern design with:

- Light background (#fff)
- Dark text for readability
- Subtle borders and shadows
- Rounded corners for modern appearance
- Responsive padding and margins

## Learn More 📚

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Expo Router Guide](https://docs.expo.dev/routing/introduction/)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## License 📄

This project is open source and available under the MIT License.

## Support 💬

For issues, questions, or suggestions, please open an issue on the repository.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
