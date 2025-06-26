#!/usr/bin/env bash

if [ ! -f .env ]; then
  echo "[ERROR] .env file not found"
  exit 1
fi

set -o allexport
source .env
set +o allexport

echo "[SUCCESS] Loaded environment variables from .env"

COMMIT_TS=$(date +%F_%T)
if git diff-index --quiet HEAD --; then
  echo "[INFO] No changes to commit"
else
  git add .
  if [ $? -ne 0 ]; then
    echo "[ERROR] git add failed"
    exit 1
  fi
  echo "[SUCCESS] git add completed"

  git commit -m "Auto-backup $COMMIT_TS"
  if [ $? -ne 0 ]; then
    echo "[ERROR] git commit failed"
    exit 1
  fi
  echo "[SUCCESS] git commit completed"
fi

git push origin main
if [ $? -ne 0 ]; then
  echo "[ERROR] git push failed"
  exit 1
fi
echo "[SUCCESS] git push completed"

BACKUP_DIR="/opt/backups"
if mkdir -p "$BACKUP_DIR"; then
  echo "[SUCCESS] Created directory $BACKUP_DIR"
else
  echo "[ERROR] Failed to create directory $BACKUP_DIR"
  exit 1
fi

DUMP_TS=$(date +%F_%T)
DUMP_FILE="$BACKUP_DIR/db-$DUMP_TS.sql"
if pg_dump "$DATABASE_URL" > "$DUMP_FILE"; then
  echo "[SUCCESS] Database dump created at $DUMP_FILE"
else
  echo "[ERROR] Database dump failed"
  exit 1
fi

if gzip "$DUMP_FILE"; then
  echo "[SUCCESS] Compressed dump to $DUMP_FILE.gz"
else
  echo "[ERROR] gzip failed"
  exit 1
fi

if find "$BACKUP_DIR" -name "*.sql.gz" -type f -mtime +7 -print -delete; then
  echo "[SUCCESS] Old backups deleted"
else
  echo "[ERROR] Failed to delete old backups"
  exit 1
fi