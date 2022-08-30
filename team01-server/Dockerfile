FROM node:14

WORKDIR /dangder/
COPY ./package.json /dangder/
COPY ./yarn.lock /dangder/
RUN yarn install

COPY . /dangder/
CMD yarn start:dev
