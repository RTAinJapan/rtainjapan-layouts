set -eu

npm run prod

rsync -avh --delete \
dashboard extension graphics schemas spotify-callback \
configschema.json package.json package-lock.json \
$1
