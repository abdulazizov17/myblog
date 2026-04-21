import json
import mimetypes
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST, require_http_methods
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.conf import settings
from .models import Post, Attachment


# ─── Page Views ───────────────────────────────────────────────

def index_view(request):
    return render(request, 'index.html')


def blog_view(request):
    return render(request, 'blog.html')


def admin_panel_view(request):
    return render(request, 'admin_panel.html')


# ─── API Views ────────────────────────────────────────────────

@require_GET
def api_posts(request):
    """Return all posts with attachments as JSON."""
    posts = Post.objects.prefetch_related('attachments').all()
    data = []
    for post in posts:
        attachments = []
        for att in post.attachments.all():
            attachments.append({
                'id': str(att.id),
                'name': att.original_name,
                'mime': att.mime_type,
                'size': att.size,
                'url': att.file.url,
            })
        data.append({
            'id': str(post.id),
            'title': post.title,
            'content': post.content,
            'createdAt': post.created_at.isoformat(),
            'attachments': attachments,
        })
    return JsonResponse(data, safe=False)


@csrf_exempt
@require_POST
def api_admin_login(request):
    """Login with username/password."""
    try:
        body = json.loads(request.body)
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({'message': 'Invalid JSON body'}, status=400)

    username = str(body.get('username', '')).strip()
    password = str(body.get('password', ''))

    if not username or not password:
        return JsonResponse({'message': 'Invalid credentials'}, status=401)

    # Try Django auth first
    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        return JsonResponse({'ok': True, 'username': user.username})

    # Fallback: check .env credentials
    env_username = getattr(settings, 'ADMIN_USERNAME', '')
    env_password = getattr(settings, 'ADMIN_PASSWORD', '')

    if (username.lower() == env_username.lower() and password == env_password):
        # Auto-create user if using .env credentials
        try:
            user = User.objects.get(username__iexact=username)
        except User.DoesNotExist:
            user = User.objects.create_user(
                username=username,
                password=password,
                is_staff=True,
                is_superuser=True,
            )
        login(request, user)
        return JsonResponse({'ok': True, 'username': username})

    return JsonResponse({'message': 'Invalid credentials'}, status=401)


@csrf_exempt
@require_POST
def api_admin_logout(request):
    """Logout current user."""
    logout(request)
    return JsonResponse({'ok': True})


@require_GET
def api_admin_me(request):
    """Check if user is authenticated."""
    if request.user.is_authenticated:
        return JsonResponse({'ok': True, 'username': request.user.username})
    return JsonResponse({'message': 'Unauthorized'}, status=401)


@csrf_exempt
@require_POST
def api_admin_create_post(request):
    """Create a new blog post with optional file attachments."""
    if not request.user.is_authenticated:
        return JsonResponse({'message': 'Unauthorized'}, status=401)

    title = request.POST.get('title', '').strip()
    content = request.POST.get('content', '').strip()
    files = request.FILES.getlist('attachments')

    if not title:
        return JsonResponse({'message': 'Title is required'}, status=400)

    if not content and not files:
        return JsonResponse({'message': 'Content or attachment is required'}, status=400)

    if len(files) > 6:
        return JsonResponse({'message': 'Too many files (max 6).'}, status=400)

    post = Post.objects.create(title=title, content=content)

    attachments_data = []
    for f in files:
        if f.size > 25 * 1024 * 1024:
            continue

        mime = f.content_type or mimetypes.guess_type(f.name)[0] or 'application/octet-stream'
        att = Attachment.objects.create(
            post=post,
            file=f,
            original_name=f.name,
            mime_type=mime,
            size=f.size,
        )
        attachments_data.append({
            'id': str(att.id),
            'name': att.original_name,
            'mime': att.mime_type,
            'size': att.size,
            'url': att.file.url,
        })

    return JsonResponse({
        'id': str(post.id),
        'title': post.title,
        'content': post.content,
        'createdAt': post.created_at.isoformat(),
        'attachments': attachments_data,
    }, status=201)


@csrf_exempt
@require_http_methods(["DELETE"])
def api_admin_delete_post(request, post_id):
    """Delete a blog post and its attachments."""
    if not request.user.is_authenticated:
        return JsonResponse({'message': 'Unauthorized'}, status=401)

    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return JsonResponse({'message': 'Post not found'}, status=404)

    # Delete attachment files from disk
    for att in post.attachments.all():
        if att.file:
            try:
                att.file.delete(save=False)
            except Exception:
                pass

    post.delete()
    return JsonResponse({'ok': True})
