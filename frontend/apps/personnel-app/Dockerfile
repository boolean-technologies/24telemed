FROM nginx:alpine

COPY ../../dist/apps/personnel-app /usr/share/nginx/html

COPY /apps/personnel-app/custom-nginx.template /etc/nginx/conf.d/

COPY /apps/personnel-app/generate-config.sh .

RUN chmod +x generate-config.sh

EXPOSE 8082

USER root

ENTRYPOINT [ "/bin/sh", "generate-config.sh"]

