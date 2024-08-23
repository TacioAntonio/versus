# Socket.io

## Emitting event to the socket itself
> Emitindo evento para o próprio socket
```js
socket.emit('<event-name>', values...);
```

## Emitting event for all other sockets except for itself
> Emitindo evento para todos os outros sockets, menos para si mesmo
```js
socket.broadcast.emit('<event-name>', values...);
```

## Emitting event to all sockets, even to itself
> Emitindo evento para todos os sockets, até para si mesmo
```js
io.emit('<event-name>', values...);
```

## Remove all sockets from the room
> Remove todos os sockets da sala
```js
io.socketsLeave(<room-name>);
```

## Delete the room
> Deleta a sala
```js
delete io.of('/').adapter.rooms[<room-name>];
```