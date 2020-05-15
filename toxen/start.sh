#!/usr/bin/env bash

uniroll pages/index.tsx --out public/.toxen/index.js
deno run --unstable --importmap import_map.json --allow-net --allow-read server.tsx