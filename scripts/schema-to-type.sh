json2ts configschema.json > src/types/configschema.ts

for f in $(find schemas -name "*.json" | sed -r 's/^(.*)\.json$/\1/')
do
	json2ts $f.json > src/types/$f.ts
done
