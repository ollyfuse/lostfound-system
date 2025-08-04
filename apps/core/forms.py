from django import forms
from .models import LostDocument, FoundDocument, UserContactInfo

class UserContactInfoForm(forms.ModelForm):
    class Meta:
        model = UserContactInfo
        fields = ['full_name', 'email', 'phone_number']
        widgets = {
            'full_name': forms.TextInput(attrs={
                'class': 'w-full p-2 border border-gray-300 rounded',
                'placeholder': 'Full Name'
            }),
            'email': forms.EmailInput(attrs={
                'class': 'w-full p-2 border border-gray-300 rounded',
                'placeholder': 'Email Address'
            }),
            'phone_number': forms.TextInput(attrs={
                'class': 'w-full p-2 border border-gray-300 rounded',
                'placeholder': 'Phone Number'
            }),
        }


class LostDocumentForm(forms.ModelForm):
    class Meta:
        model = LostDocument
        fields = ['document_type', 'document_number', 'description']
        widgets = {
            'document_type': forms.Select(attrs={
                'class': 'w-full p-2 border border-gray-300 rounded'
            }),
            'document_number': forms.TextInput(attrs={
                'class': 'w-full p-2 border border-gray-300 rounded',
                'placeholder': 'Document Number'
            }),
            'description': forms.Textarea(attrs={
                'class': 'w-full p-2 border border-gray-300 rounded',
                'placeholder': 'Brief description...',
                'rows': 3,
            }),
        }


class FoundDocumentForm(forms.ModelForm):
    full_name = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={
            'class': 'w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500',
            'placeholder': 'Full name'
        })
    )
    phone_number = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'w-full p-2 border border-gray-300 rounded',
            'placeholder': 'Phone number'
        })
    )
    email = forms.EmailField(
        required=False,
        widget=forms.EmailInput(attrs={
            'class': 'w-full p-2 border border-gray-300 rounded',
            'placeholder': 'Email address'
        })
    )
    document_type = forms.ModelChoiceField(
        queryset=FoundDocument._meta.get_field('document_type').remote_field.model.objects.all(),
        widget=forms.Select(attrs={
            'class': 'w-full p-2 border border-gray-300 rounded'
        })
    )
    name_on_document = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'w-full p-2 border border-gray-300 rounded',
            'placeholder': 'Name on document'
        })
    )
    document_number = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'w-full p-2 border border-gray-300 rounded',
            'placeholder': 'Document number'
        })
    )
    found_date = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={
            'type': 'date',
            'class': 'w-full p-2 border border-gray-300 rounded'
        })
    )
    image = forms.ImageField(
        widget=forms.ClearableFileInput(attrs={
            'class': 'w-full p-2 border border-gray-300 rounded bg-white'
        })
    )

    class Meta:
        model = FoundDocument
        exclude = ['contact_info', 'is_approved', 'uploaded_at']
