import React, { useEffect, useRef, useState } from 'react';
import { processColor, Text, TouchableOpacity, View } from 'react-native';
import NutrientView, { PDFConfiguration } from '@nutrient-sdk/react-native';

import {
  formDocumentName,
  formDocumentPath,
  pspdfkitColor,
  writableFormDocumentPath,
} from '../configuration/Constants';
import {
  renderWithBaseExampleSafeArea,
  useBaseExampleAutoHidingHeader,
} from '../helpers/ExampleScreenLayoutHelpers';
import { extractFromAssetsIfMissing } from '../helpers/FileSystemHelpers';

// The text field this example locks and unlocks. Form_example.pdf also has an
// `EMPLOYEE SIGNATURE` signature field, exercised by the SignaturePadControl example.
const TARGET_FIELD = 'Name_Last';

export const FormFieldReadOnly = ({ navigation }: any) => {
  const pdfRef = useRef<NutrientView | null>(null);
  const [documentPath, setDocumentPath] = useState(formDocumentPath);
  const [status, setStatus] = useState('Status: idle');
  useBaseExampleAutoHidingHeader(navigation);

  useEffect(() => {
    extractFromAssetsIfMissing(formDocumentName, () => {
      setDocumentPath(writableFormDocumentPath);
    });
  }, []);

  // Reads the field back through getFormElements so the assertion reflects the
  // document state rather than just the resolved value of the setter.
  //
  // Note: read the state off `formField.isReadOnly`, not the `readOnly` property
  // on the element. Neither platform serializes an element-level `readOnly`
  // (Android `FormUtils.formElementToJSON`, iOS `RCTConvert+FormField`), so
  // `FormElement.readOnly` is always false and would report a locked field as
  // editable.
  const readBackReadOnlyState = async (): Promise<boolean | null> => {
    const elements = await pdfRef.current?.getDocument().forms.getFormElements();
    const match = elements?.find(
      element => element.fullyQualifiedFieldName === TARGET_FIELD,
    );
    return match ? match.formField?.isReadOnly ?? null : null;
  };

  const setReadOnly = async (readOnly: boolean) => {
    try {
      const forms = pdfRef.current?.getDocument().forms;
      if (!forms) {
        setStatus('Status: no forms instance');
        return;
      }
      const result = await forms.setFormFieldReadOnly(TARGET_FIELD, readOnly);
      const readBack = await readBackReadOnlyState();
      setStatus(
        `Status: set=${String(result)} readOnly=${String(readBack)}`,
      );
    } catch (error) {
      setStatus(`Status: error ${JSON.stringify(error)}`);
    }
  };

  // A name that is not in the document, to pin down the not-found behavior.
  const lockMissingField = async () => {
    try {
      const forms = pdfRef.current?.getDocument().forms;
      const result = await forms?.setFormFieldReadOnly('NoSuchField', true);
      setStatus(`Status: missing resolved=${String(result)}`);
    } catch (error) {
      setStatus('Status: missing rejected');
    }
  };

  return (
    <View style={styles.flex}>
      <NutrientView
        ref={pdfRef}
        document={documentPath}
        configuration={{
          iOSBackgroundColor: processColor('lightgray'),
          documentLabelEnabled: true,
          disableAutomaticSaving: true,
          iOSFileConflictResolution:
            PDFConfiguration.IOSFileConflictResolution.CLOSE,
        }}
        style={styles.pdfColor}
      />
      {renderWithBaseExampleSafeArea(insets => (
        <View style={[styles.column, { paddingBottom: insets.bottom }]}>
          <Text style={styles.status} accessibilityLabel={status}>
            {status}
          </Text>
          <View style={styles.horizontalContainer}>
            <TouchableOpacity
              onPress={() => setReadOnly(true)}
              accessibilityLabel="Lock Field"
            >
              <Text style={styles.button}>Lock Field</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setReadOnly(false)}
              accessibilityLabel="Unlock Field"
            >
              <Text style={styles.button}>Unlock Field</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => lockMissingField()}
              accessibilityLabel="Lock Missing Field"
            >
              <Text style={styles.button}>Lock Missing</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = {
  flex: { flex: 1 },
  pdfColor: { flex: 1, color: pspdfkitColor },
  column: {
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    overflow: 'visible' as 'visible',
  },
  horizontalContainer: {
    flexDirection: 'row' as 'row',
    minWidth: '70%' as '70%',
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',
    padding: 10,
    overflow: 'visible' as 'visible',
  },
  status: {
    fontSize: 14,
    color: pspdfkitColor,
    textAlign: 'center' as 'center',
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  button: {
    padding: 15,
    fontSize: 16,
    color: pspdfkitColor,
    textAlign: 'center' as 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginHorizontal: 5,
    minHeight: 24,
    paddingVertical: 10,
  },
};
