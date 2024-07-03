// For more information, see https://crawlee.dev/
import { PuppeteerCrawler, Dataset } from 'crawlee';
import { xciteRouter } from './xciteRoute.js';
import { xciteBaseUrl, allowedTypesXcite } from '../utils/constants.js';
import { optimizePageLoad } from "../utils/puppeteerUtils.js"

// to scrape products from Xcite site
export const scrapeXciteProducts = async () => {

    const crawlerXciteSite = new PuppeteerCrawler({
       // keepAlive: false,
        requestHandler: xciteRouter,
      //  useSessionPool: true,
        headless: false,
        useSessionPool: true,
        
       // preNavigationHooks: [({ page }) => optimizePageLoad(page, allowedTypesXcite)],
          maxConcurrency: 6,
         navigationTimeoutSecs: 260,
        requestHandlerTimeoutSecs: 260
    });

    await crawlerXciteSite.run([xciteBaseUrl]);

    const { items: products } = await Dataset.getData();

    // TODO: insert into the database
    // insertProducts(products);

    return products;
}