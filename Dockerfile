FROM node:12

WORKDIR /usr/src/app

COPY server/package*.json server/

RUN cd server && npm i

COPY . .

EXPOSE 3000

CMD ["cd server && npm start"]