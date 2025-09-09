"use strict";
/**
 * @typedef AIAssistantConfiguration
 * @memberof AIAssistantConfiguration
 * @property { string } jwt The JSON Web Token used for authentication with your instance of the Nutrient AI Assistant server.
 * @property { string } serverURL Base HTTP URL where your instance of the Nutrient AI Assistant server can be reached.
 * @property { string } sessionID A unique identifier for the chat session, which can be used to recall a session in the future.
 * @property { string } [userID] An optional user identifier to associate with the session. This will be used to tag session history for user management.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIAssistantConfiguration = void 0;
/**
 * @class AIAssistantConfiguration
 */
var AIAssistantConfiguration = /** @class */ (function () {
    function AIAssistantConfiguration(params) {
        var jwt = params.jwt, serverURL = params.serverURL, sessionID = params.sessionID, userID = params.userID;
        this.jwt = jwt;
        this.serverURL = serverURL;
        this.sessionID = sessionID;
        this.userID = userID;
    }
    return AIAssistantConfiguration;
}());
exports.AIAssistantConfiguration = AIAssistantConfiguration;
