export default class EventBus<EventType> {
  private getListeners: (event: EventType) => ((data: any) => void)[] = e => []; 

  public publish<DataType>(event: EventType, data: DataType) {
    const listeners = this.getListeners(event);
    for (const listener of listeners) {
      listener(data);
    }
  }

  public subscribe<DataType>(event: EventType, listener: (data: DataType) => void) {
    const prevGetListeners = this.getListeners;
    this.getListeners = (e: EventType) => {
      const listeners = prevGetListeners(e);
      if (e === event) {
        listeners.push(listener);
      }
      return listeners;
    }
  }
}