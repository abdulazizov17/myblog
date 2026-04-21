import uuid
import os
from django.db import models


def upload_to(instance, filename):
    """Generate unique filename for uploads."""
    ext = os.path.splitext(filename)[1]
    safe_name = "".join(c if c.isalnum() or c in '._-' else '_' for c in os.path.splitext(filename)[0])[:64]
    unique_name = f"{uuid.uuid4().hex}_{safe_name}{ext}"
    return f"uploads/{unique_name}"


class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=300)
    content = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Attachment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to=upload_to)
    original_name = models.CharField(max_length=300)
    mime_type = models.CharField(max_length=100, default='application/octet-stream')
    size = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.original_name
