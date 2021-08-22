import { List } from 'immutable';
import { SetStateAction } from "react";
import { Phase, Player, RoundType } from "./game-state";

export interface ShowcaseItem {
  elementType: 'image' | 'text';
  data: string;
}

interface ControllerProps {
  setPhase: React.Dispatch<SetStateAction<Phase>>;
  setRoom: React.Dispatch<SetStateAction<string>>;
  setRoundType: React.Dispatch<SetStateAction<RoundType>>;
  showcaseItems: List<ShowcaseItem>;
  setShowcaseItems: React.Dispatch<SetStateAction<List<ShowcaseItem>>>;
  setPlayers: React.Dispatch<SetStateAction<List<Player>>>;
  setPrevDescription: React.Dispatch<SetStateAction<string>>;
  setPrevPictureSource: React.Dispatch<SetStateAction<string>>;
  setWaiting: React.Dispatch<SetStateAction<boolean>>;
}

export class UIController {
  private readonly mock: boolean = false;
  private props?: ControllerProps;
  private static uninitError = new Error('UIController is not initialized');

  constructor(mock?: boolean) {
    this.mock = !!mock;
  }

  public refresh(props?: ControllerProps) {
    this.props = props;
  }

  public showcasePicture(source: string) {
    if (this.mock) return;
    if (!this.props) throw UIController.uninitError;
    const items = this.props.showcaseItems.push({ elementType: 'image', data: source });
    this.props.setShowcaseItems(items);
    this.props.showcaseItems = items;
  }

  public showcaseText(text: string) {
    if (this.mock) return;
    if (!this.props) throw UIController.uninitError;
    const items = this.props.showcaseItems.push({ elementType: 'text', data: text });
    this.props.setShowcaseItems(items);
    this.props.showcaseItems = items;
  }

  public clearShowcase() {
    if (this.mock) return;
    if (!this.props) throw UIController.uninitError;
    const items = List();
    this.props.setShowcaseItems(items);
    this.props.showcaseItems = items;
  }

  public displayPhase(phase: Phase) {
    if (this.mock) return;
    if (!this.props) throw UIController.uninitError;
    this.props.setPhase(phase);
  }

  public setPlayers(players: List<Player>) {
    if (this.mock) return;
    if (!this.props) throw UIController.uninitError;
    this.props.setPlayers(players);
  }

  public setRoom(room: string) {
    if (this.mock) return;
    if (!this.props) throw UIController.uninitError;
    this.props.setRoom(room);
  }

  public showWaiting() {
    if (this.mock) return;
    if (!this.props) throw UIController.uninitError;
    this.props.setWaiting(true);
  }

  public showDoneButton() {
    if (this.mock) return;
    if (!this.props) throw UIController.uninitError;
    this.props.setWaiting(false);
  }

  public showTextArea(prevPictureSource?: string) {
    if (this.mock) return;
    if (!this.props) throw UIController.uninitError;
    this.props.setPrevPictureSource(prevPictureSource || '');
    this.props.setRoundType('TEXT');
  }

  public showCanvas(prevDescription?: string) {
    if (this.mock) return;
    if (!this.props) throw UIController.uninitError;
    this.props.setPrevDescription(prevDescription || '');
    this.props.setRoundType('PICTURE');
  }
}