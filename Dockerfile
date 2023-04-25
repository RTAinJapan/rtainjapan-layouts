FROM ghcr.io/nodecg/nodecg:2 AS dev

WORKDIR /opt/nodecg/bundles/rtainjapan-layouts

COPY package.json package-lock.json ./
RUN npm ci

WORKDIR /opt/nodecg


FROM ghcr.io/nodecg/nodecg:2 AS npm

WORKDIR /rtainjapan-layouts

COPY package.json package-lock.json ./
RUN npm ci --omit=dev


FROM ghcr.io/nodecg/nodecg:2 AS build

WORKDIR /rtainjapan-layouts

COPY package.json package-lock.json ./
RUN npm ci

COPY schemas schemas
COPY src src
COPY spotify-callback spotify-callback
COPY webpack webpack
COPY .babelrc configschema.json tsconfig.json webpack.config.ts ./

RUN npm run build


FROM ghcr.io/nodecg/nodecg:2 AS prod

WORKDIR /opt/nodecg/bundles/rtainjapan-layouts

COPY --from=npm /rtainjapan-layouts/package.json ./
COPY --from=npm /rtainjapan-layouts/node_modules node_modules
COPY --from=build /rtainjapan-layouts/configschema.json ./
COPY --from=build /rtainjapan-layouts/dashboard dashboard
COPY --from=build /rtainjapan-layouts/extension extension
COPY --from=build /rtainjapan-layouts/graphics graphics
COPY --from=build /rtainjapan-layouts/schemas schemas
COPY --from=build /rtainjapan-layouts/spotify-callback spotify-callback
