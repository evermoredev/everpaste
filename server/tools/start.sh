#!/bin/bash
# For use with the everpaste.service file

cd ../../
sudo npm i
sudo npm prune
sudo npm run prod
