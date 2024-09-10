package com.pspdfkit.react.annotations

import com.pspdfkit.annotations.AnnotationType
import com.pspdfkit.annotations.configuration.AnnotationConfiguration
import com.pspdfkit.ui.special_mode.controller.AnnotationTool
import com.pspdfkit.ui.special_mode.controller.AnnotationToolVariant

data class ReactAnnotationPresetConfiguration(val type: AnnotationType?,
                                              val annotationTool: AnnotationTool?,
                                              val variant: AnnotationToolVariant?,
                                              val configuration: AnnotationConfiguration)