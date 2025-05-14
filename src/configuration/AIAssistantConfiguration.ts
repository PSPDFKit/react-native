/**
 * @typedef AIAssistantConfiguration
 * @memberof AIAssistantConfiguration
 * @property { string } jwt The JSON Web Token used for authentication with your instance of the Nutrient AI Assistant server.
 * @property { string } serverUrl Base HTTP URL where your instance of the Nutrient AI Assistant server can be reached.
 * @property { string } sessionID A unique identifier for the chat session, which can be used to recall a session in the future.
 * @property { string } [userID] An optional user identifier to associate with the session. This will be used to tag session history for user management.
 */

/**
 * @class AIAssistantConfiguration
 */
export class AIAssistantConfiguration {
    /**
     * The JSON Web Token used for authentication with your instance of the Nutrient AI Assistant server.
     */
    jwt: string;
    /**
     * Base HTTP URL where your instance of the Nutrient AI Assistant server can be reached.
     */
    serverURL: string;
    /**
     * A unique identifier for the chat session, which can be used to recall a session in the future.
     */
    sessionID: string;
    /**
     * An optional user identifier to associate with the session. This will be used to tag session history for user management.
     */
    userID?: string;
}