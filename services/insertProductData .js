import { Sequelize } from 'sequelize';
import Product from '../models/Product.js';
import ProductPhotos from '../models/ProductPhotos.js';
import ProductSpecifications from '../models/ProductSpecifications.js';
import ProductPrice from '../models/ProductPrice.js';
import { findOrCreateBrand } from '../utils/findBrand.js';

const { Op } = Sequelize;

export const insertProductData = async (productData) => {
    console.log("Category ID is: " + productData.categoryID);

    const transaction = await Product.sequelize.transaction();

    try {
        // Check if a product with the given URL already exists
        const existingProduct = await Product.findOne({
            where: { Url: productData.url },
            transaction
        });

        if (existingProduct) {
            console.log(`Product with URL ${productData.url} already exists. Checking price...`);

            // Fetch the latest price for the existing product
            const latestPrice = await ProductPrice.findOne({
                where: { Product_ID: existingProduct.id },
                transaction
            });

            // Compare prices and add new price row if different
            if (latestPrice.Price !== productData.price) {
                console.log(`Price for product ${existingProduct.id} has changed. Updating price...`);

                await ProductPrice.create({
                    Product_ID: existingProduct.id,
                    Price: productData.price,
                    WasPrice: productData.wasPrice,
                    Discount: (((productData.wasPrice - productData.price) / productData.wasPrice) * 100).toFixed(2),
                    Currency_ID:productData.currency , // Assuming USD, adjust based on your Currency IDs
                    Store_ID: productData.storeId,
                }, { transaction });
            } else {
                console.log(`Price for product ${existingProduct.id} is the same. No update needed.`);
            }

            await transaction.commit();
            return;
        }

        // Create new product if it does not exist
        const brandId = await findOrCreateBrand(productData.brand.toLowerCase()) ?? null;

        const product = await Product.create({
            Name: productData.productName,
            Description: JSON.stringify(productData.description),
            Url: productData.url,
            Category_ID: productData.categoryID,
            Available: productData.available,
            Brand_ID: brandId,
        }, { transaction });

        const photos = productData.photos.map(photoUrl => ({ Product_ID: product.id, Photo_URL: photoUrl }));
        const specifications = productData.specification.flatMap(spec =>
            Object.entries(spec).map(([key, value]) => ({
                Product_ID: product.id,
                Specification_Key: key,
                Specification_Value: value
            }))
        );

        await ProductPhotos.bulkCreate(photos, { transaction });
        await ProductSpecifications.bulkCreate(specifications, { transaction });

        await ProductPrice.create({
            Product_ID: product.id,
            Price: productData.price,
            WasPrice: productData.wasPrice,
            Discount: (((productData.wasPrice - productData.price) / productData.wasPrice) * 100).toFixed(2),
            Currency_ID: productData.currency, // Assuming USD, adjust based on your Currency IDs
            Store_ID: productData.storeId,
        }, { transaction });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.error('Error inserting product data:', error);
    }
};

export const goInsert = async (sampleProductData) => {
    for (const productData of sampleProductData) {
        await insertProductData(productData);
    }
};
