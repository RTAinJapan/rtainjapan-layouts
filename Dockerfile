FROM nodecg/nodecg

RUN mkdir -p /usr/src/app/bundles/rtainjapan

COPY \
  package-lock.json \
  package.json \
  bower.json \
  /usr/src/app/bundles/rtainjapan/

WORKDIR /usr/src/app/bundles/rtainjapan

RUN npm install
RUN bower install --allow-root

WORKDIR /usr/src/app