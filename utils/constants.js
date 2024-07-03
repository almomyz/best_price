import dotenv from 'dotenv';
dotenv.config();

// abdulwahed constants
// TODO: make another url for arabic: change this /en/ to /ar/
const ABDULWAHED_PRODUCTS_URL = 'https://www.abdulwahed.com/en/computers-mobiles/smart-phones/all-smart-phones.html';
const PRODUCTS_PER_PAGE = 72;

// for abdulwahed crawlee
const ABDULWAHED_PRODUCTS_LABEL = "abdulwahed_products_url";
const ABDULWAHED_DETAILS_LABEL = "abdulwahed_details";

// abdulwahed selectors
const abdulwahedSelectors = {
    productsCount: "div.product-count > h3",
    productUrl: ".product-item-info > a",
    brand: "div.pdp-brand-container > span:nth-child(2)",
    productName: ".product-info-main div h2",
    description: "div.product.attribute.overview div.value",
    price: '.price-wrapper[data-price-type="finalPrice"]',
    wasPrice: '.price-wrapper[data-price-type="oldPrice"]',
    available: "div.product-info-price > div > div > h3 > span",
    specification: "#product-attribute-specs-table > tbody > tr > td > table > tbody > tr",
    image: 'div.gallery-placeholder',
    scriptTag: 'script[type="text/x-magento-init"]',
};

// for xcite api crawlee
const XCITE_PRODUCTS_LABEL = "xcite_products_url";
const XCITE_DETAILS_LABEL = "xcite_details";

// xcite API key and app ID
const xciteApiKey = process.env.XCITE_API_KEY;
const xciteAppId = process.env.XCITE_APP_ID;
const xciteAlgoliaAgent = 'Algolia for JavaScript (4.11.0); Browser (lite); instantsearch.js (4.57.0); react (17.0.2); react-instantsearch (7.1.0); react-instantsearch-core (7.1.0); next.js (12.1.6); JS Helper (3.14.2)';
// const xciteAlgoliaAgent = 'Algolia%20for%20JavaScript%20(4.11.0)%3B%20Browser%20(lite)%3B%20instantsearch.js%20(4.57.0)%3B%20react%20(17.0.2)%3B%20react-instantsearch%20(7.1.0)%3B%20react-instantsearch-core%20(7.1.0)%3B%20next.js%20(12.1.6)%3B%20JS%20Helper%20(3.14.2)';

// the website url: https://www.xcite.com/ar-KW/mobile-phones/c
// TODO: make another one for arabic edit this: 'https://www.xcite.com/ar-KW/'
const XCITE_BASE_URL = 'https://www.xcite.com/en-KW/';
const XCITE_PRODUCTS_URL = `https://jsv268mefd-1.algolianet.com/1/indexes/*/queries?x-algolia-agent=${xciteAlgoliaAgent}&x-algolia-api-key=${xciteApiKey}&x-algolia-application-id=${xciteAppId}`;

// Constants for xcite API request parameters
// const XCITE_HITS_PER_PAGE = 96;
const XCITE_HITS_PER_PAGE = 750;

const XCITE_SINGLE_PRODUCT_URL = 'https://www.xcite.com/_next/data';


// for Almanea api crawlee
const ALMANEA_PRODUCTS_LABEL = "almanea_products_url";
const ALMANEA_DETAILS_LABEL = "almanea_details";

// Almanea API constants
const ALMANEA_BASE_URL = 'https://www.almanea.sa';
// https://www.almanea.sa/mobiles-tablets-c-7423/mobiles-c-7424
const ALMANEA_PRODUCTS_URL = 'https://www.almanea.sa/api/category/pagination';
// const uniqueId = 1716707943486;
// const ALMANEA_SINGLE_PRODUCT_URL = `https://www.almanea.sa/_next/data/${uniqueId}/ar/product`;
const ALMANEA_SINGLE_PRODUCT_URL = 'https://www.almanea.sa/_next/data';
const NUMBER_OF_ITEM = 30;
const API_CATEGORY_ID = 7424;


// Extra API key and app ID
const extraApiKey = process.env.EXTRA_API_KEY;
const extraAppId = process.env.EXTRA_APP_ID;
const extraAlgoliaAgent = 'Algolia for JavaScript (4.5.1); Browser (lite)';

// the website url: https://www.extra.com/ar-sa/mobiles-tablets/mobiles/smartphone/c/2-212-3/facet/?q=:relevance:inStock:true&text=&pageSize=48&pg=2&sort=relevance
const EXTRA_BASE_URL = 'https://www.extra.com/en-sa';
const EXTRA_PRODUCTS_URL = `https://ml6pm6jwsi-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=${extraAlgoliaAgent}&x-algolia-api-key=${extraApiKey}&x-algolia-application-id=${extraAppId}`;

// Constants for extra API request parameters
const EXTRA_HITS_PER_PAGE = 96;
const EXTRA_OPTIONAL_FILTERS = '["sellingOutFastCities:SA-riyadh<score=5>","inStockCities:SA-riyadh<score=5>"]';
const EXTRA_FACET_FILTERS = '[["inStock:SA-riyadh_inStock"]]';
const EXTRA_FACETS = '["productFeaturesAr.*", "brandAr", "subFamilyAr", "rating","productStatusAr","price","offersFacet","inStock","hasFreeGifts","familyAr","deliveryFacet"]';
const EXTRA_INDEX_NAME = 'prod_sa_product_index';
const EXTRA_CATEGORY_FILTER = 'categories:2-212-3';

// temporary store IDs
const STORE = {
    ABDULWAHED: 2,
    XCITE: 4,
    EXTRA: 3,
    ALMANEA: 1,
}
const Currencies = {
    SAR: 1,
    KWD: 2,
    USD: 3
}
// temporary category ID
const CATEGORY = {
    SMARTPHONE: 2,
    TABLET: 3,
}


export {
    ALMANEA_BASE_URL,
    ALMANEA_PRODUCTS_URL,
    EXTRA_BASE_URL,
    EXTRA_PRODUCTS_URL,
    abdulwahedSelectors,
    EXTRA_HITS_PER_PAGE,
    EXTRA_OPTIONAL_FILTERS,
    EXTRA_FACET_FILTERS,
    EXTRA_FACETS,
    EXTRA_INDEX_NAME,
    EXTRA_CATEGORY_FILTER,
    STORE,
    CATEGORY,
    NUMBER_OF_ITEM,
    API_CATEGORY_ID,
    ALMANEA_SINGLE_PRODUCT_URL,
    XCITE_PRODUCTS_URL,
    XCITE_PRODUCTS_LABEL,
    XCITE_HITS_PER_PAGE,
    XCITE_BASE_URL,
    XCITE_SINGLE_PRODUCT_URL,
    XCITE_DETAILS_LABEL,
    ABDULWAHED_PRODUCTS_URL,
    PRODUCTS_PER_PAGE,
    ABDULWAHED_PRODUCTS_LABEL,
    ABDULWAHED_DETAILS_LABEL,
    ALMANEA_PRODUCTS_LABEL,
    ALMANEA_DETAILS_LABEL,
    Currencies
}

