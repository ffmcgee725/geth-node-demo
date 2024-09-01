## Instructions

This dockerized setup includes:
- A `geth` node configured with a provided `genesis.json` for a private network
- A Blockchain API
- An API client

## Start up
If no `.env` file is present in root directory, copy over from `.env.example` 

Make sure you have docker installed in your machine and run either
```sh
docker-compose build --no-cache
docker-compose up
```
or
```sh
docker compose up --build
```

- Mount images for the `geth` node
- Start a service exposing an API accessible from the host to query token data described in [Blockchain API](#blockchain-api)
    For documentation check `http://localhost:8080/api`
- Prints the expected output described in [Api Client](#api-client) to `stdout`.
    The token balance for each ethereum address in `addresses.json`. Format: `<address>: <amount> <symbol>`
    The total token balance for each user in `addresses.json`. Format: `<user name>: <amount> <symbol>`
