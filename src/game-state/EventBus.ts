type Listeners = Map<Symbol, ((data: any) => void)>

export default class EventBus<EventType> {
  private getListeners: (event: EventType) => Listeners = e => new Map();

  public publish<DataType>(event: EventType, data: DataType) {
    const listeners = this.getListeners(event);
    for (const listener of listeners.values()) {
      listener(data);
    }
  }

  public subscribe<DataType>(event: EventType, listener: (data: DataType) => void): Symbol {
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

  public unsubscribe(event: EventType, key: Symbol) {
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