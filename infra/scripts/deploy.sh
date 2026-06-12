#!/bin/bash
# Deployment script for VPS BAZNAS
# Usage: ./infra/scripts/deploy.sh

set -e

echo "🚀 Deploying PPID BAZNAS Kab. Cianjur..."

# Pull latest images
docker compose -f docker-compose.prod.yml pull

# Run DB migrations
docker compose -f docker-compose.prod.yml run --rm web pnpm db:migrate

# Restart services with zero downtime
docker compose -f docker-compose.prod.yml up -d --remove-orphans

# Health check
sleep 5
curl -f https://ppid.baznas-cianjur.or.id/api/health || echo "⚠️  Health check failed"

echo "✅ Deployment complete"
