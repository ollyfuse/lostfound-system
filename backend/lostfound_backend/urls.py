"""
URL configuration for lostfound_backend project.
"""
from django.contrib import admin
from django.views.static import serve
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse
import os

def health_check(request):
    return HttpResponse("OK", content_type="text/plain")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('reports.urls')),
    path('api/', include('core.urls')),
    path('health/', health_check, name='health_check'),
]

# Serve static and media files
urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]