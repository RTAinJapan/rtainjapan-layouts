# RTA in Japan Layouts

This is the [NodeCG](http://github.com/nodecg/nodecg) bundle used for the streaming overlay in RTA in Japan events.

## Local development

Start the development build server/watcher

```sh
npm install
npm run dev
```

`docker compose` is easiest to launch NodeCG on local environment, without installing NodeCG in the parent directory.

```sh
mkdir cfg
```

Then create and configure cfg/nodecg.json and/or cfg/rtainjapan-layouts.json

```sh
docker compose up
```

## Credits

- [NodeCG](https://github.com/nodecg/nodecg): Main framework. Made by Lange and contributors.
- [SupportClass](https://supportclass.net/): [sgdq2017-layouts](https://github.com/gamesdonequick/sgdq2017-layouts) influenced dashboard design, architecture, etc.
- [pppnt](https://twitter.com/pppnt): Graphics design.

## License

Source code (excluding image files) are destributed with MIT License.

License for image files is TBD. Please contact us if you need further information.
