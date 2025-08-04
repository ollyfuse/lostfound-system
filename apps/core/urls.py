from django.urls import path
from . import views


urlpatterns = [
    path('', views.home, name='home'),
    path('report/', views.report_document, name='report'),
    path('upload/', views.upload_document, name='upload'),
    path('', views.found_documents, name='found_documents_list'),
    # path('upload/', views.upload_found_document, name='upload_found_document'),
]
