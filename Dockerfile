FROM ubuntu:14.04
MAINTAINER Mohammed Amjed CHand <amjedonline@gmail.com>
RUN apt-get update && apt-get install -y \
    curl \
    nodejs \
    nodejs-legacy \
    npm \
    git

ENV NODE_ENV live

EXPOSE 3000

WORKDIR /var
RUN git clone https://github.com/amjedonline/karniyarik.git

WORKDIR /var/karniyarik/
RUN npm install
CMD ["node", "server.js"]
