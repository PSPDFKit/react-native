package com.pspdfkit.rn;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import io.nutrient.domain.ai.AiAssistant;
import io.nutrient.domain.ai.AiAssistantProvider;
import com.pspdfkit.react.SessionStorage;
import android.graphics.RectF;

import androidx.annotation.NonNull;

import java.util.List;

public class MainActivity extends ReactActivity implements AiAssistantProvider {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Catalog";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
        // If you opted-in for the New Architecture, we enable Concurrent React (i.e. React 18).
        DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // concurrentRootEnabled
        );
  }

  @Override
  public AiAssistant getAiAssistant() {
    return SessionStorage.getAiAssistant();
  }

  @Override
  public void navigateTo(@NonNull List<? extends RectF> list, int i, int i1) {
    // No-op
  }
}
