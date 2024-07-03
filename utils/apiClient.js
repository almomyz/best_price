import axios from 'axios';
import { EXTRA_PRODUCTS_URL, EXTRA_HITS_PER_PAGE, EXTRA_OPTIONAL_FILTERS, EXTRA_FACET_FILTERS, EXTRA_FACETS, EXTRA_INDEX_NAME, EXTRA_CATEGORY_FILTER } from './constants.js';

// Helper function to build request data for a given page
const buildRequestData = (page) => ({
    requests: [
        {
            indexName: EXTRA_INDEX_NAME,
            query: '',
            params: `optionalFilters=${EXTRA_OPTIONAL_FILTERS}`
                + `&facetFilters=${EXTRA_FACET_FILTERS}`
                + `&facets=${EXTRA_FACETS}`
                + `&hitsPerPage=${EXTRA_HITS_PER_PAGE}&page=${page}&getRankingInfo=1&clickAnalytics=true&filters=${EXTRA_CATEGORY_FILTER}`
        },
        {
            indexName: EXTRA_INDEX_NAME,
            query: '',
            params: `hitsPerPage=${EXTRA_HITS_PER_PAGE}&responseFields=["facets"]&facets=inStock&filters=${EXTRA_CATEGORY_FILTER}`,
        },
    ],
});

// Function to fetch data for a specific page from the API
const fetchPageData = async (page) => {
    try {
        const response = await axios.post(EXTRA_PRODUCTS_URL, buildRequestData(page));
        const responseData = response.data.results[0];

        console.log(`fetch page ${page+1} of total ${responseData.nbPages}`);

        return {
            hits: responseData.hits,
            numberOfHits: responseData.nbHits,
            numberOfPages: responseData.nbPages,
        };
    } catch (error) {
        console.error('Error fetching data from API:', error.message);
        throw new Error('Error fetching data from API');
    }
};

export { fetchPageData };
