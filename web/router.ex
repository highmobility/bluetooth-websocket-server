defmodule BluetoothWebsocketServer.Router do
  use BluetoothWebsocketServer.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", BluetoothWebsocketServer do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    get "/websocket-client", ClientController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", BluetoothWebsocketServer do
  #   pipe_through :api
  # end
end
