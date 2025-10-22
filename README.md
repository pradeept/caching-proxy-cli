# caching-proxy

A text based forward-proxy server with caching capability.

## Pre-requisites
- Bun - [installation guide](https://bun.com/docs/installation)
- Node.js >=20.0

## Installation

- Clone the repo
``git clone <repo-url>``
- Cd into the project folder and install dependencies
``cd <project-folder> && bun install``
- Allow index.ts to execute
``chmod +x index.ts``
- Link the package
`` bun link``

__Now, you can use the app from anywhere in your computer by typing 
``caching-proxy`` in your terminal app.__

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

## Upcoming
- Npm package.
- Allow css, js and images through proxy.

## Credits
[Backend Projects - Roadmap.sh](https://roadmap.sh/projects/caching-server)