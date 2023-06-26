import os
from django.shortcuts import render, get_object_or_404, redirect
from django.views import View
from .models import Survey, Answer


FILE_PATH = os.path.dirname(os.path.abspath(__file__))


class SurveyView(View):
    def get(self, request, slug):
        print(slug)
        survey = get_object_or_404(Survey, slug=slug)
        return render(request, f"{FILE_PATH}/templates/survey.html", {"survey": survey})


class SubmitSurveyView(View):
    def post(self, request):
        # Retrieve the survey using the slug
        slug = request.POST.get("slug")
        survey = Survey.objects.get(slug=slug)

        # Retrieve the language from the request
        language = request.POST.get("language")

        # Retrieve the answers for each question from the request
        answers = {}
        for key, value in request.POST.items():
            if key.startswith("question_"):
                question_id = key.replace("question_", "")
                answers[question_id] = value

        # Create a new Answer instance for the submitted survey
        answer = Answer(survey=survey, answers=answers)
        answer.save()

        # Redirect to a thank you page or any other appropriate URL
        return redirect(f"surveys/{slug}")
