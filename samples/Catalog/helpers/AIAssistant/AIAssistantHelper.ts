import { AIAssistantConfiguration } from '@nutrient-sdk/react-native';
import { KJUR } from 'jsrsasign';
import { Platform } from 'react-native';

// PEM-formatted private key string used to sign the JWT
const privateKeyPEM = `-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEA2gzhmJ9TDanEzWdP1WG+0Ecwbe7f3bv6e5UUpvcT5q68IQJK
P47AQdBAnSlFVi4X9SaurbWoXdS6jpmPpk24QvitzLNFphHdwjFBelTAOa6taZrS
usoFvrtK9x5xsW4zzt/bkpUraNx82Z8MwLwrt6HlY7dgO9+xBAabj4t1d2t+0HS8
O/ed3CB6T2lj6S8AbLDSEFc9ScO6Uc1XJlSorgyJJSPCpNhSq3AubEZ1wMS1iEtg
AzTPRDsQv50qWIbn634HLWxTP/UH6YNJBwzt3O6q29kTtjXlMGXCvin37PyX4Jy1
IiPFwJm45aWJGKSfVGMDojTJbuUtM+8P9RrnAwIDAQABAoIBAQDSKxhGw0qKINhQ
IwQP5+bDWdqUG2orjsQf2dHOHNhRwJoUNuDZ4f3tcYzV7rGmH0d4Q5CaXj2qMyCd
0eVjpgW0h3z9kM3RA+d7BX7XKlkdQABliZUT9SUUcfIPvohXPKEzBRHed2kf6WVt
XKAuJTD+Dk3LjzRygWldOAE4mnLeZjU61kxPYriynyre+44Gpsgy37Tj25MAmVCY
Flotr/1WZx6bg3HIyFRGxnoJ1zU1MkGxwS4IsrQwOpWEHBiD5nvo54hF5I00NHj/
ccz+MwpgGdjyl02IGCy1fF+Q5SYyH86DG52Mgn8VI9dseGmanLGcgNvrdJFILoJR
SZW7gQoBAoGBAP+D6ZmRF7EqPNMypEHQ5qHHDMvil3mhNQJyIC5rhhl/nn063wnm
zhg96109hVh4zUAj3Rmjb9WqPiW7KBMJJdnEPjmZ/NOXKmgjs2BF+c8oiLQyTQml
xB7LnptvBDi8MnEd3uemfxNuZc+2siuSzgditshNru8xPG2Sn99JC271AoGBANp2
xj5EfdlqNLd11paLOtJ7dfREgc+8FxQCiKSxbaOlVXNk0DW1w4+zLnFohj2m/wRr
bBIzSL+eufoQ9y4BT/AA+ln4qxOpC0isOGK5SxwIjB6OHhCuP8L3anj1IFYM+NX0
Xr1/qdZHKulgbS49cq+TDpB74WyKLLnsvQFyINMXAoGABR5+cp4ujFUdTNnp4out
4zXasscCY+Rv7HGe5W8wC5i78yRXzZn7LQ8ohQCziDc7XXqadmYI2o4DmrvqLJ91
S6yb1omYQCD6L4XvlREx1Q2p13pegr/4cul/bvvFaOGUXSHNEnUKfLgsgAHYBfl1
+T3oDZFI3O/ulv9mBpIvEXUCgYEApeRnqcUM49o4ac/7wZm8czT5XyHeiUbFJ5a8
+IMbRJc6CkRVr1N1S1u/OrMqrQpwwIRqLm/vIEOB6hiT+sVYVGIJueSQ1H8baHYO
4zjdhk4fSNyWjAgltwF2Qp+xjGaRVrcYckHNUD/+n/VvMxvKSPUcrC7GAUvzpsPU
ypJFxsUCgYEA6GuP6M2zIhCYYeB2iLRD4ZHw92RfjikaYmB0++T0y2TVrStlzXHl
c8H6tJWNchtHH30nfLCj9WIMb/cODpm/DrzlSigHffo3+5XUpD/2nSrcFKESw4Xs
a4GXoAxqU44w4Mckg2E19b2MrcNkV9eWAyTACbEO4oFcZcSZOCKj8Fw=
-----END RSA PRIVATE KEY-----`;

/**
 * Creates a JWT token for AI Assistant authentication
 * @param documentId The ID of the document to be accessed
 * @param sessionId The session ID for the chat session
 * @returns Signed JWT string
 */
export function createAIAssistantJWT(documentId: string, sessionId: string): string {
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  const claims = {
    document_ids: [documentId],
    session_ids: [sessionId],
    exp: Math.floor(Date.now() / 1000) + 60 * 60 // 1 hour from now
  };

  const sHeader = JSON.stringify(header);
  const sPayload = JSON.stringify(claims);
  
  const sJWT = KJUR.jws.JWS.sign('RS256', sHeader, sPayload, privateKeyPEM);
  return sJWT;
}

/**
 * Creates the AI Assistant configuration object
 * @param documentId The ID of the document to be accessed
 * @param sessionId Session ID
 * @param userId Optional user ID
 * @returns AIAssistantConfiguration object
 */
export function createAIAssistantConfig(
  documentId: string,
  sessionId: string,
  userId?: string
): AIAssistantConfiguration {
  
  // For this example, we're hardcoding to Android's emulator localhost address (10.0.2.2).
  // This is because the Android emulator runs in a virtual environment where:
  // - localhost/127.0.0.1 refers to the emulator itself
  // - 10.0.2.2 is a special alias that points to the host machine's localhost
  // For iOS, localhost is used.
  const serverURL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:4000'
  : 'http://localhost:4000';
  
  return {
    jwt: createAIAssistantJWT(documentId, sessionId),
    serverURL,
    sessionID: sessionId,
    userID: userId
  };
} 