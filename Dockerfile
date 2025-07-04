FROM node:18.19.0-alpine3.19

RUN apk update && apk upgrade

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]