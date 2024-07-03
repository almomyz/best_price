import { createPuppeteerRouter, Dataset } from "crawlee";
import { xciteLabelDetail, xciteSelectors, STORE, CATEGORY } from "../utils/constants.js";
// import { insertProducts } from "../utils/mongooseUtils.js";

export const xciteRouter = createPuppeteerRouter();

xciteRouter.addDefaultHandler(async ({ enqueueLinks, log, page, infiniteScroll }) => {
    log.info(`enqueueing new URLs`);

   // await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 260000 });

    // await infiniteScroll({ buttonSelector: xciteSelectors.nextButton });

    await enqueueLinks({
        selector: xciteSelectors.productUrl,
        label: xciteLabelDetail,
    });

    log.info('Navigation and selector wait completed');
    log.info('Links enqueued');
    log.info("done");
});

xciteRouter.addHandler(xciteLabelDetail, async ({ request, page, log, pushData, infiniteScroll }) => {
    //  await page.waitForNavigation({ waitUntil: "load" });

    log.info(`processing ${request.loadedUrl}`);
    log.info(`processing ${request.loadedUrl.length}`);

    const productData = await page.evaluate(async (url, selectors, CATEGORY, STORE) => {
        // Define the clickShowMoreButton function within the browser context
        async function clickShowMoreButton(selector) {
            const showMoreButton = document.querySelector(selector);
            if (showMoreButton) {
                showMoreButton.click();
                // Wait for a short period to ensure the content is loaded
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        const productName = document.querySelector(selectors.productName)?.textContent ?? null;
        const priceContainer = document.querySelector(selectors.priceContainer);
        const priceElement = priceContainer.childElementCount ? priceContainer.querySelector(selectors.price) : priceContainer;
        const price = parseFloat(priceElement.textContent.replace(/[^\d.]/g, ''));
        const wasPriceElement = document.querySelector(selectors.wasPrice);
        const wasPrice = wasPriceElement ? parseFloat(wasPriceElement.textContent.replace(/[^\d.]/g, '')) : null;
        const description = Array.from(document.querySelectorAll(selectors.description)).map(el => el.textContent);
        const available = document.querySelector(selectors.available)?.textContent === 'In Stock';
        
        await clickShowMoreButton("#specifications > div > div:nth-child(2) > button");

        const SpecificationRows = document.querySelectorAll(selectors.specification);
        const specification = Array.from(SpecificationRows).reduce((acc, element) => {
            const tds = element.querySelectorAll("td");
            if (tds.length === 2) {
                const key = tds[0].textContent.trim();
                const value = tds[1].textContent.trim();
                acc[key] = value;
            }
            return acc;
        }, {});

        const brand = document.querySelector(selectors.brand)?.textContent ?? null;
        
        // Scroll the page to ensure lazy-loaded images are loaded
        // window.scrollTo(0, document.body.scrollHeight);
        // await new Promise(resolve => setTimeout(resolve, 2000));
        // window.scrollTo(0, 0);
        // await new Promise(resolve => setTimeout(resolve, 2000));

        // Extract the photo URLs
        let photos = [];
        const allPhoto = document.querySelectorAll('main noscript');

        allPhoto.forEach((element) => {
            var tempDiv = document.createElement('div');

            tempDiv.innerHTML = element.innerHTML;

            var imgSrc = tempDiv.querySelector('img').getAttribute('src');

            console.log(imgSrc);
            photos.push(imgSrc);
        });

        /*
        const images = document.querySelectorAll(selectors.photo);

        images.forEach((img) => {
            const src = img.getAttribute("src") || img.getAttribute("data-src");
            if (src) {
                photos.push(src);
            }
        });
        */

        return {
            productName,
            url,
            photos,
            price,
            wasPrice,
            description,
            available,
            specification,
            brand,
            storeId: STORE.XCITE,
            createAt: new Date().toISOString(),
            updateAt: new Date().toISOString(),
            categoryID: CATEGORY.SMARTPHONE
        };
    }, request.loadedUrl, xciteSelectors, CATEGORY, STORE);

    await pushData(productData);
    log.info(`Processed ${request.loadedUrl} successfully`);
});
