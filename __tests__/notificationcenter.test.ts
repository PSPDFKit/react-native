import { NotificationCenter } from '../src/notification-center/NotificationCenter';
import { NativeModules, NativeEventEmitter, findNodeHandle } from 'react-native';

const mockAddListener = jest.fn();
const mockRemove = jest.fn();

jest.mock('react-native', () => {
  const actual = jest.requireActual('react-native');
  return {
    ...actual,
    NativeModules: {
      ...actual.NativeModules,
      Nutrient: {
        handleListenerAdded: jest.fn(),
        handleListenerRemoved: jest.fn(),
      },
    },
    NativeEventEmitter: jest.fn().mockImplementation(() => ({
      addListener: mockAddListener,
    })),
    findNodeHandle: jest.fn(() => 1234),
  };
});

jest.mock('../src/ArchitectureDetector', () => ({
  isNewArchitectureEnabled: jest.fn(() => false), // Default to Paper
}));

describe('NotificationCenter', () => {
  let notificationCenter: NotificationCenter;
  const mockPdfViewRef = { current: 1234 };

  beforeEach(() => {
    jest.clearAllMocks();
    mockAddListener.mockReturnValue({ remove: mockRemove });
    notificationCenter = new NotificationCenter(mockPdfViewRef);
  });

  test('subscribe stores subscription and calls handleListenerAdded', () => {
    const callback = jest.fn();
    notificationCenter.subscribe('documentLoaded', callback);
    
    expect(notificationCenter.subscribedEvents.has('documentLoaded')).toBe(true);
    expect(NativeModules.Nutrient.handleListenerAdded).toHaveBeenCalledWith('documentLoaded', 1234);
    expect(mockAddListener).toHaveBeenCalledWith('documentLoaded', expect.any(Function));
  });

  test('subscribe filters events by componentID', () => {
    const callback = jest.fn();
    notificationCenter.subscribe('documentLoaded', callback);
    
    // Get the event handler that was passed to addListener
    const eventHandler = mockAddListener.mock.calls[0][1];
    
    // Simulate event with matching componentID
    eventHandler({ componentID: 1234, data: { documentID: 'test' } });
    
    expect(callback).toHaveBeenCalledWith({ documentID: 'test' });
  });

  test('subscribe ignores events with different componentID', () => {
    const callback = jest.fn();
    notificationCenter.subscribe('documentLoaded', callback);
    
    // Get the event handler
    const eventHandler = mockAddListener.mock.calls[0][1];
    
    // Simulate event with different componentID
    eventHandler({ componentID: 9999, data: { documentID: 'test' } });
    
    expect(callback).not.toHaveBeenCalled();
  });

  test('subscribe allows analytics events regardless of componentID', () => {
    const callback = jest.fn();
    notificationCenter.subscribe(NotificationCenter.AnalyticsEvent.ANALYTICS, callback);
    
    // Get the event handler
    const eventHandler = mockAddListener.mock.calls[0][1];
    
    // Simulate analytics event with different componentID
    eventHandler({ componentID: 9999, data: { event: 'test' } });
    
    expect(callback).toHaveBeenCalledWith({ event: 'test' });
  });

  test('unsubscribe removes subscription and calls handleListenerRemoved', () => {
    const callback = jest.fn();
    notificationCenter.subscribe('documentLoaded', callback);
    notificationCenter.unsubscribe('documentLoaded');
    
    expect(mockRemove).toHaveBeenCalled();
    expect(notificationCenter.subscribedEvents.has('documentLoaded')).toBe(false);
    expect(NativeModules.Nutrient.handleListenerRemoved).toHaveBeenCalledWith('documentLoaded', 1234);
  });

  test('unsubscribeAllEvents removes all subscriptions', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    notificationCenter.subscribe('documentLoaded', callback1);
    notificationCenter.subscribe('documentLoadFailed', callback2);
    notificationCenter.unsubscribeAllEvents();

    expect(mockRemove).toHaveBeenCalledTimes(2);
    expect(notificationCenter.subscribedEvents.size).toBe(0);
    expect(NativeModules.Nutrient.handleListenerRemoved).toHaveBeenCalledTimes(2);
  });
});

// Multiple listeners per event must work independently: each subscription
// handle removes only its own listener, native is notified only on the first
// add and last removal, and bare unsubscribe(event) removes all listeners for
// the event (backwards-compatible behavior).
describe('NotificationCenter multi-listener support', () => {
  const EVENT = 'documentViewportChanged';
  let notificationCenter: NotificationCenter;
  let emitterListeners: Array<(payload: any) => void>;

  const emit = (data: any) => {
    // Copy so removals during iteration behave like the real emitter.
    [...emitterListeners].forEach(listener =>
      listener({ componentID: 1234, data }),
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    emitterListeners = [];
    // Stateful emitter: tracks which listeners are actually registered so
    // orphaned subscriptions keep receiving events, like in the real emitter.
    mockAddListener.mockImplementation((_event, handler) => {
      emitterListeners.push(handler);
      return {
        remove: () => {
          emitterListeners = emitterListeners.filter(l => l !== handler);
        },
      };
    });
    notificationCenter = new NotificationCenter({ current: 1234 });
  });

  test('delivers events to both listeners while both are subscribed', () => {
    const first = jest.fn();
    const second = jest.fn();
    notificationCenter.subscribe(EVENT, first);
    notificationCenter.subscribe(EVENT, second);

    emit({ zoomScale: 2 });

    expect(first).toHaveBeenCalledWith({ zoomScale: 2 });
    expect(second).toHaveBeenCalledWith({ zoomScale: 2 });
  });

  test('a subscription handle removes only its own listener', () => {
    const first = jest.fn();
    const second = jest.fn();
    const firstSubscription = notificationCenter.subscribe(EVENT, first);
    notificationCenter.subscribe(EVENT, second);

    firstSubscription.remove();
    emit({ zoomScale: 3 });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith({ zoomScale: 3 });
  });

  test('removing a handle twice is a safe no-op', () => {
    const first = jest.fn();
    const second = jest.fn();
    const firstSubscription = notificationCenter.subscribe(EVENT, first);
    notificationCenter.subscribe(EVENT, second);

    firstSubscription.remove();
    firstSubscription.remove();
    emit({ zoomScale: 4 });

    expect(second).toHaveBeenCalledWith({ zoomScale: 4 });
    expect(emitterListeners).toHaveLength(1);
  });

  test('native is notified only on the first add and the last removal', () => {
    const firstSubscription = notificationCenter.subscribe(EVENT, jest.fn());
    const secondSubscription = notificationCenter.subscribe(EVENT, jest.fn());
    expect(NativeModules.Nutrient.handleListenerAdded).toHaveBeenCalledTimes(1);

    firstSubscription.remove();
    expect(NativeModules.Nutrient.handleListenerRemoved).not.toHaveBeenCalled();

    secondSubscription.remove();
    expect(NativeModules.Nutrient.handleListenerRemoved).toHaveBeenCalledTimes(1);
    expect(NativeModules.Nutrient.handleListenerRemoved).toHaveBeenCalledWith(
      EVENT,
      1234,
    );
  });

  test('unsubscribe(event) removes all listeners for the event', () => {
    const first = jest.fn();
    const second = jest.fn();
    notificationCenter.subscribe(EVENT, first);
    notificationCenter.subscribe(EVENT, second);

    notificationCenter.unsubscribe(EVENT);
    emit({ zoomScale: 5 });

    expect(first).not.toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();
    expect(emitterListeners).toHaveLength(0);
    expect(NativeModules.Nutrient.handleListenerRemoved).toHaveBeenCalledTimes(1);
  });

  test('unsubscribeAllEvents removes every listener including same-event duplicates', () => {
    const first = jest.fn();
    const second = jest.fn();
    notificationCenter.subscribe(EVENT, first);
    notificationCenter.subscribe(EVENT, second);

    notificationCenter.unsubscribeAllEvents();
    emit({ zoomScale: 6 });

    expect(first).not.toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();
    expect(notificationCenter.subscribedEvents.size).toBe(0);
  });
});

