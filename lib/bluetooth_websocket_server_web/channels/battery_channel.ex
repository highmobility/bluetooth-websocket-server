defmodule BluetoothWebsocketServerWeb.BatteryChannel do
  require Logger
  use Phoenix.Channel

  @battery_service "0000180F-0000-1000-8000-00805f9b34fb"
  @battery_level_characteristic "00002A19-0000-1000-8000-00805f9b34fb"

  @services ["battery_service"]

  def join("bws:battery", _message, socket) do
    Logger.debug "BatteryChannel joined by socket: #{inspect socket}"

    send self, :after_join
    {:ok, socket}
  end

  def join("bws:" <> _session_id, _params, _socket) do
    {:error, %{reason: "unauthorized"}}
  end

  def handle_info(:after_join, socket) do
    push socket, "request_device", %{ filters: [%{ services: @services }] }

    { :noreply, socket }
  end

  def handle_in("device_found", params, socket) do
    Logger.debug "device_found: #{inspect params}"

    push socket, "connect_device", %{ device_id: params["device_id"] }

    {:noreply, socket}
  end

  def handle_in("device_connected", params, socket) do
    Logger.debug "device_connected: #{inspect params}"

    push socket, "discover_service", %{ device_id: params["device_id"],
                                        service_uuid: @battery_service }
    {:noreply, socket}
  end

  def handle_in("service_found", params, socket) do
    Logger.debug "service_found: #{inspect params}"

    # Discover write characteristic
    push socket, "discover_characteristic", %{ device_id: params["device_id"],
                                               service_uuid: params["service_uuid"],
                                               characteristic_uuid: @battery_level_characteristic }
    {:noreply, socket}
  end

  def handle_in("characteristic_found", params, socket) do
    Logger.debug "characteristic_found: #{inspect params}"

    push socket, "start_notifications", %{ device_id: params["device_id"],
                                           service_uuid: params["service_uuid"],
                                           characteristic_uuid: @battery_level_characteristic }

    {:noreply, socket}
  end

  def handle_in("notifications_started", params, socket) do
    Logger.debug "notifications_started: #{inspect params}"

    # The notifications for the characteristic were successfully started

    {:noreply, socket}
  end

  def handle_in("characteristic_value_written", params, socket) do
    Logger.debug "characteristic_value_written: #{inspect params}"

    # Callback for when a characteristic value was successfully sent to the device.
    # Here unused.

    {:noreply, socket}
  end

  def handle_in("notification_received", params, socket) do
    Logger.debug "notification_received: #{inspect params}"

    push socket, "read_characteristic_value", %{ device_id: params["device_id"],
                                                 service_uuid: params["service_uuid"],
                                                 characteristic_uuid: params["characteristic_uuid"] }
    {:noreply, socket}
  end

  def handle_in("characteristic_value_read", params, socket) do
    Logger.debug "characteristic_value_read: #{inspect params}"

    battery_level = Base.decode64! params["characteristic_value"]
    Logger.info "Battery level: 0x#{inspect Base.encode16 battery_level}"

    {:noreply, socket}
  end

  def handle_in("notifications_stopped", params, socket) do
    Logger.debug "notifications_stopped: #{inspect params}"

    push socket, "disconnect_device", %{ device_id: params["device_id"] }

    {:noreply, socket}
  end

  def handle_in("device_disconnected", params, socket) do
    Logger.debug "device_disconnected: #{inspect params}"

    # Start scanning again
    push socket, "request_device", %{ services: @services }

    {:noreply, socket}
  end

  def handle_in("error", params, socket) do
    Logger.error "BatteryChannel error: #{inspect params}"

    {:noreply, socket}
  end
end
