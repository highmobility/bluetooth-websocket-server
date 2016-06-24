// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "web/static/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/my_app/endpoint.ex":
import {Socket} from "deps/phoenix/web/static/js/phoenix"

let socket = new Socket("wss://localhost:4443/socket", {params: {token: window.userToken}})

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "web/templates/layout/app.html.eex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/2" function
// in "web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, pass the token on connect as below. Or remove it
// from connect if you don't care about authentication.

socket.connect()

// Now that you are connected, you can join channels with a topic:
let channel = socket.channel("bws:battery", {})

channel.on("request_device", msg => {
  console.log("Got Request Device", msg)

  // once the device has been scanned and found through Web BLE
  channel.push("device_found", {
    name: "Phone",
    device_id: "82:ba:e5:17:e0:e9",
    advertised_services: ["0000180F-0000-1000-8000-00805f9b34fb"],
    rssi: 56
  })
})

channel.on("connect_device", msg => {
  console.log("Got Connect Device", msg)

  // once the device has been connected through Web BLE
  channel.push("device_connected", {
    device_id: msg["device_id"]
  })
})

channel.on("discover_service", msg => {
  console.log("Got Discover Service", msg)

  // once the service has been discovered through Web BLE
  channel.push("service_found", {
    device_id: msg["device_id"],
    service_uuid: msg["service_uuid"]
  })
})

channel.on("discover_characteristic", msg => {
  console.log("Got Discover Characteristic", msg)

  // once the characteristic has been discovered through Web BLE
  channel.push("characteristic_found", {
    device_id: msg["device_id"],
    service_uuid: msg["service_uuid"],
    characteristic_uuid: msg["characteristic_uuid"]
  })
})

channel.on("start_notifications", msg => {
  console.log("Got Start Notifications", msg)

  // once the notifications have benn started through Web BLE
  channel.push("notifications_started", {
    device_id: msg["device_id"],
    service_uuid: msg["service_uuid"],
    characteristic_uuid: msg["characteristic_uuid"]
  })

  // once a notification is actuallt received through the Web BLE
  channel.push("notification_received", {
    device_id: msg["device_id"],
    service_uuid: msg["service_uuid"],
    characteristic_uuid: msg["characteristic_uuid"],
    characteristic_value: "Mg=="
  })
})

channel.on("read_characteristic_value", msg => {
  console.log("Got Read Characteristic Value", msg)

  // once the value has been read through Web BLE
  channel.push("characteristic_value_read", {
    device_id: msg["device_id"],
    service_uuid: msg["service_uuid"],
    characteristic_uuid: msg["characteristic_uuid"],
    characteristic_value: "Mg==" // Send dummy data, could be raw bytes base64 encoded
  })
})

channel.on("write_characteristic_value", msg => {
  console.log("Got Write Characteristic Value", msg)

  // once the value has been written through Web BLE
  channel.push("characteristic_value_written", {
    device_id: msg["device_id"],
    service_uuid: msg["service_uuid"],
    characteristic_uuid: msg["characteristic_uuid"],
    characteristic_value: msg["characteristic_value"]
  })
})

channel.on("stop_notifications", msg => {
  console.log("Got Stop Notifications", msg)

  // once notifications have beens stopped through Web BLE
  channel.push("notifications_stopped", {
    device_id: msg["device_id"],
    service_uuid: msg["service_uuid"],
    characteristic_uuid: msg["characteristic_uuid"]
  })
})

channel.on("disconnect_device", msg => {
  console.log("Got Disconnect Device", msg)

  // once the device has been disconnected through Web BLE
  channel.push("device_disconnected", {
    device_id: msg["device_id"]
  })
})

channel.join()
  .receive("ok", resp => {
    console.log("INIT Joined successfully", resp)
   })
  .receive("error", resp => { console.log("Unable to join", resp) })

export default socket
