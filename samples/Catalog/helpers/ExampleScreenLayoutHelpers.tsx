import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function SafeAreaWrapper({
  children,
}: {
  children: (insets: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }) => React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return <>{children(insets)}</>;
}

export function useBaseExampleAutoHidingHeader(navigation?: any) {
  useEffect(() => {
    if (Platform.OS === 'android' && navigation) {
      navigation.setOptions({
        // Since the NutrientView provides its own toolbar and back button we don't need a header in Android.
        headerShown: false,
      });
    }
  }, [navigation]);
}

export function renderWithBaseExampleSafeArea(
  renderContent: (insets: any) => React.ReactNode,
) {
  return (
    <SafeAreaWrapper>
      {insets =>
        renderContent({
          // Only apply bottom inset on Android
          bottom: Platform.OS === 'android' ? insets.bottom : 0,
          top: insets.top,
          left: insets.left,
          right: insets.right,
        })
      }
    </SafeAreaWrapper>
  );
}
