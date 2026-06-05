import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketClient {
  IO.Socket? socket;
  static SocketClient? _instance;
  SocketClient._internal() {
    socket = IO.io('http://192.168.1.10:3000', <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
    });
    socket!.connect();

    // Listeners
    socket!.onConnect((_) {
      print("Connected");
      print(socket!.id);
    });

    socket!.onDisconnect((_) {
      print('Disconnected');
    });

    socket!.onConnectError((data) {
      print('Connect Error: $data');
    });

    socket!.onError((data) {
      print('Socket Error: $data');
    });
  }

  static SocketClient get instance {
    _instance ??= SocketClient._internal();
    return _instance!;
  }
}
