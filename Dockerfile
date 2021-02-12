FROM node:12

WORKDIR /usr/src/app

COPY server/package*.json server/

WORKDIR /usr/src/app/server

RUN npm i

COPY . .

EXPOSE 3000

VOLUME [ "/user/src/app" ]

CMD npm run start