# Custom voting app

## Serve in production

* ~~in the remote machine, make sure port `5000` is not taken, then run~~

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

- way later - implement user auth & change Poll.js Model's author to be ObjectId & modify create poll route & it's dependants

**Copyright (c) Kipras Melnikovas 2018**
