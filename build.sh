#!/bin/bash

mkdir -p dist
while IFS= read -r file; do
  cat "$file" >> dist/timtween-playcanvas.tmp.js
done < filelist.txt

npx terser dist/timtween-playcanvas.tmp.js -o dist/timtween-playcanvas.min.js --compress --mangle

rm dist/timtween-playcanvas.tmp.js
