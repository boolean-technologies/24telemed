#!/bin/bash

python manage.py migrate

python manage.py collectstatic --noinput

exec daphne -b 0.0.0.0 -p 8000 server.asgi:application