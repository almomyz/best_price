import { createCheerioRouter } from 'crawlee';
import { ABDULWAHED_PRODUCTS_URL, abdulwahedSelectors, ABDULWAHED_PRODUCTS_LABEL, ABDULWAHED_DETAILS_LABEL, PRODUCTS_PER_PAGE } from "../utils/constants.js";
import { convertTextToNumber, extractImageUrls, extractDescription, extractSpecification } from "../utils/abdulwahedUtils.js"
import { STORE, CATEGORY, Currencies } from '../utils/constants.js';
import Category from '../models/Category.js';
// initialize needed var
let currentPage = 1;
let allProductsUrl = [];

export const abdulwahedRouter = createCheerioRouter();

abdulwahedRouter.addHandler(ABDULWAHED_PRODUCTS_LABEL, async ({ request, $, log, sendRequest, addRequests, enqueueLinks }) => {

    console.log(`Fetching URL: ${request.url}`);

    await sendRequest({
        url: request.url,
        method: 'post',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        body: 'isAjax=1'
    })

    // Extract products URLs
    $(abdulwahedSelectors.productUrl).each((index, element) => {
        allProductsUrl.push($(element).attr('href'));
    });

    const numberOfProducts = $(abdulwahedSelectors.productsCount).text().match(/\d+/)[0];

    // if numberOfProducts is not null then calculate the total pages
    const totalPages = numberOfProducts ? Math.ceil(numberOfProducts / PRODUCTS_PER_PAGE) : 0;

    log.info(`Fetched products from page ${currentPage} / ${totalPages}`);

    // loop and adding all products links 
    if (currentPage < totalPages) {

        // increase the current page
        currentPage++;

        // add another request if there is a products
        await addRequests([{
            url: `${ABDULWAHED_PRODUCTS_URL}?p=${currentPage}&product_list_limit=${PRODUCTS_PER_PAGE}`,
            label: ABDULWAHED_PRODUCTS_LABEL,
        }]);
    }
    else {
        log.info(`Finished fetching all products`);
        log.info(`total products fetch ${allProductsUrl.length} / ${numberOfProducts}`);

        // go to the ABDULWAHED_DETAILS_LABEL and send all products url
        await enqueueLinks({
            urls: allProductsUrl,
            label: ABDULWAHED_DETAILS_LABEL,
        });
    }
});

// Function to extract necessary fields
function extractProductInfo($, url) {
    try {
        // Extract image URLs from the script tag
        const scriptTagContent = $(abdulwahedSelectors.image).next(abdulwahedSelectors.scriptTag).html();
        const photos = extractImageUrls(scriptTagContent);

        // Extract product information
        const productName = $(abdulwahedSelectors.productName)?.text()?.trim() ?? null;
        const brand = $(abdulwahedSelectors.brand)?.text()?.trim() ?? null;
        const price = $(abdulwahedSelectors.price).data('price-amount');
        // const wasPrice = $(abdulwahedSelectors.wasPrice).length ? convertTextToNumber($(abdulwahedSelectors.wasPrice).text().trim()) : 0;
        const wasPrice = $(abdulwahedSelectors.wasPrice).length ? $(abdulwahedSelectors.wasPrice).data('price-amount') : 0;
        // TODO: add this for arabic languages
        // const available = $(abdulwahedSelectors.available).text().trim() === "متوفر";
        const available = $(abdulwahedSelectors.available).text().trim() === "In stock";
        const specification = extractSpecification($, abdulwahedSelectors.specification);
        const description = extractDescription($, abdulwahedSelectors.description);
        //   const categoryID = CATEGORY.SMARTPHONE;
        //  const storeId = STORE.ABDULWAHED
        return {
            productName, url, photos, brand, price, storeId: STORE.ABDULWAHED,
            wasPrice, available, description, specification, categoryID: CATEGORY.SMARTPHONE,
            currency: Currencies.SAR
        };
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

abdulwahedRouter.addHandler(ABDULWAHED_DETAILS_LABEL, async ({ request, $, log, pushData }) => {
    log.info(`processing ${request.url}`);

    // save the response products
    const product = extractProductInfo($, request.url);
    await pushData(product);
});
