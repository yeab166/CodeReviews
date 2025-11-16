FROM node:21.5

WORKDIR /app

COPY . .

RUN npm install

CMD ["npm", "run", "dev"]
