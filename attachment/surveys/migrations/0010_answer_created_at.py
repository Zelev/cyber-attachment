# Generated by Django 4.1.9 on 2023-06-27 08:48

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [("surveys", "0009_alter_question_question_type")]

    operations = [
        migrations.AddField(
            model_name="answer",
            name="created_at",
            field=models.DateTimeField(
                auto_now_add=True, default=django.utils.timezone.now
            ),
            preserve_default=False,
        )
    ]