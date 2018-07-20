#!/usr/bin/env bash

mkdir -p src/types/schemas

./node_modules/.bin/json2ts configschema.json 1> src/types/schemas/configschema.d.ts

for f in $(ls schemas | grep '\.json$' | sed -r 's/^(.*)\.json$/\1/')
do
	./node_modules/.bin/json2ts ./schemas/$f.json 1> src/types/schemas/$f.d.ts
done
