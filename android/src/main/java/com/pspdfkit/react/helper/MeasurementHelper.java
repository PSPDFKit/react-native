/*
 * ConversionHelpers.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2021-2023 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */


package com.pspdfkit.react.helper;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.pspdfkit.annotations.measurements.FloatPrecision;
import com.pspdfkit.annotations.measurements.Scale;
import com.pspdfkit.document.PdfDocument;

import javax.annotation.Nullable;

public class MeasurementHelper {

    public static FloatPrecision getPrecision(@Nullable String precisionString) {
        if (precisionString == null) {
            return FloatPrecision.TWO_DP;
        }

        switch (precisionString.toLowerCase()) {
            case "whole":
                return FloatPrecision.WHOLE;
            case "onedp":
                return FloatPrecision.ONE_DP;
            case "threedp":
                return FloatPrecision.THREE_DP;
            case "fourdp":
                return FloatPrecision.FOUR_DP;

            default:
                return FloatPrecision.TWO_DP;
        }
    }

    private static Scale.UnitFrom parseScaleUnitFrom(@Nullable String stringUnit) {
        if (stringUnit == null) {
            return Scale.UnitFrom.IN;
        }
        switch (stringUnit.toLowerCase()) {
            case "mm":
                return Scale.UnitFrom.MM;
            case "cm":
                return Scale.UnitFrom.CM;
            case "pt":
                return Scale.UnitFrom.PT;
            default:
                return Scale.UnitFrom.IN;
        }
    }

    private static Scale.UnitTo parseScaleUnitTo(String stringUnit) {
        if (stringUnit == null) {
            return Scale.UnitTo.IN;
        }
        switch (stringUnit.toLowerCase()) {
            case "mm":
                return Scale.UnitTo.MM;
            case "cm":
                return Scale.UnitTo.CM;
            case "pt":
                return Scale.UnitTo.PT;
            case "ft":
                return Scale.UnitTo.FT;
            case "m":
                return Scale.UnitTo.M;
            case "yd":
                return Scale.UnitTo.YD;
            case "km":
                return Scale.UnitTo.KM;
            case "mi":
                return Scale.UnitTo.MI;
            default:
                return Scale.UnitTo.IN;
        }
    }

    public static Scale getScale(ReadableMap rawData) {
        Scale.UnitFrom unitFrom = Scale.UnitFrom.IN;
        Scale.UnitTo unitTo = Scale.UnitTo.IN;
        double valueFrom = 1.0;
        double valueTo = 1.0;

        ReadableMapKeySetIterator iterator = rawData.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            switch (key) {
                case "unitFrom":
                    unitFrom = parseScaleUnitFrom(rawData.getString(key));
                    break;
                case "unitTo":
                    unitTo = parseScaleUnitTo(rawData.getString(key));
                    break;
                case "valueFrom":
                    valueFrom = rawData.getDouble(key);
                    break;
                case "valueTo":
                    valueTo = rawData.getDouble(key);
                    break;
            }
        }

        return new Scale((float) valueFrom, unitFrom, (float) valueTo, unitTo);
    }

    public static void setConfig(@Nullable ReadableMap configuration, @Nullable PdfDocument document) {
        if(configuration == null || document == null) {
            return;
        }

        if (configuration.hasKey("measurementScale")) {
            document.setMeasurementScale(MeasurementHelper.getScale(configuration));
        }
        if (configuration.hasKey("measurementPrecision")) {
            document.setMeasurementPrecision(MeasurementHelper.getPrecision(configuration.getString("measurementPrecision")));
        }
    }
}
