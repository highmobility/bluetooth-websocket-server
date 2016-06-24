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
[Let's Encrypt](https://letsencrypt.org/) you will have to whitelist
your self-signed certificates before the websocket connections can occur.
You may done so manually visiting the server homepage using SSL (i.e.
going to https://localhost:4443 and adding a permanent exception).

### To start your Phoenix app:

  1. Install dependencies with `mix deps.get`
  2. Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  3. Start Phoenix endpoint with `mix phoenix.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

### To use SSL on localhost with Phoenix

  1. Generate key with `openssl genrsa -out localhost.key 2048`
  2. Generate cert with `openssl req -new -x509 -key localhost.key -out localhost.cert -days 3650 -subj /CN=localhost`
  3. Put them in a directory `priv/keys/`

Now you can visit [`localhost:4443`](https://localhost:4443) with SSL from your browser.

Ready to run in production? Please [check our deployment guides](http://www.phoenixframework.org/docs/deployment).

## Learn more

  * Bluetooth Websocket API: https://github.com/highmobility/bluetooth-websocket-api
  * Android BLE Peripheral Simulator: https://github.com/WebBluetoothCG/ble-test-peripheral-android
  * Web Bluetooth homepage: https://www.w3.org/community/web-bluetooth/
  * Let's Encrypt: https://letsencrypt.org/
  * Phoenix framework website: http://www.phoenixframework.org/
