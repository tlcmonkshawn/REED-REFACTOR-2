# REED REFACTOR 2

## Docker Setup

### Build and Run Locally

```bash
# Build the Docker image
docker build -t reed-refactor-2 .

# Run the container
docker run -p 3000:3000 reed-refactor-2

# Or use docker-compose
docker-compose up
```

### Development

```bash
docker-compose up --build
```

## Hosting Options

### Recommended Platforms:

1. **Render** (Recommended for simplicity)
   - Free tier available
   - Automatic deployments from Git
   - Built-in Docker support
   - Easy environment variable management
   - URL: https://render.com

2. **Railway**
   - Excellent developer experience
   - Free tier with $5 credit/month
   - One-click deployments
   - Automatic HTTPS
   - URL: https://railway.app

3. **Fly.io**
   - Global edge deployment
   - Free tier available
   - Great for Docker containers
   - Fast worldwide distribution
   - URL: https://fly.io

4. **DigitalOcean App Platform**
   - Simple pricing
   - Auto-scaling
   - Built-in CI/CD
   - $5/month starter plan
   - URL: https://www.digitalocean.com/products/app-platform

5. **AWS (ECS/Fargate)**
   - Enterprise-grade
   - More complex setup
   - Pay-as-you-go pricing
   - Best for production workloads

6. **Google Cloud Run**
   - Serverless containers
   - Pay per request
   - Auto-scaling
   - Free tier available

7. **Azure Container Instances**
   - Simple container hosting
   - Integrated with Azure services
   - Pay-as-you-go

### Quick Start with Render:
1. Push your code to GitHub/GitLab
2. Connect your repository to Render
3. Select "Web Service"
4. Render will detect Docker and deploy automatically

## Database API

The project includes PostgreSQL database with REST API routes for external access.

### Database Information
- **Type**: PostgreSQL
- **Database**: `reed_refactor_2`
- **User**: `reed_user`
- **Port**: 5432 (internal)

### API Endpoints

All endpoints are available at: `https://reed-refactor-2.onrender.com/api/items`

#### GET /api/items
Get all items
```bash
curl https://reed-refactor-2.onrender.com/api/items
```

#### GET /api/items/:id
Get a specific item by ID
```bash
curl https://reed-refactor-2.onrender.com/api/items/1
```

#### POST /api/items
Create a new item
```bash
curl -X POST https://reed-refactor-2.onrender.com/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Item", "description": "This is a test"}'
```

#### PUT /api/items/:id
Update an existing item
```bash
curl -X PUT https://reed-refactor-2.onrender.com/api/items/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Item", "description": "Updated description"}'
```

#### DELETE /api/items/:id
Delete an item
```bash
curl -X DELETE https://reed-refactor-2.onrender.com/api/items/1
```

### Health Check
```bash
curl https://reed-refactor-2.onrender.com/health
```

