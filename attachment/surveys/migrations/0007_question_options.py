# Generated by Django 4.1.9 on 2023-06-22 06:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("surveys", "0006_survey_name_survey_slug")]

    operations = [
        migrations.AddField(
            model_name="question",
            name="options",
            field=models.JSONField(blank=True, default=dict, null=True),
        )
    ]