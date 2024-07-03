// Function to convert text to number
function convertTextToNumber(text) {
    // Clean the text to extract the number
    const cleanedText = text.split("‏")[1].split(".")[0].replace(",", "");
    return parseFloat(cleanedText);
}

// Function to extract image URLs from the script tag
function extractImageUrls(scriptTagContent) {
    // Parse JSON content inside the script tag
    const imageData = JSON.parse(scriptTagContent);
    return imageData['[data-gallery-role=gallery-placeholder]']['mage/gallery/gallery']['data'].map(item => item['img']);
}

// Function to extract product description
function extractDescription($, selector) {
    const description = [];
    $(selector).each((i, element) => {
        const $element = $(element);
        // Select p and div tags with right-aligned text
        // TODO: add this for arabic languages
        // const elements = $element.find('p[style="text-align: right;"], div[style="text-align: right;"]');
        const elements = $element.find('p, div');
        elements.each((i, el) => {
            // Replace <br> tags with newline characters
            $(el).find('br').replaceWith('\n');
            // Split the text by newline, trim whitespace, and filter out empty lines
            const text = $(el).text().split('\n').map(line => line.trim()).filter(line => line);
            description.push(...text);
        });
    });
    return description;
}

// Function to extract product specifications
function extractSpecification($, selector) {
    const specification = [];
    $(selector).each((index, element) => {
        const tds = $(element).find("td");
        if (tds.length === 2) {
            const key = $(tds[0]).text().trim();
            const value = $(tds[1]).text().trim();
            specification.push({ [key]: value });
        }
    });
    return specification;
}


export {convertTextToNumber, extractImageUrls, extractDescription, extractSpecification}