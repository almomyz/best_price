import { createPuppeteerRouter } from "crawlee";
import {
    abdulwahedLabelDetail,
    abdulwahedSelectors,
    CATEGORY,
    STORE,
} from "../utils/constants.js";

export const abdulwahedRouter = createPuppeteerRouter();

// get all url from page
abdulwahedRouter.addDefaultHandler(async ({ enqueueLinks, log }) => {
    log.info(`enqueueing new URLs`);

    await enqueueLinks({
        selector: abdulwahedSelectors.productUrl,
        label: abdulwahedLabelDetail,
    });

    log.info("done");
});

// get data for all product
abdulwahedRouter.addHandler(
    abdulwahedLabelDetail,
    async ({ request, page, log, pushData }) => {
        // await page.waitForNavigation({ waitUntil: "domcontentloaded" });
        log.info(`processing ${request.loadedUrl}`);
        try {
            const productData = await page.evaluate(
                (url, selectors, CATEGORY, STORE) => {

                    function convertTextToNumber(text) {
                        // Remove non-numeric characters
                        let cleanedText = text.split("‏");

                        // Replace comma with an empty string
                        cleanedText = cleanedText[1].split(".")[0].replace(",", "");

                        // Convert the cleaned text to a number
                        return parseFloat(cleanedText);
                    }

                    // Define an empty array to hold the image URLs
                    var photos = [];

                    // Select all the image elements within the fotorama__stage__frame class
                    const images = document.querySelectorAll(".fotorama__nav__frame--thumb img");
                    // Loop through each image element and extract the src attribute
                    images.forEach((img) => {
                        photos.push(img.src);
                    });


                    const productName =
                        document.querySelector(selectors.productName)?.textContent.trim() ??
                        null;
                    const brand =
                        document.querySelector(selectors.brand)?.textContent.trim() ?? null;
                    const priceElement = document.querySelector(selectors.price);
                    const price = priceElement
                        ? convertTextToNumber(priceElement.textContent.trim())
                        : 0;

                    let descriptionElements = document.querySelectorAll(selectors.description);

                    // If the primary selector doesn't find any elements, use the alternative selector
                    if (descriptionElements.length === 0) {
                        descriptionElements = document.querySelectorAll(selectors.alternativeDescription);
                    }

                    const description = Array.from(descriptionElements).flatMap((el) => {
                        // Get all the text content of the element, including its children
                        let textContent = el.innerText || el.textContent;

                        // Split the text content into an array of lines
                        let lines = textContent.split("\n");

                        // Initialize an array and add each line prefixed with a comma
                        let formattedArray = lines.map((line) => `,"${line.trim()}"`);

                        return formattedArray;
                    });


                    // Log the resulting array to the console

                    const categoryID = CATEGORY.SMARTPHONE;
                    const wasPriceElement = document.querySelector(selectors.wasPrice);
                    const wasPrice = wasPriceElement
                        ? convertTextToNumber(wasPriceElement.textContent.trim())
                        : null;
                    const storeId = STORE.ABDULWAHED;
                    //   const photo =
                    //     document.querySelector(selectors.photo)?.getAttribute("src") ??
                    //     null;
                    const available =
                        document.querySelector(selectors.available).textContent.trim() ===
                        "متوفر";
                    const createAt = new Date().toISOString();
                    const updateAt = new Date().toISOString();
                    const SpecificationRows = document.querySelectorAll(
                        selectors.Specification
                    );

                    const specification = Array.from(SpecificationRows).reduce((acc, element) => {
                        const tds = element.querySelectorAll("td");
                        if (tds.length === 2) {
                            const key = tds[0].textContent.trim();
                            const value = tds[1].textContent.trim();
                            acc[key] = value;
                        }
                        return acc;
                    }, {});

                    return {
                        productName,
                        url,
                        photos,
                        price,
                        wasPrice,
                        specification,
                        available,
                        brand,
                        storeId,
                        description,
                        createAt,
                        updateAt,
                        categoryID,
                    };
                },
                request.url,
                abdulwahedSelectors,
                CATEGORY,
                STORE
            ); // Pass request.url as an argument to page.evaluate

            await pushData(productData);
        } catch (error) {
            console.log(error);
        }
    }
);
