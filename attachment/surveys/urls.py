# Add urls to the views in surveys app.
#
# Path: attachment-project\attachment\surveys\urls.py
from django.urls import path
from .views import SurveyView, SubmitSurveyView


urlpatterns = [
    path("<slug:slug>/", SurveyView.as_view(), name="survey"),
    path("submit/", SubmitSurveyView.as_view(), name="submit_survey"),
    # Add other URLs as needed
]
