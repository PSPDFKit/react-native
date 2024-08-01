package com.pspdfkit.react.helper

import com.pspdfkit.annotations.measurements.MeasurementPrecision
import com.pspdfkit.annotations.measurements.MeasurementValueConfiguration
import com.pspdfkit.annotations.measurements.Scale
import com.pspdfkit.ui.PdfFragment

class MeasurementsHelper {

    companion object {

        /**
         * Adds a new measurement configuration to the document.
         *
         * @param pdfFragment The [PdfFragment] to which the measurement configuration should be added.
         * @param configurations The measurement configuration to add.
         */
        @JvmStatic
        fun addMeasurementConfiguration(pdfFragment: PdfFragment, configurations : Map<String, Any>) {
            val measurementValueConfiguration = convertMeasurementConfiguration(configurations)
            val addToUndo = (configurations["addToUndo"] as Boolean?) ?: false
            pdfFragment.measurementValueConfigurationEditor?.add(measurementValueConfiguration,addToUndo)
            val isSelected = (configurations["isSelected"] as Boolean?) ?: false
            if (isSelected) {
                pdfFragment.setSelectedMeasurementValueConfiguration(measurementValueConfiguration);
            }
        }

        /**
         * Removes a measurement configuration from the document.
         *
         * @param pdfFragment The [PdfFragment] from which the measurement configuration should be removed.
         * @param configurations The measurement configuration to remove.
         */
        @JvmStatic
        fun removeMeasurementConfiguration(pdfFragment: PdfFragment, configurations :Map<String, Any>) {
            @Suppress("UNCHECKED_CAST")
            val measurementValueConfiguration = convertMeasurementConfiguration(configurations["configuration"] as Map<String, Any>)
            val deleteAssociatedAnnotations = configurations["deleteAssociatedAnnotations"] as Boolean
            val addToUndoStack = configurations["addToUndo"] as Boolean
            pdfFragment.measurementValueConfigurationEditor?.remove(measurementValueConfiguration,deleteAssociatedAnnotations,addToUndoStack)
        }

        /**
         * Returns the measurement configurations for the document.
         *
         * @param pdfFragment The [PdfFragment] from which the measurement configurations should be retrieved.
         * @return The measurement configurations for the document.
         */
        @JvmStatic
        fun getMeasurementConfigurations(pdfFragment: PdfFragment) : List<Map<String,Any?>> {
            return pdfFragment.measurementValueConfigurationEditor?.configurations?.map { reverseMeasurementConfiguration(it) } ?: emptyList()
        }

        /**
         * Modifies a measurement configuration in the document.
         *
         * @param pdfFragment The [PdfFragment] in which the measurement configuration should be modified.
         * @param args The arguments for the modification.
         */
        @Suppress("UNCHECKED_CAST")
        @JvmStatic
        fun modifyMeasurementConfiguration(pdfFragment: PdfFragment, args : Map<String, Any>) {
            val newMeasurementValueConfiguration = convertMeasurementConfiguration(args["newConfiguration"] as Map<String, Any>?)
            val oldMeasurementValueConfiguration = convertMeasurementConfiguration(args["oldConfiguration"] as Map<String, Any>?)
            val modifyAssociatedAnnotations = args["modifyAssociatedAnnotations"] as Boolean
            val addToUndoStack = args["addToUndo"] as Boolean
            pdfFragment.measurementValueConfigurationEditor?.modify(oldMeasurementValueConfiguration,newMeasurementValueConfiguration,
                    modifyAssociatedAnnotations,addToUndoStack)
        }

        /**
         * Converts a measurement configuration from a map to a [MeasurementValueConfiguration].
         *
         * @param measurementConfigurations The map representation of the measurement configuration.
         * @return The [MeasurementValueConfiguration] representation of the measurement configuration.
         */
        @Suppress("UNCHECKED_CAST")
        @JvmStatic
        fun convertMeasurementConfiguration(measurementConfigurations: Map<String, Any>?): MeasurementValueConfiguration {
            val scale =
                    convertScale(measurementConfigurations?.get("scale") as Map<String, Any>?)
            val precision =
                    convertPrecision(measurementConfigurations?.get("precision") as String?)
            val name = (measurementConfigurations?.get("name") as String?) ?: "Unknown"
            if (scale == null) {
                throw IllegalArgumentException("Invalid scale")
            }
            if (precision == null) {
                throw IllegalArgumentException("Invalid precision")
            }
            return MeasurementValueConfiguration(name, scale, precision)
        }
        private  fun reverseMeasurementConfiguration(measurementValueConfiguration: MeasurementValueConfiguration): Map<String, Any?> {
            return mapOf(
                    "name" to measurementValueConfiguration.name,
                    "scale" to reverseScale(measurementValueConfiguration.scale),
                    "precision" to reversePrecision(measurementValueConfiguration.precision)
            )
        }

        private  fun convertScale(scale: Map<String, Any>?): Scale? {
            if (scale == null) {
                return null
            }
            val fromValue: Double = requireNotNull(scale["valueFrom"] as Double)
            val toValue: Double = requireNotNull(scale["valueTo"] as Double)
            val unitFromValue: String = requireNotNull(scale["unitFrom"] as String)
            val unitToValue: String = requireNotNull(scale["unitTo"] as String)

            val unitFrom: Scale.UnitFrom = convertUnitFrom(unitFromValue)
            val unitTo: Scale.UnitTo = convertUnitTo(unitToValue)
            return Scale(fromValue.toFloat(), unitFrom, toValue.toFloat(), unitTo)
        }

        private fun convertUnitFrom(unitFrom: String): Scale.UnitFrom {
            return when (unitFrom) {
                "cm" -> Scale.UnitFrom.CM
                "inch" -> Scale.UnitFrom.IN
                "pt" -> Scale.UnitFrom.PT
                "mm" -> Scale.UnitFrom.MM
                else -> Scale.UnitFrom.CM
            }
        }

        private fun convertUnitTo(unitTo: String): Scale.UnitTo {
            return when (unitTo) {
                "cm" -> Scale.UnitTo.CM
                "inch" -> Scale.UnitTo.IN
                "m" -> Scale.UnitTo.M
                "ft" -> Scale.UnitTo.FT
                "mm" -> Scale.UnitTo.MM
                "km" -> Scale.UnitTo.KM
                "mi" -> Scale.UnitTo.MI
                "yd" -> Scale.UnitTo.YD
                else -> Scale.UnitTo.CM
            }
        }

        private fun reverseScale(scale: Scale): Map<String, Any> {
            return mapOf(
                    "valueFrom" to scale.valueFrom.toDouble(),
                    "valueTo" to scale.valueTo.toDouble(),
                    "unitFrom" to reverseUnitFrom(scale.unitFrom),
                    "unitTo" to reverseUnitTo(scale.unitTo)
            )
        }

        private fun reverseUnitFrom(unitFrom: Scale.UnitFrom): String {
            return when (unitFrom) {
                Scale.UnitFrom.CM -> "cm"
                Scale.UnitFrom.IN -> "inch"
                Scale.UnitFrom.PT -> "pt"
                Scale.UnitFrom.MM -> "mm"
            }
        }

        private fun reverseUnitTo(unitTo: Scale.UnitTo): String {
            return when (unitTo) {
                Scale.UnitTo.CM -> "cm"
                Scale.UnitTo.IN -> "inch"
                Scale.UnitTo.M -> "m"
                Scale.UnitTo.FT -> "ft"
                Scale.UnitTo.MM -> "mm"
                Scale.UnitTo.KM -> "km"
                Scale.UnitTo.MI -> "mi"
                Scale.UnitTo.YD -> "yd"
                Scale.UnitTo.PT -> "pt"
            }
        }

        private fun convertPrecision(precision: String?): MeasurementPrecision? {
            if (precision == null) {
                return null
            }
            val measurementPrecision = when (precision) {
                "oneDP" -> MeasurementPrecision.ONE_DP
                "twoDP" -> MeasurementPrecision.TWO_DP
                "threeDP" -> MeasurementPrecision.THREE_DP
                "fourDP" -> MeasurementPrecision.FOUR_DP
                "whole" -> MeasurementPrecision.WHOLE
                else -> MeasurementPrecision.TWO_DP
            }
            return measurementPrecision
        }

        private fun reversePrecision(precision: MeasurementPrecision): String {
            return when (precision) {
                MeasurementPrecision.ONE_DP -> "oneDP"
                MeasurementPrecision.TWO_DP -> "twoDP"
                MeasurementPrecision.THREE_DP -> "threeDP"
                MeasurementPrecision.FOUR_DP -> "fourDP"
                MeasurementPrecision.WHOLE -> "whole"
                MeasurementPrecision.WHOLE_INCH -> "wholeInch"
                MeasurementPrecision.HALVES_INCH -> "halvesInch"
                MeasurementPrecision.QUARTERS_INCH -> "quartersInch"
                MeasurementPrecision.EIGHTHS_INCH -> "eighthsInch"
                MeasurementPrecision.SIXTEENTHS_INCH -> "sixteenthsInch"
            }
        }
    }
}