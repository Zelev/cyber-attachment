from django.contrib import admin
from .models import (
    Survey,
    SurveyTranslation,
    Question,
    QuestionTranslation,
    Answer,
    Screen,
    Recording,
)


class QuestionInline(admin.TabularInline):
    model = Survey.questions.through
    extra = 1


class SurveyTranslationInline(admin.TabularInline):
    model = SurveyTranslation
    extra = 1


class QuestionTranslationInline(admin.TabularInline):
    model = QuestionTranslation
    extra = 1


class ScreenInline(admin.TabularInline):
    model = Screen
    extra = 1


@admin.register(Survey)
class SurveyAdmin(admin.ModelAdmin):
    inlines = [SurveyTranslationInline, QuestionInline, ScreenInline]
    exclude = ("questions",)  # Exclude questions field from the main form


class SurveyTranslationAdmin(admin.ModelAdmin):
    pass


class QuestionTranslationAdmin(admin.ModelAdmin):
    list_display = ("question_prompt", "language")
    list_filter = ("language",)
    search_fields = ("question_prompt",)


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    inlines = [QuestionTranslationInline]
    list_display = ("name", "question_type", "order")
    list_filter = ("question_type", "name")
    search_fields = ("question_type", "name")
    exclude = ("survey",)


class QuestionTranslationAdmin(QuestionTranslationAdmin):
    pass


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ("survey", "get_answers", "created_at")
    list_filter = ("survey",)
    search_fields = ("survey",)


@admin.register(Screen)
class ScreenAdmin(admin.ModelAdmin):
    pass


@admin.register(Recording)
class Recording(admin.ModelAdmin):
    pass
