FROM python:3.11-slim

# keep python output unbuffered (helps with logs)
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# install OS deps we need (nc used in entrypoint wait)
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends gcc libpq-dev netcat-openbsd curl && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x /app/entrypoint.sh

# entrypoint will wait for DB, run migrations and then exec CMD
ENTRYPOINT ["/app/entrypoint.sh"]

# default dev command; in production you'd run gunicorn
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
