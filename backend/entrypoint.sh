#!/bin/sh
set -e

# Install Pillow if not already installed
python -c "import PIL" 2>/dev/null || pip install Pillow

# wait for Postgres
echo ">>> Waiting for database..."
while ! nc -z $SQL_HOST $SQL_PORT; do
  sleep 1
done

# run migrations
echo ">>> Running migrations..."
python manage.py migrate --noinput

# collect static files (optional in dev)
# python manage.py collectstatic --noinput

# finally run the CMD
exec "$@"
