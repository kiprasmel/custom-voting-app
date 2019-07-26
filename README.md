# Custom voting app

## Serve in production

* in the remote machine, make sure port `5000` is not taken, then run

```sh
git clone git@github.com:kipras/custom-voting-app.git
cd custom-voting-app
sudo docker-compose up --build
```

* ~~take a walk~~

* or, if you're a danker individual

```sh
sudo docker run -p 5000:5000 kipras/custom-voting-app
```

## Todos

- Create `docker-compose.yml`

- create performance tests for the API to make sure our optimizations are actually working

  - also, take averages, because some tests of only single iteration might not be accurate

- way later - implement user auth & change Poll.js Model's author to be ObjectId & modify create poll route & it's dependants

**Copyright (c) Kipras Melnikovas 2018**
