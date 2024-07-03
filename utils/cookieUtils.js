import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { startBrowserAndPage, saveToJson, optimizePageLoad } from './puppeteerUtils.js';
import { ALMANEA_BASE_URL } from './constants.js';
import { PuppeteerCrawler, log, Dataset } from 'crawlee';
import * as cheerio from "cheerio";

// to get the current working directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// to get the cookies file path
const COOKIES_FILE_PATH = path.resolve(__dirname, 'cookies.json');

// Function to load cookies from a file
const loadCookies = (filePath = COOKIES_FILE_PATH) => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        const { cookies, expiryDate } = JSON.parse(data);
        if (new Date(expiryDate) > new Date()) {
            return cookies;
        }
    }
    return null;
};

const saveCookies = (cookies, filePath = COOKIES_FILE_PATH) => {
    // Set expiry date to 1 month from now
    const now = new Date();
    const expiryDate = new Date(now.setMonth(now.getMonth() + 1));
    const data = { cookies, expiryDate: expiryDate.toISOString() };
    saveToJson(data, filePath)
};


// Function to get new cookies using Puppeteer
const getNewCookies = async () => {
    try {
        const allowedTypes = ['document', 'script', 'xhr'];

        // Visit the website to get cookies
        const { browser, page } = await startBrowserAndPage(ALMANEA_BASE_URL, allowedTypes);

        // Get cookies from the page
        const cookies = await page.cookies();

        // Close the browser since we have the cookies
        await browser.close();

        // save only the handshake form the cookie
        const handshakeCookie = cookies.find(cookie => cookie.name === "handshake");

        // Get the handshake value if the handshake cookie is found
        const formattedHandshakeCookie = handshakeCookie ? `${handshakeCookie.name}=${handshakeCookie.value}` : null;

        // throw and error if no cookies
        if (!formattedHandshakeCookie) {
            throw new Error('No cookies found');
        }

        saveCookies(formattedHandshakeCookie);

        return formattedHandshakeCookie;
    } catch (error) {
        console.log(`Error fetching the cookies: ${error.message}`);
        throw error;
    }
}

/*
// Function to get new cookies using PuppeteerCrawler
const getNewCookies = async () => {
    const allowedTypes = ['document', 'script', "xhr"];

    const crawler = new PuppeteerCrawler({
        headless: false,
        preNavigationHooks: [({ page }) => optimizePageLoad(page, allowedTypes)],
        async requestHandler({ page, request }) {
            console.log(`Processing: ${request.url}`);

            await page.waitForNetworkIdle();

            // Get cookies from the page
            const cookies = await page.cookies();

            // Save only the handshake form the cookie
            const handshakeCookie = cookies.find(cookie => cookie.name === "handshake");

            if (handshakeCookie) {
                // Close the browser since we have the cookies
                // await browserController.close();

                // Get the handshake value if the handshake cookie is found
                const formattedHandshakeCookie = `${handshakeCookie.name}=${handshakeCookie.value}`;

                // also save it to json file
                saveCookies(formattedHandshakeCookie);

                // Save the formatted cookie to the dataset
                await Dataset.pushData({ formattedHandshakeCookie });
                return;
            } else {
                // Throw an error if no cookies
                throw new Error('No cookies found');
            }
        }
    });

    await crawler.run([ALMANEA_BASE_URL]);

    // Retrieve the saved data from the dataset
    const data = await Dataset.getData();

    // Extract the cookie value
    const cookieValue = data.items.length > 0 ? data.items[0].formattedHandshakeCookie : null;

    return cookieValue;
};
*/

function scrapeBuildId(html) {
    // Load the HTML content into Cheerio
    const $ = cheerio.load(html);

    // Find the script tag with src attribute ending with _buildManifest.js
    const script = $('script[src$="buildManifest.js"]').first();

    // If the script tag is found, extract the number from its src attribute
    if (script.length) {
        // Extract the buildId from the src attribute using regular expression
        // const match = script.attr('src').match(/\/(\d+)\/_buildManifest.js/);

        // Extracts the data between "/" and "/_buildManifest.js" from the source attribute of the script element
        const match = script.attr('src').match(/\/([^\/]+)\/_buildManifest.js/);
        // Return the extracted number if found, otherwise return null
        if (match && match[1]) {
            return match[1];
        }
    }
    return null;
}

// the same but another way
/*
function extractBuildId(html) {
    // Load the HTML content into Cheerio
    const $ = cheerio.load(html);

    // Find the script tag with id "__NEXT_DATA__" and extract its content
    const scriptContent = $('#__NEXT_DATA__').html();

    // Parse the JSON data
    const jsonData = JSON.parse(scriptContent);

    // Extract the desired number
    return jsonData.buildId;
}
*/

// test if the build id is valid or not
async function checkBuildID(sendRequest, requestData, pageUrl) {

    const testRes = await sendRequest(requestData);

    // if the build id is not valid, get a new one
    if (!testRes.ok) {
        console.log(`the build id is not valid, getting a new one.....`);

        // get a new buildId from the server
        const newRes = await sendRequest({ url: pageUrl });
        const newBuildId = scrapeBuildId(newRes.body);

        return newBuildId
    }
    return null;
}


export { loadCookies, getNewCookies, checkBuildID };
