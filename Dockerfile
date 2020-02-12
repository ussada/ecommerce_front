# 1st Stage
FROM node:8.15.1-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# 2nd Stage
FROM nginx:1.14.2-alpine
# Copy build folder
COPY --from=0 /usr/src/app/build /usr/share/nginx/html

# Replace conf file
RUN rm -rf /etc/nginx/conf.d

RUN mkdir -p /etc/nginx/conf.d

COPY nginx.conf /etc/nginx/nginx.conf

COPY default.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]