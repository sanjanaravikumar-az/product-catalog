const https = require('https');

const GRAPHQL_ENDPOINT = process.env.API_PRODUCTCATALOG_GRAPHQLAPIENDPOINTOUTPUT || 'https://5bbxkhstfrcofl3uihzbbc4jaq.appsync-api.us-east-1.amazonaws.com/graphql';
const GRAPHQL_API_KEY = process.env.API_PRODUCTCATALOG_GRAPHQLAPIKEYOUTPUT || 'da2-5plr4677q5gvpfuldjzeq3p5te';

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
    console.log(`GRAPHQL_ENDPOINT: ${GRAPHQL_ENDPOINT}`);
    console.log(`GRAPHQL_API_KEY: ${GRAPHQL_API_KEY ? 'SET' : 'NOT SET'}`);
    
    if (!GRAPHQL_ENDPOINT || !GRAPHQL_API_KEY) {
        console.error('Missing environment variables');
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Missing GraphQL configuration' })
        };
    }
    
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


