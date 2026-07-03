import React, { useRef, useState } from 'react';
import { processColor, Text, TouchableOpacity, View } from 'react-native';
import NutrientView from '@nutrient-sdk/react-native';

import { exampleDocumentPath, pspdfkitColor } from '../configuration/Constants';
import {
  renderWithBaseExampleSafeArea,
  useBaseExampleAutoHidingHeader,
} from '../helpers/ExampleScreenLayoutHelpers';

// Reproduces ZD 133361 / HYB-1002: in horizontal scroll + `automatic` UI mode,
// edge taps are treated as page-turn gestures and intentionally do not toggle
// the toolbar, so a user tapping near the edges to bring the toolbar back just
// keeps flipping pages. Toggle `scrollOnEdgeTapEnabled` to compare:
//   - false: taps anywhere (including edges) toggle the user interface.
//   - true (default): edge taps flip pages and never restore the toolbar.
export const ScrollOnEdgeTap = ({ navigation }: any) => {
  const pdfRef = useRef<NutrientView | null>(null);
  const [edgeTapEnabled, setEdgeTapEnabled] = useState(false);
  useBaseExampleAutoHidingHeader(navigation);

  return (
    <View style={styles.flex}>
      <NutrientView
        // Remount on toggle so the new configuration is applied (Android rebuilds
        // the activity from the configuration, so the value must be set up front).
        key={`edge-tap-${edgeTapEnabled}`}
        ref={pdfRef}
        document={exampleDocumentPath}
        configuration={{
          iOSBackgroundColor: processColor('lightgrey'),
          scrollDirection: 'horizontal',
          pageTransition: 'scrollPerSpread',
          userInterfaceViewMode: 'automatic',
          scrollOnEdgeTapEnabled: edgeTapEnabled,
        }}
        disableAutomaticSaving={true}
        fragmentTag="PDF1"
        style={styles.pdfColor}
      />
      {renderWithBaseExampleSafeArea(insets => (
        <View style={[styles.buttonContainer, { paddingBottom: insets.bottom }]}>
          <TouchableOpacity
            style={styles.fullWidthButton}
            accessibilityLabel={'Toggle Scroll On Edge Tap'}
            testID={'Toggle Scroll On Edge Tap'}
            onPress={() => setEdgeTapEnabled(prev => !prev)}
          >
            <Text style={styles.button}>
              {`scrollOnEdgeTapEnabled: ${edgeTapEnabled} (tap to toggle)`}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
  buttonContainer: {
    width: '100%' as '100%',
    height: 80,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  fullWidthButton: {
    width: '100%' as '100%',
    height: '100%' as '100%',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  button: {
    padding: 15,
    fontSize: 16,
    color: pspdfkitColor,
    textAlign: 'center' as 'center',
    minHeight: 44,
  },
};
