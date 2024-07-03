import { CheerioCrawler, Dataset } from 'crawlee';
import { abdulwahedRouter } from "./abdulwahedRoute.js";
import { ABDULWAHED_PRODUCTS_URL, PRODUCTS_PER_PAGE, ABDULWAHED_PRODUCTS_LABEL, } from '../utils/constants.js';
// to scrape products from abdulwahed site
export const scrapeAbdulwahedProducts = async () => {

    // https://www.abdulwahed.com/ar/computers-mobiles.html?p=1&product_list_limit=72
    const ABDULWAHED_START_URL = `${ABDULWAHED_PRODUCTS_URL}?p=1&product_list_limit=${PRODUCTS_PER_PAGE}`;

    const crawler = new CheerioCrawler({
        requestHandler: abdulwahedRouter,
    });

    // to add initial request
    await crawler.addRequests([
        {
            url: ABDULWAHED_START_URL,
            label: ABDULWAHED_PRODUCTS_LABEL,
        }
    ]);

    await crawler.run();

    const { items: products } = await Dataset.getData();
    return products;
}