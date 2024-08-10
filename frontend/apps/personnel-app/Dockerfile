FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG VITE_VIDEO_SDK_TOKEN
ARG VITE_API_BASE
ARG VITE_WEBSOCKET_BASE

ENV VITE_VIDEO_SDK_TOKEN=$VITE_VIDEO_SDK_TOKEN
ENV VITE_API_BASE=$VITE_API_BASE
ENV VITE_WEBSOCKET_BASE=$VITE_WEBSOCKET_BASE

RUN npx nx build personnel-app --prod

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist/apps/personnel-app /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
