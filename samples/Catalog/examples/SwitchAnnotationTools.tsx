import React from 'react';
import {
  processColor,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import NutrientView, { Annotation } from '@nutrient-sdk/react-native';

import { pspdfkitColor, writableDocumentPath } from '../configuration/Constants';
import { BaseExampleAutoHidingHeaderComponent } from '../helpers/BaseExampleAutoHidingHeaderComponent';

type Tool = 'ink' | 'highlight' | 'note' | 'signature';

const TOOL_TO_ANNOTATION: Record<Tool, Annotation.Type> = {
  ink: Annotation.Type.INK,
  highlight: Annotation.Type.HIGHLIGHT,
  note: Annotation.Type.NOTE,
  signature: Annotation.Type.SIGNATURE,
};

// A single, stable grouping defined once at module scope. Because this
// reference and its value never change, switching tools never updates a
// NutrientView prop, so the native view is never re-configured/reloaded and
// unsaved annotations are preserved.
const STATIC_MENU_ITEM_GROUPING = ['ink', 'highlight', 'note', 'signature'];

interface IState {
  activeTool: Tool;
  // When true we filter menuItemGrouping down to the active tool on every
  // switch (rebuilding the prop each time — reproduces the annotation loss).
  // When false we keep a single static grouping (the recommended approach).
  dynamicGrouping: boolean;
}

/**
 * Switching annotation creation tools without saving.
 *
 * Deriving `menuItemGrouping` from React state and rebuilding it on every tool
 * switch changes a NutrientView prop, which can make the native view re-apply
 * its configuration / reload and discard the in-memory (unsaved) annotation.
 *
 * Toggle "Dynamic grouping" ON to see that behavior, OFF to use a static
 * grouping (with imperative enter/exit calls) that keeps the annotation.
 */
export class SwitchAnnotationTools extends BaseExampleAutoHidingHeaderComponent {
  pdfRef: React.RefObject<NutrientView | null>;

  constructor(props: any) {
    super(props);
    this.pdfRef = React.createRef();
    this.state = {
      // Default to the static grouping (recommended). Toggle the switch ON to
      // see the annotation loss caused by a dynamic, state-driven grouping.
      activeTool: 'ink',
      dynamicGrouping: false,
    };
  }

  // Customer's pattern: grouping filtered to the active tool only.
  private dynamicMenuItemGrouping() {
    return (['ink', 'highlight', 'note', 'signature'] as Tool[]).filter(
      item => item === this.state.activeTool,
    );
  }

  // Option 1 fix: always the same stable grouping (see STATIC_MENU_ITEM_GROUPING).
  private staticMenuItemGrouping() {
    return STATIC_MENU_ITEM_GROUPING;
  }

  private async switchTool(tool: Tool) {
    // Commit whatever is being drawn and leave the current mode.
    await this.pdfRef.current?.exitCurrentlyActiveMode();
    this.setState({ activeTool: tool });
    setTimeout(async () => {
      await this.pdfRef.current?.enterAnnotationCreationMode(
        TOOL_TO_ANNOTATION[tool],
      );
    }, 250);
  }

  override render() {
    const tools: Tool[] = ['ink', 'highlight', 'note', 'signature'];
    return (
      <View style={styles.flex}>
        <NutrientView
          ref={this.pdfRef}
          document={writableDocumentPath}
          disableAutomaticSaving={true}
          configuration={{
            iOSBackgroundColor: processColor('lightgrey'),
          }}
          menuItemGrouping={
            this.state.dynamicGrouping
              ? this.dynamicMenuItemGrouping()
              : this.staticMenuItemGrouping()
          }
          style={styles.pdfColor}
        />
        {this.renderWithSafeArea(insets => (
          <View
            style={[styles.controls, { paddingBottom: insets.bottom + 8 }]}>
            <View style={styles.row}>
              <Text style={styles.label}>Dynamic grouping (repro)</Text>
              <Switch
                value={this.state.dynamicGrouping}
                onValueChange={v => this.setState({ dynamicGrouping: v })}
              />
            </View>
            <View style={styles.row}>
              {tools.map(tool => (
                <TouchableOpacity
                  key={tool}
                  style={[
                    styles.button,
                    this.state.activeTool === tool && styles.buttonActive,
                  ]}
                  onPress={() => this.switchTool(tool)}>
                  <Text style={styles.buttonText}>{tool}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => this.pdfRef.current?.getDocument().save()}>
              <Text style={styles.buttonText}>Save</Text>
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
  controls: {
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    justifyContent: 'space-between' as 'space-between',
    marginVertical: 6,
  },
  label: { fontSize: 15, color: '#333' },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 3,
    borderRadius: 5,
    backgroundColor: '#e6e6e6',
  },
  buttonActive: { backgroundColor: '#cfe3ff' },
  saveButton: {
    paddingVertical: 12,
    marginVertical: 6,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  buttonText: {
    fontSize: 15,
    color: pspdfkitColor,
    textAlign: 'center' as 'center',
  },
};
