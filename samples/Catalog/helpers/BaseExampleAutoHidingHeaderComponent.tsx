import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IProps {
  navigation?: any;
  route?: any;
}

// Create the wrapper component
function SafeAreaWrapper({ children }: { children: (insets: { top: number, right: number, bottom: number, left: number }) => React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return <>{children(insets)}</>;
}

export class BaseExampleAutoHidingHeaderComponent extends Component<
  IProps,
  any
> {
  constructor(props: any) {
    super(props);
    const { navigation } = this.props;
    if (Platform.OS === 'android') {
      navigation.setOptions({
        // Since the PSPDFKitView provides it's own toolbar and back button we don't need a header in Android.
        headerShown: false,
      });
    }
  }

  // Add a helper method to render content with safe area insets
  renderWithSafeArea(renderContent: (insets: any) => React.ReactNode) {
    return (
      <SafeAreaWrapper>
        {insets => renderContent({
          // Only apply bottom inset on Android
          bottom: Platform.OS === 'android' ? insets.bottom : 0,
          top: insets.top,
          left: insets.left,
          right: insets.right
        })}
      </SafeAreaWrapper>
    );
  }
}
