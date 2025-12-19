/* Amplify Params - DO NOT EDIT
	API_PRODUCTCATALOG_GRAPHQLAPIENDPOINTOUTPUT
	API_PRODUCTCATALOG_GRAPHQLAPIIDOUTPUT
	API_PRODUCTCATALOG_GRAPHQLAPIKEYOUTPUT
	AUTH_PRODUCTCATALOG6E145452_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import { Handler } from 'aws-lambda';
import * as https from 'https';

interface Product {
    id: string;
    engword: string;
    stock: number | null;
    price?: number;
    category?: string;
}

interface LowStockResponse {
    message: string;
    lowStockProducts: Array<{
        name: string;
        stock: number | null;
    }>;
}

const GRAPHQL_ENDPOINT = process.env.API_PRODUCTCATALOG_GRAPHQLAPIENDPOINTOUTPUT!;
const GRAPHQL_API_KEY = process.env.API_PRODUCTCATALOG_GRAPHQLAPIKEYOUTPUT!;
const LOW_STOCK_THRESHOLD = parseInt(process.env.LOW_STOCK_THRESHOLD || '5');

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

export const handler: Handler = async (event: any): Promise<LowStockResponse> => {
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
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error checking stock:', errorMessage);
        console.error('Full error:', error);
        throw new Error(`Error checking stock: ${errorMessage}`);
    }
};

async function fetchProducts(): Promise<Product[]> {
    return new Promise<Product[]>((resolve, reject) => {
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
