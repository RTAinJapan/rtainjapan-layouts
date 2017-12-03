# RTA in Japan Layouts

This is a [NodeCG](http://github.com/nodecg/nodecg) application.

It uses `nodecg/nodecg` Docker image. You will need to have `docker` and `docker-compose` available on your machine.

Docker does not work on Windows 10 Home.

## Usage

```sh
# Download the master branch
git clone https://github.com/Hoishin/rtainjapan-layouts.git
cd rtainjapan-layouts

# Build image upon NodeCG
docker-compose build

# Start the app
docker-compose up
```