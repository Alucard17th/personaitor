#!/usr/bin/env bash
set -euo pipefail

DEPLOY_PATH="${DEPLOY_PATH:-$(pwd)}"
cd "$DEPLOY_PATH"

if [ ! -d .git ]; then
  echo "${DEPLOY_PATH} is not a git repository (.git not found)." >&2
  echo "This deploy strategy expects the server directory to be a git clone." >&2
  exit 1
fi

git fetch --all --prune
git reset --hard origin/main

mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache
chmod -R ug+rwX storage bootstrap/cache || true

if ! command -v composer >/dev/null 2>&1; then
  echo "composer not found on server" >&2
  exit 1
fi

composer install --no-interaction --no-dev --prefer-dist --optimize-autoloader

php artisan migrate --force

php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

php artisan queue:restart || true

echo "Deploy complete."
