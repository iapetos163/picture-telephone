#!/bin/bash
set -eu

git checkout -b tmp
git add --all
git commit -m "WIP"
git push origin tmp --force
git checkout master
git branch -D tmp