#!/bin/bash
# This could be a makefile but hey ¯\_(ツ)_/¯
# It could be part of the webpack config too I guess but hey ¯\_(シ)_/¯

set -e
set -u
set -o pipefail

PATH=node_modules/.bin/:$PATH
BUILD_ENV=${BUILD_ENV:-"RELEASE"}

if [ ! -f "package.json" ]; then
    echo "Run me from the root of your working copy"
    exit 1;
fi

echo "Freshening the dist dir"
npm run clean

echo "Copying assets"
cp -v assets/* dist/assets/

echo "Installing manifest"
node bin/generate-manifest.js \
     > dist/manifest.json

if [[ $BUILD_ENV == "RELEASE" ]]; then
    echo "Building script bundles for release"
    webpack --config .webpack.config.build.js

    echo "Building extension package (dist/firemacs-quantum.zip)"
    (cd dist/; zip -rm firemacs-quantum.zip *)

    echo "Done!"
else
    echo "Starting build watcher for dev"
    echo "(install temp extension from dist/)"
    webpack --config .webpack.config.dev.js
fi
