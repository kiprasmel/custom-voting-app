# Custom voting app

## Start the app in production

- using `pm2`

```bash
pm2 start npm --name "voting" -- start
```

## Todos

- create performance tests for the API to make sure our optimizations are actually working

  - also, take averages, because some tests of only single iteration might not be accurate

- way later - implement user auth & change Poll.js Model's author to be ObjectId & modify create poll route & it's dependants

**Copyright (c) Kipras Melnikovas 2018**
