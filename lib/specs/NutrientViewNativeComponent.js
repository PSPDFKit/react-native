"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toolbar = void 0;
// @ts-ignore
var codegenNativeComponent_1 = __importDefault(require("react-native/Libraries/Utilities/codegenNativeComponent"));
var Toolbar;
(function (Toolbar) {
    Toolbar.DefaultToolbarButton = {
        CLOSE_BUTTON_ITEM: 'closeButtonItem',
        OUTLINE_BUTTON_ITEM: 'outlineButtonItem',
        SEARCH_BUTTON_ITEM: 'searchButtonItem',
        THUMBNAILS_BUTTON_ITEM: 'thumbnailsButtonItem',
        DOCUMENT_EDITOR_BUTTON_ITEM: 'documentEditorButtonItem',
        PRINT_BUTTON_ITEM: 'printButtonItem',
        OPEN_IN_BUTTON_ITEM: 'openInButtonItem',
        EMAIL_BUTTON_ITEM: 'emailButtonItem',
        MESSAGE_BUTTON_ITEM: 'messageButtonItem',
        ANNOTATION_BUTTON_ITEM: 'annotationButtonItem',
        BOOKMARK_BUTTON_ITEM: 'bookmarkButtonItem',
        BRIGHTNESS_BUTTON_ITEM: 'brightnessButtonItem',
        ACTIVITY_BUTTON_ITEM: 'activityButtonItem',
        SETTINGS_BUTTON_ITEM: 'settingsButtonItem',
        READER_VIEW_BUTTON_ITEM: 'readerViewButtonItem',
        ANNOTATION_LIST_BUTTON_ITEM: 'annotationListButtonItem',
        SHARE_BUTTON_ITEM: 'shareButtonItem',
        AI_ASSISTANT_BUTTON_ITEM: 'aiAssistantButtonItem',
    };
    Toolbar.PDFViewMode = {
        VIEW_MODE_DOCUMENT: 'document',
        VIEW_MODE_THUMBNAILS: 'thumbnails',
        VIEW_MODE_DOCUMENT_EDITOR: 'documentEditor',
    };
})(Toolbar || (exports.Toolbar = Toolbar = {}));
// Export the Fabric native component with Nutrient prefix
exports.default = (0, codegenNativeComponent_1.default)('NutrientView');
