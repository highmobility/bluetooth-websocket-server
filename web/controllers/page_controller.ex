defmodule BluetoothWebsocketServer.PageController do
  use BluetoothWebsocketServer.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
