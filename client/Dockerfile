FROM node:12-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run react-dev
CMD ["npm", "run", "start"]