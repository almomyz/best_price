// sync.js
import sequelize from "../config/mySqlDB.js";
import Category from "../models/Category.js";
import Brand from "../models/Brand.js";
import Store from "../models/Store.js";
import Currency from "../models/Currency.js";
import Product from "../models/Product.js";
import ProductPhotos from "../models/ProductPhotos.js";
import ProductSpecifications from "../models/ProductSpecifications.js";
import ProductPrice from "../models/ProductPrice.js";

const syncDatabase = async () => {
    const categories = [
        {
            name: "Mobile Phones, Tablets & Accessories",
            subcategories: [
                { name: "Smartphones", photo: "smartphones.png" },
                { name: "Tablets", photo: "tablets.png" },
                { name: "Cases & Covers", photo: null },
                { name: "Chargers", photo: null },
                { name: "Screen Protectors", photo: null },
            ],
        },
        {
            name: "Computers & Laptops",
            subcategories: [
                { name: "Laptops", photo: "laptops.png" },
                { name: "Desktops", photo: null },
                { name: "Monitors", photo: null },
                { name: "Keyboards & Mice", photo: null },
                { name: "Accessories", photo: null },
            ],
        },
        {
            name: "Audio & Headphones",
            subcategories: [
                { name: "Headphones", photo: "headphones.png" },
                { name: "Earbuds", photo: null },
                { name: "Speakers", photo: null },
                { name: "Home Audio Systems", photo: null },
            ],
        },
        {
            name: "Cameras & Photography",
            subcategories: [
                { name: "Digital Cameras", photo: "cameras.png" },
                { name: "Lenses", photo: null },
                { name: "Tripods", photo: null },
                { name: "Memory Cards", photo: null },
            ],
        },
        {
            name: "Wearable Technology",
            subcategories: [
                { name: "Smartwatches", photo: "smartwatches.png" },
                { name: "Fitness Trackers", photo: null },
                { name: "Smart Glasses", photo: null },
            ],
        },
    ];
    try {
        await sequelize.sync({ force: true });
        // Create the parent category
        // Create the parent category "Electronics"
        const parentCategory = await Category.create({
            Name: "Electronics",
            Image: "electronics.svg", // or you can provide an image URL if available
        });

        // Get the ID of the newly created parent category
        const parentCategoryId = parentCategory.id;

        // Function to create a subcategory
        async function createSubcategory(name, parentCategoryId, imagePath) {
            const subcategory = await Category.create({
                Name: name,
                Image: imagePath,
                Parent_Category_ID: parentCategoryId,
            });
            return subcategory.id;
        }

        // Create subcategories under "Electronics" and their children

        // Create the categories and subcategories
        for (const category of categories) {
            const categoryId = await createSubcategory(
                category.name,
                parentCategoryId,
                null
            );
            for (const subcategory of category.subcategories) {
                await createSubcategory(
                    subcategory.name,
                    categoryId,
                    subcategory.photo
                );
            }
        }

        // Insert sample brands
        // await Brand.bulkCreate([
        //     { Name: 'أبل', Image: 'https://www.example.com/apple.jpg' },
        //     { Name: 'سامسونج', Image: 'https://www.example.com/samsung.jpg' },
        //     { Name: 'هواوي', Image: 'https://www.example.com/sony.jpg' },
        //     { Name: 'هونر', Image: 'https://www.example.com/lg.jpg' },
        //     { Name: 'ريلمي', Image: 'https://www.example.com/dell.jpg' },
        //     { Name: 'فيفو', Image: 'https://www.example.com/dell.jpg' },
        //     { Name: 'شاومي ', Image: 'https://www.example.com/dell.jpg' }
        // ]);

        // Insert sample stores
        await Store.bulkCreate([
            {
                Name: "almanea",
                // Logo: "https://firebasestorage.googleapis.com/v0/b/mlproject-60be1.appspot.com/o/photo_2024-05-29_14-36-22-removebg-preview.png?alt=media&token=5d0f12ba-2c6f-4825-b24c-242916ef70ce",
                Logo: "almanea-logo.svg",
            },
            {
                Name: "abdulwahed",
                // Logo: "https://firebasestorage.googleapis.com/v0/b/mlproject-60be1.appspot.com/o/aaaw_logo_1_ar__1_-removebg-preview.png?alt=media&token=b1e36cbf-ec2e-4289-93c4-4b397d9609b7",
                Logo: "abdulwahed-logo-en.svg",
            },
            {
                Name: "extra",
                // Logo: "https://firebasestorage.googleapis.com/v0/b/mlproject-60be1.appspot.com/o/photo_2024-05-29_14-38-16-removebg-preview.png?alt=media&token=bf0917b9-2f73-4940-9470-4d41d0838b14",
                Logo: "extra-logo.svg",
            },
            {
                Name: "xcite",
                // Logo: "https://firebasestorage.googleapis.com/v0/b/mlproject-60be1.appspot.com/o/photo_2024-05-29_14-38-12.jpg?alt=media&token=ea886d5d-6bfb-46cb-bada-03bd478bd208",
                Logo: "xcite-logo-en.svg",
            },
        ]);

        // Insert sample currency
        await Currency.bulkCreate([
            { Name: "SAR" },
            { Name: "KWD" },
            { Name: "USD" },
        ]);
        console.log("Database & tables created!");
    } catch (err) {
        console.error("Error creating database & tables:", err);
    }
};

syncDatabase();
