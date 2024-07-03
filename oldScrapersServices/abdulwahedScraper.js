
// For more information, see https://crawlee.dev/
import { PuppeteerCrawler, Dataset } from 'crawlee';
import { abdulwahedRouter } from "./abdulwahedRoute_old.js";
import { abdulwahedBaseUrl, allowedTypesAbdulwahed } from '../utils/constants.js';
import { optimizePageLoad } from "../utils/puppeteerUtils.js"
import { goInsert    } from "./insertProductData .js"
// to scrape products from Xcite site
export const scrapeAbdulwahedProducts = async () => {

    const crawlerAbdulwahedSite = new PuppeteerCrawler({
        keepAlive: false,
        requestHandler: abdulwahedRouter,
        useSessionPool: true,
        headless: false,
        launchContext: { launchOptions: { headless: false } },
       // preNavigationHooks: [({ page }) => optimizePageLoad(page, allowedTypesAbdulwahed)],
        maxConcurrency: 6,
        // navigationTimeoutSecs: 260,
        // requestHandlerTimeoutSecs: 260
    });

    await crawlerAbdulwahedSite.run([abdulwahedBaseUrl]);

    const { items: products } = await Dataset.getData();
    goInsert(products);
    // TODO: insert into the database
    // insertProducts(products);

    return products;
}