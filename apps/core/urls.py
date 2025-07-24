from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('found-documents/', views.found_documents_list, name='found_documents_list'),
]
