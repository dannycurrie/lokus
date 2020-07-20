rm -rf ./build
rsync -av --relative --exclude=".*" --exclude="build/" ./ ./build