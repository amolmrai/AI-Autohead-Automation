
/**
 * @author Amol Ray.
 * Self-Healing Test Automation Demo for Macy's Login Page
 * Uses Gemini AI for automatic locator healing
 */

// Import required modules
import { test, expect } from '@playwright/test';
import { chromium } from 'playwright';
require('dotenv').config();

// Import custom utilities
const { getLocatorsFromAI } = require('../tests/getLocators_AI.js');
const { aiHealAction } = require('../util/aiAction.js');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'https://www.macys.com/account/signin',
  headless: false,
  timeout: 10000,
  testEmail: 'user@example.com',
  testPassword: 'secret123'
};

test('Auto-heal test case for Macy\'s Login using Gemini AI', async ({ page }) => {
  // Step 1: Launch browser and navigate to login page
  const browser = await chromium.launch({ 
    headless: TEST_CONFIG.headless,
    slowMo: 100 // Add slight delay for better visibility
  });
  //Get locators from AI
  try {
    const page = await browser.newPage();
    await page.goto(TEST_CONFIG.baseUrl);
    // Step 2: Attempt form actions with self-healing
    await aiHealAction(page,'type','#email',TEST_CONFIG.testEmail,'Entering test email');
    await aiHealAction(page,'type','#wrongPassword',TEST_CONFIG.testPassword,'Entering test password');
    await aiHealAction(page,'click','#wrongLoginBtn',TEST_CONFIG.testPassword,'Clicking login button');
    
  } finally {
    // Step 3: Clean up
    //await page.waitForTimeout(5000); // Visual verification
    await browser.close();
  }
});