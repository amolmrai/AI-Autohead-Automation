// Example Playwright test script to demonstrate Self-Healing Test Automation using Gemini AI
import { test, expect } from '@playwright/test';
require('dotenv').config();
const { getLocatorsFromAI } = require('../tests/getLocators_AI.js'); // Adjust the path as necessary
const puppeteer = require('puppeteer');
const { aiHealAction } = require('../util/aiAction.js'); // Adjust the path as necessary
const { chromium } = require('playwright'); // Import Playwright's Chromium browser

test('**** Approach 1 :- Auto-heal automation test case for Macys Login page using Gemini AI ', async () => {
    // Step 1: Launch the browser and navigate to the Macy's login page.
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.macys.com/account/signin');
    // Step 2: Attempt to fill Email address filed the login form.
    await aiHealAction(page, 'type', '#email', 'user@example.com') ;
    await aiHealAction(page, 'type', '#wrongPassword', 'secret123');
    await aiHealAction(page, 'click', '#wrongLoginBtn','');
    await aiHealAction(page, 'click', 'Details','');
    await aiHealAction(page, 'click', 'Details',''); 
    // Step 3: Close the browser.
    await page.waitForTimeout(5000);
    await browser.close();
});



test('****** Approach : 1 : Auto-heal automation test cases  **********', async ({ page }) => {
    const browser = await puppeteer.launch();
    const page1 = await browser.newPage();

    const element = 'create account button'; // Example field to search for
    await page1.goto('https://www.mcom-135.tbe.zeus.fds.com/account/signin'); // Navigate to the specified URL

    try {
        
    // Fill in login credentials (replace with your actual credentials)
    await page1.type('#email', 'your_email@example.com');
    await page1.type('#password', 'your_password');
    //await page1.type('#email', 'your_email@example.com');

    // Click the Sign In button
    await page1.click('#signInBtn');

    // Wait for login to complete or dashboard to load
    //await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

    // Check if login was successful (look for user menu or account text)
    const isLoggedIn = await page1.isVisible('text=My Account');
    
    } catch (error) {
        //'No element found for selector: #password'
        // Get the entire DOM content
    const dom_content = await page1.content();

    // Get AI-suggested locators for the element
    const aiElementLocator = await getLocatorsFromAI(dom_content, element);
    console.log('**** AI Suggested ' + element + ' Locators ****:', aiElementLocator);
    }
    
    page.close();
});
test('Auto-heal Automation test case for Macys Pdp page using Gemini AI',async ()=> {
    const productId = '21322921'; // The product ID to search for
   
    // 1. Navigate to Macy's homepage
    const macysUrl = 'https://www.mcom-135.tbe.zeus.fds.com/shop/product/now-this-womens-shirred-midi-slipdress-exclusively-at-macys?ID=21322921&cm_kws=21322921/'; // Macy's base URL
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    console.info(`Step 1:- Navigating to Macy's homepage: ${macysUrl}`);
    await page.goto(macysUrl);
    
    // 2. Locate the search bar and type the product ID
    const txtInputSearchBar = 'input[name="keyword"]';
    const btnSearch = '[data-test-id="search-submit-button"]';
    console.info(`Searching for product ID:.... "${productId}"`);
    // Wait for the search input to be visible and enabled
    //await aiHealAction(page, 'type', '[data-test-id="search-input"]', '21322921') ;

    console.info(`Step 2:- Located the search bar and type the product ID: ${productId}`);
    // Type the product ID into the search bar
    //await page.locator(txtInputSearchBar).fill(productId);
    
    // Press Enter to submit the search, or click a search button
    // Option A: Press Enter (common behavior)
    //await page.locator(txtInputSearchBar).press('Enter');
    // const searchButton = page.locator(btnSearch);
    // await expect(searchButton).toBeVisible();
    // await expect(searchButton).toBeEnabled();
    // await searchButton.click();
    // 3. Validate navigation to the product description page (PDP)
    console.info(`Step 3:- Pressed Enter to submit the search for product ID: ${productId}`);
    console.info('Waiting for navigation to Product Description Page (PDP)...');
    // Waits for any URL containing the product ID
   // await page.waitForURL(`**/*${productId}*`); 
    // Examples of common PDP elements:
    const productTitleSelector = 'h1.product-name'; // Common selector for product title
    const productPriceSelector = '.price-display'; // Common selector for product price
    const addToBagButtonSelector = 'button:has-text("Add to Bag")'; // Common selector for add to cart button
    const productSizeChartSelector = 'link-sm margin-left-xxxs'; // Common selector for product price
    const productSizeChartCloseButtonSelector = 'v-overlay-close-btn cell large-1 medium-1 small-1'; // Common selector for product price
    
    console.info('Validating elements on the PDP...');
   
    // Assert that the product title is visible and not empty
    const productTitle = page.locator(productTitleSelector);
    //await page.waitForSelector(productTitle, { timeout: 5000 }); // Wait max 5 seconds.
    console.log(`✅ Product Title found: "${await productTitle.innerText()}"`);


    // Assert that the product price is visible
    const productPrice = page.locator(productPriceSelector);
    //await page.waitForSelector(productPrice, { timeout: 5000 }); // Wait max 5 seconds.
   console.log(`✅ Product Price found: "${await productPrice.innerText()}"`);


    await page.waitForSelector(productSizeChartSelector, { timeout: 5000 }); // Wait max 5 seconds.
    await page.click(productSizeChartSelector);
    await page.waitForSelector(productSizeChartCloseButtonSelector, { timeout: 5000 }); // Wait max 5 seconds.
    await page.click(productSizeChartCloseButtonSelector);

    // Assert that the "Add to Bag" button is visible and enabled
    // 4. click on the "Add to Bag" button
    const addToBagButton = page.locator(addToBagButtonSelector);
    await addToBagButton.click();
    console.log('✅ "Add to Bag" button found and clicked.');

    // Optional: Take a screenshot of the PDP for visual verification
    await page.screenshot({ path: `macys-product-${productId}-pdp.png`, fullPage: true });
    console.log(`📸 Screenshot saved: macys-product-${productId}-pdp.png`);

    console.log(`🎉 Test for product ID ${productId} completed successfully!`);


    // Clsoe the browser
    await page.waitForTimeout(5000);
    await browser.close();

});







/*
message =
'No element found for selector: #password'
stack =
'Error: No element found for selector: #password\n    at assert (/Users/amol.ray/Documents/personal/Study/Aray_Playwright/node_modules/puppeteer-core/src/util/assert.ts:19:11)\n    at CdpFrame.type (/Users/amol.ray/Documents/personal/Study/Aray_Playwright/node_modules/puppeteer-core/src/api/Frame.ts:1167:11)\n    at /Users/amol.ray/Documents/personal/Study/Aray_Playwright/tests/example.spec.js:17:5\n    at /Users/amol.ray/Documents/personal/Study/Aray_Playwright/node_modules/playwright/lib/worker/wo…dy/Aray_Playwright/node_modules/playwright/lib/worker/workerMain.js:302:7\n    at WorkerMain._runTest (/Users/amol.ray/Documents/personal/Study/Aray_Playwright/node_modules/playwright/lib/worker/workerMain.js:277:5)\n    at WorkerMain.runTestGroup (/Users/amol.ray/Documents/personal/Study/Aray_Playwright/node_modules/playwright/lib/worker/workerMain.js:193:11)\n    at process.<anonymous> (/Users/amol.ray/Documents/personal/Study/Aray_Playwright/node_modules/playwright/lib/common/process.js:70:22)'
[[Prototype]] =
Object
*/
 test('get all locators info', async ({ page }) => {
  //const url = 'http://www.macys.com/';
 try {
        const allElementsInfo = await getAllElementInfo(page);
        console.log(`Found ${allElementsInfo.length} elements on ${page}:\n`);
        allElementsInfo.forEach(element => {
            console.log(element);
        });
    } catch (error) {
        console.error("An error occurred:", error);
    }

});

async function getAllElementInfo(page) {
   
   await page.goto('https://www.macys.com/account/signin');
   //await expect(page).toHaveTitle('https://www.macys.com/account/signin');             // Navigate to the specified URL

    const elementsData = await page.evaluate(() => {
        const allElements = document.querySelectorAll('*'); // Select all elements on the page
        const data = []; // Array to store information about each element

        allElements.forEach(element => {
            const tag = element.tagName.toLowerCase(); // Get the tag name (e.g., 'div', 'button')
            const id = element.id;                     // Get the element's ID
            const classes = Array.from(element.classList); // Get all classes as an array
            // Get text content, trim whitespace, and normalize multiple spaces
            const textContent = element.textContent ? element.textContent.trim().replace(/\s+/g, ' ') : '';
            
            const attributes = {}; // Object to store all attributes
            for (let i = 0; i < element.attributes.length; i++) {
                const attr = element.attributes[i];
                attributes[attr.name] = attr.value; // Store attribute name-value pairs
            }

            // Attempt to infer common Playwright locators based on element attributes
            const inferredPlaywrightLocators = [];
            if (id) inferredPlaywrightLocators.push(`id=${id}`);
            if (classes.length > 0) inferredPlaywrightLocators.push(`css=.${classes.join('.')}`);
            // Truncate long text content for display in inferred locators
            if (textContent) inferredPlaywrightLocators.push(`text=${JSON.stringify(textContent.substring(0, 50) + (textContent.length > 50 ? '...' : ''))}`);
            if (attributes['name']) inferredPlaywrightLocators.push(`name=${attributes['name']}`);
            if (attributes['placeholder']) inferredPlaywrightLocators.push(`placeholder=${attributes['placeholder']}`);
            if (attributes['alt']) inferredPlaywrightLocators.push(`alt=${attributes['alt']}`);
            if (attributes['title']) inferredPlaywrightLocators.push(`title=${attributes['title']}`);
            if (attributes['data-testid']) inferredPlaywrightLocators.push(`data-testid=${attributes['data-testid']}`);
            // You can add more conditions here to infer other types of locators (e.g., role)

            data.push({
                tag: tag,
                id: id,
                classes: classes,
                textContent: textContent,
                attributes: attributes,
                inferred_playwright_locators: inferredPlaywrightLocators // List of potential locators
            });
        });
        return data; // Return the collected data
    });

    //await browser.close(); // Close the browser
    return elementsData;    // Return the element information
}
