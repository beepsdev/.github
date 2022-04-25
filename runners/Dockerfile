FROM ubuntu:latest
LABEL maintainer="git@beeps.dev"

RUN apt-get update -y && apt-get install curl liblttng-ust1 libkrb5-3 zlib1g libicu-dev jq -y

ENV AGENT_TOOLSDIRECTORY=/opt/hostedtools
RUN mkdir -p /opt/hostedtools

run mkdir /app/
WORKDIR /app/

RUN curl -o actions-runner-linux-x64-2.290.1.tar.gz -L https://github.com/actions/runner/releases/download/v2.290.1/actions-runner-linux-x64-2.290.1.tar.gz
RUN tar xzf ./actions-runner-linux-x64-2.290.1.tar.gz

COPY entrypoint.sh ./entrypoint.sh
COPY fixinstall.sh ./bin/installdependencies.sh
RUN chmod +x ./entrypoint.sh ./bin/installdependencies.sh
CMD ["./entrypoint.sh"]