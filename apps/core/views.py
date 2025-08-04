from django.shortcuts import render, redirect
from django.core.paginator import Paginator
from .forms import UserContactInfoForm, LostDocumentForm, FoundDocumentForm
from .models import LostDocument, FoundDocument, UserContactInfo

def home(request):
    lost_form = LostDocumentForm()
    found_form = FoundDocumentForm()
    contact_form = UserContactInfoForm()
    documents = FoundDocument.objects.filter(is_approved=True).order_by('-uploaded_at')[:12]
    return render(request, 'core/home.html', {
        'lost_form': lost_form,
        'found_form': found_form,
        'contact_form': contact_form,
        'documents': documents,
    })
def report_document(request):
    if request.method == 'POST':
        contact_form = UserContactInfoForm(request.POST)
        lost_form = LostDocumentForm(request.POST)
        if contact_form.is_valid() and lost_form.is_valid():
            contact = contact_form.save()
            lost_doc = lost_form.save(commit=False)
            lost_doc.contact_info = contact
            lost_doc.save()
            return redirect('home')
    else:
        contact_form = UserContactInfoForm()
        lost_form = LostDocumentForm()
    return render(request, 'core/report.html', {
        'contact_form': contact_form,
        'lost_form': lost_form,
    })

def upload_document(request):
    if request.method == 'POST':
        contact_form = UserContactInfoForm(request.POST)
        found_form = FoundDocumentForm(request.POST, request.FILES)
        if contact_form.is_valid() and found_form.is_valid():
            contact = contact_form.save()
            found_doc = found_form.save(commit=False)
            found_doc.contact_info = contact
            found_doc.save()
            return redirect('home')
    else:
        contact_form = UserContactInfoForm()
        found_form = FoundDocumentForm()
    return render(request, 'core/upload.html', {
        'contact_form': contact_form,
        'found_form': found_form,
    })
def found_documents(request):
    documents = FoundDocument.objects.filter(is_approved=True).order_by('-found_date')
    # paginator = Paginator(found_documents, 6) 

    # page_number = request.GET.get("page")
    # page_obj = paginator.get_page(page_number)

    return render(request, 'core/found_documents_list.html', {
        'documents': documents
    })
