# deplo

mobile app for deplo.ai. check if your sites are up, see if a deploy finished, retry or roll back, and read build logs from your phone.

built with expo (react native + typescript) and a small express server.

## screens

- home: all projects, up/down and last deploy
- project: deploy history
- deploy: redeploy, retry, rollback
- logs: last 200 lines, errors in red, jump to error

you also get a push when a site goes down or a deploy finishes. tap it to open that deploy.

## run

server:

```
cd server
npm install
npm start
```

app:

```
npm install
npm start
```

on a real phone set `EXPO_PUBLIC_API_URL` to your laptop ip, like `http://192.168.1.5:4000`.
push notifications only work on a real device.
