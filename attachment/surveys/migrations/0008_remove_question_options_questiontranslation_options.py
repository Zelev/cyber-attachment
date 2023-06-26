# Generated by Django 4.1.9 on 2023-06-26 07:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('surveys', '0007_question_options'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='question',
            name='options',
        ),
        migrations.AddField(
            model_name='questiontranslation',
            name='options',
            field=models.JSONField(blank=True, default=dict, null=True),
        ),
    ]
