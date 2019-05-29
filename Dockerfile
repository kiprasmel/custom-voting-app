# Dockerfile
#
# Copyright (c) 2019 Kipras Melnikovas (kipras.org) <kipras@kipras.org>
#

FROM node:11 as node

ENV workdir=/usr/src/app
ENV servecmd=serve

WORKDIR ${workdir}

# BEGIN v1
# COPY package*.json ./
# COPY client/package*.json ./client/
# COPY server/package*.json ./server/

# RUN npm run full-install
# END v1

# BEGIN v2
COPY package*.json ./
RUN npm i

COPY client/package*.json ./client/
RUN cd client && npm i && cd ..

COPY server/package*.json ./server/
RUN cd server && npm i && cd ..
# END v2

COPY . .

RUN npm run build

EXPOSE 5000

# we do NOT use an array of commands here
# (as ["npm", "run", "${servecmd}"] ),
# because the ${servecmd} would be interpreted directly,
# without giving the actual value of the variable.
# Read more @ https://stackoverflow.com/a/40454758
#
# Also,
# CMD ["sh", "-c", "npm run ${servecmd}"]
# would also work.
CMD npm run ${servecmd}
