//
//  Copyright © 2018-2024 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

package com.pspdfkit.react

import android.content.Context
import android.graphics.Color
import androidx.core.util.Pair
import com.facebook.react.bridge.ReadableMap
import com.pspdfkit.annotations.AnnotationType
import com.pspdfkit.annotations.AnnotationType.*
import com.pspdfkit.annotations.LineEndType
import com.pspdfkit.annotations.configuration.AnnotationConfiguration
import com.pspdfkit.annotations.configuration.AnnotationProperty
import com.pspdfkit.annotations.configuration.EraserToolConfiguration
import com.pspdfkit.annotations.configuration.FileAnnotationConfiguration
import com.pspdfkit.annotations.configuration.FreeTextAnnotationConfiguration
import com.pspdfkit.annotations.configuration.InkAnnotationConfiguration
import com.pspdfkit.annotations.configuration.LineAnnotationConfiguration
import com.pspdfkit.annotations.configuration.MarkupAnnotationConfiguration
import com.pspdfkit.annotations.configuration.MeasurementAreaAnnotationConfiguration
import com.pspdfkit.annotations.configuration.MeasurementDistanceAnnotationConfiguration
import com.pspdfkit.annotations.configuration.MeasurementPerimeterAnnotationConfiguration
import com.pspdfkit.annotations.configuration.NoteAnnotationConfiguration
import com.pspdfkit.annotations.configuration.RedactionAnnotationConfiguration
import com.pspdfkit.annotations.configuration.ShapeAnnotationConfiguration
import com.pspdfkit.annotations.configuration.SoundAnnotationConfiguration
import com.pspdfkit.annotations.configuration.StampAnnotationConfiguration
import com.pspdfkit.annotations.stamps.StampPickerItem
import com.pspdfkit.configuration.annotations.AnnotationAggregationStrategy
import com.pspdfkit.react.annotations.ReactAnnotationPresetConfiguration
import com.pspdfkit.ui.fonts.Font
import com.pspdfkit.ui.inspector.views.BorderStylePreset
import com.pspdfkit.ui.special_mode.controller.AnnotationTool
import com.pspdfkit.ui.special_mode.controller.AnnotationToolVariant
import java.util.EnumSet

const val DEFAULT_COLOR = "defaultColor"
const val DEFAULT_FILL_COLOR = "defaultFillColor"
const val DEFAULT_THICKNESS = "defaultThickness"
const val DEFAULT_ALPHA = "defaultAlpha"
const val AVAILABLE_COLORS = "availableColors"
const val AVAILABLE_FILL_COLORS = "availableFillColors"
const val MAX_ALPHA = "maximumAlpha"
const val MIN_ALPHA = "minimumAlpha"
const val MAX_THICKNESS = "maximumThickness"
const val MIN_THICKNESS = "minimumThickness"
const val CUSTOM_COLOR_PICKER_ENABLED = "customColorPickerEnabled"
const val Z_INDEX_EDITING_ENABLED = "zIndexEditingEnabled"
const val AGGREGATION_STRATEGY = "aggregationStrategy"
const val PREVIEW_ENABLED = "previewEnabled"
const val SUPPORTED_PROPERTIES = "supportedProperties"
const val FORCE_DEFAULTS = "forceDefaults"
const val AVAILABLE_BORDER_STYLES_PRESENT = "setBorderStylePresets"
const val DEFAULT_BORDER_STYLE = "defaultBorderStyle"
const val AUDION_SAMPLING_RATE = "audioSamplingRate"
const val AUDIO_RECORDING_TIME_LIMIT = "audioRecordingTimeLimit"
const val AVAILABLE_STAMP_ITEMS = "availableStampPickers"
const val DEFAULT_ICON_NAME = "defaultIconName"
const val AVAILABLE_ICON_NAMES = "availableIconNames"
const val DEFAULT_LINE_END = "defaultLineEnd"
const val AVAILABLE_LINE_ENDS = "availableLineEnds"
const val DEFAULT_TEXT_SIZE = "defaultTextSize"
const val MIN_TEXT_SIZE = "minimumTextSize"
const val MAX_TEXT_SIZE = "maximumTextSize"
const val DEFAULT_FONT = "defaultFont"
const val AVAILABLE_FONTS = "availableFonts"

const val ANNOTATION_INK_PEN = "inkPen"
const val ANNOTATION_INK_MAGIC = "inkMagic"
const val ANNOTATION_INK_HIGHLIGHTER = "inkHighlighter"
const val ANNOTATION_FREE_TEXT = "freeText"
const val ANNOTATION_FREE_TEXT_CALL_OUT = "freeTextCallout"
const val ANNOTATION_STAMP = "stamp"
const val ANNOTATION_NOTE = "note"
const val ANNOTATION_HIGHLIGHT = "highlight"
const val ANNOTATION_UNDERLINE = "underline"
const val ANNOTATION_SQUIGGLY = "squiggly"
const val ANNOTATION_STRIKE_OUT = "strikeOut"
const val ANNOTATION_SQUARE = "square"
const val ANNOTATION_CIRCLE = "circle"
const val ANNOTATION_LINE = "line"
const val ANNOTATION_ARROW = "arrow"
const val ANNOTATION_ERASER = "eraser"
const val ANNOTATION_FILE = "file"
const val ANNOTATION_POLYGON = "polygon"
const val ANNOTATION_POLYLINE = "polyline"
const val ANNOTATION_SOUND = "sound"
const val ANNOTATION_REDACTION = "redaction"
const val ANNOTATION_IMAGE = "image"
const val ANNOTATION_AUDIO = "audio"
const val ANNOTATION_MEASUREMENT_AREA_RECT = "measurementAreaRect"
const val ANNOTATION_MEASUREMENT_AREA_POLYGON = "measurementAreaPolygon"
const val ANNOTATION_MEASUREMENT_AREA_ELLIPSE = "measurementAreaEllipse"
const val ANNOTATION_MEASUREMENT_PERIMETER = "measurementPerimeter"
const val ANNOTATION_MEASUREMENT_DISTANCE = "measurementDistance"

// This class is used to convert annotation configuration from React Native to PSPDFKit. It is used in the `ReactPdfViewManager` class.
class AnnotationConfigurationAdaptor {

    companion object {

        private val configurationsList:MutableList<ReactAnnotationPresetConfiguration> = mutableListOf()

        @JvmStatic
        fun convertAnnotationConfigurations(
            context: Context, annotationConfigurations: ReadableMap
        ): List<ReactAnnotationPresetConfiguration> {

            val iterator = annotationConfigurations.keySetIterator()

            while (iterator.hasNextKey()) {
                val key = iterator.nextKey()
                val configuration = annotationConfigurations.getMap(key) ?: continue
                when (key) {
                    ANNOTATION_INK_PEN -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(INK,
                                AnnotationTool.INK,
                                AnnotationToolVariant.fromPreset(AnnotationToolVariant.Preset.PEN),
                                parseInkAnnotationConfiguration(context, configuration)))
                    }

                    ANNOTATION_INK_HIGHLIGHTER -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(INK,
                                AnnotationTool.INK,
                                AnnotationToolVariant.fromPreset(AnnotationToolVariant.Preset.HIGHLIGHTER),
                                parseInkAnnotationConfiguration(context, configuration)))
                    }

                    ANNOTATION_INK_MAGIC -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(INK,
                                AnnotationTool.MAGIC_INK,
                                AnnotationToolVariant.fromPreset(AnnotationToolVariant.Preset.MAGIC),
                                parseInkAnnotationConfiguration(context, configuration)))
                    }

                    ANNOTATION_UNDERLINE -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(UNDERLINE,
                                AnnotationTool.UNDERLINE,
                                null,
                                parseMarkupAnnotationConfiguration(context, configuration, UNDERLINE)))
                    }

                    ANNOTATION_FREE_TEXT -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(FREETEXT,
                                AnnotationTool.FREETEXT,
                                null,
                                parserFreeTextAnnotationConfiguration(context, configuration)))
                    }

                    ANNOTATION_LINE -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(LINE,
                                AnnotationTool.LINE,
                                null,
                                parseLineAnnotationConfiguration(context, configuration, LINE, AnnotationTool.LINE)))
                    }

                    ANNOTATION_NOTE -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(NOTE,
                                AnnotationTool.NOTE,
                                null,
                                parseNoteAnnotationConfiguration(context, configuration)))
                    }

                    ANNOTATION_STAMP -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(STAMP,
                                AnnotationTool.STAMP,
                                null,
                                parseStampAnnotationConfiguration(context, configuration)))
                    }

                    ANNOTATION_FILE -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(FILE,
                                null,
                                null,
                                parseFileAnnotationConfiguration(configuration)))
                    }

                    ANNOTATION_REDACTION -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(REDACT,
                                null,
                                null,
                                parseRedactAnnotationConfiguration(context, configuration)))
                    }

                    ANNOTATION_SOUND -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(SOUND,
                                null,
                                null,
                                parseSoundAnnotationConfiguration(configuration)))
                    }

                    ANNOTATION_HIGHLIGHT -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(HIGHLIGHT,
                                AnnotationTool.HIGHLIGHT,
                                null,
                                parseMarkupAnnotationConfiguration(context, configuration, HIGHLIGHT)))
                    }

                    ANNOTATION_SQUARE -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(SQUARE,
                                AnnotationTool.SQUARE,
                                null,
                                parseShapeAnnotationConfiguration(context, configuration, SQUARE)))
                    }

                    ANNOTATION_CIRCLE -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(CIRCLE,
                                AnnotationTool.CIRCLE,
                                null,
                                parseShapeAnnotationConfiguration(context, configuration, CIRCLE)))
                    }

                    ANNOTATION_POLYGON -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(POLYGON,
                                AnnotationTool.POLYGON,
                                null,
                                parseShapeAnnotationConfiguration(context, configuration, POLYGON)))
                    }

                    ANNOTATION_POLYLINE -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(POLYLINE,
                                AnnotationTool.POLYLINE,
                                null,
                                parseLineAnnotationConfiguration(context, configuration, POLYLINE, AnnotationTool.POLYLINE)))
                    }

                    ANNOTATION_IMAGE -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(STAMP,
                                AnnotationTool.IMAGE,
                                null,
                                parseStampAnnotationConfiguration(context, configuration)))
                    }

                    ANNOTATION_ARROW -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(LINE,
                                AnnotationTool.LINE,
                                AnnotationToolVariant.fromPreset(AnnotationToolVariant.Preset.ARROW),
                                parseLineAnnotationConfiguration(context, configuration, LINE, AnnotationTool.LINE)))
                    }

                    ANNOTATION_SQUIGGLY -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(SQUIGGLY,
                                AnnotationTool.SQUIGGLY,
                                null,
                                parseMarkupAnnotationConfiguration(context, configuration, SQUIGGLY)))
                    }

                    ANNOTATION_STRIKE_OUT -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(STRIKEOUT,
                                AnnotationTool.STRIKEOUT,
                                null,
                                parseMarkupAnnotationConfiguration(context, configuration, STRIKEOUT)))
                    }

                    ANNOTATION_ERASER -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(null,
                                AnnotationTool.ERASER,
                                null,
                                parseEraserAnnotationConfiguration(configuration)))
                    }

                    ANNOTATION_AUDIO -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(SOUND,
                                null,
                                null,
                                parseSoundAnnotationConfiguration(configuration)))
                    }

                    ANNOTATION_FREE_TEXT_CALL_OUT -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(FREETEXT,
                                AnnotationTool.FREETEXT_CALLOUT,
                                null,
                                parserFreeTextAnnotationConfiguration(context, configuration)))
                    }

                    ANNOTATION_MEASUREMENT_AREA_RECT -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(null,
                                AnnotationTool.MEASUREMENT_AREA_RECT,
                                null,
                                parserMeasurementAreaAnnotationConfiguration(context, configuration)))
                    }

                    ANNOTATION_MEASUREMENT_AREA_POLYGON -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(null,
                                AnnotationTool.MEASUREMENT_AREA_POLYGON,
                                null,
                                parserMeasurementAreaAnnotationConfiguration(context, configuration)))
                    }

                    ANNOTATION_MEASUREMENT_AREA_ELLIPSE -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(null,
                                AnnotationTool.MEASUREMENT_AREA_ELLIPSE,
                                null,
                                parserMeasurementAreaAnnotationConfiguration(context, configuration)))
                    }

                    ANNOTATION_MEASUREMENT_PERIMETER -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(null,
                                AnnotationTool.MEASUREMENT_PERIMETER,
                                null,
                                parseMeasurementPerimeterAnnotationConfiguration(context, configuration)))
                    }

                    ANNOTATION_MEASUREMENT_DISTANCE -> {
                        configurationsList.add(ReactAnnotationPresetConfiguration(null,
                                AnnotationTool.MEASUREMENT_DISTANCE,
                                null,
                                parseMeasurementDistanceConfiguration(context, configuration)))
                    }

                    else -> {
                        throw IllegalArgumentException("Unknown annotation type: $key")
                    }
                }
            }
            return configurationsList
        }

        private fun parserMeasurementAreaAnnotationConfiguration(
            context: Context,
            configuration: ReadableMap
        ): AnnotationConfiguration {
            val builder = MeasurementAreaAnnotationConfiguration.builder(context)
            val iterator = configuration.keySetIterator()
            while (iterator.hasNextKey()) {
                when (val key = iterator.nextKey()) {
                    DEFAULT_COLOR -> builder.setDefaultColor(
                        extractColor(configuration.getString(key))
                    )

                    DEFAULT_ALPHA -> builder.setDefaultAlpha(configuration.getDouble(key).toFloat())

                    DEFAULT_THICKNESS -> builder.setDefaultThickness(
                        configuration.getDouble(key).toFloat()
                    )

                    DEFAULT_BORDER_STYLE -> builder.setDefaultBorderStylePreset(
                            extractBorderStyles(
                                    listOf(configuration.getString(key) ?: "")
                            ).first()
                    )

                    AVAILABLE_COLORS -> configuration.getArray(key)?.let { colors ->
                        builder.setAvailableColors(
                            extractColors(colors.toArrayList().map { it as String })
                        )
                    }

                    MAX_ALPHA -> builder.setMaxAlpha(configuration.getDouble(key).toFloat())
                    MIN_ALPHA -> builder.setMinAlpha(configuration.getDouble(key).toFloat())
                    MAX_THICKNESS -> builder.setMaxThickness(configuration.getDouble(key).toFloat())
                    MIN_THICKNESS -> builder.setMinThickness(configuration.getDouble(key).toFloat())
                    CUSTOM_COLOR_PICKER_ENABLED -> builder.setCustomColorPickerEnabled(
                        configuration.getBoolean(key)
                    )

                    PREVIEW_ENABLED -> builder.setPreviewEnabled(configuration.getBoolean(key))
                    Z_INDEX_EDITING_ENABLED -> builder.setZIndexEditingEnabled(
                        configuration.getBoolean(key)
                    )

                    SUPPORTED_PROPERTIES -> configuration.getArray(key)?.let { properties ->
                        builder.setSupportedProperties(
                            extractSupportedProperties(
                                properties.toArrayList().map { it as String })
                        )
                    }

                    FORCE_DEFAULTS -> builder.setForceDefaults(configuration.getBoolean(key))
                    else -> {
                        throw IllegalArgumentException("Unknown annotation configuration key: $key")
                    }
                }
            }
            return builder.build()
        }

        private fun parseMeasurementDistanceConfiguration(
            context: Context,
            configuration: ReadableMap
        ): AnnotationConfiguration {
            val builder = MeasurementDistanceAnnotationConfiguration.builder(context)
            val iterator = configuration.keySetIterator()
            while (iterator.hasNextKey()) {
                when (val key = iterator.nextKey()) {
                    DEFAULT_COLOR -> builder.setDefaultColor(
                        extractColor(configuration.getString(key))
                    )

                    DEFAULT_ALPHA -> builder.setDefaultAlpha(configuration.getDouble(key).toFloat())
                    DEFAULT_THICKNESS -> builder.setDefaultThickness(
                        configuration.getDouble(key).toFloat()
                    )

                    AVAILABLE_COLORS -> configuration.getArray(key)?.let { colors ->
                        builder.setAvailableColors(extractColors(colors.toArrayList().map { it as String }))
                    }

                    DEFAULT_LINE_END -> configuration.getString(key)?.let { lineEndPair ->
                        builder.setDefaultLineEnds(extractLineEndPair(lineEndPair))
                    }

                    MAX_ALPHA -> builder.setMaxAlpha(configuration.getDouble(key).toFloat())
                    MIN_ALPHA -> builder.setMinAlpha(configuration.getDouble(key).toFloat())
                    MAX_THICKNESS -> builder.setMaxThickness(configuration.getDouble(key).toFloat())
                    MIN_THICKNESS -> builder.setMinThickness(configuration.getDouble(key).toFloat())
                    CUSTOM_COLOR_PICKER_ENABLED -> builder.setCustomColorPickerEnabled(
                        configuration.getBoolean(key)
                    )

                    PREVIEW_ENABLED -> builder.setPreviewEnabled(configuration.getBoolean(key))
                    Z_INDEX_EDITING_ENABLED -> builder.setZIndexEditingEnabled(
                        configuration.getBoolean(key)
                    )

                    DEFAULT_BORDER_STYLE -> builder.setDefaultBorderStylePreset(
                        extractBorderStyles(
                            listOf(configuration.getString(key) ?: "")
                        ).first()
                    )

                    SUPPORTED_PROPERTIES -> configuration.getArray(key)?.let { properties ->
                        builder.setSupportedProperties(
                            extractSupportedProperties(
                                properties.toArrayList().map { it as String })
                        )
                    }

                    FORCE_DEFAULTS -> builder.setForceDefaults(configuration.getBoolean(key))
                    else -> {
                        throw IllegalArgumentException("Unknown annotation configuration key: $key")
                    }
                }
            }
            return builder.build()
        }


        private fun parseMeasurementPerimeterAnnotationConfiguration(
            context: Context,
            configuration: ReadableMap
        ): AnnotationConfiguration {
            val builder = MeasurementPerimeterAnnotationConfiguration.builder(context)
            val iterator = configuration.keySetIterator()
            while (iterator.hasNextKey()) {
                when (val key = iterator.nextKey()) {
                    DEFAULT_COLOR -> builder.setDefaultColor(
                        extractColor(configuration.getString(key))
                    )

                    DEFAULT_ALPHA -> builder.setDefaultAlpha(configuration.getDouble(key).toFloat())
                    DEFAULT_THICKNESS -> builder.setDefaultThickness(
                        configuration.getDouble(key).toFloat()
                    )

                    AVAILABLE_COLORS -> configuration.getArray(key)?.let { colors ->
                        builder.setAvailableColors(
                            extractColors(colors.toArrayList().map { it as String })
                        )
                    }

                    DEFAULT_LINE_END -> configuration.getString(key)?.let { lineEndPair ->
                        builder.setDefaultLineEnds(extractLineEndPair(lineEndPair))
                    }

                    AVAILABLE_LINE_ENDS -> configuration.getArray(key)?.let { lineEnds ->
                        builder.setAvailableLineEnds(
                            extractLineEnds(
                                lineEnds.toArrayList().map { it as String })
                        )
                    }

                    MAX_ALPHA -> builder.setMaxAlpha(configuration.getDouble(key).toFloat())
                    MIN_ALPHA -> builder.setMinAlpha(configuration.getDouble(key).toFloat())
                    MAX_THICKNESS -> builder.setMaxThickness(configuration.getDouble(key).toFloat())
                    MIN_THICKNESS -> builder.setMinThickness(configuration.getDouble(key).toFloat())
                    CUSTOM_COLOR_PICKER_ENABLED -> builder.setCustomColorPickerEnabled(
                        configuration.getBoolean(key)
                    )

                    PREVIEW_ENABLED -> builder.setPreviewEnabled(configuration.getBoolean(key))
                    Z_INDEX_EDITING_ENABLED -> builder.setZIndexEditingEnabled(
                        configuration.getBoolean(key)
                    )

                    DEFAULT_BORDER_STYLE -> builder.setDefaultBorderStylePreset(
                        extractBorderStyles(
                            listOf(configuration.getString(key) ?: "")
                        ).first()
                    )

                    SUPPORTED_PROPERTIES -> configuration.getArray(key)?.let { properties ->
                        builder.setSupportedProperties(
                            extractSupportedProperties(
                                properties.toArrayList().map { it as String })
                        )
                    }

                    FORCE_DEFAULTS -> builder.setForceDefaults(configuration.getBoolean(key))
                    else -> {
                        throw IllegalArgumentException("Unknown annotation configuration key: $key")
                    }
                }
            }
            return builder.build()
        }

        private fun extractLineEndPair(lineEndPair: String): Pair<LineEndType, LineEndType> {
            val lineEnds = lineEndPair.split(",")
            if (lineEnds.size != 2) {
                throw IllegalArgumentException("Invalid line end pair: $lineEndPair")
            }
               val firstLineEnd = parseLineEnd(lineEnds[0])
            val secondLineEnd = parseLineEnd(lineEnds[1])
            return Pair(firstLineEnd, secondLineEnd)
        }

        private fun parseLineEnd(s: String): LineEndType {
            return when (s) {
                "none" -> LineEndType.NONE
                "square" -> LineEndType.SQUARE
                "circle" -> LineEndType.CIRCLE
                "openArrow" -> LineEndType.OPEN_ARROW
                "closedArrow" -> LineEndType.CLOSED_ARROW
                "butt" -> LineEndType.BUTT
                "reverseOpenArrow" -> LineEndType.REVERSE_OPEN_ARROW
                "reverseClosedArrow" -> LineEndType.REVERSE_CLOSED_ARROW
                "diamond" -> LineEndType.DIAMOND
                else -> {
                    LineEndType.NONE
                }
            }
        }

        private fun parseShapeAnnotationConfiguration(
            context: Context, configuration: ReadableMap, annotationType: AnnotationType
        ): AnnotationConfiguration {
            val builder = ShapeAnnotationConfiguration.builder(context, annotationType)

            val iterator = configuration.keySetIterator()

            while (iterator.hasNextKey()) {
                when (val key = iterator.nextKey()) {
                    DEFAULT_COLOR -> builder.setDefaultColor(
                        extractColor(configuration.getString(key))
                    )

                    DEFAULT_FILL_COLOR -> builder.setDefaultFillColor(extractColor( configuration.getString( key )))
                    DEFAULT_ALPHA -> builder.setDefaultAlpha(configuration.getDouble(key).toFloat())
                    DEFAULT_THICKNESS -> builder.setDefaultThickness(
                        configuration.getDouble(key).toFloat()
                    )

                    AVAILABLE_COLORS -> configuration.getArray(key)?.let { colors ->
                        builder.setAvailableColors(
                            extractColors(colors.toArrayList().map { it as String }))
                    }

                    AVAILABLE_FILL_COLORS -> configuration.getArray(key)?.let { fillColors ->
                        builder.setAvailableFillColors(
                            extractColors(fillColors.toArrayList().map { it as String }))
                    }

                    MAX_ALPHA -> builder.setMaxAlpha(configuration.getDouble(key).toFloat())
                    MIN_ALPHA -> builder.setMinAlpha(configuration.getDouble(key).toFloat())
                    MAX_THICKNESS -> builder.setMaxThickness(configuration.getDouble(key).toFloat())
                    MIN_THICKNESS -> builder.setMinThickness(configuration.getDouble(key).toFloat())
                    CUSTOM_COLOR_PICKER_ENABLED -> builder.setCustomColorPickerEnabled(
                        configuration.getBoolean(
                            key
                        )
                    )

                    Z_INDEX_EDITING_ENABLED -> builder.setZIndexEditingEnabled(
                        configuration.getBoolean(
                            key
                        )
                    )

                    PREVIEW_ENABLED -> builder.setPreviewEnabled(configuration.getBoolean(key))
                    SUPPORTED_PROPERTIES -> configuration.getArray(key)?.let { properties ->
                        builder.setSupportedProperties(
                            extractSupportedProperties(
                                properties.toArrayList().map { it as String })
                        )
                    }

                    DEFAULT_BORDER_STYLE -> builder.setDefaultBorderStylePreset(
                        extractBorderStyles(
                            listOf(configuration.getString(key) ?: "")
                        ).first()
                    )

                    AVAILABLE_BORDER_STYLES_PRESENT -> builder.setBorderStylePresets(
                        extractBorderStyles(configuration.getArray(key)?.toArrayList()
                            ?.map { it as String } ?: listOf()))

                    FORCE_DEFAULTS -> builder.setForceDefaults(configuration.getBoolean(key))
                    else -> {
                        throw IllegalArgumentException("Unknown key: $key")
                    }
                }
            }
            return builder.build()
        }

        private fun parseMarkupAnnotationConfiguration(
            context: Context, configuration: ReadableMap, annotationType: AnnotationType
        ): AnnotationConfiguration {

            val builder = MarkupAnnotationConfiguration.builder(context, annotationType)

            val iterator = configuration.keySetIterator()

            while (iterator.hasNextKey()) {
                when (val key = iterator.nextKey()) {
                    DEFAULT_COLOR -> builder.setDefaultColor(
                        extractColor(configuration.getString(key))
                    )

                    DEFAULT_ALPHA -> builder.setDefaultAlpha(configuration.getDouble(key).toFloat())
                    AVAILABLE_COLORS -> configuration.getArray(key)?.let { colors ->
                        builder.setAvailableColors(
                            extractColors(colors.toArrayList().map { it as String }))
                    }

                    MAX_ALPHA -> builder.setMaxAlpha(configuration.getDouble(key).toFloat())
                    MIN_ALPHA -> builder.setMinAlpha(configuration.getDouble(key).toFloat())
                    CUSTOM_COLOR_PICKER_ENABLED -> builder.setCustomColorPickerEnabled(
                        configuration.getBoolean(
                            key
                        )
                    )

                    Z_INDEX_EDITING_ENABLED -> builder.setZIndexEditingEnabled(
                        configuration.getBoolean(
                            key
                        )
                    )

                    SUPPORTED_PROPERTIES -> configuration.getArray(key)?.let { properties ->
                        builder.setSupportedProperties(
                            extractSupportedProperties(
                                properties.toArrayList().map { it as String })
                        )
                    }

                    FORCE_DEFAULTS -> builder.setForceDefaults(configuration.getBoolean(key))
                    else -> {
                        throw IllegalArgumentException("Unknown key: $key")
                    }
                }
            }

            return builder.build()
        }

        private fun parseEraserAnnotationConfiguration(configuration: ReadableMap): AnnotationConfiguration {
            val builder = EraserToolConfiguration.builder()
            val iterator = configuration.keySetIterator()

            while (iterator.hasNextKey()) {
                when (val key = iterator.nextKey()) {
                    DEFAULT_THICKNESS -> builder.setDefaultThickness(
                        configuration.getDouble(key).toFloat()
                    )

                    MAX_THICKNESS -> builder.setMaxThickness(configuration.getDouble(key).toFloat())
                    MIN_THICKNESS -> builder.setMinThickness(configuration.getDouble(key).toFloat())
                    PREVIEW_ENABLED -> builder.setPreviewEnabled(configuration.getBoolean(key))
                    Z_INDEX_EDITING_ENABLED -> builder.setZIndexEditingEnabled(
                        configuration.getBoolean(
                            key
                        )
                    )

                    SUPPORTED_PROPERTIES -> configuration.getArray(key)?.let { properties ->
                        builder.setSupportedProperties(
                            extractSupportedProperties(
                                properties.toArrayList().map { it as String })
                        )
                    }

                    FORCE_DEFAULTS -> builder.setForceDefaults(configuration.getBoolean(key))
                    else -> {
                        throw IllegalArgumentException("Unknown key: $key")
                    }

                }

            }
            return builder.build()
        }

        private fun parseSoundAnnotationConfiguration(
            configuration: ReadableMap
        ): AnnotationConfiguration {
            val builder = SoundAnnotationConfiguration.builder()
            val iterator = configuration.keySetIterator()

            while (iterator.hasNextKey()) {
                when (val key = iterator.nextKey()) {
                    AUDION_SAMPLING_RATE -> builder.setAudioRecordingSampleRate(
                        configuration.getInt(
                            key
                        )
                    )

                    AUDIO_RECORDING_TIME_LIMIT -> builder.setAudioRecordingTimeLimit(
                        configuration.getInt(
                            key
                        )
                    )

                    Z_INDEX_EDITING_ENABLED -> builder.setZIndexEditingEnabled(
                        configuration.getBoolean(
                            key
                        )
                    )

                    SUPPORTED_PROPERTIES -> configuration.getArray(key)?.let { properties ->
                        builder.setSupportedProperties(
                            extractSupportedProperties(
                                properties.toArrayList().map { it as String })
                        )
                    }

                    FORCE_DEFAULTS -> builder.setForceDefaults(configuration.getBoolean(key))
                    else -> {
                        throw IllegalArgumentException("Unknown key: $key")
                    }
                }
            }
            return builder.build()
        }

        private fun parseFileAnnotationConfiguration(
            configuration: ReadableMap
        ): AnnotationConfiguration {
            val builder = FileAnnotationConfiguration.builder()
            val iterator = configuration.keySetIterator()

            while (iterator.hasNextKey()) {
                when (val key = iterator.nextKey()) {
                    Z_INDEX_EDITING_ENABLED -> builder.setZIndexEditingEnabled(
                        configuration.getBoolean(
                            key
                        )
                    )

                    SUPPORTED_PROPERTIES -> configuration.getArray(key)?.let { properties ->
                        builder.setSupportedProperties(
                            extractSupportedProperties(
                                properties.toArrayList().map { it as String })
                        )
                    }

                    FORCE_DEFAULTS -> builder.setForceDefaults(configuration.getBoolean(key))
                    else -> {
                        throw IllegalArgumentException("Unknown key: $key")
                    }
                }
            }
            return builder.build()

        }

        private fun parseStampAnnotationConfiguration(
            context: Context, configuration: ReadableMap
        ): AnnotationConfiguration {
            val builder = StampAnnotationConfiguration.builder(context)
            val iterator = configuration.keySetIterator()

            while (iterator.hasNextKey()) {
                when (val key = iterator.nextKey()) {
                    AVAILABLE_STAMP_ITEMS -> configuration.getArray(key)?.let { stampItems ->
                        builder.setAvailableStampPickerItems(
                            extractStampPickerItems(
                                stampItems.toArrayList().map { it as String }, context
                            )
                        )
                    }

                    Z_INDEX_EDITING_ENABLED -> builder.setZIndexEditingEnabled(
                        configuration.getBoolean(
                            key
                        )
                    )

                    SUPPORTED_PROPERTIES -> configuration.getArray(key)?.let { properties ->
                        builder.setSupportedProperties(
                            extractSupportedProperties(
                                properties.toArrayList().map { it as String })
                        )
                    }

                    FORCE_DEFAULTS -> builder.setForceDefaults(configuration.getBoolean(key))
                    else -> {
                        throw IllegalArgumentException("Unknown key: $key")
                    }
                }
            }
            return builder.build()
        }


        private fun parseRedactAnnotationConfiguration(
            context: Context, configuration: ReadableMap
        ): AnnotationConfiguration {
            val builder = RedactionAnnotationConfiguration.builder(context)

            val iterator = configuration.keySetIterator()

            while (iterator.hasNextKey()) {
                when (val key = iterator.nextKey()) {
                    DEFAULT_COLOR -> builder.setDefaultColor(
                        extractColor(
                            configuration.getString(key)
                        )
                    )

                    DEFAULT_FILL_COLOR -> builder.setDefaultFillColor(
                        extractColor(
                            configuration.getString(key)
                        )
                    )

                    AVAILABLE_COLORS -> configuration.getArray(key)?.let { colors ->
                        builder.setAvailableColors(extractColors(colors.toArrayList().map { it as String }))
                    }

                    AVAILABLE_FILL_COLORS -> configuration.getArray(key)?.let { fillColors ->
                        builder.setAvailableFillColors(
                            extractColors(
                                fillColors.toArrayList().map { it as String })
                        )
                    }

                    CUSTOM_COLOR_PICKER_ENABLED -> builder.setCustomColorPickerEnabled(
                        configuration.getBoolean(
                            key
                        )
                    )

                    PREVIEW_ENABLED -> builder.setPreviewEnabled(configuration.getBoolean(key))
                    Z_INDEX_EDITING_ENABLED -> builder.setZIndexEditingEnabled(
                        configuration.getBoolean(
                            key
                        )
                    )

                    SUPPORTED_PROPERTIES -> configuration.getArray(key)?.let { properties ->
                        builder.setSupportedProperties(
                            extractSupportedProperties(
                                properties.toArrayList().map { it as String })
                        )
                    }

                    FORCE_DEFAULTS -> builder.setForceDefaults(configuration.getBoolean(key))
                    else -> {
                        throw IllegalArgumentException("Unknown key: $key")
                    }

                }
            }
            return builder.build()
        }

        private fun parseNoteAnnotationConfiguration(
            context: Context, configuration: ReadableMap
        ): AnnotationConfiguration {
            val builder = NoteAnnotationConfiguration.builder(context)

            val iterator = configuration.keySetIterator()

            while (iterator.hasNextKey()) {
                when (val key = iterator.nextKey()) {
                    DEFAULT_COLOR -> builder.setDefaultColor(
                        extractColor(
                            configuration.getString(key)
                        )
                    )

                    AVAILABLE_COLORS -> configuration.getArray(key)?.let { colors ->
                        builder.setAvailableColors(extractColors(colors.toArrayList().map { it as String }))
                    }

                    CUSTOM_COLOR_PICKER_ENABLED -> builder.setCustomColorPickerEnabled(
                        configuration.getBoolean(
                            key
                        )
                    )

                    DEFAULT_ICON_NAME -> configuration.getString(
                        key
                    )?.let {
                        builder.setDefaultIconName(
                            it
                        )
                    }

                    AVAILABLE_ICON_NAMES -> configuration.getArray(key)?.let { names ->
                        builder.setAvailableIconNames(names.toArrayList().map { it as String })
                    }

                    Z_INDEX_EDITING_ENABLED -> builder.setZIndexEditingEnabled(
                        configuration.getBoolean(
                            key
                        )
                    )

                    SUPPORTED_PROPERTIES -> configuration.getArray(key)?.let { properties ->
                        builder.setSupportedProperties(
                            extractSupportedProperties(
                                properties.toArrayList().map { it as String })
                        )
                    }

                    FORCE_DEFAULTS -> builder.setForceDefaults(configuration.getBoolean(key))
                    else -> {
                        throw IllegalArgumentException("Unknown key: $key")
                    }
                }
            }
            return builder.build()
        }

        private fun parseLineAnnotationConfiguration(
            context: Context, configuration: ReadableMap, type: AnnotationType, tool: AnnotationTool
        ): AnnotationConfiguration {
            val builder = LineAnnotationConfiguration.builder(context, tool)

            val iterator = configuration.keySetIterator()

            while (iterator.hasNextKey()) {
                when (val key = iterator.nextKey()) {
                    DEFAULT_COLOR -> builder.setDefaultColor(
                        extractColor(configuration.getString(key))
                    )

                    AVAILABLE_COLORS -> configuration.getArray(key)?.let { colors ->
                        builder.setAvailableColors(extractColors(colors.toArrayList().map { it as String }))
                    }

                    DEFAULT_FILL_COLOR -> builder.setDefaultFillColor(extractColor( configuration.getString( key )))

                    AVAILABLE_FILL_COLORS -> configuration.getArray(key)?.let { fillColors ->
                        builder.setAvailableFillColors(extractColors(fillColors.toArrayList().map { it as String }))
                    }

                    CUSTOM_COLOR_PICKER_ENABLED -> builder.setCustomColorPickerEnabled(
                        configuration.getBoolean(
                            key
                        )
                    )

                    DEFAULT_THICKNESS -> builder.setDefaultThickness(
                        configuration.getDouble(key).toFloat()
                    )

                    MIN_THICKNESS -> builder.setMinThickness(
                        configuration.getDouble(key).toFloat()
                    )

                    MAX_THICKNESS -> builder.setMaxThickness(
                        configuration.getDouble(key).toFloat()
                    )

                    DEFAULT_ALPHA -> builder.setDefaultAlpha(
                        configuration.getDouble(key).toFloat()
                    )

                    MIN_ALPHA -> builder.setMinAlpha(
                        configuration.getDouble(key).toFloat()
                    )

                    MAX_ALPHA -> builder.setMaxAlpha(
                        configuration.getDouble(key).toFloat()
                    )

                    DEFAULT_LINE_END -> configuration.getString(key)?.let {
                        builder.setDefaultLineEnds(
                            extractLineEndPair(it)
                        )
                    }

                    AVAILABLE_LINE_ENDS -> configuration.getArray(key)?.toArrayList()
                        ?.let { lineEnds ->
                            builder.setAvailableLineEnds(extractLineEnds(lineEnds.map { it as String }))
                        }

                    DEFAULT_BORDER_STYLE -> configuration.getString(key)?.let {
                        builder.setDefaultBorderStylePreset(
                            extractBorderStyles(
                                listOf(it)
                            ).first()
                        )
                    }

                    PREVIEW_ENABLED -> builder.setPreviewEnabled(configuration.getBoolean(key))
                    Z_INDEX_EDITING_ENABLED -> builder.setZIndexEditingEnabled(
                        configuration.getBoolean(
                            key
                        )
                    )

                    SUPPORTED_PROPERTIES -> configuration.getArray(key)?.let { properties ->
                        builder.setSupportedProperties(
                            extractSupportedProperties(
                                properties.toArrayList().map { it as String })
                        )
                    }

                    FORCE_DEFAULTS -> builder.setForceDefaults(configuration.getBoolean(key))
                    else -> {
                        throw IllegalArgumentException("Unknown key: $key")
                    }
                }
            }
            return builder.build()
        }

        private fun extractLineEnds(strings: List<String>): MutableList<LineEndType> {
            val lineEnds = mutableListOf<LineEndType>()
            strings.forEach {
                lineEnds.add(parseLineEnd(it))
            }
            return lineEnds
        }

        private fun parserFreeTextAnnotationConfiguration(
            context: Context, configuration: ReadableMap
        ): AnnotationConfiguration {

            val builder = FreeTextAnnotationConfiguration.builder(context)
            val iterator = configuration.keySetIterator()

            while (iterator.hasNextKey()) {
                when (val key = iterator.nextKey()) {
                    DEFAULT_COLOR -> configuration.getString(key)?.let { color ->
                        builder.setDefaultColor(
                            extractColor(color)
                        )
                    }

                    AVAILABLE_COLORS -> configuration.getArray(key)?.let { colors ->
                        builder.setAvailableColors(extractColors(colors.toArrayList().map { it as String }))
                    }

                    CUSTOM_COLOR_PICKER_ENABLED -> builder.setCustomColorPickerEnabled(
                        configuration.getBoolean(
                            key
                        )
                    )

                    DEFAULT_TEXT_SIZE -> builder.setDefaultTextSize(
                        configuration.getDouble(key).toFloat()
                    )

                    MAX_TEXT_SIZE -> builder.setMaxTextSize(
                        configuration.getDouble(key).toFloat()
                    )

                    MIN_TEXT_SIZE -> builder.setMinTextSize(
                        configuration.getDouble(key).toFloat()
                    )

                    DEFAULT_FONT -> configuration.getString(key)?.let { font ->
                        builder.setDefaultFont(
                            extractFonts(listOf(font)).first()
                        )
                    }

                    AVAILABLE_FONTS -> configuration.getArray(key)?.let { fonts ->
                        builder.setAvailableFonts(
                            extractFonts(fonts.toArrayList().map { it as String })
                        )
                    }

                    Z_INDEX_EDITING_ENABLED -> builder.setZIndexEditingEnabled(
                        configuration.getBoolean(
                            key
                        )
                    )

                    PREVIEW_ENABLED -> builder.setPreviewEnabled(configuration.getBoolean(key))

                    SUPPORTED_PROPERTIES -> configuration.getArray(key)?.let { properties ->
                        builder.setSupportedProperties(
                            extractSupportedProperties(
                                properties.toArrayList().map { it as String })
                        )
                    }

                    FORCE_DEFAULTS -> builder.setForceDefaults(configuration.getBoolean(key))
                    else -> {
                        throw IllegalArgumentException("Unknown key: $key")
                    }
                }
            }

            return builder.build()
        }


        private fun parseInkAnnotationConfiguration(
            context: Context, configuration: ReadableMap
        ): InkAnnotationConfiguration {
            val builder = InkAnnotationConfiguration.builder(context)
            val iterator = configuration.keySetIterator()

            while (iterator.hasNextKey()) {
                when (val key = iterator.nextKey()) {
                    DEFAULT_THICKNESS -> builder.setDefaultThickness(
                        configuration.getDouble(key).toFloat()
                    )

                    DEFAULT_COLOR -> builder.setDefaultColor(
                        extractColor(
                            configuration.getString(
                                key
                            )
                        )
                    )
                    DEFAULT_FILL_COLOR -> builder.setDefaultFillColor(extractColor( configuration.getString( key )))
                    DEFAULT_ALPHA -> builder.setDefaultAlpha(configuration.getDouble(key).toFloat())
                    AVAILABLE_COLORS -> configuration.getArray(key)?.let { colors ->
                        builder.setAvailableColors(
                            extractColors(
                                colors.toArrayList().map { it as String }
                            )
                        )
                    }

                    AVAILABLE_FILL_COLORS -> configuration.getArray(key)?.let { colors ->
                        builder.setAvailableFillColors(
                            extractColors(
                                colors.toArrayList().map { it as String }
                            )
                        )
                    }

                    MAX_ALPHA -> builder.setMaxAlpha(configuration.getDouble(key).toFloat())
                    MIN_ALPHA -> builder.setMinAlpha(configuration.getDouble(key).toFloat())
                    MAX_THICKNESS -> builder.setMaxThickness(configuration.getDouble(key).toFloat())
                    MIN_THICKNESS -> builder.setMinThickness(configuration.getDouble(key).toFloat())
                    CUSTOM_COLOR_PICKER_ENABLED -> builder.setCustomColorPickerEnabled(
                        configuration.getBoolean(
                            key
                        )
                    )

                    PREVIEW_ENABLED -> builder.setPreviewEnabled(configuration.getBoolean(key))
                    Z_INDEX_EDITING_ENABLED -> builder.setZIndexEditingEnabled(
                        configuration.getBoolean(
                            key
                        )
                    )

                    FORCE_DEFAULTS -> builder.setForceDefaults(configuration.getBoolean(key))
                    SUPPORTED_PROPERTIES -> configuration.getArray(key)?.let { properties ->
                        builder.setSupportedProperties(
                            extractSupportedProperties(
                                properties.toArrayList().map { it as String })
                        )
                    }

                    AGGREGATION_STRATEGY -> builder.setAnnotationAggregationStrategy(
                        extractAggregationStrategy(configuration.getString(key))
                    )

                    else -> throw IllegalArgumentException("Unknown property $key")
                }
            }
            return builder.build();
        }

        private fun extractFonts(font: List<String>): MutableList<Font> {
            val fonts = mutableListOf<Font>()
            font.forEach {
                fonts.add(Font(it))
            }
            return fonts
        }

        private fun extractStampPickerItems(it: Any, context: Context): List<StampPickerItem> {
            val stampPickerItems = mutableListOf<StampPickerItem>()
            (it as ArrayList<*>).forEach { stampPickerItem ->
                val stampPickerItemString = stampPickerItem as String
                stampPickerItems.add(
                    StampPickerItem.fromTitle(context, stampPickerItemString).build()
                )
            }
            return stampPickerItems
        }

        private fun extractBorderStyles(it: List<String>): List<BorderStylePreset> {
            val borderStyles = mutableListOf<BorderStylePreset>()
            it.forEach { borderStyle ->
                when (borderStyle) {
                    "solid" -> borderStyles.add(BorderStylePreset.SOLID)
                    "cloudy" -> borderStyles.add(BorderStylePreset.CLOUDY)
                    "none" -> borderStyles.add(BorderStylePreset.NONE)
                    "dashed_1_1" -> borderStyles.add(BorderStylePreset.DASHED_1_1)
                    "dashed_1_3" -> borderStyles.add(BorderStylePreset.DASHED_1_3)
                    "dashed_3_3" -> borderStyles.add(BorderStylePreset.DASHED_3_3)
                    "dashed_6_6" -> borderStyles.add(BorderStylePreset.DASHED_6_6)
                }
            }
            return borderStyles
        }

        private fun extractSupportedProperties(properties: List<String>): EnumSet<AnnotationProperty> {
            val supportedProperties = EnumSet.noneOf(AnnotationProperty::class.java)
            properties.forEach { property ->
                when (property) {
                    "color" -> supportedProperties.add(AnnotationProperty.COLOR)
                    "fillColor" -> supportedProperties.add(AnnotationProperty.FILL_COLOR)
                    "thickness" -> supportedProperties.add(AnnotationProperty.THICKNESS)
                    "borderStyle" -> supportedProperties.add(AnnotationProperty.BORDER_STYLE)
                    "font" -> supportedProperties.add(AnnotationProperty.FONT)
                    "overlayText" -> supportedProperties.add(AnnotationProperty.OVERLAY_TEXT)
                }
            }
            return supportedProperties
        }

        private fun extractAggregationStrategy(string: String?): AnnotationAggregationStrategy {
            return when (string) {
                "automatic" -> AnnotationAggregationStrategy.AUTOMATIC
                "merge" -> AnnotationAggregationStrategy.MERGE_IF_POSSIBLE
                "separate" -> AnnotationAggregationStrategy.SEPARATE
                else -> throw IllegalArgumentException("Unknown aggregation strategy $string")
            }
        }

        private fun extractColor(colorStrings: String?): Int {
            if (colorStrings == null)
                return Color.BLUE
            return extractColors(listOf(colorStrings)).first()
        }

        private fun extractColors(colorStrings: List<String?>): MutableList<Int> {
            val colors = mutableListOf<Int>()
            colorStrings.let {
                for (i in colorStrings) {
                    if (i == null)
                        continue
                    colors.add(Color.parseColor(i))
                }
            }
            return colors
        }
    }
}
