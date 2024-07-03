import { Dataset, HttpCrawler } from 'crawlee';
import { XCITE_PRODUCTS_URL, XCITE_PRODUCTS_LABEL } from '../utils/constants.js';
import { xciteApiRouter } from './xciteApiRoute.js';
// to scrape products from almanea site
export const scrapeXciteProducts = async () => {

    const crawler = new HttpCrawler({
        requestHandler: xciteApiRouter,
        additionalMimeTypes: ['application/json'],
    });

    // to add initial request
    await crawler.addRequests([
        {
            label: XCITE_PRODUCTS_LABEL,
            url: XCITE_PRODUCTS_URL
        }
    ]);

    await crawler.run();

    const { items: products } = await Dataset.getData();
    return products;
}