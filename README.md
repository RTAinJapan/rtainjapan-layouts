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
npm start
```
