import React from 'react';
import { Alert, Button, processColor, View } from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';

import { pspdfkitColor, tiffImagePath } from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { hideToolbar } from '../helpers/NavigationHelper';

export class OpenImageDocument extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<PSPDFKitView>;

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
        <PSPDFKitView
          document={tiffImagePath}
          ref={this.pdfRef}
          configuration={{
            iOSBackgroundColor: processColor('lightgrey'),
            showPageLabels: false,
            iOSUseParentNavigationBar: false,
            iOSAllowToolbarTitleChange: false,
          }}
          showNavigationButtonInToolbar={true}
          onNavigationButtonClicked={() => navigation.goBack()}
          style={styles.pdfColor}
        />
        <View style={styles.wrapper}>
          <View style={styles.flex}>
            <Button
              accessibilityLabel={'Get Document ID'}
              testID={'Get Document ID'}
              onPress={ async () => {
                const document = this.pdfRef.current?.getDocument();
                Alert.alert(
                  'PSPDFKit',
                  'Document ID: ' + await document?.getDocumentId(),
                );
              }}
              title="Get Document ID"
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
  wrapper: {
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    padding: 10,
  },
};
