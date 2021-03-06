#!/bin/bash

# skip if build is triggered by pull request
if [ $TRAVIS_PULL_REQUEST == "true" ]; then
  echo "this is PR, exiting"
  exit 0
fi

# enable error reporting to the console
set -e

# cleanup "_site"
rm -rf _site
mkdir _site

# clone remote repo to "_site"
git clone https://${GH_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git --branch master _site

# build with Jekyll into "_site"
npm install
bundle exec jekyll build

# push
cd _site
git config user.email "edward.compton@btinernet.com"
git config user.name "Edward Compton"
git add --all
git commit -a -m "Travis Deploy #$TRAVIS_BUILD_NUMBER"
git push --force origin master
