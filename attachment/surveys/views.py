import os
import json
from django.shortcuts import render, get_object_or_404, redirect
from django.views import View
from .models import Survey, Answer


FILE_PATH = os.path.dirname(os.path.abspath(__file__))


class SurveyView(View):
    def get(self, request, slug):
        survey = get_object_or_404(Survey, slug=slug)
        questions = []
        for question in survey.questions.all():
            question_class = False
            for translation in question.questiontranslation_set.all():
                for option in translation.options:
                    if len(option['label']) > 30:
                        question_class = True
                        break
            question.long_text = question_class
            questions.append(question)
        survey.checked_questions = questions
    
        return render(request, f"{FILE_PATH}/templates/survey.html", {"survey": survey})
    
    def post(self, request, slug):
        # Retrieve the survey using the slug
        survey = Survey.objects.get(slug=slug)

        # Retrieve the language from the request
        language = request.POST.get("language")

        # Retrieve the answers for each question from the request
        answers = {}
        for key, value in request.POST.items():
            if key.startswith("question_") or key in ["language"]:
                question_id = key.replace("question_", "")
                answers[question_id] = value
        # convert the answers to a JSON string
        answers = json.dumps(answers)

        # Create a new Answer instance for the submitted survey
        answer = Answer(survey=survey, answers=answers)
        answer.save()

        # Redirect to a thank you page or any other appropriate URL
        return render(request, f"{FILE_PATH}/templates/survey_submit.html")
