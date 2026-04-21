# AbdulazizovDEV — Portfolio + Blog

Django asosidagi shaxsiy portfolio va blog sayti.

## Texnologiyalar
- **Backend**: Python, Django 5
- **Database**: SQLite
- **Frontend**: HTML, CSS, JavaScript
- **Til qo'llab-quvatlash**: UZ, EN, RU

## O'rnatish

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Sayt: http://localhost:8000

## Admin panel

- Custom admin: http://localhost:8000/admin-panel/
- Django admin: http://localhost:8000/django-admin/

Login: `.env` fayldagi `ADMIN_USERNAME` va `ADMIN_PASSWORD`

## Sahifalar
- `/` — Portfolio (GitHub loyihalar, haqida)
- `/blog/` — Blog (barcha postlar)
- `/admin-panel/` — Admin panel (post yozish, o'chirish)
- `/django-admin/` — Django built-in admin
