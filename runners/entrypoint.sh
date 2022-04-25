#!/bin/bash
rm -rf /app/
cp -R /template /app/
cd /app/

sleep $[ ( $RANDOM % 15 )  + 1 ]s

export RUNNER_ALLOW_RUNASROOT=1
export GH_REGISTRATION_KEY=$(curl \
  -X POST \
  -H "Authorization: token $GH_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/orgs/beepsdev/actions/runners/registration-token | jq -r .token)

echo "$GH_REGISTRATION_KEY"

./config.sh --url https://github.com/$GH_ORG --token $GH_REGISTRATION_KEY --ephemeral --unattended
./run.sh