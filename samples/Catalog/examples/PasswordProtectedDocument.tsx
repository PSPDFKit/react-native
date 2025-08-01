import React from 'react';
import { processColor, View, Alert, Text, TouchableOpacity, Platform } from 'react-native';
import NutrientView from '@nutrient-sdk/react-native';

import { examplePasswordDocumentPath, pspdfkitColor } from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { hideToolbar } from '../helpers/NavigationHelper';

export class PasswordProtectedDocument extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<NutrientView | null>;

  constructor(props: any) {
    super(props);
    const { navigation } = this.props;
    this.pdfRef = React.createRef();
    hideToolbar(navigation);
  }

  override render() {
    const { navigation } = this.props;

    return (
      <View style={styles.flex}>
        <NutrientView
          ref={this.pdfRef}
          document={examplePasswordDocumentPath}
          configuration={{
            iOSAllowToolbarTitleChange: false,
            toolbarTitle: 'My Awesome Report',
            iOSBackgroundColor: processColor('lightgrey'),
            iOSUseParentNavigationBar: false,
            documentPassword: 'myPassword'
          }}
          fragmentTag="PDF1"
          showNavigationButtonInToolbar={true}
          onNavigationButtonClicked={() => navigation.goBack()}
          style={styles.pdfColor}
        />
        {this.renderWithSafeArea(insets => (
          <View style={[styles.buttonContainer, { paddingBottom: insets.bottom }]}>
            <TouchableOpacity 
              style={styles.fullWidthButton}
              onPress={async () => {
                const document = this.pdfRef.current?.getDocument();
                Alert.alert(
                  'Nutrient',
                  'Document ID: ' + await document?.getDocumentId(),
                );
              }}>
              <Text style={styles.button}>{'Get Document ID'}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  }
}
const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
  buttonContainer: {
    width: '100%' as '100%',
    height: Platform.OS === 'ios' ? 80 : 60,
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
  },
};
