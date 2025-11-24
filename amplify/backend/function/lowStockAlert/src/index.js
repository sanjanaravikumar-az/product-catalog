const https = require('https');

const GRAPHQL_ENDPOINT = process.env.API_PRODUCTCATALOG_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_PRODUCTCATALOG_GRAPHQLAPIKEYOUTPUT;

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
        // Fetch all products
        const products = await fetchProducts();
        
        // Find low stock products (less than 5)
        const lowStockProducts = products.filter(product => 
            product.stock !== null && product.stock < 5
        );
        
        console.log(`Found ${lowStockProducts.length} low stock products`);
        
        if (lowStockProducts.length > 0) {
            console.log('Low stock products:', lowStockProducts.map(p => ({
                name: p.engword,
                stock: p.stock
            })));
        }
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Checked ${products.length} products, found ${lowStockProducts.length} low stock items`,
                lowStockProducts: lowStockProducts.map(p => ({
                    name: p.engword,
                    stock: p.stock
                }))
            })
        };
        
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
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
                'Content-Type': 'application/json',
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


