# Generated by Django 4.1.9 on 2023-06-21 07:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('surveys', '0002_answer'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='survey',
            name='title',
        ),
        migrations.RemoveField(
            model_name='surveytranslation',
            name='question_prompt',
        ),
        migrations.AddField(
            model_name='surveytranslation',
            name='title',
            field=models.CharField(default='test', max_length=255),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='surveytranslation',
            name='language',
            field=models.CharField(choices=[('es', 'Spanish'), ('en', 'English')], max_length=60),
        ),
    ]
