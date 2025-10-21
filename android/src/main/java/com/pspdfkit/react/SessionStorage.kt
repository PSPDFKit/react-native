package com.pspdfkit.react

import io.nutrient.domain.ai.AiAssistant

object SessionStorage {
    @Volatile
    private var aiAssistant: AiAssistant? = null

    @JvmStatic
    fun getAiAssistant(): AiAssistant? = aiAssistant

    @JvmStatic
    fun setAiAssistant(assistant: AiAssistant?) {
        aiAssistant = assistant
    }
}


