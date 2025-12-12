#!/bin/sh
set -e

echo "🚀 Starting DocuFind Production Backend..."

# Wait for database
echo "⏳ Waiting for database..."
while ! nc -z $SQL_HOST $SQL_PORT; do
  sleep 1
done
echo "✅ Database is ready!"

# Wait for Redis
echo "⏳ Waiting for Redis..."
while ! nc -z redis 6379; do
  sleep 1
done
echo "✅ Redis is ready!"

# Run migrations
echo "🔄 Running database migrations..."
python manage.py migrate --noinput

# Collect static files
echo "📦 Collecting static files..."
python manage.py collectstatic --noinput

# Create superuser if it doesn't exist
echo "👤 Creating superuser..."
python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@docufind.com', '#admin@123')
    print("Superuser created successfully!")
else:
    print("Superuser already exists.")
EOF

echo "✅ Backend initialization completed!"

# Execute the main command
exec "$@"
