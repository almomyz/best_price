// services/brandService.js
import Brand from '../models/Brand.js';

const findOrCreateBrand = async (brandName) => {
  try {
    const [brand, created] = await Brand.findOrCreate({
      where: { Name: brandName }
    });

    if (created) {
      console.log('A new brand was created:', brand.id);
    } else {
      console.log('Brand already exists:', brand.id);
    }

    return brand.id;
  } catch (error) {
    console.error('Error in findOrCreateBrand:', error);
    throw error;
  }
};



export { findOrCreateBrand };
