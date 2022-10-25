import React from 'react';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { processColor, View } from 'react-native';
import PSPDFKitView from 'react-native-pspdfkit';
import { pspdfkitColor } from '../configuration/Constants';
import { hideToolbar } from '../helpers/NavigationHelper';

export class GeneratePDF extends BaseExampleAutoHidingHeaderComponent {
  pdfRef = null;

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.pdfRef = React.createRef();

    navigation.addListener('beforeRemove', e => {
      this.pdfRef?.current?.destroyView();
    });
  }

  componentWillUnmount() {
    const { navigation } = this.props;
    navigation.removeListener('beforeRemove');
  }

  render() {
    const { route } = this.props;
    const { fullPath } = route.params;

    return (
      <View style={styles.flex}>
        <PSPDFKitView
          ref={this.pdfRef}
          document={fullPath}
          configuration={{
            backgroundColor: processColor('lightgrey'),
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
