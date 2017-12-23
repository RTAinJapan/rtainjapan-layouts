# RTA in Japan Layouts

[![Greenkeeper badge](https://badges.greenkeeper.io/Hoishin/rtainjapan-layouts.svg)](https://greenkeeper.io/)

This is a [NodeCG](http://github.com/nodecg/nodecg) application.

This project is based on [GamesDoneQuick Layouts](https://github.com/GamesDoneQuick/sgdq17-layouts). Thank you so much for the hard work put into the series of layouts. Thier work inspired me to get into software engineering.

## Usage without Docker

You will need to install NodeCG on your machine/server.

PM2 is recommended for production.

```sh
# Clone and install NodeCG
sudo npm install -g bower
git clone https://github.com/nodecg/nodecg.git
cd nodecg
sudo npm install --production
sudo bower install --allow-root

# Clone and install the bundle
cd bundles
git clone https://github.com/Hoishin/rtainjapan-layouts.git
cd rtainjapan-layouts
sudo npm install --production
sudo bower install --allow-root

# Start the app
cd ../..
node index.js
```

## Usage with Docker

**`Dockerfile` and `docker-compose.yml` are not maintained. You will need to fix them if this doesn't work.**

It is built on `nodecg/nodecg` Docker image. You will need to have `docker` and `docker-compose` available on your machine/server.

Docker does not work on Windows 10 Home.

```sh
# Download the master branch
git clone https://github.com/Hoishin/rtainjapan-layouts.git
cd rtainjapan-layouts

# Build image upon NodeCG
docker-compose build

# Start the app
docker-compose up
```