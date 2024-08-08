#!/bin/bash

RUN python manage.py migrate

python manage.py collectstsatic --noinput

exec daphne -b 0.0.0.0 -p 8000 server.asgi:application


