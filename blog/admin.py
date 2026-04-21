from django.contrib import admin
from .models import Post, Attachment


class AttachmentInline(admin.TabularInline):
    model = Attachment
    extra = 1
    readonly_fields = ('original_name', 'mime_type', 'size')


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('title', 'content')
    inlines = [AttachmentInline]
    readonly_fields = ('id', 'created_at')


@admin.register(Attachment)
class AttachmentAdmin(admin.ModelAdmin):
    list_display = ('original_name', 'post', 'mime_type', 'size')
    list_filter = ('mime_type',)
