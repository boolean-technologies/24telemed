#!/bin/sh

envsubst < /app/index.html > /app/index.html.tmp && mv /app/index.html.tmp /app/index.html
