# Product Catalog Service - Setup Guide

A modern React + TypeScript product catalog application built with AWS Amplify, featuring real-time inventory management, image uploads, and low stock alerts.

## 🏗️ Architecture Overview

This application uses:
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: AWS Amplify (AppSync GraphQL API)
- **Database**: DynamoDB (via Amplify)
- **Authentication**: Amazon Cognito
- **Storage**: Amazon S3 (for product images)
- **Functions**: AWS Lambda (for low stock alerts)
- **UI Components**: AWS Amplify UI React

## 📋 Prerequisites

Before setting up this service, ensure you have:

- **Node.js** (v18 or later)
- **npm** or **yarn** package manager
- **AWS Account** with appropriate permissions
- **AWS CLI** configured with your credentials
- **Amplify CLI** installed globally

### Install Required Tools

```bash
# Install Node.js (if not already installed)
# Download from https://nodejs.org/

# Install AWS CLI
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# Configure AWS CLI
aws configure

# Install Amplify CLI globally
npm install -g @aws-amplify/cli

# Configure Amplify CLI
amplify configure
```

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd product-catalog

# Install dependencies
npm install
```

### 2. Initialize Amplify Backend

```bash
# Initialize Amplify in your project
amplify init

# Follow the prompts:
# - Project name: product-catalog
# - Environment name: dev (or your preferred environment)
# - Default editor: Visual Studio Code (or your preferred editor)
# - App type: javascript
# - Javascript framework: react
# - Source Directory Path: src
# - Distribution Directory Path: dist
# - Build Command: npm run build
# - Start Command: npm run dev
```

### 3. Deploy Backend Services

```bash
# Deploy all backend resources
amplify push

# This will create:
# - GraphQL API (AppSync)
# - Authentication (Cognito)
# - Storage (S3 bucket)
# - Lambda function for low stock alerts
```

### 4. Start Development Server

```bash
# Start the development server
npm run dev

# The application will be available at http://localhost:5173
```

## 🔧 Backend Configuration

### GraphQL Schema

The application uses the following GraphQL schema located in `amplify/backend/api/productcatalog/schema.graphql`:

```graphql
type Product @model @auth(rules: [{ allow: private, provider: identityPool }]) {
  id: ID!
  serialno: Int!
  engword: String!
  price: Float
  category: String
  description: String
  stock: Int
  brand: String
  imageKey: String
  images: [String]
}
```

### AWS Services Created

1. **AppSync GraphQL API**
   - Endpoint for CRUD operations on products
   - Real-time subscriptions support
   - API Key and IAM authentication

2. **Amazon Cognito**
   - User authentication and authorization
   - Email-based signup/signin
   - Password policies and MFA support

3. **Amazon S3**
   - Product image storage
   - Secure file uploads with pre-signed URLs

4. **AWS Lambda**
   - Low stock alert function
   - Automated inventory monitoring

5. **Amazon DynamoDB**
   - Product data storage
   - Auto-scaling enabled

## 🎯 Features

### Core Functionality
- ✅ **Product Management**: Create, read, update, delete products
- ✅ **Image Upload**: Upload and display product images
- ✅ **Search & Filter**: Search by name, filter by category
- ✅ **Sorting**: Sort by name, price, or stock level
- ✅ **Authentication**: Secure user login/logout
- ✅ **Responsive Design**: Works on desktop and mobile

### Advanced Features
- ✅ **Low Stock Alerts**: Visual alerts for products with < 5 items
- ✅ **Stock Reports**: Download CSV reports of low stock items
- ✅ **Real-time Updates**: Live data synchronization
- ✅ **Form Validation**: Client-side validation for all inputs
- ✅ **Loading States**: Smooth loading indicators

## 📱 Usage Guide

### Adding Products
1. Click "✨ Add Product" button
2. Fill in the product details:
   - **Serial Number**: Unique identifier (required)
   - **Product Name**: Display name (required)
   - **Price**: Product price in USD
   - **Category**: Select from predefined categories
   - **Brand**: Product brand/manufacturer
   - **Stock**: Current inventory count
   - **Description**: Product description
   - **Image**: Upload product photo
3. Click "✨ Create Product"

### Managing Inventory
- **Edit Products**: Click "✏️ Edit" on any product card
- **Delete Products**: Click "🗑️ Delete" on any product card
- **Monitor Stock**: Low stock items (< 5) show warning badges
- **Download Reports**: Click "📄 Download Report" for CSV export

### Search and Filter
- **Search**: Type in the search box to find products by name
- **Filter**: Select category from dropdown to filter results
- **Sort**: Choose sorting option (name, price, stock)

## 🔐 Authentication Setup

The app uses Amazon Cognito for authentication:

### User Registration
- Users sign up with email and password
- Email verification required
- Password must be at least 8 characters

### User Management
```bash
# View users in Cognito console
amplify console auth

# Or via AWS CLI
aws cognito-idp list-users --user-pool-id <your-user-pool-id>
```

## 📊 Monitoring and Logs

### View Application Logs
```bash
# View API logs
amplify console api

# View function logs
amplify console function
```

### CloudWatch Monitoring
- API request metrics
- Lambda function performance
- Error rates and latency

## 🛠️ Development

### Project Structure
```
product-catalog/
├── src/
│   ├── components/          # React components
│   ├── graphql/            # GraphQL queries/mutations
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── amplify/
│   ├── backend/            # Amplify backend configuration
│   │   ├── api/           # GraphQL API configuration
│   │   ├── auth/          # Authentication configuration
│   │   ├── function/      # Lambda functions
│   │   └── storage/       # S3 storage configuration
│   └── team-provider-info.json
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

### Available Scripts
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Amplify
amplify status       # Check backend status
amplify push         # Deploy backend changes
amplify pull         # Pull backend changes
amplify console      # Open Amplify console
```

### Environment Variables
The application automatically uses Amplify-generated configuration files:
- `src/amplifyconfiguration.json` - Amplify configuration
- `src/aws-exports.js` - AWS service endpoints

## 🚀 Deployment

### Deploy to Amplify Hosting
```bash
# Add hosting
amplify add hosting

# Choose Amplify Console hosting
# Deploy
amplify publish
```

### Manual Deployment
```bash
# Build the application
npm run build

# Deploy to your preferred hosting service
# Upload the contents of the 'dist' folder
```

## 🔧 Troubleshooting

### Common Issues

**1. Authentication Errors**
```bash
# Clear local auth cache
amplify auth remove
amplify auth add
amplify push
```

**2. GraphQL Schema Changes**
```bash
# After modifying schema.graphql
amplify push
# Regenerate GraphQL code
amplify codegen
```

**3. Storage Permission Issues**
```bash
# Check S3 bucket policies
amplify console storage
```

**4. Lambda Function Errors**
```bash
# View function logs
amplify console function
# Check CloudWatch logs for detailed error messages
```

### Debug Mode
```bash
# Enable debug logging
export DEBUG=amplify*
npm run dev
```

## 📚 Additional Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)
- [AWS Amplify UI React](https://ui.docs.amplify.aws/)

## 🤝 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review AWS Amplify documentation
3. Check CloudWatch logs for detailed error messages
4. Contact your development team

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.