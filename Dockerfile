FROM node:10-slim

WORKDIR /usr/src/app
RUN npm install -g yarn

COPY package.json .
COPY yarn.lock .
RUN yarn

COPY . .
RUN yarn build
RUN yarn --production

EXPOSE 3000
CMD [ "yarn", "start:prod" ]
