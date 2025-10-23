#!/bin/bash

http-server -c-1 --cors &
node --watch bookmarklet.cjs &

google-chrome 'http://localhost:8888/' &
sleep 1
google-chrome 'https://en.wikipedia.org/wiki/Tokay_gecko' &
google-chrome 'http://localhost:8080/' &
google-chrome 'http://localhost:8080/bench.html#cache' &
