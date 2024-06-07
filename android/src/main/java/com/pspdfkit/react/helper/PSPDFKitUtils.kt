package com.pspdfkit.react.helper

import android.content.Context
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
        public fun isValidImage(path: String): Boolean {
            val file = File(path)
            for (extension in SUPPORTED_IMAGE_TYPES) {
                if (file.name.lowercase(Locale.getDefault()).endsWith(extension)) {
                    return true
                }
            }
            return false
        }

         @JvmStatic
         public fun isValidPdf(path: String): Boolean {
             val file = File(path)
             return file.name.lowercase(Locale.getDefault()).endsWith(".pdf")
         }

        @JvmStatic
        public fun getCustomResourceId(resName: String, type: String, context: Context): Int {
            return context.resources.getIdentifier(resName, type, context.packageName)
        }
    }
}