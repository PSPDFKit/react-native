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

