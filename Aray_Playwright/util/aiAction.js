
/**
 * @author Amol Ray.
 * @file This module provides a self-healing action utility for Playwright tests.
 * It uses Gemini AI to suggest new locators if an initial action fails due to a missing element.
 */

// Import custom utilities
const { getDomSnapshot } = require('../util/dom');
const { suggestWithGemini } = require('../engines/gemini');

/**
 * Default timeout for Playwright actions when waiting for selectors.
 * @type {number}
 */
const ACTION_TIMEOUT = 5000;

/**
 * Performs a specified action on an element, with AI-powered self-healing capabilities.
 * If the initial action fails because the element is not found, it captures the current DOM,
 * sends it to Gemini AI to get a new, potentially working, selector, and then retries the action.
 *
 * @param {import('@playwright/test').Page} page - The Playwright `Page` object to interact with.
 * @param {'type' | 'click' | 'select'} actionType - The type of action to perform.
 *   - 'type': To fill text into an input field.
 *   - 'click': To click an element.
 *   - 'select': To select an option from a dropdown.
 * @param {string} selector - The initial CSS selector or Playwright locator string for the target element.
 * @param {string | number | boolean | null} [value=null] - The value to use for 'type' or 'select' actions.
 *   Required for 'type' and 'select' actions. Optional for 'click'.
 * @param {string} [description=''] - An optional description for the action, used in console logs.
 * @returns {Promise<void>} A promise that resolves when the action is successfully performed,
 *   or rejects if both initial and AI-healed attempts fail.
 * @throws {Error} If the action type is unsupported or if AI healing fails to provide a valid selector.
 */
async function aiHealAction(page, actionType, selector, value = null) {
   /**
    * Internal helper function to perform the actual Playwright action.
    * @param {string} currentSelector - The selector to use for the action.
    * @returns {Promise<void>}
    * @throws {Error} If the selector is not found within the timeout or action type is unsupported.
    */
   const performAction = async (currentSelector) => {
     await page.waitForSelector(currentSelector, { timeout: ACTION_TIMEOUT });
     switch (actionType) {
       case 'type':
         if (value === null) {
           throw new Error(`'type' action requires a 'value' parameter.`);
         }
         await page.type(currentSelector, value);
         break;
       case 'click':
         // No value needed for click
         await page.click(currentSelector);
         break;
       case 'select':
         await page.selectOption(currentSelector, value);
         break;
       default:
         throw new Error(`Unsupported action type: ${actionType}`);
     }
   };
   
   try {
     console.log(`Attempting to perform '${actionType}' on selector: '${selector}'...\n`);
     await performAction(selector);
   } catch (err) {
     // If the error is because the element wasn't found, we try AI healing
     // We'll log a warning and then try to get a new selector from Gemini
     console.warn(`⚠️  Failed to locate element with selector: '${selector}' for action '${actionType}'. Initiating AI healing via Google Gemini...\n`);
     
     // Capture a snapshot of the current DOM for the AI model
     const dom = await getDomSnapshot(page);
     
     // Request a new selector from Gemini AI
     const newSelector = await suggestWithGemini({
       selector,
       domSnapshot: dom,
       action: actionType
     });
     if (!newSelector) {
       throw new Error(`❌ AI healing failed. No new selector returned for original selector: '${selector}'. Please check the AI service or your configuration.\n`);
     }
     console.log(`✅ AI element healing successful. Original: "${selector}" -> AI Healed: "${newSelector}". Retrying action...\n`);
     // Now try the action with the new selector
     await performAction(newSelector);
   }
 }
module.exports = { aiHealAction };
