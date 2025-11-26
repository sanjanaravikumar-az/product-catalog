/* Amplify Params - DO NOT EDIT
	API_PRODUCTCATALOG_GRAPHQLAPIENDPOINTOUTPUT
	API_PRODUCTCATALOG_GRAPHQLAPIIDOUTPUT
	API_PRODUCTCATALOG_GRAPHQLAPIKEYOUTPUT
	AUTH_PRODUCTCATALOG6E145452_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const https = require('https');

const GRAPHQL_ENDPOINT = process.env.API_PRODUCTCATALOG_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_PRODUCTCATALOG_GRAPHQLAPIKEYOUTPUT;
const LOW_STOCK_THRESHOLD = parseInt(process.env.LOW_STOCK_THRESHOLD) || 5;

const listProductsQuery = `
  query ListProducts {
    listProducts {
      items {
        id
        engword
        stock
        price
        category
      }
    }
  }
`;

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    
    try {
        const products = await fetchProducts();
        const lowStockProducts = products.filter(product => 
            product.stock !== null && product.stock < LOW_STOCK_THRESHOLD
        );
        
        console.log(`Found ${lowStockProducts.length} low stock products`);
        
        return {
            message: `Checked ${products.length} products, found ${lowStockProducts.length} low stock items`,
            lowStockProducts: lowStockProducts.map(p => ({
                name: p.engword,
                stock: p.stock
            }))
        };
        
    } catch (error) {
        console.error('Error checking stock:', error.message);
        console.error('Full error:', error);
        throw new Error(`Error checking stock: ${error.message}`);
    }
};

async function fetchProducts() {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            query: listProductsQuery
        });
        
        const url = new URL(GRAPHQL_ENDPOINT);
        const options = {
            hostname: url.hostname,
            port: 443,
            path: url.pathname,
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-api-key': GRAPHQL_API_KEY,
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.errors) {
                        reject(new Error(response.errors[0].message));
                    } else {
                        resolve(response.data.listProducts.items || []);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.write(postData);
        req.end();
    });
}
