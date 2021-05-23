import EventBus from './EventBus';

type TestEvent = 'A' | 'B';
type AData = 'aaa' | 'AAA';
type BData = 'bbb';

describe('EventBus', () => {
  it('Invokes the correct subscriptions', () => {
    const bus = new EventBus<TestEvent>();
  
    const cbA1 = jest.fn();
    const cbA2 = jest.fn();
    const cbB = jest.fn();
    bus.subscribe('A', cbA1);
    bus.subscribe('A', cbA2);
    bus.subscribe('B', cbB);

    bus.publish<AData>('A', 'aaa');
    expect(cbA1).toHaveBeenLastCalledWith('aaa');
    expect(cbA2).toHaveBeenLastCalledWith('aaa');
    expect(cbB).not.toHaveBeenCalled();

    bus.publish<BData>('B', 'bbb');
    expect(cbA1).toHaveBeenCalledTimes(1);
    expect(cbA2).toHaveBeenCalledTimes(1);
    expect(cbB).toHaveBeenLastCalledWith('bbb');

    bus.publish<AData>('A', 'AAA');
    expect(cbA1).toHaveBeenLastCalledWith('AAA');
    expect(cbA2).toHaveBeenLastCalledWith('AAA');
    expect(cbB).toHaveBeenCalledTimes(1);
  });

  it('Can unsubscribe', () => {
    const bus = new EventBus<TestEvent>();
  
    const cb = jest.fn();
    const sub = bus.subscribe('A', cb);

    bus.publish<AData>('A', 'aaa');
    expect(cb).toHaveBeenCalled();

    bus.unsubscribe('A', sub);
    bus.publish<AData>('A', 'AAA');
    expect(cb).toHaveBeenCalledTimes(1);
  });
})
