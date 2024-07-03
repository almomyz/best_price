import { fetchPageData } from '../utils/apiClient.js';
import { CATEGORY, EXTRA_BASE_URL, STORE, Currencies } from "../utils/constants.js";
// to scrape products from the external API
export const scrapeExtraProducts = async () => {
    const extractedInfo = [];
    let currentPage = 0;
    let nbPages = 0;
    let nbHits = 0;

    do {
        // Fetch data for the current page
        const { hits, numberOfHits: totalHits, numberOfPages: totalPages } = await fetchPageData(currentPage);
        nbHits = totalHits;
        nbPages = totalPages;

        // Extract product information from the hits
        hits.forEach((item) => {
            // const specification = Object.entries(item.productFeaturesAr).map(([key, value]) => `${key}: ${value}`);
            // TODO: for arabic use: productFeaturesAr
            const specification = Object.entries(item.productFeaturesEn).map(([key, value]) => {
                return { [key]: value }
            });

            extractedInfo.push({
                // productName: item.nameAr,
                productName: item.nameEn,
                price: item.price,
                wasPrice: item.wasPrice || null,
                available: item.available || false,
                // url: EXTRA_BASE_URL + item.urlAr,
                url: EXTRA_BASE_URL + item.urlEn,
                // TODO: goto each product and get ist image: https://media.extra.com/s/aurora/100345839_800.json 
                // use this arribute and exuded the text after the number "amplienceProductBaseUrl": "//media.extra.com/s/aurora/100345839_800/Apple-iPhone-15-Pro-Max%2C-5G%2C-6-7-inch%2C-256GB%2C-Natural-Titanium?locale=en-GB,en-*,*",
                // photos: item.productMediaUrls.slice(1).map(url => `https:${url}`), // to add http://
                photos: item.productMediaUrls.slice(1),
                // description: [item.descriptionAr],
                description: [item.descriptionEn],
                specification: specification,
                // brand: item.brandAr,
                brand: item.brandEn,
                storeId: STORE.EXTRA,
                categoryID: CATEGORY.SMARTPHONE,
                currency: Currencies.SAR,
                // discount: item.basicPrimepriceDiscountPercentage,
            });
        });

        currentPage++;

        // Delay between requests
        await wait(1000);
    } while (currentPage < nbPages);

    // display the number of products scraped
    console.log(`Number of products scraped: ${extractedInfo.length}`);
    // display the number of products in the API
    console.log(`Number of products in the API: ${nbHits}`);

    return extractedInfo;
};

// Utility function to create a delay
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
