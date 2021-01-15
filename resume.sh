#!/bin/bash
set -eu

git fetch origin tmp
git rebase origin/tmp
git reset HEAD^ --soft
git reset .
