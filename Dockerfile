FROM ghcr.io/nodecg/nodecg:2 AS dev

WORKDIR /opt/nodecg/bundles/rtainjapan-layouts

COPY package.json package-lock.json ./
RUN npm ci

WORKDIR /opt/nodecg
