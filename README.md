# SyncNote - React Collaborative Editor

SyncNote is a collaborative text editor built with React and localStorage. It includes document management, user sessions, auto-save, and simulated user activity.

## Features

### Collaboration

* Text editor interface
* Simulated user presence
* User activity indicators
* Document creation, editing, and deletion
* Auto-save with save status
* User avatars

### User Management

* User registration and login
* Persistent sessions using localStorage
* Random avatar colors
* Session persistence after refreshing the browser

### Data Storage

* localStorage for client-side data
* Documents remain available after closing and reopening the browser
* Automatic document saving
* Data recovery after page refresh

## Tech Stack

* React 18
* TypeScript
* Tailwind CSS
* Lucide React
* React Hot Toast
* localStorage
* UUID
* Vite

## Getting Started

### Installation

Clone the repository:

```bash
git clone https://github.com/Vivaanfbcmc/SyncNote.git
cd SyncNote
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application at:

```text
http://localhost:5173
```

## How It Works

### Local Storage

The application uses localStorage to store user and document data.

* User sessions are stored locally.
* Documents are saved locally.
* Changes are automatically saved.
* User activity is simulated on the client side.
* React state is used to update the interface.

### Main Components

**EditorWorkspace**

Handles the main editor, document list, document actions, user presence, and saving.

**LoginScreen**

Handles the login and registration interface.

**Document Management**

Allows users to create, edit, select, and delete documents.

**Auto-save**

Automatically saves document changes to localStorage and displays the current save status.

## Interface

The application uses:

* Gradient backgrounds
* Glass-style panels
* Card-based layouts
* Backdrop blur
* CSS animations
* Responsive layouts
* Inter font

The interface is designed to work on desktop and mobile screen sizes.

## Build

To create a production build:

```bash
npm run build
```

The production files will be generated in the `dist` directory.

## Deployment

### Netlify

Install the Netlify CLI:

```bash
npm install -g netlify-cli
```

Deploy the project:

```bash
netlify deploy --prod --dir=dist
```

### Vercel

Install the Vercel CLI:

```bash
npm install -g vercel
```

Deploy the project:

```bash
vercel --prod
```

## Contributing

1. Fork the repository.
2. Create a new branch:

```bash
git checkout -b feature/feature-name
```

3. Make your changes.
4. Commit the changes:

```bash
git commit -m "Add feature"
```

5. Push the branch:

```bash
git push origin feature/feature-name
```

6. Open a pull request.

## License

This project is licensed under the MIT License.

## Planned Features

* Node.js and MongoDB backend
* WebSocket-based collaboration
* Rich text and Markdown support
* File attachments
* Team workspaces
* Permission management
* Version history
* Document recovery

## Acknowledgments

* React
* Tailwind CSS
* Lucide React
* Vite
