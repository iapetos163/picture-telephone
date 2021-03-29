import { getPhase, submitPicture, submitText } from '.';
import { phrases, images } from './mock-data.json';
import { joinLobby } from './mock-server';

export default class MockPlayer {
  private readonly id: number;
  private round = 0;

  public static players: MockPlayer[] = [];

  constructor(id: number) {
    this.id = id;
    setTimeout(() => {
      joinLobby(new Date());
    }, Math.random() * 3000);
  }

  private playRound() {
    setTimeout(() => {
      if (this.round % 2 === 0) {
        submitText(this.id, phrases[Math.floor(Math.random() * phrases.length)]);
      } else {
        submitPicture(this.id, images[Math.floor(Math.random() * images.length)]);
      }
    }, Math.random() * 10000)
  }

  protected startGame() {
    this.playRound();
  }

  protected nextRound() {
    this.round++;
    this.playRound();
  }
  
  public static allStartGame() {
    for (const player of MockPlayer.players) {
      player.startGame();
    }
  }

  public static allNextRound() {
    if (getPhase() === 'CREATE') {
      for (const player of MockPlayer.players) {
        player.nextRound();
      }
    }
  }

  public static initialize(numPlayers: number) {
    for (let i=1; i <= numPlayers ; i++) {
      MockPlayer.players.push(new MockPlayer(i));
    }
  }
}