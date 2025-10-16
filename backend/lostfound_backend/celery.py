import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "lostfound_backend.settings")

app = Celery("lostfound_backend")

# Load task modules from all registered Django apps
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()  # <-- this tells Celery to find tasks.py in apps

app.conf.result_backend = "redis://redis:6379/1"