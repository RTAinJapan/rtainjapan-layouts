FROM node:10.14.0 AS build

RUN yarn global add bower

WORKDIR /nodecg
COPY package.json yarn.lock Makefile ./
RUN yarn

WORKDIR /nodecg/rtainjapan-layouts
COPY rtainjapan-layouts/package.json rtainjapan-layouts/yarn.lock ./
RUN yarn

COPY . /nodecg/
RUN NODE_ENV=production yarn webpack


FROM node:10.14.0-alpine AS node_modules_build

ENV NODE_ENV=production

RUN apk --no-cache add make bash git && yarn global add bower

WORKDIR /nodecg
COPY package.json yarn.lock Makefile ./
RUN yarn

WORKDIR /nodecg/rtainjapan-layouts
COPY rtainjapan-layouts/package.json rtainjapan-layouts/yarn.lock ./
RUN yarn


FROM node:10.14.0-alpine AS run

ENV NODE_ENV=production

WORKDIR /nodecg
COPY --from=build /nodecg/package.json ./
COPY --from=node_modules_build /nodecg/node_modules ./node_modules

WORKDIR /nodecg/rtainjapan-layouts
COPY --from=build /nodecg/rtainjapan-layouts/dashboard ./dashboard
COPY --from=build /nodecg/rtainjapan-layouts/graphics ./graphics
COPY --from=build /nodecg/rtainjapan-layouts/extension ./extension
COPY --from=build /nodecg/rtainjapan-layouts/package.json ./
COPY --from=node_modules_build /nodecg/rtainjapan-layouts/node_modules ./node_modules

WORKDIR /nodecg
RUN mkdir cfg

EXPOSE 9090

CMD [ "yarn", "start" ]
