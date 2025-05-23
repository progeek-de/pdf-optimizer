FROM node:22 AS build

WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn --platform=linux --arch=x64 install

COPY . /app/
RUN yarn build

FROM nginx:1.27

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build /app/dist .

ENTRYPOINT ["nginx", "-g", "daemon off;"]
