import React, { ChangeEvent, FC, FormEvent, useState } from 'react';

interface FrontPageProps {
  createRoom(): void;
  joinRoom(room: string): void;
}

const FrontPage: FC<FrontPageProps> = ({ createRoom, joinRoom }) => {
  const [roomCode, setRoomCode] = useState('');

  const onRoomCodeChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setRoomCode(evt.target.value);
  };
 
  const onJoinRoom = (evt: FormEvent) => {
    evt.preventDefault();
    joinRoom(roomCode);
  }

  return (
    <div>
      <button onClick={createRoom} className="btn btn-lg btn-success">Create New Room</button>
      <hr></hr>
      <form onSubmit={onJoinRoom}>
        <label>Enter Room Code</label>
        <input name="room" type="text" maxLength={6} onChange={onRoomCodeChange} className="room-code-input"></input>
        <button type="submit" onClick={onJoinRoom} disabled={roomCode.length != 6} className="btn btn-lg btn-info">Join Room</button>
      </form>
    </div>
  );
}
export default FrontPage;