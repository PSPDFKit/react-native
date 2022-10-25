import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { processColor, View } from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';
import { pspdfkitColor, tiffImagePath } from '../configuration/Constants';
import React from 'react';
import { hideToolbar } from '../helpers/NavigationHelper';

export class OpenImageDocument extends BaseExampleAutoHidingHeaderComponent {
  pdfRef = null;

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.pdfRef = React.createRef();

    hideToolbar(navigation);

    navigation.addListener('beforeRemove', e => {
      this.pdfRef?.current?.destroyView();
    });
  }

  componentWillUnmount() {
    const { navigation } = this.props;
    navigation.removeListener('beforeRemove');
  }
  render() {
    return (
      <View style={styles.flex}>
        <PSPDFKitView
          document={tiffImagePath}
          ref={this.pdfRef}
          configuration={{
            backgroundColor: processColor('lightgrey'),
            showPageLabels: false,
            useParentNavigationBar: false,
            allowToolbarTitleChange: false,
          }}
          style={styles.pdfColor}
        />
      </View>
    );
  }
}

const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
};
