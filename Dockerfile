FROM node:23-alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8081

CMD ["npm", "run", "dev"]