# RTA in Japan Layouts

[![Greenkeeper badge](https://badges.greenkeeper.io/Hoishin/rtainjapan-layouts.svg)](https://greenkeeper.io/)

This is a [NodeCG](http://github.com/nodecg/nodecg) application. 

## Usage

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

## Usage without Docker

Alternatively, you can use Node.js to use this bundle. You will need to manually install Node.js before the following scripts.

```sh
# Clone and install NodeCG
npm install -g bower
git clone https://github.com/nodecg/nodecg.git
cd nodecg
npm install --production
bower install

# Clone and install the bundle
cd bundles
git clone https://github.com/Hoishin/rtainjapan-layouts.git
cd rtainjapan-layouts
npm install --production
bower install
```