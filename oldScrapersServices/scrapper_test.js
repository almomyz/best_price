import { PuppeteerCrawler, log, Dataset } from 'crawlee';
import { router } from './routes.js';
import { startUrl, labels } from "./constants.js";

// function for static html page scrapping
const scrapePrice = async (url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const price = parseFloat($(".price").replace('$', ''));
        return price;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Function for Headless Scraping using Crawlee (SPA)
const headlessScrape = async (url, selector) => {
    const crawler = new PuppeteerCrawler({
        requestHandler: async ({ page, request, response, enqueueLinks }) => {
            // Extract the price from the page
            const price = await page.evaluate(() => {
                const priceElement = document.querySelector('.price');
                return priceElement ? priceElement.textContent : null;
            });
            // const price = await page.$eval(selector, el => parseFloat(el.innerText.replace('$', '')));

            // Enqueue all links on the page
            await enqueueLinks();

            // Log the price
            log.info(`Price: ${price}`);

            // Save the result to the dataset
            await Dataset.pushData({
                url: request.url,
                price,
                date: new Date()
            });
        },
        failedRequestHandler({ request }) {
            console.log(`Request ${request.url} failed too many times.`);
        }
    });

    // Add the URL to the queue
    await crawler.addRequests([url]);

    // Run the crawler
    await crawler.run();

    // Get the result from the dataset
    const dataset = await Dataset.getData();
    const priceData = dataset.items[0];

    return { price: priceData.price };
}


// function for API Scraping
const apiScrape = async (url, apiEndpoint) => {
    try {
        const response = await axios.get(url);
        const data = response.data;
        return { price: data.price };
    } catch (error) {
        throw new Error(error.message);
    }
}

const getCookiesOld = async () => {

    const crawler = new PuppeteerCrawler({
        headless: false,
        preNavigationHooks: [({ page }) => optimizePageLoad(page, allowedTypes)],
        async requestHandler({ page, request }) {
            console.log(`Processing: ${request.url}`);

            const cookies = await page.cookies();
            console.log('cookies', cookies);
            await Dataset.pushData(cookies);

            console.log('data pushed');
        }
    });

    await crawler.run([BASE_URL]);

    const cookiesDataset = await Dataset.getData();
    // return cookiesDataset[0].cookies;
    return cookiesDataset.items[0];
}