# Generated by Django 4.1.13 on 2024-01-11 15:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("surveys", "0019_survey_next_survey")]

    operations = [
        migrations.AlterField(
            model_name="questiontranslation",
            name="language",
            field=models.CharField(
                choices=[("es", "Spanish"), ("en", "English"), ("pt", "Portuguese")],
                max_length=60,
            ),
        ),
        migrations.AlterField(
            model_name="recording",
            name="language",
            field=models.CharField(
                choices=[("es", "Spanish"), ("en", "English"), ("pt", "Portuguese")],
                max_length=60,
            ),
        ),
        migrations.AlterField(
            model_name="surveytranslation",
            name="language",
            field=models.CharField(
                choices=[("es", "Spanish"), ("en", "English"), ("pt", "Portuguese")],
                max_length=60,
            ),
        ),
    ]
