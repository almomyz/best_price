import { createHttpRouter, Dataset, log } from 'crawlee';
import { XCITE_PRODUCTS_URL, Currencies, XCITE_PRODUCTS_LABEL, XCITE_DETAILS_LABEL, XCITE_HITS_PER_PAGE, XCITE_BASE_URL, XCITE_SINGLE_PRODUCT_URL, STORE, CATEGORY } from '../utils/constants.js';
import { checkBuildID } from '../utils/cookieUtils.js';

export const xciteApiRouter = createHttpRouter();

let numberOfPages = 0;
let currentPage = 0;
let allProductsUrls = [];
let buildId = "XVlWTKDITsUA1CNdbHuMe";

// get data for all product 
xciteApiRouter.addHandler(XCITE_PRODUCTS_LABEL, async ({ request, sendRequest, log, addRequests }) => {

    const res = await sendRequest({
        url: request.url,
        method: 'POST',
        json: {
            requests: [
                {
                    indexName: "xcite_prod_kw_ar_main",
                    params: `analytics=true`
                        + `&analyticsTags=["Device_Type_Web_Desktop","Lang_AR"]`
                        + `&clickAnalytics=true`
                        + `&facetingAfterDistinct=true`
                        + `&facets=["*"]`
                        + `&highlightPostTag=__/ais-highlight__`
                        + `&highlightPreTag=__ais-highlight__`
                        + `&hitsPerPage=${XCITE_HITS_PER_PAGE}`
                        + `&maxValuesPerFacet=1000`
                        + `&page=${currentPage}`
                        + `&query=cd6b18ab-c46b-4d90-b9b3-736bd9af29a6`
                }
            ]
        },
        responseType: 'json'
    });

    const responseData = res.body.results[0];

    log.info(`fetch page ${currentPage + 1} of total ${responseData.nbPages}`);

    const products = responseData.hits;
    numberOfPages = responseData.nbPages;

    // in the first request check if the build id is valid or get new ones
    if (currentPage === 0) {
        const newBuildId = await checkBuildID(
            sendRequest,
            // request data to send
            { url: `${XCITE_SINGLE_PRODUCT_URL}/${buildId}/ar-KW/product/${products[0].slug}.json` },
            // page to get the build id from
            "https://www.xcite.com/ar-KW/contacts"
        );
        
        if (newBuildId) {
            buildId = newBuildId;
        }
    }

    // const productsUrls = products.map(product => `${XCITE_SINGLE_PRODUCT_URL}${product.slug}.json`);
    const productsUrls = products.map(product => {
        return {
            // TODO: make another one for arabic edit this: /ar-KW/product/
            productUrl: `${XCITE_SINGLE_PRODUCT_URL}/${buildId}/en-KW/product/${product.slug}.json`,
            fullUrl: `${XCITE_BASE_URL}${product.slug}/p`
        }
    });

    // // save all products urls
    allProductsUrls.push(...productsUrls);

    // add another request if there is a products
    if ((currentPage + 1) < numberOfPages) {
        currentPage++;
        await addRequests([
            {
                label: XCITE_PRODUCTS_LABEL,
                url: `${XCITE_PRODUCTS_URL}`,
                useExtendedUniqueKey: true,
                uniqueKey: `page_${currentPage}`,
            }
        ]);

    } else {

        await addRequests(
            allProductsUrls.map(url => ({
                label: XCITE_DETAILS_LABEL,
                url: url.productUrl,
                userData: { fullUrl: url.fullUrl }
            }))
        );

        log.info(`all products urls in API ${responseData.nbHits}`);
        log.info(`all products urls in queue ${allProductsUrls.length}`);
    }
});

// Function to extract necessary fields from the response
const extractProductData = (pro, url) => {
    const product = pro.pageProps.meta.product;

    return {
        productName: product.name,
        // loop and get only the image url from '_media_.image' array
        photos: product.media.map(image => image.src),
        url: url,
        price: product.price.value,
        wasPrice: product.price.valueUnmodified,
        currency: product.price.currency,
        available: (product.status === "InStock") ? true : false,
        // Splitting by newline and filtering out empty strings
        description: product.sections.quickOverview.content.details.content.split('\n').filter(Boolean),
        // Extracting label and value properties and creating a new array of objects
        specification: product.sections.specifications.attributes.map(attribute => {
            return { [attribute.label]: attribute.value }
        }),
        // brand: product.brand ? product.brand: 'other',
        brand: (product.brand != "") ? product.brand : "other",

        currency: Currencies.KWD,
        categoryID: CATEGORY.SMARTPHONE,
        storeId: STORE.XCITE,
    };
};


xciteApiRouter.addHandler(XCITE_DETAILS_LABEL, async ({ request, sendRequest }) => {
     log.info(`processing ${request.url}`);
    // const url = request.url;
    // const extractedString = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));

    const res = await sendRequest({ url: request.url, responseType: 'json' });

    // save the response products
    const product = extractProductData(res.body, request.userData.fullUrl);
    Dataset.pushData(product);
});
