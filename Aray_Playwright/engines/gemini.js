// engines/gemini.js
import fetch from 'node-fetch';
global.fetch = fetch;

// Test configuration
const TEST_CONFIG = {
  engine : 'gemini',
  geminiApiKey: "AIzaSyCXUgBORw1CTlOaU7PmeJI1pmo9oEixj4Y",
}; 
async function suggestWithGemini({ selector, domSnapshot, action }) {
  
  const prompt = `
    A test automation action "${action}" failed to find selector "${selector}".
    Here's the DOM:
    ${JSON.stringify(domSnapshot, null, 2)}
    Give a working selector string only.
`;
  const res = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': TEST_CONFIG.geminiApiKey,
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    }),
  });
  // It's crucial to check for a successful response before parsing JSON
  if (!res.ok) {
    const errorText = await res.text(); // Get raw error text
    console.error('Gemini API Error:', res.status, res.statusText, errorText);
    throw new Error(`Gemini API request failed: ${res.status} ${res.statusText} - ${errorText}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
}
// Export the function for use in other modules
module.exports = { suggestWithGemini };
