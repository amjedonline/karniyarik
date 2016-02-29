#!/bin/bash

docker run -p 27017:27017 -v /data/db/ -d amjedonline/alomongo:0.1.0-SNAPSHOT
