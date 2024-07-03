import fs from 'fs';
import puppeteer from 'puppeteer';


// for stating puppeteer browser and page
async function startBrowserAndPage(pageURL, allowedResourceTypes = null, useUserDataDir = false) {

    // Set the launch opt
    const launchOptions = {
        headless: false,
        defaultViewport: null
    };

    // Set the userDataDir
    if (useUserDataDir) {
        launchOptions.userDataDir = './data'; // to cache data
    }

    // Start a puppeteer session
    const browser = await puppeteer.launch(launchOptions);

    // Open a new page
    const page = await browser.newPage();

    // Call the function to optimize page load
    if (allowedResourceTypes) {
        await optimizePageLoad(page, allowedResourceTypes);
    }

    // Navigate to the signIn page
    // , { waitUntil: "domcontentloaded" }
    await page.goto(pageURL, { waitUntil: 'networkidle0' });

    return { browser, page };
}

/*
possible value for allowedResourceTypes
"script" | "image" | "font" | "document" | "stylesheet" | "media" | "texttrack" | "xhr" | 
"fetch" | "prefetch" | "eventsource" | "websocket" | "manifest" | "signedexchange" | 
"ping" | "cspviolationreport" | "preflight" | "other"
*/

// for optimizing load of page
async function optimizePageLoad(page, allowedResourceTypes) {

    await page.setRequestInterception(true);

    page.on('request', async (request) => {
        if (allowedResourceTypes.includes(request.resourceType())) {
            request.continue();
        } else {
            request.abort();
        }
    });
}

// save output to json file
function saveToJson(data, filePath) {
    const jsonData = JSON.stringify(data, null, 4);
    fs.writeFileSync(filePath, jsonData, "utf8");
    console.log("all items have been successfully saved in", filePath, "file");
}

// name export multiple var and function and should when import use the same name
export { startBrowserAndPage, optimizePageLoad, saveToJson };
