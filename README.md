# Custom voting app

## Serve in production from 0

### build remotely

> building locally might be more cumbersome due to having to clone the image from dockerhub. Instead, we clone the git repo & then build remotely.

> note - this assumes you've got an ssh key, and have copied the public part of it to the remote server's user's `~/.ssh/authorized_keys` file either manually or using `ssh-copy-id`, and you've pushed your source code into a remote repository

* ssh to remote machine

```sh
ssh <username>@<host>
```

* clone git repo

```sh
# on remote machine:
git clone git@github.com:sarpik/custom-voting-app.git
sudo docker build .
```

* copy the hash once the build finishes

* run the built image as a container

```sh
sudo docker run -p 5000:5000 <the-hash-docker-build-gave-you>
```

fin

---

## Todos

- Create `docker-compose.yml`

- create performance tests for the API to make sure our optimizations are actually working

  - also, take averages, because some tests of only single iteration might not be accurate

- way later - implement user auth & change Poll.js Model's author to be ObjectId & modify create poll route & it's dependants

**Copyright (c) Kipras Melnikovas 2018**
