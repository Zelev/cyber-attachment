from django.contrib import admin
from .models import Survey, SurveyTranslation, Question, QuestionTranslation, Answer


class QuestionInline(admin.TabularInline):
    model = Survey.questions.through
    extra = 1


class SurveyTranslationInline(admin.TabularInline):
    model = SurveyTranslation
    extra = 1


class QuestionTranslationInline(admin.TabularInline):
    model = QuestionTranslation


@admin.register(Survey)
class SurveyAdmin(admin.ModelAdmin):
    inlines = [SurveyTranslationInline, QuestionInline]
    exclude = ("questions",)  # Exclude questions field from the main form


@admin.register(SurveyTranslation)
class SurveyTranslationAdmin(admin.ModelAdmin):
    pass


class QuestionTranslationAdmin(admin.ModelAdmin):
    list_display = ("question_prompt", "language")
    list_filter = ("language",)
    search_fields = ("question_prompt",)


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    inlines = [QuestionTranslationInline]
    list_display = ("question_type", "order")
    list_filter = ("question_type",)
    search_fields = ("question_type",)
    exclude = ("survey",)


@admin.register(QuestionTranslation)
class QuestionTranslationAdmin(QuestionTranslationAdmin):
    pass


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ("survey", "get_answers")
    list_filter = ("survey",)
    search_fields = ("survey",)
