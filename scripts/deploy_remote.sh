#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${DEPLOY_PATH:-}" ]]; then
  DEPLOY_PATH="$(pwd)"
fi

cd "$DEPLOY_PATH"

# Ensure required dirs exist
mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache

# Keep permissions relaxed enough for CloudPanel/www-data scenarios.
chmod -R ug+rwX storage bootstrap/cache || true

# PHP dependencies
if command -v composer >/dev/null 2>&1; then
  composer install --no-interaction --no-dev --prefer-dist --optimize-autoloader
else
  echo "composer not found on server" >&2
  exit 1
fi

# Migrate
php artisan migrate --force

# Clear and rebuild caches
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# (Optional) Restart queues if supervisor is used
php artisan queue:restart || true

echo "Deploy complete."

