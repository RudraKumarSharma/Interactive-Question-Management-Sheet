# Codolio

A beautiful, modern coding problem tracker and organizer for interview preparation and learning. Built with React, TypeScript, and Vite.

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Vite](https://img.shields.io/badge/Vite-7.2-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Features

- **📚 Organized Learning**: Structure coding problems by topics and subtopics
- **✅ Progress Tracking**: Mark questions as completed and track your progress
- **🔍 Smart Search**: Quickly find questions across all topics
- **🎯 Difficulty Levels**: Categorize problems by Easy, Medium, and Hard difficulty
- **📊 Visual Statistics**: View your progress with interactive charts and statistics
- **🎨 Drag & Drop**: Reorder topics, subtopics, and questions with intuitive drag-and-drop
- **🌓 Dark Mode**: Beautiful dark/light theme with smooth circular reveal transitions
- **💾 Auto-Save**: All changes are automatically saved to local storage
- **🔗 External Links**: Add links to problem statements (LeetCode, HackerRank, etc.)
- **📝 Notes**: Add personal notes to each question
- **📱 Responsive**: Works seamlessly on desktop and mobile devices

## 🚀 Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS v4
- **State Management**: Zustand with persistence
- **UI Components**: Radix UI / shadcn/ui
- **Drag & Drop**: @hello-pangea/dnd
- **Charts**: Recharts
- **Routing**: React Router v7
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd Codolio_Rudra
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── ItemDialog.tsx  # Add/Edit dialog for items
│   ├── QuestionRow.tsx # Question list item
│   ├── SubTopicCard.tsx# Subtopic card component
│   ├── TopicSection.tsx# Topic section container
│   └── StatsChart.tsx  # Statistics visualization
├── data/               # Data files and transformers
│   ├── sampleData.ts   # Sample/default data
│   └── sheetData.json  # JSON data store
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
│   ├── Index.tsx       # Main app page
│   └── NotFound.tsx    # 404 page
├── store/              # Zustand state management
│   └── sheetStore.ts   # Main app store
├── types/              # TypeScript type definitions
│   └── sheet.ts        # Data model types
├── App.tsx             # Root app component
└── main.tsx            # App entry point
```

## 💡 Usage

### Adding Topics

1. Click the "Add Topic" button in the header
2. Enter a topic name (e.g., "Arrays", "Dynamic Programming")
3. Click "Add" or press Enter

### Adding Subtopics

1. Navigate to a topic section
2. Click "Add Subtopic"
3. Enter a subtopic name
4. Save

### Adding Questions

1. Click "Add Question" within a subtopic
2. Fill in the question details:
   - Title (required)
   - Difficulty level
   - Problem link (optional)
   - Notes (optional)
3. Save the question

### Tracking Progress

- Click the checkbox next to any question to mark it as completed
- View your overall progress in the stats section
- See completion percentage by difficulty level

### Reordering Items

- Drag and drop topics, subtopics, or questions to reorder them
- Changes are automatically saved

### Searching

- Use the search bar to filter questions across all topics
- Search works on question titles

### Theme Toggle

- Click the sun/moon icon in the header to switch between light and dark modes
- Theme preference is saved automatically

## 🎨 Customization

### Adding Custom Data

Edit `src/data/sheetData.json` to add your own questions, or modify `src/data/sampleData.ts` for custom data transformations.

### Styling

The app uses TailwindCSS v4. Customize the theme in `tailwind.config.js` or modify component styles directly.

### Components

All UI components are based on shadcn/ui and can be customized in `src/components/ui/`.

## 📊 Data Structure

```typescript
interface Question {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  link?: string;
  completed: boolean;
  notes?: string;
}

interface SubTopic {
  id: string;
  title: string;
  questions: Question[];
}

interface Topic {
  id: string;
  title: string;
  subTopics: SubTopic[];
}
```

## 🚢 Deployment

### Build

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deploy to Netlify

This project includes a `netlify.toml` configuration file. Simply connect your repository to Netlify for automatic deployments.

### Deploy to Other Platforms

The built static files in `dist/` can be deployed to any static hosting service:

- Vercel
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
- etc.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Lucide](https://lucide.dev/) for the icon set

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

Built with ❤️ using React and TypeScript
