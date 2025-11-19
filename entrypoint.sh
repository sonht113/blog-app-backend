#!/bin/sh
set -e

# Ensure runtime DATABASE_URL is provided
if [ -z "${DATABASE_URL:-}" ]; then
  echo "❌ ERROR: DATABASE_URL is not set. Exiting."
  exit 1
fi

echo "🚀 Starting NestJS application..."
echo "⏳ Waiting for database readiness and applying migrations..."

# Try to deploy migrations; retry until DB ready / migrations succeed
retry=0
max=30
until npx prisma migrate deploy --schema=prisma/schema.prisma 2>/dev/null || [ $retry -ge $max ]; do
  retry=$((retry+1))
  echo "🔄 Database not ready yet (attempt $retry/$max). Sleeping 2s..."
  sleep 2
done

if [ $retry -ge $max ]; then
  echo "❌ ERROR: Database did not become ready in time."
  exit 1
fi

echo "✅ Migrations applied successfully!"
echo "🎯 Starting NestJS application..."
exec node dist/main.js