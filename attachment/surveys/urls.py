# Add urls to the views in surveys app.
#
# Path: attachment-project\attachment\surveys\urls.py
from django.urls import path
from .views import SurveyView, RecordingView


urlpatterns = [
    path("<slug:slug>/", SurveyView.as_view(), name="survey"),
    path("<slug:slug>/recording/", RecordingView.as_view(), name="recording"),
]
