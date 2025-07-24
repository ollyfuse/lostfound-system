from django.shortcuts import render
from .models import FoundDocument

def found_documents_list(request):
    """
    Displays a paginated list of found documents
    with image previews and basic metadata.
    """
    documents = FoundDocument.objects.all()
    return render(request, 'found_documents_list.html', {'documents': documents})
