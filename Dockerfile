FROM node:4.3.1

ADD ./package.json /app/package.json

WORKDIR /app

RUN npm install --production

ENV NODE_ENV=production
ENV PORT=8080

ADD ./ /app

EXPOSE 8080

CMD [ "node", "dist/index.js" ]
