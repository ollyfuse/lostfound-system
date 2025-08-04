from django import template

register = template.Library()

@register.filter
def as_widget(value):
    return value.as_widget(attrs={'class': 'w-full border border-gray-300 p-2 rounded'})
