import { BasicCrawler, Dataset, log } from 'crawlee';
import { ALMANEA_PRODUCTS_URL, ALMANEA_PRODUCTS_LABEL } from '../utils/constants.js';
import { almaneaRouter } from "./almaneaRouter.js";
import { loadCookies, getNewCookies } from '../utils/cookieUtils.js';
import { goInsert } from './insertProductData .js';

// to scrape products from almanea site
export const scrapeAlmaneaProducts = async () => {

    let cookies = await loadCookies();

    if (cookies == null) {
        cookies = await getNewCookies();
    }

    const crawler = new BasicCrawler({
        requestHandler: almaneaRouter,
        maxRequestRetries: 3,
        useSessionPool: true,
        sessionPoolOptions: {
            maxPoolSize: 20,
            sessionOptions: {
                userData: { cookies: cookies }
            }
        }
    });

    // to add initial request
    await crawler.addRequests([
        {
            label: ALMANEA_PRODUCTS_LABEL,
            url: ALMANEA_PRODUCTS_URL
        }
    ]);

    await crawler.run();

    const { items: products } = await Dataset.getData();

    return products;
}