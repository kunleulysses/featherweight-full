#!/usr/bin/env bash
set -euo pipefail
## Create an exec-enabled temp dir in the repo to avoid spawn EPERM (noexec on /tmp)
TMPDIR="$(pwd)/.tmp"
mkdir -p "$TMPDIR"
export TMPDIR TMP TEMP TEMPDIR="$TMPDIR"
export ESBUILD_BINARY_PATH="$(pwd)/node_modules/vite/node_modules/esbuild/bin/esbuild"
unset XDG_RUNTIME_DIR

[ -f .env ] || { echo "[ERROR] .env file not found"; exit 1; }
echo "[START] Loading environment variables from .env"
set -o allexport
source .env
set +o allexport
echo "[SUCCESS] Loaded environment variables from .env"

echo "[START] npm install (with devDependencies)"
if npm install --include=dev; then
  echo "[SUCCESS] npm install"
else
  echo "[ERROR] npm install failed"
  exit 1
fi

echo "[START] npm run build"
if npm run build; then
  echo "[SUCCESS] npm run build"
else
  echo "[ERROR] npm run build failed"
  exit 1
fi

echo "[START] npm run migrate (if present)"
if npm run migrate --if-present; then
  echo "[SUCCESS] npm run migrate"
else
  echo "[ERROR] npm run migrate failed"
  exit 1
fi

echo "[START] npm run seed:initial (if present)"
if npm run seed:initial --if-present; then
  echo "[SUCCESS] npm run seed:initial"
else
  echo "[ERROR] npm run seed:initial failed"
  exit 1
fi

# Ensure PM2 home directory exists for logging
mkdir -p "$HOME/.pm2"

echo "[START] pm2 restart featherweight-main"
if pm2 restart featherweight-main --update-env; then
  echo "[SUCCESS] pm2 restart featherweight-main"
else
  echo "[WARN] pm2 restart featherweight-main failed (process may not exist), attempting to start"
  if pm2 start npm --name featherweight-main -- run start --update-env; then
    echo "[SUCCESS] pm2 start featherweight-main"
  else
    echo "[ERROR] pm2 start featherweight-main failed"
    exit 1
  fi
fi

echo "[START] Reloading Caddy"
if sudo systemctl reload caddy; then
  echo "[SUCCESS] Caddy reloaded"
else
  echo "[ERROR] Caddy reload failed"
  exit 1
fi

echo "[START] Checking site health"
HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' https://featherweight.world) || HTTP_CODE="000"
if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ featherweight.world is live"
else
  echo "❌ Deployment failed: site not responding (HTTP $HTTP_CODE)"
  exit 1
fi