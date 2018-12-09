FROM node:10.14.0 AS build

WORKDIR /nodecg
COPY . ./
RUN yarn && cd rtainjapan-layouts && yarn && NODE_ENV=production yarn webpack

FROM node:10.14.0-alpine AS run

ENV NODE_ENV=production

WORKDIR /nodecg/rtainjapan-layouts
COPY --from=build /nodecg/rtainjapan-layouts/dashboard ./dashboard
COPY --from=build /nodecg/rtainjapan-layouts/graphics ./graphics
COPY --from=build /nodecg/rtainjapan-layouts/extension ./extension
COPY --from=build /nodecg/rtainjapan-layouts/package.json /nodecg/rtainjapan-layouts/yarn.lock ./

WORKDIR /nodecg
COPY --from=build /nodecg/package.json /nodecg/yarn.lock /nodecg/Makefile ./

RUN yarn && cd rtainjapan-layouts && yarn

EXPOSE 9090

CMD [ "yarn", "start" ]
