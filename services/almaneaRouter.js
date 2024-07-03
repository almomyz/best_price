import { createBasicRouter, Dataset } from "crawlee";
import { checkBuildID, getNewCookies } from "../utils/cookieUtils.js";
import {
    ALMANEA_PRODUCTS_URL,
    ALMANEA_SINGLE_PRODUCT_URL,
    STORE,
    CATEGORY,
    API_CATEGORY_ID,
    NUMBER_OF_ITEM,
    ALMANEA_BASE_URL,
    ALMANEA_PRODUCTS_LABEL,
    ALMANEA_DETAILS_LABEL,
    Currencies,
} from "../utils/constants.js";

export const almaneaRouter = createBasicRouter();

let currentPage = 0;
let allProductsUrls = [];
let buildId = 1716563035314;

// get data for all product
almaneaRouter.addHandler(
    ALMANEA_PRODUCTS_LABEL,
    async ({
        request,
        sendRequest,
        log,
        addRequests,
        enqueueLinks,
        session,
    }) => {
        log.info(`processing ${request.url}`);
        log.info(`currentPage ${currentPage}`);

        log.info(`User data: ${session.userData.cookies}`);

        const res = await sendRequest({
            url: request.url,
            method: "POST",
            json: {
                pageNo: currentPage,
                pageSize: NUMBER_OF_ITEM,
                categoryID: API_CATEGORY_ID,
                currentSortFilterKeys: "sortBy=position&sortDir=ASC&",
            },
            headers: {
                accept: "application/json, text/plain, */*",
                "content-type": "application/json",
                cookie: session.userData.cookies,
            },
            responseType: "json",
        });

        if (res.statusCode === 500) {
            console.warn(
                "Internal server error, refreshing cookies and retrying..."
            );
            // TODO: make it using PuppeteerCrawler instead on Puppeteer
            session.userData.cookies = await getNewCookies();
            throw new Error(
                "Internal server error, refreshing cookies and retrying..."
            );
        }

        const { products, pageParam, pages } = res.body;

        if (currentPage === 0) {
            const newBuildId = await checkBuildID(
                sendRequest,
                // request data to send
                {
                    url: `${ALMANEA_SINGLE_PRODUCT_URL}/${buildId}/en/product/${products[0]._source.rewrite_url}.json`,
                    headers: { cookie: session.userData.cookies },
                },
                // page to get the build id from
                "https://www.almanea.sa/static/about"
            );

            if (newBuildId) {
                buildId = newBuildId;
            }
        }

        // TODO: and another one for arabic just change: /en/ to /ar/
        // const productsUrls = products.map(product => `${ALMANEA_SINGLE_PRODUCT_URL}/${product._source.rewrite_url}.json`);
        const productsUrls = products.map(
            (product) =>
                `${ALMANEA_SINGLE_PRODUCT_URL}/${buildId}/en/product/${product._source.rewrite_url}.json`
        );

        // save all products urls
        allProductsUrls.push(...productsUrls);

        // add another request if there is a products
        console.log(pages, pageParam);

        if (pageParam != pages) {
            console.log("there is pro");
            currentPage++;
            await addRequests([
                {
                    label: ALMANEA_PRODUCTS_LABEL,
                    url: `${ALMANEA_PRODUCTS_URL}`,
                    useExtendedUniqueKey: true,
                    uniqueKey: `page_${pageParam}`,
                },
            ]);
        } else {
            // when completing getting all products urls then go to extract product details
            await enqueueLinks({
                urls: allProductsUrls,
                label: ALMANEA_DETAILS_LABEL,
            });
        }
    }
);

// Function to extract necessary fields from the response
const extractProductData = (pro) => {
    const product = pro.pageProps.product;

    return {
        productName: product.name[0],
        // loop and get only the image url from '_media_.image' array
        photos: product._media_.image.map((image) => image.image),
        url: `${ALMANEA_BASE_URL}/product/${product.rewrite_url}`,
        price: product.prices_with_tax.price,
        wasPrice: product.prices_with_tax.original_price,
        available: product.stock.is_in_stock,
        description: product.short_description
            ? product.short_description
            : null,
        // Extracting label and value properties and creating a new array of objects
        /*
        specification: product.product_attributes.flatMap(attribute => {
            return Object.values(attribute).map(item => ({
                [item.label]: item.value,
            }));
        }),
        */
        // TODO: to get the arabic specific attributes use ["14"] instead of ["2"]
        specification: product.product_attributes.map((attribute) => ({
            [attribute["2"].label]: attribute["2"].value,
        })),
        brand: product.option_text_brand[0],
        categoryID: CATEGORY.SMARTPHONE,
        storeId: STORE.ALMANEA,
        currency: Currencies.SAR,
    };
};

almaneaRouter.addHandler(
    ALMANEA_DETAILS_LABEL,
    async ({ request, sendRequest, session }) => {
        console.log(request.url);

        const res = await sendRequest({
            url: request.url,
            headers: {
                accept: "application/json, text/plain, */*",
                "content-type": "application/json",
                cookie: session.userData.cookies,
            },
            responseType: "json",
        });

        // save the response products
        const body = res.body;
        const product = extractProductData(body);
        Dataset.pushData(product);
    }
);
