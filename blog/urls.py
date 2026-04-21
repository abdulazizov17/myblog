from django.urls import path
from . import views

urlpatterns = [
    # Pages
    path('', views.index_view, name='index'),
    path('blog/', views.blog_view, name='blog'),
    path('admin-panel/', views.admin_panel_view, name='admin_panel'),

    # API
    path('api/posts/', views.api_posts, name='api_posts'),
    path('api/admin/login/', views.api_admin_login, name='api_admin_login'),
    path('api/admin/logout/', views.api_admin_logout, name='api_admin_logout'),
    path('api/admin/me/', views.api_admin_me, name='api_admin_me'),
    path('api/admin/posts/', views.api_admin_create_post, name='api_admin_create_post'),
    path('api/admin/posts/<uuid:post_id>/', views.api_admin_delete_post, name='api_admin_delete_post'),
]
