const { GoogleGenerativeAI } = require('@google/generative-ai');
const cheerio = require('cheerio');
require('dotenv').config(); // Loads .env variables

async function getLocatorsFromAI(htmlContent, elementDescription) {
    // Use API key from environment variable for security
    const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCXUgBORw1CTlOaU7PmeJI1pmo9oEixj4Y';
    const AI_MODEL = process.env.GEMINI_AI_MODEL || 'gemini-1.5-flash';
    if (!API_KEY) {
        console.error("GEMINI_API_KEY not found in .env file. Please set it.");
        process.exit(1);
    }

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: AI_MODEL });

    // Clean HTML: remove non-essential tags
    const $ = cheerio.load(htmlContent);
    $('script, style, link, meta, noscript, svg').remove();
    const cleanedHtml = $.html();
    console.log("Cleaned HTML content for AI processing:", cleanedHtml);

    // Prompt for the AI model
    const prompt = `
You are an expert in web automation and Playwright.
Given the following HTML content, identify the best Playwright locators for "${elementDescription}".

Prioritize Playwright's built-in locators:
- page.getByRole() (e.g., 'textbox', 'button', 'link', 'checkbox')
- page.getByText()
- page.getByLabel()
- page.getByPlaceholder()
- page.getByAltText()
- page.getByTitle()
- page.getByTestId() (if a data-testid attribute is present)

If none of the above are suitable, suggest a robust CSS selector (e.g., 'input[name="username"]', '.login-button', '#submitBtn').
Avoid generic selectors like 'div > div > input' if more specific options exist.

Output the locators in a JSON array, where each object has a 'type' and 'selector' field.
The 'type' should indicate the Playwright method (e.g., 'getByRole', 'getByPlaceholder', 'css').
The 'selector' should be the argument for that method.
If multiple strong locators are found for the same element, list them all.

Example Output Structure:
[
    { "type": "getByRole", "selector": "textbox", "options": { "name": "Email address" } },
    { "type": "getByPlaceholder", "selector": "Enter your password" },
    { "type": "css", "selector": "button.login-btn" }
]

HTML Content:
\`\`\`html
${cleanedHtml}
\`\`\`
Please provide only the JSON array.
`;

    // Generate AI response
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    // Optionally, parse and return JSON if needed:
    // return JSON.parse(responseText);
    return responseText;
}

module.exports.getLocatorsFromAI = getLocatorsFromAI;