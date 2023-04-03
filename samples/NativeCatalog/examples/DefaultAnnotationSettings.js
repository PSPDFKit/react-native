import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';
import { Platform, View } from 'react-native';
import { CustomPdfView, formDocumentPath } from '../configuration/Constants';
import React from 'react';

export class DefaultAnnotationSettings extends BaseExampleAutoHidingHeaderComponent {
  pdfRef = React.createRef();

  constructor(props) {
    super(props);
    const { navigation } = props;
    this.state = {
      shouldReturn: false,
    };

    navigation.addListener('beforeRemove', e => {
      if (Platform.OS !== 'android') {
        return;
      }
      const { shouldReturn } = this.state;
      if (!shouldReturn) {
        this.setState({ shouldReturn: true });
        e.preventDefault();
      }
      setTimeout(() => {
        this.goBack();
      }, 50);
    });
  }

  goBack() {
    this.props.navigation.goBack();
  }

  render() {
    const { shouldReturn } = this.state;
    return (
      <View style={styles.flex}>
        {!shouldReturn && (
          <CustomPdfView
            ref={this.pdfRef?.current}
            document={formDocumentPath}
            style={styles.flex}
            // This way only the ink tool and the button to open the inspector is shown.
            // If you don't need the inspector you can remove the "picker" option completely
            // and only configure the tool using the AnnotationConfiguration.
            // See CustomPdfViewManager#setDocument() for how to apply the custom configuration.
            menuItemGrouping={['pen', 'picker']}
            rightBarButtonItems={['annotationButtonItem']}
          />
        )}
      </View>
    );
  }
}

const styles = { flex: { flex: 1 } };
