// import fs from 'fs';
// import path from 'path';

// BEFORE USING got MUST DO: npm install got@9.6.0
import got from 'got';

// get filepath to data directory
// const dataDirectory = path.join(process.cwd(), 'data');

// define URL for rest endpoint
const dataURL = "https://dev-nleal-cs5513.pantheonsite.io/wp-json/twentytwentyfive-child/v1/articles";



export async function getSortedArticlesData() {
    // Get file path of posts
    // const filePath = path.join(dataDirectory, 'posts.json');

    // Read all data in the file
    // const jsonString = fs.readFileSync(filePath, 'utf-8');
    let jsonString;
    try {
        // next line use got snchronously to retrieve cia https our json data from wp site
        jsonString = await got(dataURL);
        console.log('Articles endpoint response:', jsonString.body);
    } catch (error) {
        console.error('Error fetching articles from endpoint:', error.message);
        // Return empty array if endpoint fails
        return [];
    }

    // Check if response body is empty or invalid
    if (!jsonString || !jsonString.body) {
        console.warn('Articles endpoint returned empty or invalid response');
        return [];
    }

    let jsonObject;
    try {
        // Parse json data into an object value
        jsonObject = JSON.parse(jsonString.body);
    } catch (parseError) {
        console.error('Error parsing articles JSON:', parseError.message);
        console.error('Response body:', jsonString.body);
        return [];
    }

    // Check if parsed data is an array and not empty
    if (!Array.isArray(jsonObject)) {
        console.warn('Articles endpoint did not return an array:', typeof jsonObject);
        return [];
    }

    if (jsonObject.length === 0) {
        console.warn('Articles endpoint returned empty array');
        return [];
    }

    // Sort all data based on title properties
    jsonObject.sort(function (a, b) {
        const titleA = a.post_title ?? a.name ?? '';
        const titleB = b.post_title ?? b.name ?? '';
        return titleA.localeCompare(titleB);
    });

    console.log(`Successfully processed ${jsonObject.length} articles`);

    // Return reconfigured array organized by id converted to a string
    return jsonObject.map(item => {
        return {
            // id: item.id.toString(),
            id: item.ID.toString(),
            title: item.post_title ?? 'Untitled',
            date: item.post_date ?? '',
            // Keep additional fields for potential future use
            featured_image: item.featured_image,
            featured_image_description: item.featured_image_description,
            section_1_title: item.section_1_title,
            section_1_description: item.section_1_description,
            section_2_title: item.section_2_title,
            section_2_description: item.section_2_description,
            section_3_title: item.section_3_title,
            section_3_description: item.section_3_description,
            section_4_title: item.section_4_title,
            section_4_description: item.section_4_description,
            section_5_title: item.section_5_title,
            section_5_description: item.section_5_description,
            secondary_image: item.secondary_image,
            secondary_image_description: item.secondary_image_description,
        }
    });
}

export async function getAllPostIds() {
    // Get file path of posts
    // const filePath = path.join(dataDirectory, 'posts.json');

    // Read all data in the file
    // const jsonString = fs.readFileSync(filePath, 'utf-8');

    let jsonString;
    try {
        // next line use got snchronously to retrieve cia https our json data from wp site
        jsonString = await got(dataURL);
        console.log('Articles endpoint response (getAllPostIds):', jsonString.body);
    } catch (error) {
        console.error('Error fetching articles from endpoint (getAllPostIds):', error.message);
        return [];
    }

    if (!jsonString || !jsonString.body) {
        console.warn('Articles endpoint returned empty or invalid response (getAllPostIds)');
        return [];
    }

    let jsonObject;
    try {
        // Parse json data into an object value
        jsonObject = JSON.parse(jsonString.body);
    } catch (parseError) {
        console.error('Error parsing articles JSON (getAllPostIds):', parseError.message);
        return [];
    }

    if (!Array.isArray(jsonObject) || jsonObject.length === 0) {
        console.warn('Articles endpoint returned empty or non-array response (getAllPostIds)');
        return [];
    }

    // Return reconfigured array organized by id converted to a string
    return jsonObject.map(item => {
        return {
            params: {
                //id: item.id.toString()
                id: item.ID.toString()
            }
        }
    });
}

export async function getPostData(id) {
    // Get file path of posts
    // const filePath = path.join(dataDirectory, 'posts.json');

    // Read all data in the file
    // const jsonString = fs.readFileSync(filePath, 'utf-8');

    let jsonString;
    try {
        // next line use got snchronously to retrieve cia https our json data from wp site
        jsonString = await got(dataURL);
        console.log('Articles endpoint response (getPostData):', jsonString.body);
    } catch (error) {
        console.error('Error fetching articles from endpoint (getPostData):', error.message);
        return {
            id,
            title: 'Not found',
            date: 'Not found',
            featured_image: 'Not found',
            featured_image_description: 'Not found',
            section_1_title: 'Not found',
            section_1_description: 'Not found',
            section_2_title: 'Not found',
            section_2_description: 'Not found',
            section_3_title: 'Not found',
            section_3_description: 'Not found',
            section_4_title: 'Not found',
            section_4_description: 'Not found',
            section_5_title: 'Not found',
            section_5_description: 'Not found',
            secondary_image: 'Not found',
            secondary_image_description: 'Not found',
        };
    }

    if (!jsonString || !jsonString.body) {
        console.warn('Articles endpoint returned empty or invalid response (getPostData)');
        return {
            id,
            title: 'Not found',
            date: 'Not found',
            featured_image: 'Not found',
            featured_image_description: 'Not found',
            section_1_title: 'Not found',
            section_1_description: 'Not found',
            section_2_title: 'Not found',
            section_2_description: 'Not found',
            section_3_description: 'Not found',
            section_4_title: 'Not found',
            section_4_description: 'Not found',
            section_5_title: 'Not found',
            section_5_description: 'Not found',
            secondary_image: 'Not found',
            secondary_image_description: 'Not found',
        };
    }

    let jsonObject;
    try {
        // Parse json data into an object value
        jsonObject = JSON.parse(jsonString.body);
    } catch (parseError) {
        console.error('Error parsing articles JSON (getPostData):', parseError.message);
        return {
            id,
            title: 'Not found',
            date: 'Not found',
            featured_image: 'Not found',
            featured_image_description: 'Not found',
            section_1_title: 'Not found',
            section_1_description: 'Not found',
            section_2_title: 'Not found',
            section_2_description: 'Not found',
            section_3_title: 'Not found',
            section_3_description: 'Not found',
            section_4_title: 'Not found',
            section_4_description: 'Not found',
            section_5_title: 'Not found',
            section_5_description: 'Not found',
            secondary_image: 'Not found',
            secondary_image_description: 'Not found',
        };
    }

    if (!Array.isArray(jsonObject)) {
        console.warn('Articles endpoint did not return an array (getPostData)');
        return {
            id,
            title: 'Not found',
            date: 'Not found',
            featured_image: 'Not found',
            section_1_title: 'Not found',
            section_1_description: 'Not found',
            section_2_title: 'Not found',
            section_2_description: 'Not found',
            section_3_description: 'Not found',
            section_4_title: 'Not found',
            section_4_description: 'Not found',
            section_5_title: 'Not found',
            section_5_description: 'Not found',
        };
    }

    // Find single object value corresponding to the id value using the built in filter array object
    const objectReturned = jsonObject.filter(object => {
        // return object.id.toString() === id;
        return object.ID.toString() === id;
    });

    if (objectReturned.length === 0) {
        console.warn(`Article with id ${id} not found`);
        return {
            id,
            title: 'Not found',
            date: 'Not found',
            featured_image: 'Not found',
            featured_image_description: 'Not found',
            section_1_title: 'Not found',
            section_1_description: 'Not found',
            section_2_title: 'Not found',
            section_2_description: 'Not found',
            section_3_description: 'Not found',
            section_4_title: 'Not found',
            section_4_description: 'Not found',
            section_5_title: 'Not found',
            section_5_description: 'Not found',
            secondary_image: 'Not found',
            secondary_image_description: 'Not found',
        };
    }

    const article = objectReturned[0];

    return {
        id: article.ID ? article.ID.toString() : id,
        title: article.post_title ?? 'Untitled',
        date: article.post_date ?? '',
        featured_image: article.featured_image ?? '',
        featured_image_description: article.featured_image_description ?? '',
        section_1_title: article.section_1_title ?? '',
        section_1_description: article.section_1_description ?? '',
        section_2_title: article.section_2_title ?? '',
        section_2_description: article.section_2_description ?? '',
        section_3_title: article.section_3_title ?? '',
        section_3_description: article.section_3_description ?? '',
        section_4_title: article.section_4_title ?? '',
        section_4_description: article.section_4_description ?? '',
        section_5_title: article.section_5_title ?? '',
        section_5_description: article.section_5_description ?? '',
        secondary_image: article.secondary_image ?? '',
        secondary_image_description: article.secondary_image_description ?? '',
    };
}
