import React, { useState, useEffect, useCallback } from "react";
import { PdfUpload } from "./components/PdfUpload";
import { ChatWindow } from "./components/ChatWindow";
import { processPdf } from "./hooks/usePdfProcessor";
import { answerWithRAG } from "./services/geminiService";

const App = () => {
  const [pdfContext, setPdfContext] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [apiKeyError, setApiKeyError] = useState(false);

  useEffect(() => {
    if (!process.env.API_KEY) {
      console.error("API_KEY environment variable not set.");
      setApiKeyError(true);
    }
  }, []);

  const handlePdfUpload = useCallback(async (file) => {
    setIsProcessingPdf(true);
    setPdfContext(null);
    setMessages([]);
    try {
      const text = await processPdf(file);
      setPdfContext(text);
      setMessages([
        {
          id: "initial-bot-message",
          sender: "bot",
          text: "I've processed the document. What would you like to know?",
        },
      ]);
    } catch (error) {
      console.error("Error processing PDF:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      setMessages([
        {
          id: "error-message",
          sender: "bot",
          text: `Sorry, I couldn't process that PDF. Please try another one. Error: ${errorMessage}`,
        },
      ]);
    } finally {
      setIsProcessingPdf(false);
    }
  }, []);

  const handleSendMessage = useCallback(
    async (text) => {
      if (!pdfContext) return;

      const userMessage = { id: Date.now().toString(), text, sender: "user" };
      setMessages((prev) => [...prev, userMessage]);
      setIsChatLoading(true);

      try {
        const botResponseText = await answerWithRAG(text, pdfContext);
        const botMessage = {
          id: (Date.now() + 1).toString(),
          text: botResponseText,
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error("Error getting response from Gemini:", error);
        const errorMessageText =
          error instanceof Error ? error.message : "An unknown error occurred.";
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          text: `Sorry, I encountered an error. ${errorMessageText}`,
          sender: "bot",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsChatLoading(false);
      }
    },
    [pdfContext]
  );

  const handleReset = () => {
    setPdfContext(null);
    setMessages([]);
    setIsProcessingPdf(false);
    setIsChatLoading(false);
  };

  if (apiKeyError) {
    return (
      <div className="flex h-screen items-center justify-center bg-red-100 text-red-800">
        <div className="p-8 bg-white shadow-lg rounded-lg text-center">
          <h1 className="text-2xl font-bold mb-4">Configuration Error</h1>
          <p>The Gemini API key is not configured.</p>
          <p>Please ensure the `API_KEY` environment variable is set.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen font-sans antialiased text-gray-800">
      <div className="flex flex-col flex-1">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
            <h1 className="text-2xl font-bold text-gray-700">MediBot RAG</h1>
          </div>
          {pdfContext && (
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Upload New PDF
            </button>
          )}
        </header>
        <main className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {!pdfContext ? (
            <PdfUpload
              onPdfUpload={handlePdfUpload}
              isProcessing={isProcessingPdf}
            />
          ) : (
            <ChatWindow
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isChatLoading}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
