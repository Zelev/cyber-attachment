# Generated by Django 4.1.9 on 2023-10-27 13:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [("surveys", "0018_question_exclusion_value")]

    operations = [
        migrations.AddField(
            model_name="survey",
            name="next_survey",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="surveys.survey",
            ),
        )
    ]
