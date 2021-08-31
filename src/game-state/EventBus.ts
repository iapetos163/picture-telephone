type Listeners = Map<Symbol, ((data: any) => void)>;
export type Subscription = Symbol;

export default class EventBus<EventType> {
  private getListeners: (event: EventType) => Listeners = e => new Map();

  public publish<DataType>(event: EventType, data: DataType, exclude?: Set<Subscription>) {
    const listeners = this.getListeners(event);
    for (const [key, listener] of listeners) {
      if (!exclude || !exclude.has(key)) listener(data);
    }
  }

  public subscribe<DataType>(event: EventType, listener: (data: DataType) => void): Subscription {
    const prevGetListeners = this.getListeners;
    const key = Symbol();
    this.getListeners = (e: EventType) => {
      const listeners = prevGetListeners(e);
      if (e === event) {
        listeners.set(key, listener);
      }
      return listeners;
    };
    return key;
  }

  public unsubscribe(event: EventType, key: Subscription) {
    const prevGetListeners = this.getListeners;
    this.getListeners = (e: EventType) => {
      const listeners = prevGetListeners(e);
      if (e === event) {
        listeners.delete(key);
      }
      return listeners;
    };
  }
}