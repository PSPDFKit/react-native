import React, { useEffect, useRef, useState } from 'react';
import { processColor, Text, TouchableOpacity, View } from 'react-native';
import NutrientView, { PDFConfiguration } from '@nutrient-sdk/react-native';

import {
  formDocumentName,
  formDocumentPath,
  pspdfkitColor,
  writableFormDocumentPath,
} from '../configuration/Constants';
import {
  renderWithBaseExampleSafeArea,
  useBaseExampleAutoHidingHeader,
} from '../helpers/ExampleScreenLayoutHelpers';
import { extractFromAssetsIfMissing } from '../helpers/FileSystemHelpers';

// Long enough for the remaining taps to land, the signature UI to finish
// presenting, and a UI test to assert that it is visible, before the armed
// dismissal fires.
const ARM_DISMISS_DELAY_MS = 6000;

export const SignaturePadControl = ({ navigation }: any) => {
  const pdfRef = useRef<NutrientView | null>(null);
  const armDismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [documentPath, setDocumentPath] = useState(formDocumentPath);
  // Interception is driven by the presence of the onShouldShowSignaturePad prop,
  // so toggling this swaps the prop and returns the viewer to its default flow.
  const [intercepting, setIntercepting] = useState(true);
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);
  const [status, setStatus] = useState('Status: idle');
  useBaseExampleAutoHidingHeader(navigation);

  useEffect(() => {
    extractFromAssetsIfMissing(formDocumentName, () => {
      setDocumentPath(writableFormDocumentPath);
    });
  }, []);

  // Clear any armed dismissal when the screen goes away so it can't fire on an
  // unmounted component.
  useEffect(() => {
    return () => {
      if (armDismissTimer.current != null) {
        clearTimeout(armDismissTimer.current);
      }
    };
  }, []);

  const handleShouldShowSignaturePad = (event: any) => {
    const payload = event?.nativeEvent ?? event;
    setPendingRequestId(payload.requestId);
    setStatus(
      `Status: intercepted ${payload.fullyQualifiedName} page ${payload.pageIndex}`,
    );
  };

  const respond = async (allow: boolean) => {
    if (pendingRequestId == null) {
      setStatus('Status: no pending request');
      return;
    }
    try {
      const result = await pdfRef.current?.showSignaturePad(
        pendingRequestId,
        allow,
      );
      setPendingRequestId(null);
      setStatus(`Status: ${allow ? 'allowed' : 'denied'}=${String(result)}`);
    } catch (error) {
      setStatus(`Status: respond error ${JSON.stringify(error)}`);
    }
  };

  const dismiss = async () => {
    try {
      const result = await pdfRef.current?.dismissSignaturePad();
      setStatus(`Status: dismissed=${String(result)}`);
    } catch (error) {
      setStatus(`Status: dismiss error ${JSON.stringify(error)}`);
    }
  };

  // Once the signature UI is presented it covers these controls, so a dismissal
  // that has to happen while the pad is open must be scheduled beforehand. This
  // is what lets a UI test observe the pad opening and then being closed by
  // dismissSignaturePad rather than by the SDK's own cancel button.
  const armDismiss = () => {
    // A new arm supersedes any previously scheduled dismissal.
    if (armDismissTimer.current != null) {
      clearTimeout(armDismissTimer.current);
    }
    setStatus('Status: dismiss armed');
    armDismissTimer.current = setTimeout(() => {
      armDismissTimer.current = null;
      dismiss();
    }, ARM_DISMISS_DELAY_MS);
  };

  const toggleIntercepting = () => {
    const next = !intercepting;
    setIntercepting(next);
    setPendingRequestId(null);
    setStatus(`Status: intercept ${next ? 'on' : 'off'}`);
  };

  const interceptionProps = intercepting
    ? { onShouldShowSignaturePad: handleShouldShowSignaturePad }
    : {};

  return (
    <View style={styles.flex}>
      <NutrientView
        ref={pdfRef}
        document={documentPath}
        configuration={{
          iOSBackgroundColor: processColor('lightgray'),
          documentLabelEnabled: true,
          disableAutomaticSaving: true,
          signatureSavingStrategy: 'saveIfSelected',
          iOSFileConflictResolution:
            PDFConfiguration.IOSFileConflictResolution.CLOSE,
        }}
        {...interceptionProps}
        style={styles.pdfColor}
      />
      {renderWithBaseExampleSafeArea(insets => (
        <View style={[styles.column, { paddingBottom: insets.bottom }]}>
          <Text style={styles.status} accessibilityLabel={status}>
            {status}
          </Text>
          <View style={styles.horizontalContainer}>
            <TouchableOpacity
              onPress={() => toggleIntercepting()}
              accessibilityLabel={
                intercepting ? 'Disable Intercept' : 'Enable Intercept'
              }
            >
              <Text style={styles.button}>
                {intercepting ? 'Disable Intercept' : 'Enable Intercept'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => respond(true)}
              accessibilityLabel="Allow Signing"
            >
              <Text style={styles.button}>Allow</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => respond(false)}
              accessibilityLabel="Deny Signing"
            >
              <Text style={styles.button}>Deny</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => dismiss()}
              accessibilityLabel="Dismiss Pad"
            >
              <Text style={styles.button}>Dismiss</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => armDismiss()}
              accessibilityLabel="Arm Dismiss"
            >
              <Text style={styles.button}>Arm Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
  column: {
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    overflow: 'visible' as 'visible',
  },
  // Five controls have to fit the width of a phone without clipping, so this row
  // is sized to the screen and only its horizontal spacing is tightened. The
  // vertical padding is left alone on purpose: the row's height determines how
  // much room is left for the viewer, and the UI tests tap the signature widget
  // at a percentage of the screen.
  horizontalContainer: {
    flexDirection: 'row' as 'row',
    width: '100%' as '100%',
    justifyContent: 'space-evenly' as 'space-evenly',
    alignItems: 'center' as 'center',
    paddingHorizontal: 2,
    paddingVertical: 10,
    overflow: 'visible' as 'visible',
  },
  status: {
    fontSize: 14,
    color: pspdfkitColor,
    textAlign: 'center' as 'center',
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  button: {
    fontSize: 13,
    color: pspdfkitColor,
    textAlign: 'center' as 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginHorizontal: 1,
    minHeight: 24,
    paddingHorizontal: 6,
    paddingVertical: 10,
  },
};
