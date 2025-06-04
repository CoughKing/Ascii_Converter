from django.urls import path
from .views import ASCIIConvertView

urlpatterns = [
    path('ascii/', ASCIIConvertView.as_view()),
]
