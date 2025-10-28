# caching-proxy

A text based forward-proxy server with caching capability.

## Pre-requisites
- Bun - [installation guide](https://bun.com/docs/installation)
- Node.js >=20.0

## Installation

### Using npm
```bash
npm i caching-proxy-cli
```
_Click here to view the package in [npm page](https://www.npmjs.com/package/caching-proxy-cli)._
### Manually

```bash
git clone <repo-url> # clone the repo
cd <project-folder> && bun install # install dependencies
chmod +x index.ts # allow execution
bun link # link the package to use from anywhere in your system
```
_Now, you can use the app from anywhere in your computer by typing 
``caching-proxy-cli`` in your terminal app._

## Options
-  __-V, --version__ : Output the version number
- __-p, --port <number>__ : Port for proxy server
- __-U, --url <URL>__ : URL of the server to which requests are forwarded
- __-R, --redis <hostname:port>__ : Provide the redis <hostname:port>
- __-C, --clear__: Clear cached responses
-  __-h, --help__: Display help for command


## Features

- Arguments validation.
- Forward proxy.
- Cache the response.
- Clear the cache store.

## Credits
[Backend Projects - Roadmap.sh](https://roadmap.sh/projects/caching-server)