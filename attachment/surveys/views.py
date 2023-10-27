import os
import json
from django.shortcuts import render, get_object_or_404
from django.views import View
from django.http import HttpResponse
from .models import Survey, Answer, Recording
import uuid


FILE_PATH = os.path.dirname(os.path.abspath(__file__))


class SurveyView(View):
    def get(self, request, slug):
        survey = get_object_or_404(Survey, slug=slug)
        survey_uuid = request.GET.get("uuid", str(uuid.uuid4()))
        questions = []
        # get the screens
        screens = {}
        for screen in survey.screens.all():
            screens[screen.id] = []
            # check the questions in the screen
            for question in screen.questions.all():
                if question.exclusion_value:
                    question.exclusion_value = json.dumps(question.exclusion_value)
                question_class = False
                for translation in question.questiontranslation_set.all():
                    for option in translation.options:
                        if option.get("image"):
                            question.image = option["image"]
                        if len(option["label"]) > 30:
                            question_class = True
                            break
                question.long_text = question_class
                screens.get(screen.id).append(question)
        survey.checked_screens = screens
        return render(request, f"{FILE_PATH}/templates/survey.html", {"survey": survey, "uuid": survey_uuid})

    def post(self, request, slug):
        survey = Survey.objects.get(slug=slug)
        language = request.POST.get("language")

        # Retrieve the answers for each question from the request
        answers = {}
        audio_uuids = []
        excluded = False
        for key, value in request.POST.items():
            if key == "response-uuid":
                answers["response-uuid"] = value
                response_uuid = value
            if key == "excluded":
                excluded = json.loads(value)
            if key.startswith("question_") or key in ["language"]:
                question_id = key.replace("question_", "")
                answers[question_id] = value
            if key.startswith("audio_"):
                audio_id = key.replace("audio_", "")
                if value:
                    answers[audio_id] = value
                    audio_uuids.append(value)
        answers = json.dumps(answers)
        answer = Answer(survey=survey, answers=answers)
        answer.save()
        if audio_uuids:
            Recording.objects.filter(uuid__in=audio_uuids).update(answer=answer)
        if survey.next_survey:
            redirect_url = survey.next_survey.get_absolute_url()
            return render(request, f"{FILE_PATH}/templates/survey_submit.html", {"survey": redirect_url, "uuid": response_uuid, "excluded": excluded})
        return render(request, f"{FILE_PATH}/templates/survey_submit.html")


class RecordingView(View):
    def post(self, request, slug):
        language = request.POST.get("language")
        recording = request.FILES.get("audioBlob")
        recording = Recording(recording=recording, language=language)
        recording.save()
        return HttpResponse(
            json.dumps({"uuid": str(recording.uuid)}),
            status=200,
            content_type="application/json",
        )
