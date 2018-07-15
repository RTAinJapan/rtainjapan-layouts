#!/usr/bin/env bash

npx json2ts configschema.json > src/types/configschema.d.ts

for f in $(find schemas -name "*.json" | sed -r 's/^(.*)\.json$/\1/')
do
	npx json2ts $f.json > src/types/$f.d.ts
done
