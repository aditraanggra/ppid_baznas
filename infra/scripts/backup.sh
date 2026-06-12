#!/bin/bash
# Daily backup script — run via cron: 0 2 * * * /path/to/backup.sh
set -e

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/ppid-baznas"
mkdir -p "$BACKUP_DIR"

echo "📦 Backing up PostgreSQL database..."
docker exec ppid_postgres pg_dump -U ppid_user ppid_baznas | \
  gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

echo "📦 Backing up MinIO files..."
docker exec ppid_minio mc mirror /data "$BACKUP_DIR/minio_$DATE" 2>/dev/null || true

# Keep only last 30 days of backups
find "$BACKUP_DIR" -name "*.gz" -mtime +30 -delete

echo "✅ Backup complete: $BACKUP_DIR"
