import json
from enum import Enum

from django.db import models
from django.utils.translation import gettext_lazy as _


class LanguageEnum(Enum):
    SPANISH = 'es'
    ENGLISH = 'en'

    @classmethod
    def choices(cls):
        return [(e.value, _(e.name.capitalize())) for e in cls]


class Survey(models.Model):
    name = models.CharField(max_length=60)
    slug = models.SlugField(max_length=60, unique=True)

    def __str__(self):
        return self.name
    
    def get_absolute_url(self):
        return f'/surveys/{self.slug}/'
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self.name
        super().save(*args, **kwargs)


class SurveyTranslation(models.Model):
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)
    language = models.CharField(max_length=60, choices=LanguageEnum.choices())
    title = models.CharField(max_length=255)

    class Meta:
        unique_together = [('survey', 'language')]


class Question(models.Model):
    TEXT = 'text'
    SINGLE_SELECT = 'single_select'
    MULTIPLE_SELECT = 'multiple_select'
    LIKERT_5 = 'likert_5'
    LIKERT_7 = 'likert_7'
    NUMBER = 'number'

    QUESTION_TYPES = [
        (TEXT, 'Text'),
        (SINGLE_SELECT, 'Single Select'),
        (MULTIPLE_SELECT, 'Multiple Select'),
        (LIKERT_5, 'likert_5'),
        (LIKERT_7, 'likert_7'),
        (NUMBER, 'number'),
    ]
    name = models.CharField(max_length=60)
    survey = models.ManyToManyField(Survey, related_name='questions')
    question_type = models.CharField(max_length=60, choices=QUESTION_TYPES)
    order = models.IntegerField()

    def __str__(self):
        return self.name

class QuestionTranslation(models.Model):
    survey_question = models.ForeignKey(Question, on_delete=models.CASCADE)
    language = models.CharField(max_length=60, choices=LanguageEnum.choices())
    question_prompt = models.TextField()
    options = models.JSONField(default=dict, null=True, blank=True)

    class Meta:
        unique_together = [('survey_question', 'language')]

    def __str__(self):
        return self.question_prompt


class Answer(models.Model):
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)
    answers = models.JSONField(default=dict)

    def set_answers(self, answers):
        self.answers = json.dumps(answers)

    def get_answers(self):
        return json.loads(self.answers)
