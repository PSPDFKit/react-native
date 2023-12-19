package com.pspdfkit.react.helper

import java.io.File
import java.util.Locale


class PSPDFKitUtils {
    companion object {

        private val SUPPORTED_IMAGE_TYPES = arrayOf(
                ".jpg",
                ".png",
                ".jpeg",
                ".tif",
                ".tiff"
        )

        @JvmStatic
        public fun isValidImage(file: File): Boolean {
            for (extension in SUPPORTED_IMAGE_TYPES) {
                if (file.name.lowercase(Locale.getDefault()).endsWith(extension)) {
                    return true
                }
            }
            return false
        }

         @JvmStatic
         public fun isValidPdf(file: File): Boolean {
            return file.name.lowercase(Locale.getDefault()).endsWith(".pdf")
        }
    }
}