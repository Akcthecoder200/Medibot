// This is not a true hook as it doesn't use React state, but follows the convention.
// It's a utility function for processing PDFs.

/**
 * Extracts text content from a PDF file.
 * @param file The PDF file to process.
 * @returns A promise that resolves to the full text content of the PDF.
 */
export const processPdf = async (file) => {
  if (typeof pdfjsLib === "undefined") {
    throw new Error("pdf.js library is not loaded.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  let fullText = "";

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(" ");
    fullText += pageText + "\n\n"; // Add newlines to separate pages
  }

  return fullText;
};
