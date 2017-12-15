# RTA in Japan Layouts

[ ![Codeship Status for Hoishin/rtainjapan-layouts](https://app.codeship.com/projects/1a66d6f0-c3e7-0135-2bd6-5e1e25c4f686/status?branch=master)](https://app.codeship.com/projects/260852)
[![Greenkeeper badge](https://badges.greenkeeper.io/Hoishin/rtainjapan-layouts.svg)](https://greenkeeper.io/)

This is a [NodeCG](http://github.com/nodecg/nodecg) application.

## Usage with Docker

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

Alternatively, you can use Node.js to use this bundle. You will need to manually install Node.js 8.x before the following scripts.

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
```