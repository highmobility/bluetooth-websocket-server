import {Socket} from "phoenix"

let socket = new Socket("/socket", {params: {token: window.userToken}})


socket.connect()

// Now that you are connected, you can join channels with a topic:
let channel = socket.channel("bws:battery", {})

function appendHtml(el, str) {
  var div = document.createElement('div');
  div.innerHTML = str;
  while (div.children.length > 0) {
    el.appendChild(div.children[0]);
  }
}

let log_it = function(title, msg) {
  console.log(title, msg)
  let consoleDiv = document.getElementById('console-logs')
  consoleDiv.innerHTML =  consoleDiv.innerHTML + `${title} : ${msg}<br />`
}

channel.on("request_device", msg => {
  log_it("Got Request Device", msg)

  // once the device has been scanned and found through Web BLE
  channel.push("device_found", {
    name: "Phone",
    device_id: "82:ba:e5:17:e0:e9",
    advertised_services: ["0000180F-0000-1000-8000-00805f9b34fb"],
    rssi: 56
  })
})

channel.on("connect_device", msg => {
  log_it("Got Connect Device", msg)

  // once the device has been connected through Web BLE
  channel.push("device_connected", {
    device_id: msg["device_id"]
  })
})

channel.on("discover_service", msg => {
  log_it("Got Discover Service", msg)

  // once the service has been discovered through Web BLE
  channel.push("service_found", {
    device_id: msg["device_id"],
    service_uuid: msg["service_uuid"]
  })
})

channel.on("discover_characteristic", msg => {
  log_it("Got Discover Characteristic", msg)

  // once the characteristic has been discovered through Web BLE
  channel.push("characteristic_found", {
    device_id: msg["device_id"],
    service_uuid: msg["service_uuid"],
    characteristic_uuid: msg["characteristic_uuid"]
  })
})

channel.on("start_notifications", msg => {
  log_it("Got Start Notifications", msg)

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
  log_it("Got Read Characteristic Value", msg)

  // once the value has been read through Web BLE
  channel.push("characteristic_value_read", {
    device_id: msg["device_id"],
    service_uuid: msg["service_uuid"],
    characteristic_uuid: msg["characteristic_uuid"],
    characteristic_value: "Mg==" // Send dummy data, could be raw bytes base64 encoded
  })
})

channel.on("write_characteristic_value", msg => {
  log_it("Got Write Characteristic Value", msg)

  // once the value has been written through Web BLE
  channel.push("characteristic_value_written", {
    device_id: msg["device_id"],
    service_uuid: msg["service_uuid"],
    characteristic_uuid: msg["characteristic_uuid"],
    characteristic_value: msg["characteristic_value"]
  })
})

channel.on("stop_notifications", msg => {
  log_it("Got Stop Notifications", msg)

  // once notifications have beens stopped through Web BLE
  channel.push("notifications_stopped", {
    device_id: msg["device_id"],
    service_uuid: msg["service_uuid"],
    characteristic_uuid: msg["characteristic_uuid"]
  })
})

channel.on("disconnect_device", msg => {
  log_it("Got Disconnect Device", msg)

  // once the device has been disconnected through Web BLE
  channel.push("device_disconnected", {
    device_id: msg["device_id"]
  })
})

channel.join()
  .receive("ok", resp => {
    log_it("INIT Joined successfully", resp)
   })
  .receive("error", resp => { log_it("Unable to join", resp) })

export default socket
