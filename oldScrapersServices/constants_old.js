import dotenv from 'dotenv';
dotenv.config();

const abdulwahedBaseUrl = "https://www.abdulwahed.com/ar/computers-mobiles/smart-phones/all-smart-phones.html";
const abdulwahedLabelDetail = "abdulwahedLableDetail";
const ablduwahedLableInsertToDB = "ablduwahedLableInsertToDB";

const xciteBaseUrl = "https://www.xcite.com/ar-KW/mobile-phones/c";
const xciteLabelDetail = "xciteLabelDetail";
const xciteLabelInsertToDB = "xciteLabelInsertToDB";

const allowedTypesAbdulwahed = ["document", "media", "image","javascript", "xhr"];
const allowedTypesXcite = ["document", "script", "javascript", "xhr", "fetch","image"];

// for xcite api crawlee
const XCITE_PRODUCTS_LABEL = "xcite_products_url";
const XCITE_DETAILS_LABEL = "xcite_details";

// Extra API key and app ID
const xciteApiKey = process.env.XCITE_API_KEY;
const xciteAppId = process.env.XCITE_APP_ID;
// const xciteAlgoliaAgent = 'Algolia for JavaScript (4.11.0); Browser (lite); instantsearch.js (4.57.0); react (17.0.2); react-instantsearch (7.1.0); react-instantsearch-core (7.1.0); next.js (12.1.6); JS Helper (3.14.2)';
const xciteAlgoliaAgent = 'Algolia%20for%20JavaScript%20(4.11.0)%3B%20Browser%20(lite)%3B%20instantsearch.js%20(4.57.0)%3B%20react%20(17.0.2)%3B%20react-instantsearch%20(7.1.0)%3B%20react-instantsearch-core%20(7.1.0)%3B%20next.js%20(12.1.6)%3B%20JS%20Helper%20(3.14.2)';

// the website url: https://www.xcite.com/ar-KW/mobile-phones/c
const XCITE_BASE_URL = 'https://www.xcite.com/ar-KW/';
const XCITE_PRODUCTS_URL = `https://jsv268mefd-1.algolianet.com/1/indexes/*/queries?x-algolia-agent=${xciteAlgoliaAgent}&x-algolia-api-key=${xciteApiKey}&x-algolia-application-id=${xciteAppId}`;

// Constants for extra API request parameters
// const XCITE_HITS_PER_PAGE = 60;
const XCITE_HITS_PER_PAGE = 96;


// xcite selectors
const xciteSelectors = {
    nextButton: ".secondaryOnLight",
    productUrl: ".mb-28 div > a",
    specification: "#specifications > div > div:nth-child(2) > div.flex.flex-col.sm\\:mx-0 > table > tbody >tr",
    productName: "h1",
    //specification: "",
    // .relative.w-full img:nth-child(2)
    photo: "#__next > main > div.flex.mx-auto.mb-11.md\\:mb-15.flex-col.sm\\:flex-row.xl\\:container > div:nth-child(1) > div > div> span >  img ",
    priceContainer: "div.flex-1 div > h3.mb-5",
    price: "div span:nth-child(2)",
    wasPrice: ".line-through",
    available: "div.flex.items-center > div .typography-small",
    brand: '.mb-2.sm\\:justify-start.gap-x-5.sm\\:gap-x-10 > h5',
    description: ".ProductOverview_list__8gYrU  ul li",
}

// abdulwahed selectors
const abdulwahedSelectors = {
    productUrl: ".product-item-info > a",
    brand: "div.pdp-brand-container > span:nth-child(2)",
    productName: ".product-info-main div h2",
    description: "div.product.attribute.overview > div > p",
    alternativeDescription: "div.product.attribute.overview > div > div",
    // .relative.w-full img:nth-child(2)
    photo: "div.fotorama__stage__frame.fotorama__active.fotorama_vertical_ratio.fotorama__loaded.fotorama__loaded--img > img",
    price: '.price-wrapper[data-price-type="finalPrice"]',
    wasPrice: '.price-wrapper[data-price-type="oldPrice"]',
    available: "div.product-info-price > div > div > h3 > span",
    Specification: "#product-attribute-specs-table > tbody > tr > td > table > tbody > tr",
}

// Almanea API constants
const ALMANEA_BASE_URL = 'https://www.almanea.sa';
// https://www.almanea.sa/mobiles-tablets-c-7423/mobiles-c-7424
const ALMANEA_PRODUCTS_URL = 'https://www.almanea.sa/api/category/pagination';
const ALMANEA_SINGLE_PRODUCT_URL = 'https://www.almanea.sa/_next/data/1715693284004/ar/product';
const NUMBER_OF_ITEM = 30;
const API_CATEGORY_ID = 7424;


// Extra API key and app ID
const extraApiKey = process.env.EXTRA_API_KEY;
const extraAppId = process.env.EXTRA_APP_ID;
const extraAlgoliaAgent = 'Algolia for JavaScript (4.5.1); Browser (lite)';

// the website url: https://www.extra.com/ar-sa/mobiles-tablets/mobiles/smartphone/c/2-212-3/facet/?q=:relevance:inStock:true&text=&pageSize=48&pg=2&sort=relevance
const EXTRA_BASE_URL = 'https://www.extra.com';
const EXTRA_PRODUCTS_URL = `https://ml6pm6jwsi-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=${extraAlgoliaAgent}&x-algolia-api-key=${extraApiKey}&x-algolia-application-id=${extraAppId}`;
const EXTRA_SINGLE_PRODUCT_URL = 'https://www.xcite.com/_next/data/XVlWTKDITsUA1CNdbHuMe/ar-KW/product/';

// Constants for extra API request parameters
const EXTRA_HITS_PER_PAGE = 96;
const EXTRA_OPTIONAL_FILTERS = '["sellingOutFastCities:SA-riyadh<score=5>","inStockCities:SA-riyadh<score=5>"]';
const EXTRA_FACET_FILTERS = '[["inStock:SA-riyadh_inStock"]]';
const EXTRA_FACETS = '["productFeaturesAr.*", "brandAr", "subFamilyAr", "rating","productStatusAr","price","offersFacet","inStock","hasFreeGifts","familyAr","deliveryFacet"]';
const EXTRA_INDEX_NAME = 'prod_sa_product_index';
const EXTRA_CATEGORY_FILTER = 'categories:2-212-3';

// temporary store IDs
const STORE = {
    ABDULWAHED: 1,
    XCITE: 2,
    EXTRA: 3,
    ALMANEA: 4,
}

// temporary category ID
const CATEGORY = {
    SMARTPHONE: 1,
    TABLET: 2,
}


export {
    ALMANEA_BASE_URL,
    ALMANEA_PRODUCTS_URL,
    abdulwahedBaseUrl,
    abdulwahedLabelDetail,
    ablduwahedLableInsertToDB,
    xciteBaseUrl,
    xciteLabelDetail,
    xciteLabelInsertToDB,
    allowedTypesAbdulwahed,
    allowedTypesXcite,
    EXTRA_BASE_URL,
    EXTRA_PRODUCTS_URL,
    xciteSelectors,
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
    EXTRA_SINGLE_PRODUCT_URL,
    XCITE_DETAILS_LABEL
}

