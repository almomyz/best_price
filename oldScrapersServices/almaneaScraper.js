import axios from "axios";
import { loadCookies, getNewCookies } from '../utils/cookieUtils.js';
import { ALMANEA_PRODUCTS_URL, ALMANEA_SINGLE_PRODUCT_URL, STORE, CATEGORY, API_CATEGORY_ID, NUMBER_OF_ITEM, ALMANEA_BASE_URL } from '../utils/constants.js';

// Function to scrape Almanea website
const scrapeAlmanea = async (pageNo, categoryId, numberOfItem, cookies) => {
    try {
        const response = await axios.post(
            ALMANEA_PRODUCTS_URL,
            {
                pageNo,
                pageSize: numberOfItem,
                categoryID: categoryId,
                currentSortFilterKeys: 'sortBy=position&sortDir=ASC&'
            },
            {
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'content-type': 'application/json',
                    'cookie': cookies
                }
            });
        console.log(`page number ${pageNo}`);
        return response.data.products;
    } catch (error) {
        console.error(`Error scraping Almanea: ${error.message}`);
        throw error;
    }
};

// Function to extract necessary fields from the response
const extractProductData = (pro) => {
    const product = pro.pageProps.product;

    return {
        productName: product.name[0],
        // loop and get only the image url from '_media_.image' array
        photos: product._media_.image.map(image => image.image),
        url: `${ALMANEA_BASE_URL}/product/${product.rewrite_url}`,
        price: product.prices_with_tax.price,
        wasPrice: product.prices_with_tax.original_price,
        available: product.stock.is_in_stock,
        description: product.short_description ? product.short_description : null,
        // Extracting label and value properties and creating a new array of objects
        specification: product.product_attributes.flatMap(attribute => {
            return Object.values(attribute).map(item => ({
                [item.label]: item.value,
            }));
        }),
        brand: product.option_text_brand,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        categoryID: CATEGORY.SMARTPHONE,
        storeId: STORE.ALMANEA,
    };
};

// Function to scrape all products Url from Almanea
const scrapeAlmaneaProductsUrls = async () => {
    let pageNo = 0;
    let allProductsUrls = [];
    let cookies = loadCookies() || await getNewCookies();

    while (true) {
        try {
            const products = await scrapeAlmanea(pageNo, API_CATEGORY_ID, NUMBER_OF_ITEM, cookies);
            // Break the loop if no products are found
            if (!products || products.length === 0) break;

            // only extract the products url
            const productsUrls = products.map(product => product._source.rewrite_url);
            allProductsUrls = allProductsUrls.concat(productsUrls);
            pageNo++;
        } catch (error) {
            if (error.response && error.response.status === 500) {
                console.warn('Internal server error, refreshing cookies and retrying...');
                cookies = await getNewCookies();
            } else {
                console.error(`Error scraping Almanea: ${error.message}`);
                break;
            }
        }
    }

    console.log(`totals products urls ${allProductsUrls.length}`);

    return { allProductsUrls, cookies };
};


// function to scrape all products from Almanea using allProductsUrls and extract the needed data of each product using extractProductData function
const scrapeAlmaneaProducts = async () => {
    const { allProductsUrls, cookies } = await scrapeAlmaneaProductsUrls();
    const products = [];
    const headers = { headers: { 'cookie': cookies } };

    let i = 1;
    for (const url of allProductsUrls) {
        try {
            const response = await axios.get(`${ALMANEA_SINGLE_PRODUCT_URL}/${url}.json`, headers);
            const product = extractProductData(response.data);
            products.push(product);
            console.log(`scraped product ${i++}`);
        } catch (error) {
            console.error(`Error scraping product: ${error.message}`);
        }
    }

    return products;
};

export { scrapeAlmaneaProducts };
