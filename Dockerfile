FROM node:10.14.0 AS build

ARG TYPEKIT_ID

RUN yarn global add ts-node typescript

WORKDIR /nodecg
COPY package.json yarn.lock tsconfig.json ./
COPY scripts ./scripts
RUN yarn

WORKDIR /nodecg/rtainjapan-layouts
COPY rtainjapan-layouts/package.json rtainjapan-layouts/yarn.lock ./
RUN yarn

COPY . /nodecg/
RUN ts-node scripts/ts-to-schema.ts
RUN yarn csstypes
RUN NODE_ENV=production yarn webpack


FROM node:10.14.0-alpine

ENV NODE_ENV=production

WORKDIR /nodecg
COPY package.json yarn.lock ./
RUN yarn --ignore-scripts
COPY --from=build /nodecg/node_modules/nodecg /nodecg/node_modules/nodecg

WORKDIR /nodecg/rtainjapan-layouts
COPY rtainjapan-layouts/package.json rtainjapan-layouts/yarn.lock ./
RUN yarn --ignore-scripts
COPY --from=build /nodecg/rtainjapan-layouts/schemas ./schemas
COPY --from=build /nodecg/rtainjapan-layouts/configschema.json ./configschema.json
COPY --from=build /nodecg/rtainjapan-layouts/dashboard ./dashboard
COPY --from=build /nodecg/rtainjapan-layouts/graphics ./graphics
COPY --from=build /nodecg/rtainjapan-layouts/extension ./extension
COPY rtainjapan-layouts/twitter-callback ./twitter-callback
COPY rtainjapan-layouts/spotify-callback ./spotify-callback

WORKDIR /nodecg
RUN mkdir cfg db

EXPOSE 9090

CMD [ "yarn", "start" ]
