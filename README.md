# MediBot RAG

A medical chatbot that uses Retrieval-Augmented Generation (RAG) to answer questions based on a user-uploaded PDF document.

## Features
- Upload a medical PDF document
- Ask questions about the document
- Answers are generated using Google's Gemini API with RAG

## Prerequisites
- Node.js (v16 or higher recommended)
- A Gemini API key

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Set up your Gemini API key:**
   - Create a file named `.env.local` in the project root.
   - Add your Gemini API key:
     ```env
     GEMINI_API_KEY=your-gemini-api-key-here
     ```
3. **Run the app locally:**
   ```sh
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173)

## Usage
1. Upload a PDF document using the upload interface.
2. Ask questions about the content of the PDF in the chat window.
3. The bot will answer using information retrieved from your document.

## Build & Preview
To build for production:
```sh
npm run build
```
To preview the production build locally:
```sh
npm run preview
```

## Tech Stack
- React (JavaScript/JSX)
- Vite
- Google Gemini API
- Tailwind CSS (via CDN)
- PDF.js (via CDN)

---


