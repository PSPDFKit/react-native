package com.pspdfkit.react.helper;

/*
 * PSPDFKitPackage.java
 *
 *   PSPDFKit
 *
 *   Copyright © 2017-2022 PSPDFKit GmbH. All rights reserved.
 *
 *   THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 *   AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
 *   UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 *   This notice may not be removed from this file.
 */

import android.graphics.Color;

public class ColorHelper {
    public static int rgb(String color) {
        try{
            String splitStr = color.substring(color.indexOf('(') + 1, color.indexOf(')'));
            String[] components = splitStr.split(",");

            int[] colorValues = new int[components.length];
            for (int i = 0; i < components.length; i++) {
                double channelColor = Double.parseDouble(components[i].trim());
                if(channelColor > 1) {
                    colorValues[i] = Integer.parseInt(components[i].trim());
                    continue;
                }
                colorValues[i] = (int)(channelColor * 255);
            }

            return Color.rgb(colorValues[0], colorValues[1], colorValues[2]);
        } catch(Exception ex) {
            return Color.parseColor("#FFFFFF");
        }
    }
}
