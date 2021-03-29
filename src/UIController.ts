import { List } from 'immutable';
import { SetStateAction } from "react";
import { Phase } from "./game-state";
import { RoundType } from "./game-state/Session";

export interface ShowcaseItem {
  elementType: 'image' | 'text';
  data: string;
}

interface ControllerProps {
  setPhase: React.Dispatch<SetStateAction<Phase>>;
  setRoundType: React.Dispatch<SetStateAction<RoundType>>;
  showcaseItems: List<ShowcaseItem>;
  setShowcaseItems: React.Dispatch<SetStateAction<List<ShowcaseItem>>>;
  setPrevDescription: React.Dispatch<SetStateAction<string>>;
  setPrevPictureSource: React.Dispatch<SetStateAction<string>>;
  setWaiting: React.Dispatch<SetStateAction<boolean>>;
}

export class UIController {
  private props?: ControllerProps;
  private static uninitError = new Error('UIController is not initialized');

  public refresh(props?: ControllerProps) {
    this.props = props;
  }

  public showcasePicture(source: string) {
    if (!this.props) throw UIController.uninitError;
    const items = this.props.showcaseItems.push({ elementType: 'image', data: source });
    this.props.setShowcaseItems(items);
    this.props.showcaseItems = items;
  }

  public showcaseText(text: string) {
    if (!this.props) throw UIController.uninitError;
    const items = this.props.showcaseItems.push({ elementType: 'text', data: text });
    this.props.setShowcaseItems(items);
    this.props.showcaseItems = items;
  }

  public clearShowcase() {
    if (!this.props) throw UIController.uninitError;
    const items = List();
    this.props.setShowcaseItems(items);
    this.props.showcaseItems = items;
  }

  public displayPhase(phase: Phase) {
    if (!this.props) throw UIController.uninitError;
    this.props.setPhase(phase);
  }

  public showWaiting() {
    if (!this.props) throw UIController.uninitError;
    this.props.setWaiting(true);
  }

  public showDoneButton() {
    if (!this.props) throw UIController.uninitError;
    this.props.setWaiting(false);
  }

  public showTextArea(prevPictureSource?: string) {
    if (!this.props) throw UIController.uninitError;
    this.props.setPrevPictureSource(prevPictureSource || '');
    this.props.setRoundType('TEXT');
  }

  public showCanvas(prevDescription?: string) {
    if (!this.props) throw UIController.uninitError;
    this.props.setPrevDescription(prevDescription || '');
    this.props.setRoundType('PICTURE');
  }
}