import React, { useEffect, useRef, useState } from 'react';
import { processColor, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NutrientView, {
  NotificationCenter,
  NutrientOverlay,
  NutrientOverlayItem,
} from '@nutrient-sdk/react-native';

import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';
import {
  renderWithBaseExampleSafeArea,
  useBaseExampleAutoHidingHeader,
} from '../helpers/ExampleScreenLayoutHelpers';

// Renders your own React Native components on top of the PDF, anchored to positions in the
// document, and keeps them aligned while the user pans and zooms.
//
// Two things are worth knowing before adapting this:
//
//  * `NutrientOverlay` must be a *sibling* of `NutrientView` inside a container the view fills,
//    and both must share the same ref. The overlay positions its children relative to its own
//    frame, so if the two views do not line up, every item is offset by the difference.
//
//  * `position` is in PDF points on `pageIndex`, and PDF coordinates start at the *bottom-left*
//    of the page and grow upwards. A y of 0 is the bottom edge, not the top.
//
// Items are ordinary React Native components: they receive touches, animate, and re-render like
// anything else, and items on pages that are not currently visible are not rendered at all.

type Pin = { id: number; pageIndex: number; position: { x: number; y: number } };

// Anchored to the first page of the Quickstart Guide, which is A4 (595 x 842 pt).
const INITIAL_PINS: Pin[] = [
  { id: 1, pageIndex: 0, position: { x: 90, y: 690 } },
  { id: 2, pageIndex: 1, position: { x: 300, y: 430 } },
];

// On iOS the first pull reports nothing until a page has been laid out, which is a moment after
// the document loads, so it is retried for about a second. `NutrientOverlay` retries too.
const PULL_ATTEMPTS = 10;
const PULL_RETRY_DELAY_MS = 100;

export const CustomOverlays = ({ navigation }: any) => {
  const pdfRef = useRef<NutrientView | null>(null);
  const [pins, setPins] = useState<Pin[]>(INITIAL_PINS);
  const [placing, setPlacing] = useState(false);
  const [viewport, setViewport] =
    useState<NotificationCenter.DocumentViewportChangedPayload | null>(null);
  const nextId = useRef(INITIAL_PINS.length + 1);
  useBaseExampleAutoHidingHeader(navigation);

  const subscription = useRef<{ remove: () => void } | undefined>(undefined);
  const pullTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (pullTimer.current !== undefined) {
        clearTimeout(pullTimer.current);
      }
      subscription.current?.remove();
    };
  }, []);

  // The event fires on scroll and zoom, not on load, so the first value has to be asked for.
  const pullViewportState = (attemptsLeft: number) => {
    const retry = () => {
      if (mounted.current && attemptsLeft > 1) {
        pullTimer.current = setTimeout(
          () => pullViewportState(attemptsLeft - 1),
          PULL_RETRY_DELAY_MS,
        );
      }
    };
    Promise.resolve(pdfRef.current?.getViewportState())
      .then(state => {
        if (!mounted.current) {
          return;
        }
        if (state) {
          setViewport(state);
        } else {
          retry();
        }
      })
      .catch(retry);
  };

  // The viewport event reports which page is currently anchored and how far the document is
  // zoomed. Here it is used to know which page a tap should attach to, and to label the toolbar.
  // Subscribing from `onDocumentLoaded` means the view behind the ref is there by the time this
  // runs, so there is no delay to guess at.
  const trackViewport = () => {
    subscription.current?.remove();
    subscription.current = pdfRef.current
      ?.getNotificationCenter()
      ?.subscribe(NotificationCenter.DocumentEvent.VIEWPORT_CHANGED, payload =>
        setViewport(payload),
      );
    pullViewportState(PULL_ATTEMPTS);
  };

  // Turns a tap on the overlay into a position in the document: the touch arrives in screen
  // points relative to the overlay, and `convertPointToPage` maps that onto the page.
  const placePinAtTap = async (screenPoint: { x: number; y: number }) => {
    // Leave placing mode before the conversion, otherwise the tap catcher keeps swallowing
    // touches while it is in flight.
    setPlacing(false);
    // Without a viewport there is no anchored page to attach the tap to, and page 0 would be a
    // guess that lands the pin on the wrong page.
    if (!viewport) {
      return;
    }
    const { pageIndex, pageSize } = viewport;
    const position = await pdfRef.current?.convertPointToPage(pageIndex, screenPoint);
    if (!position) {
      return;
    }
    // The conversion maps the tap onto `pageIndex` whatever it actually landed on. With
    // `scrollContinuous` two pages can share the viewport, so a tap on the neighbouring one
    // still converts, just to a point off the end of the anchor page: below it that is a
    // negative y, above it a y past the page height. A pin anchored there would sit on the
    // wrong page at a coordinate that is on no page at all, so drop those taps. `pageSize`
    // arrives on the same payload and already accounts for page rotation.
    if (
      position.x < 0 ||
      position.y < 0 ||
      position.x > pageSize.width ||
      position.y > pageSize.height
    ) {
      return;
    }
    setPins(current => [
      ...current,
      { id: nextId.current++, pageIndex, position },
    ]);
  };

  return (
    <View style={styles.flex}>
      <View style={styles.viewerContainer}>
        <NutrientView
          ref={pdfRef}
          document={exampleDocumentPath}
          configuration={{
            iOSBackgroundColor: processColor('lightgrey'),
            pageTransition: 'scrollContinuous',
            scrollDirection: 'vertical',
          }}
          disableAutomaticSaving={true}
          fragmentTag="PDF1"
          onDocumentLoaded={trackViewport}
          style={styles.flex}
        />
        <NutrientOverlay viewRef={pdfRef}>
          {pins.map(pin => (
            <NutrientOverlayItem
              key={pin.id}
              pageIndex={pin.pageIndex}
              position={pin.position}
            >
              {/* An overlay item is interactive: tapping this pin removes it. */}
              <TouchableOpacity
                style={styles.pin}
                onPress={() =>
                  setPins(current => current.filter(other => other.id !== pin.id))
                }
              >
                <Text style={styles.pinText}>
                  {`${Math.round(pin.position.x)}, ${Math.round(pin.position.y)}`}
                </Text>
              </TouchableOpacity>
            </NutrientOverlayItem>
          ))}
          {/* `disableAutoZoom` keeps an item at a constant screen size while the document zooms. */}
          <NutrientOverlayItem pageIndex={0} position={{ x: 300, y: 300 }} disableAutoZoom>
            <View style={styles.fixedSizeBadge}>
              <Text style={styles.pinText}>Fixed size</Text>
            </View>
          </NutrientOverlayItem>
          {placing && (
            <View
              style={StyleSheet.absoluteFill}
              onStartShouldSetResponder={() => true}
              onResponderRelease={event =>
                placePinAtTap({
                  x: event.nativeEvent.locationX,
                  y: event.nativeEvent.locationY,
                })
              }
            />
          )}
        </NutrientOverlay>
      </View>
      {renderWithBaseExampleSafeArea(insets => (
        <View style={[styles.toolbar, { paddingBottom: 12 + insets.bottom }]}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setPlacing(current => !current)}
          >
            <Text style={styles.buttonText}>
              {placing ? 'Tap the document to place a pin' : 'Add a pin'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.status}>
            {viewport
              ? `Page ${viewport.pageIndex + 1} · zoom ${viewport.zoomScale.toFixed(2)}x · ${pins.length} pins`
              : `${pins.length} pins`}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  viewerContainer: { flex: 1 },
  toolbar: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  button: {
    minHeight: 44,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: pspdfkitColor,
    textAlign: 'center',
  },
  status: {
    fontSize: 12,
    color: '#666',
  },
  pin: {
    backgroundColor: pspdfkitColor,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  fixedSizeBadge: {
    backgroundColor: '#1f6feb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pinText: {
    color: 'white',
    fontSize: 12,
  },
});
