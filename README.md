# BluetoothWebsocketServer

Sample server written in the
[Phoenix framework](http://www.phoenixframework.org) to connect to the
[BLE Peripheral Simulator](https://github.com/WebBluetoothCG/ble-test-peripheral-android)
using the
[Bluetooth Websocket API](https://github.com/highmobility/bluetooth-websocket-api).

An example implementation of the client side is not provided yet.

Web Bluetooth requires an SSL connection, so be sure to generate your
keys following the steps below.

Unless you use proper SSL certificates (such as those provided by
[Let's Encrypt](https://letsencrypt.org/)) you will have to whitelist
your self-signed certificates before the websocket connections can occur.
You may done so manually visiting the server homepage using SSL (i.e.
going to https://localhost:4000 and adding a permanent exception).

### Enable SSL on localhost with Phoenix

```
mkdir -p priv/keys/
openssl genrsa -out priv/keys/localhost.key 2048
openssl req -new -x509 -key priv/keys/localhost.key -out priv/keys/localhost.cert -days 3650 -subj /CN=localhost
```


### To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Install Node.js dependencies with `cd assets && npm install`
  * Start Phoenix endpoint with `mix phx.server`

Now you can visit [`https://localhost:4000`](https://localhost:4000) from your browser.


### Learn more

  * Official website: http://www.phoenixframework.org/
  * Guides: http://phoenixframework.org/docs/overview
  * Docs: https://hexdocs.pm/phoenix
  * Mailing list: http://groups.google.com/group/phoenix-talk
  * Source: https://github.com/phoenixframework/phoenix
