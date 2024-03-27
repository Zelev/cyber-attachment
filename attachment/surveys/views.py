import os
import json
from django.shortcuts import render, get_object_or_404
from django.views import View
from django.http import HttpResponse
from django.shortcuts import redirect
from .models import Survey, Answer, Recording, Question
from .prolific import get_profilic_params, get_prolific_redirect
import uuid

import logging

logger = logging.getLogger(__name__)


FILE_PATH = os.path.dirname(os.path.abspath(__file__))


class SurveyView(View):
    def get(self, request, slug):
        survey = get_object_or_404(Survey, slug=slug)
        survey_uuid = request.GET.get("uuid", str(uuid.uuid4()))
        prolific_params = get_profilic_params(request.GET)
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
        return render(
            request,
            f"{FILE_PATH}/templates/survey.html",
            {"survey": survey, "uuid": survey_uuid, **prolific_params},
        )

    def post(self, request, slug):
        survey = Survey.objects.get(slug=slug)
        language = request.POST.get("language")
        # Retrieve the answers for each question from the request
        answers = {}
        audio_uuids = []
        excluded = False
        consent = True
        bad_device = False
        completed = True
        prolific_redirect = ""
        for key, value in request.POST.items():
            if key == "response-uuid":
                answers["response-uuid"] = value
                response_uuid = value
            if key == "excluded":
                excluded = json.loads(value)
                if "consent" in survey.slug:
                    consent = False
            if key.startswith("question_") or key in ["language"]:
                question_id = key.replace("question_", "")
                answers[question_id] = value
            if key.startswith("audio_"):
                audio_id = key.replace("audio_", "")
                if value:
                    if "Blob" in value:
                        bad_device = True
                    answers[audio_id] = value
                    audio_uuids.append(value)
        # check if all questions have been answered, excluding the questions that are prompts and the language
        question_count = Question.objects.filter(
            screen__survey=survey,
            question_type__in=[
                "text",
                "single_select",
                "multiple_select",
                "likert_5",
                "likert_7",
                "number",
                "recording",
            ],
        ).count()
        if len(answers) < question_count:
            completed = False
        extra_params = {}
        if extra_params := get_profilic_params(request.GET):
            answers = {**answers, **extra_params}
            if None not in extra_params.values():
                prolific_redirect = get_prolific_redirect(
                    consent=consent,
                    excluded=excluded,
                    bad_device=bad_device,
                    completed=completed,
                )
        answers = json.dumps(answers)
        answer = Answer(survey=survey, answers=answers)
        answer.save()

        if audio_uuids:
            Recording.objects.filter(uuid__in=audio_uuids).update(answer=answer)
        if survey.next_survey and not excluded and consent and not bad_device:
            redirect_url = f"/{language}{survey.next_survey.get_absolute_url()}"
            # Add uuid as a parameter to the redirect url
            redirect_url += f"?uuid={response_uuid}"
            if extra_params:
                for key, value in extra_params.items():
                    redirect_url += f"&{key}={value}"
            # render the next survey
            return redirect(redirect_url)
        if prolific_redirect:
            return redirect(prolific_redirect)
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
