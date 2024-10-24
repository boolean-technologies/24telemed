from django.db import models
from django.conf import settings
import os
import uuid

def generate_uuid_filename(instance, filename, folder="Uploads"):
    uuid_filename = f"{uuid.uuid4()}{os.path.splitext(filename)[1]}"
    return os.path.join(folder, uuid_filename)

class File(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file = models.FileField(upload_to=generate_uuid_filename, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)