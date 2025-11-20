#if RCT_NEW_ARCH_ENABLED

#import "NutrientFabricUtils.h"
// Codegen props for struct types
#import <react/renderer/components/nutrient_sdk_react_native_codegen/Props.h>

using namespace facebook::react;

// Helpers replicated from NutrientView.mm for struct-to-dictionary conversions
static inline NSString *NVS( const std::string &value ) {
    return value.empty() ? nil : [NSString stringWithUTF8String:value.c_str()];
}

static inline NSArray<NSString *> *NVArrayS( const std::vector<std::string> &values ) {
    if (values.empty()) { return @[]; }
    NSMutableArray<NSString *> *result = [NSMutableArray arrayWithCapacity:values.size()];
    for (const auto &v : values) {
        NSString *s = NVS(v);
        if (s) { [result addObject:s]; }
    }
    return [result copy];
}

static inline NSDictionary *InkLikePresetDict(
    const std::string &defaultColor,
    const std::string &defaultFillColor,
    double defaultAlpha,
    double defaultThickness,
    const std::string &blendMode,
    const std::vector<std::string> &availableColors,
    const std::vector<std::string> &availableFillColors,
    double minimumAlpha,
    double maximumAlpha,
    double minimumThickness,
    double maximumThickness,
    bool customColorPickerEnabled,
    bool previewEnabled,
    bool zIndexEditingEnabled,
    bool forceDefaults,
    const std::vector<std::string> &supportedProperties,
    const std::string &aggregationStrategy
) {
    NSMutableDictionary *dict = [NSMutableDictionary dictionary];
    if (NVS(defaultColor)) dict[@"defaultColor"] = NVS(defaultColor);
    if (NVS(defaultFillColor)) dict[@"defaultFillColor"] = NVS(defaultFillColor);
    dict[@"defaultAlpha"] = @(defaultAlpha);
    dict[@"defaultThickness"] = @(defaultThickness);
    if (NVS(blendMode)) dict[@"blendMode"] = NVS(blendMode);
    dict[@"availableColors"] = NVArrayS(availableColors);
    dict[@"availableFillColors"] = NVArrayS(availableFillColors);
    dict[@"minimumAlpha"] = @(minimumAlpha);
    dict[@"maximumAlpha"] = @(maximumAlpha);
    dict[@"minimumThickness"] = @(minimumThickness);
    dict[@"maximumThickness"] = @(maximumThickness);
    dict[@"customColorPickerEnabled"] = @(customColorPickerEnabled);
    dict[@"previewEnabled"] = @(previewEnabled);
    dict[@"zIndexEditingEnabled"] = @(zIndexEditingEnabled);
    dict[@"forceDefaults"] = @(forceDefaults);
    dict[@"supportedProperties"] = NVArrayS(supportedProperties);
    if (NVS(aggregationStrategy)) dict[@"aggregationStrategy"] = NVS(aggregationStrategy);
    return [dict copy];
}

static inline NSDictionary *FreeTextLikePresetDict(
    const std::string &defaultColor,
    const std::vector<std::string> &availableColors,
    bool customColorPickerEnabled,
    double defaultTextSize,
    double minimumTextSize,
    double maximumTextSize,
    const std::string &defaultFont,
    const std::vector<std::string> &availableFonts,
    bool zIndexEditingEnabled,
    bool previewEnabled,
    const std::vector<std::string> &supportedProperties,
    bool forceDefaults,
    const std::string &defaultIconName = std::string(),
    const std::vector<std::string> &availableIconNames = std::vector<std::string>()
) {
    NSMutableDictionary *dict = [NSMutableDictionary dictionary];
    if (NVS(defaultColor)) dict[@"defaultColor"] = NVS(defaultColor);
    dict[@"availableColors"] = NVArrayS(availableColors);
    dict[@"customColorPickerEnabled"] = @(customColorPickerEnabled);
    dict[@"defaultTextSize"] = @(defaultTextSize);
    dict[@"minimumTextSize"] = @(minimumTextSize);
    dict[@"maximumTextSize"] = @(maximumTextSize);
    if (NVS(defaultFont)) dict[@"defaultFont"] = NVS(defaultFont);
    dict[@"availableFonts"] = NVArrayS(availableFonts);
    dict[@"zIndexEditingEnabled"] = @(zIndexEditingEnabled);
    dict[@"previewEnabled"] = @(previewEnabled);
    dict[@"supportedProperties"] = NVArrayS(supportedProperties);
    dict[@"forceDefaults"] = @(forceDefaults);
    if (NVS(defaultIconName)) dict[@"defaultIconName"] = NVS(defaultIconName);
    if (!availableIconNames.empty()) dict[@"availableIconNames"] = NVArrayS(availableIconNames);
    return [dict copy];
}

static inline NSDictionary *ShapeLikePresetDict(
    const std::string &defaultColor,
    const std::string &defaultFillColor,
    double defaultAlpha,
    double defaultThickness,
    const std::vector<std::string> &availableColors,
    const std::vector<std::string> &availableFillColors,
    double minimumAlpha,
    double maximumAlpha,
    double minimumThickness,
    double maximumThickness,
    bool customColorPickerEnabled,
    bool previewEnabled,
    const std::string &defaultBorderStyle,
    bool zIndexEditingEnabled,
    bool forceDefaults,
    const std::vector<std::string> &supportedProperties
) {
    NSMutableDictionary *dict = [NSMutableDictionary dictionary];
    if (NVS(defaultColor)) dict[@"defaultColor"] = NVS(defaultColor);
    if (NVS(defaultFillColor)) dict[@"defaultFillColor"] = NVS(defaultFillColor);
    dict[@"defaultAlpha"] = @(defaultAlpha);
    dict[@"defaultThickness"] = @(defaultThickness);
    dict[@"availableColors"] = NVArrayS(availableColors);
    dict[@"availableFillColors"] = NVArrayS(availableFillColors);
    dict[@"minimumAlpha"] = @(minimumAlpha);
    dict[@"maximumAlpha"] = @(maximumAlpha);
    dict[@"minimumThickness"] = @(minimumThickness);
    dict[@"maximumThickness"] = @(maximumThickness);
    dict[@"customColorPickerEnabled"] = @(customColorPickerEnabled);
    dict[@"previewEnabled"] = @(previewEnabled);
    if (NVS(defaultBorderStyle)) dict[@"defaultBorderStyle"] = NVS(defaultBorderStyle);
    dict[@"zIndexEditingEnabled"] = @(zIndexEditingEnabled);
    dict[@"forceDefaults"] = @(forceDefaults);
    dict[@"supportedProperties"] = NVArrayS(supportedProperties);
    return [dict copy];
}

static inline NSDictionary *LineLikePresetDict(
    const std::string &defaultColor,
    const std::vector<std::string> &availableColors,
    const std::string &defaultFillColor,
    const std::vector<std::string> &availableFillColors,
    bool customColorPickerEnabled,
    double defaultThickness,
    double minimumThickness,
    double maximumThickness,
    double defaultAlpha,
    double minimumAlpha,
    double maximumAlpha,
    const std::string &defaultLineEnd,
    const std::vector<std::string> &availableLineEnds,
    const std::string &defaultBorderStyle,
    bool previewEnabled,
    bool zIndexEditingEnabled,
    const std::vector<std::string> &supportedProperties,
    bool forceDefaults
) {
    NSMutableDictionary *dict = [NSMutableDictionary dictionary];
    if (NVS(defaultColor)) dict[@"defaultColor"] = NVS(defaultColor);
    dict[@"availableColors"] = NVArrayS(availableColors);
    if (NVS(defaultFillColor)) dict[@"defaultFillColor"] = NVS(defaultFillColor);
    dict[@"availableFillColors"] = NVArrayS(availableFillColors);
    dict[@"customColorPickerEnabled"] = @(customColorPickerEnabled);
    dict[@"defaultThickness"] = @(defaultThickness);
    dict[@"minimumThickness"] = @(minimumThickness);
    dict[@"maximumThickness"] = @(maximumThickness);
    dict[@"defaultAlpha"] = @(defaultAlpha);
    dict[@"minimumAlpha"] = @(minimumAlpha);
    dict[@"maximumAlpha"] = @(maximumAlpha);
    if (NVS(defaultLineEnd)) dict[@"defaultLineEnd"] = NVS(defaultLineEnd);
    dict[@"availableLineEnds"] = NVArrayS(availableLineEnds);
    if (NVS(defaultBorderStyle)) dict[@"defaultBorderStyle"] = NVS(defaultBorderStyle);
    dict[@"previewEnabled"] = @(previewEnabled);
    dict[@"zIndexEditingEnabled"] = @(zIndexEditingEnabled);
    dict[@"supportedProperties"] = NVArrayS(supportedProperties);
    dict[@"forceDefaults"] = @(forceDefaults);
    return [dict copy];
}

static inline NSDictionary *AlphaOnlyPresetDict(
    const std::string &defaultColor,
    double defaultAlpha,
    const std::vector<std::string> &availableColors,
    double minimumAlpha,
    double maximumAlpha,
    bool customColorPickerEnabled,
    bool zIndexEditingEnabled,
    bool forceDefaults,
    const std::vector<std::string> &supportedProperties
) {
    NSMutableDictionary *dict = [NSMutableDictionary dictionary];
    if (NVS(defaultColor)) dict[@"defaultColor"] = NVS(defaultColor);
    dict[@"defaultAlpha"] = @(defaultAlpha);
    dict[@"availableColors"] = NVArrayS(availableColors);
    dict[@"minimumAlpha"] = @(minimumAlpha);
    dict[@"maximumAlpha"] = @(maximumAlpha);
    dict[@"customColorPickerEnabled"] = @(customColorPickerEnabled);
    dict[@"zIndexEditingEnabled"] = @(zIndexEditingEnabled);
    dict[@"forceDefaults"] = @(forceDefaults);
    dict[@"supportedProperties"] = NVArrayS(supportedProperties);
    return [dict copy];
}

@implementation NutrientFabricUtils

+ (NSDictionary *)dictionaryFromJSONString:(NSString *)jsonString {
    if (jsonString == nil) { return nil; }
    NSData *data = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    if (data == nil) { return nil; }
    NSError *error = nil;
    id obj = [NSJSONSerialization JSONObjectWithData:data options:0 error:&error];
    if (error != nil || obj == nil) { return nil; }
    if ([obj isKindOfClass:[NSDictionary class]]) {
        return (NSDictionary *)obj;
    }
    return nil;
}

// Returns the root JSON object (NSDictionary or NSArray). Nil on error or other types.
+ (id)objectFromJSONString:(NSString *)jsonString {
    if (jsonString == nil) { return nil; }
    NSData *data = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    if (data == nil) { return nil; }
    NSError *error = nil;
    id obj = [NSJSONSerialization JSONObjectWithData:data options:0 error:&error];
    if (error != nil || obj == nil) { return nil; }
    if ([obj isKindOfClass:[NSDictionary class]] || [obj isKindOfClass:[NSArray class]]) {
        return obj;
    }
    return nil;
}

// Parses a JSON array and returns it only if every element is an NSString.
// Returns nil if jsonString is nil, invalid JSON, not an array, or contains non-strings.
+ (NSArray<NSString *> *)stringArrayFromJSONString:(NSString *)jsonString {
    if (jsonString == nil) { return nil; }
    NSData *data = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    if (data == nil) { return nil; }
    NSError *error = nil;
    id obj = [NSJSONSerialization JSONObjectWithData:data options:0 error:&error];
    if (error != nil || obj == nil) { return nil; }
    if (![obj isKindOfClass:[NSArray class]]) { return nil; }
    NSArray *arr = (NSArray *)obj;
    for (id e in arr) { if (![e isKindOfClass:[NSString class]]) { return nil; } }
    return arr;
}

// MARK: - Struct converters

+ (NSDictionary *)convertAnnotationPresetsToDictionary:(const void *)presetsPtr {
    const NutrientViewAnnotationPresetsStruct *presets = (const NutrientViewAnnotationPresetsStruct *)presetsPtr;
    const NutrientViewAnnotationPresetsStruct &presetsStruct = *presets;
    // Replicate logic from NutrientView.mm using helpers above
    // Build dict using the same structure
    // Ink presets
    NSMutableDictionary *dict = [NSMutableDictionary dictionary];
    {
        const auto &p = presetsStruct.inkPen;
        dict[@"inkPen"] = InkLikePresetDict(
            p.defaultColor, p.defaultFillColor, p.defaultAlpha, p.defaultThickness, p.blendMode,
            p.availableColors, p.availableFillColors, p.minimumAlpha, p.maximumAlpha,
            p.minimumThickness, p.maximumThickness, p.customColorPickerEnabled, p.previewEnabled,
            p.zIndexEditingEnabled, p.forceDefaults, p.supportedProperties, p.aggregationStrategy
        );
    }
    {
        const auto &p = presetsStruct.inkMagic;
        dict[@"inkMagic"] = InkLikePresetDict(
            p.defaultColor, p.defaultFillColor, p.defaultAlpha, p.defaultThickness, p.blendMode,
            p.availableColors, p.availableFillColors, p.minimumAlpha, p.maximumAlpha,
            p.minimumThickness, p.maximumThickness, p.customColorPickerEnabled, p.previewEnabled,
            p.zIndexEditingEnabled, p.forceDefaults, p.supportedProperties, p.aggregationStrategy
        );
    }
    {
        const auto &p = presetsStruct.inkHighlighter;
        dict[@"inkHighlighter"] = InkLikePresetDict(
            p.defaultColor, p.defaultFillColor, p.defaultAlpha, p.defaultThickness, p.blendMode,
            p.availableColors, p.availableFillColors, p.minimumAlpha, p.maximumAlpha,
            p.minimumThickness, p.maximumThickness, p.customColorPickerEnabled, p.previewEnabled,
            p.zIndexEditingEnabled, p.forceDefaults, p.supportedProperties, p.aggregationStrategy
        );
    }
    // Free text
    {
        const auto &p = presetsStruct.freeText;
        dict[@"freeText"] = FreeTextLikePresetDict(
            p.defaultColor, p.availableColors, p.customColorPickerEnabled,
            p.defaultTextSize, p.minimumTextSize, p.maximumTextSize,
            p.defaultFont, p.availableFonts, p.zIndexEditingEnabled, p.previewEnabled,
            p.supportedProperties, p.forceDefaults
        );
    }
    {
        const auto &p = presetsStruct.freeTextCallout;
        dict[@"freeTextCallout"] = FreeTextLikePresetDict(
            p.defaultColor, p.availableColors, p.customColorPickerEnabled,
            p.defaultTextSize, p.minimumTextSize, p.maximumTextSize,
            p.defaultFont, p.availableFonts, p.zIndexEditingEnabled, p.previewEnabled,
            p.supportedProperties, p.forceDefaults
        );
    }
    // Stamp / Image
    dict[@"stamp"] = @{
        @"availableStampItems": NVArrayS(presetsStruct.stamp.availableStampItems),
        @"zIndexEditingEnabled": @(presetsStruct.stamp.zIndexEditingEnabled),
        @"supportedProperties": NVArrayS(presetsStruct.stamp.supportedProperties),
        @"forceDefaults": @(presetsStruct.stamp.forceDefaults),
    };
    dict[@"image"] = @{
        @"availableStampItems": NVArrayS(presetsStruct.image.availableStampItems),
        @"zIndexEditingEnabled": @(presetsStruct.image.zIndexEditingEnabled),
        @"supportedProperties": NVArrayS(presetsStruct.image.supportedProperties),
        @"forceDefaults": @(presetsStruct.image.forceDefaults),
    };
    // Redaction
    {
        const auto &p = presetsStruct.redaction;
        NSMutableDictionary *redaction = [NSMutableDictionary dictionary];
        if (NVS(p.defaultColor)) redaction[@"defaultColor"] = NVS(p.defaultColor);
        if (NVS(p.defaultFillColor)) redaction[@"defaultFillColor"] = NVS(p.defaultFillColor);
        redaction[@"availableColors"] = NVArrayS(p.availableColors);
        redaction[@"availableFillColors"] = NVArrayS(p.availableFillColors);
        redaction[@"customColorPickerEnabled"] = @(p.customColorPickerEnabled);
        redaction[@"previewEnabled"] = @(p.previewEnabled);
        redaction[@"zIndexEditingEnabled"] = @(p.zIndexEditingEnabled);
        redaction[@"forceDefaults"] = @(p.forceDefaults);
        redaction[@"supportedProperties"] = NVArrayS(p.supportedProperties);
        dict[@"redaction"] = [redaction copy];
    }
    // Note
    {
        const auto &p = presetsStruct.note;
        NSMutableDictionary *note = [NSMutableDictionary dictionary];
        if (NVS(p.defaultColor)) note[@"defaultColor"] = NVS(p.defaultColor);
        note[@"availableColors"] = NVArrayS(p.availableColors);
        note[@"customColorPickerEnabled"] = @(p.customColorPickerEnabled);
        if (NVS(p.defaultIconName)) note[@"defaultIconName"] = NVS(p.defaultIconName);
        note[@"availableIconNames"] = NVArrayS(p.availableIconNames);
        note[@"zIndexEditingEnabled"] = @(p.zIndexEditingEnabled);
        note[@"forceDefaults"] = @(p.forceDefaults);
        note[@"supportedProperties"] = NVArrayS(p.supportedProperties);
        dict[@"note"] = [note copy];
    }
    // Text markups
    {
        const auto &p = presetsStruct.highlight;
        dict[@"highlight"] = AlphaOnlyPresetDict(
            p.defaultColor, p.defaultAlpha, p.availableColors, p.minimumAlpha, p.maximumAlpha,
            p.customColorPickerEnabled, p.zIndexEditingEnabled, p.forceDefaults, p.supportedProperties
        );
    }
    {
        const auto &p = presetsStruct.underline;
        dict[@"underline"] = AlphaOnlyPresetDict(
            p.defaultColor, p.defaultAlpha, p.availableColors, p.minimumAlpha, p.maximumAlpha,
            p.customColorPickerEnabled, p.zIndexEditingEnabled, p.forceDefaults, p.supportedProperties
        );
    }
    {
        const auto &p = presetsStruct.squiggly;
        dict[@"squiggly"] = AlphaOnlyPresetDict(
            p.defaultColor, p.defaultAlpha, p.availableColors, p.minimumAlpha, p.maximumAlpha,
            p.customColorPickerEnabled, p.zIndexEditingEnabled, p.forceDefaults, p.supportedProperties
        );
    }
    {
        const auto &p = presetsStruct.strikeOut;
        dict[@"strikeOut"] = AlphaOnlyPresetDict(
            p.defaultColor, p.defaultAlpha, p.availableColors, p.minimumAlpha, p.maximumAlpha,
            p.customColorPickerEnabled, p.zIndexEditingEnabled, p.forceDefaults, p.supportedProperties
        );
    }
    // Shapes
    {
        const auto &p = presetsStruct.square;
        dict[@"square"] = ShapeLikePresetDict(
            p.defaultColor, p.defaultFillColor, p.defaultAlpha, p.defaultThickness,
            p.availableColors, p.availableFillColors, p.minimumAlpha, p.maximumAlpha,
            p.minimumThickness, p.maximumThickness, p.customColorPickerEnabled, p.previewEnabled,
            p.defaultBorderStyle, p.zIndexEditingEnabled, p.forceDefaults, p.supportedProperties
        );
    }
    {
        const auto &p = presetsStruct.circle;
        dict[@"circle"] = ShapeLikePresetDict(
            p.defaultColor, p.defaultFillColor, p.defaultAlpha, p.defaultThickness,
            p.availableColors, p.availableFillColors, p.minimumAlpha, p.maximumAlpha,
            p.minimumThickness, p.maximumThickness, p.customColorPickerEnabled, p.previewEnabled,
            p.defaultBorderStyle, p.zIndexEditingEnabled, p.forceDefaults, p.supportedProperties
        );
    }
    {
        const auto &p = presetsStruct.polygon;
        dict[@"polygon"] = ShapeLikePresetDict(
            p.defaultColor, p.defaultFillColor, p.defaultAlpha, p.defaultThickness,
            p.availableColors, p.availableFillColors, p.minimumAlpha, p.maximumAlpha,
            p.minimumThickness, p.maximumThickness, p.customColorPickerEnabled, p.previewEnabled,
            p.defaultBorderStyle, p.zIndexEditingEnabled, p.forceDefaults, p.supportedProperties
        );
    }
    // Lines
    {
        const auto &p = presetsStruct.line;
        dict[@"line"] = LineLikePresetDict(
            p.defaultColor, p.availableColors, p.defaultFillColor, p.availableFillColors,
            p.customColorPickerEnabled, p.defaultThickness, p.minimumThickness, p.maximumThickness,
            p.defaultAlpha, p.minimumAlpha, p.maximumAlpha, p.defaultLineEnd, p.availableLineEnds,
            p.defaultBorderStyle, p.previewEnabled, p.zIndexEditingEnabled, p.supportedProperties, p.forceDefaults
        );
    }
    {
        const auto &p = presetsStruct.arrow;
        dict[@"arrow"] = LineLikePresetDict(
            p.defaultColor, p.availableColors, p.defaultFillColor, p.availableFillColors,
            p.customColorPickerEnabled, p.defaultThickness, p.minimumThickness, p.maximumThickness,
            p.defaultAlpha, p.minimumAlpha, p.maximumAlpha, p.defaultLineEnd, p.availableLineEnds,
            p.defaultBorderStyle, p.previewEnabled, p.zIndexEditingEnabled, p.supportedProperties, p.forceDefaults
        );
    }
    {
        const auto &p = presetsStruct.polyline;
        dict[@"polyline"] = LineLikePresetDict(
            p.defaultColor, p.availableColors, p.defaultFillColor, p.availableFillColors,
            p.customColorPickerEnabled, p.defaultThickness, p.minimumThickness, p.maximumThickness,
            p.defaultAlpha, p.minimumAlpha, p.maximumAlpha, p.defaultLineEnd, p.availableLineEnds,
            p.defaultBorderStyle, p.previewEnabled, p.zIndexEditingEnabled, p.supportedProperties, p.forceDefaults
        );
    }
    // Eraser
    dict[@"eraser"] = @{
        @"defaultThickness": @(presetsStruct.eraser.defaultThickness),
        @"minimumThickness": @(presetsStruct.eraser.minimumThickness),
        @"maximumThickness": @(presetsStruct.eraser.maximumThickness),
        @"previewEnabled": @(presetsStruct.eraser.previewEnabled),
        @"zIndexEditingEnabled": @(presetsStruct.eraser.zIndexEditingEnabled),
        @"forceDefaults": @(presetsStruct.eraser.forceDefaults),
        @"supportedProperties": NVArrayS(presetsStruct.eraser.supportedProperties),
    };
    // File
    dict[@"file"] = @{
        @"zIndexEditingEnabled": @(presetsStruct.file.zIndexEditingEnabled),
        @"forceDefaults": @(presetsStruct.file.forceDefaults),
        @"supportedProperties": NVArrayS(presetsStruct.file.supportedProperties),
    };
    // Sound / Audio
    dict[@"sound"] = @{
        @"audioSamplingRate": @(presetsStruct.sound.audioSamplingRate),
        @"audioRecordingTimeLimit": @(presetsStruct.sound.audioRecordingTimeLimit),
        @"zIndexEditingEnabled": @(presetsStruct.sound.zIndexEditingEnabled),
        @"supportedProperties": NVArrayS(presetsStruct.sound.supportedProperties),
        @"forceDefaults": @(presetsStruct.sound.forceDefaults),
    };
    dict[@"audio"] = @{
        @"audioSamplingRate": @(presetsStruct.audio.audioSamplingRate),
        @"audioRecordingTimeLimit": @(presetsStruct.audio.audioRecordingTimeLimit),
        @"zIndexEditingEnabled": @(presetsStruct.audio.zIndexEditingEnabled),
        @"supportedProperties": NVArrayS(presetsStruct.audio.supportedProperties),
        @"forceDefaults": @(presetsStruct.audio.forceDefaults),
    };
    // Measurements
    {
        const auto &p = presetsStruct.measurementAreaRect;
        dict[@"measurementAreaRect"] = ShapeLikePresetDict(
            p.defaultColor, std::string(), p.defaultAlpha, p.defaultThickness,
            std::vector<std::string>(), std::vector<std::string>(), p.minimumAlpha, p.maximumAlpha,
            p.minimumThickness, p.maximumThickness, p.customColorPickerEnabled, p.previewEnabled,
            p.defaultBorderStyle, p.zIndexEditingEnabled, p.forceDefaults, p.supportedProperties
        );
    }
    {
        const auto &p = presetsStruct.measurementAreaPolygon;
        dict[@"measurementAreaPolygon"] = ShapeLikePresetDict(
            p.defaultColor, std::string(), p.defaultAlpha, p.defaultThickness,
            std::vector<std::string>(), std::vector<std::string>(), p.minimumAlpha, p.maximumAlpha,
            p.minimumThickness, p.maximumThickness, p.customColorPickerEnabled, p.previewEnabled,
            p.defaultBorderStyle, p.zIndexEditingEnabled, p.forceDefaults, p.supportedProperties
        );
    }
    {
        const auto &p = presetsStruct.measurementAreaEllipse;
        dict[@"measurementAreaEllipse"] = ShapeLikePresetDict(
            p.defaultColor, std::string(), p.defaultAlpha, p.defaultThickness,
            std::vector<std::string>(), std::vector<std::string>(), p.minimumAlpha, p.maximumAlpha,
            p.minimumThickness, p.maximumThickness, p.customColorPickerEnabled, p.previewEnabled,
            p.defaultBorderStyle, p.zIndexEditingEnabled, p.forceDefaults, p.supportedProperties
        );
    }
    {
        const auto &p = presetsStruct.measurementPerimeter;
        dict[@"measurementPerimeter"] = LineLikePresetDict(
            p.defaultColor, p.availableColors, std::string(), std::vector<std::string>(),
            p.customColorPickerEnabled, p.defaultThickness, p.minimumThickness, p.maximumThickness,
            p.defaultAlpha, p.minimumAlpha, p.maximumAlpha, p.defaultLineEnd, p.availableLineEnds,
            p.defaultBorderStyle, p.previewEnabled, p.zIndexEditingEnabled, p.supportedProperties, p.forceDefaults
        );
    }
    {
        const auto &p = presetsStruct.measurementDistance;
        dict[@"measurementDistance"] = LineLikePresetDict(
            p.defaultColor, p.availableColors, std::string(), std::vector<std::string>(),
            p.customColorPickerEnabled, p.defaultThickness, p.minimumThickness, p.maximumThickness,
            p.defaultAlpha, p.minimumAlpha, p.maximumAlpha, p.defaultLineEnd, p.availableLineEnds,
            p.defaultBorderStyle, p.previewEnabled, p.zIndexEditingEnabled, p.supportedProperties, p.forceDefaults
        );
    }

    return [dict copy];
}

@end

#endif // RCT_NEW_ARCH_ENABLED


