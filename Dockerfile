FROM node:12

WORKDIR /usr/src/app

COPY . .

WORKDIR /usr/src/app/server

RUN npm i

EXPOSE 3000

VOLUME [ "/user/src/app" ]

CMD npm run start
