FROM nginx:alpine

COPY ../../dist/apps/doctor-app /usr/share/nginx/html

COPY /apps/doctor-app/custom-nginx.template /etc/nginx/conf.d/

COPY /apps/doctor-app/generate-config.sh .

RUN chmod +x generate-config.sh

EXPOSE 80

USER root

ENTRYPOINT [ "/bin/sh", "generate-config.sh"]

