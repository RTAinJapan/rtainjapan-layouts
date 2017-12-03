FROM nodecg/nodecg

RUN mkdir -p /usr/src/app/bundles/rtainjapan

COPY \
  app/package-lock.json \
  app/package.json \
  /usr/src/app/bundles/rtainjapan/

WORKDIR /usr/src/app/bundles/rtainjapan

RUN npm install

WORKDIR /usr/src/app