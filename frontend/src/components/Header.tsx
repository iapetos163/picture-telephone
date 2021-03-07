import React, { FC } from 'react';

interface HeaderProps {
  lobbyCount: number | undefined;
}

const Header: FC<HeaderProps> = ({ lobbyCount }) => {
  return (
    <header>
      <nav>
        {lobbyCount !== undefined && <p>{lobbyCount} Player{lobbyCount === 1 ? '' : 's'} in Lobby</p>}
      </nav>
    </header>
  );
}
export default Header;