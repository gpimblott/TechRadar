  exports.creds = {
    // This is your app's 'REPLY URL' in AAD
    returnURL: process.env.AZURE_RETURN_URL || 'http://localhost:8090/auth/openid/return',

    realm: process.env.AZURE_REALM,
    
    // replace <your_tenant_name_or_id> with your tenant name or your tenant id,
    // tenant name is something like: *.onmicrosoft.com
    // tenant id is something like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx, to find your tenant id, go to your
    // tenant homepage in AAD, and your tenant id will be part of the url:
    // https://manage.windowsazure.com/microsoft.onmicrosoft.com#Workspaces/ActiveDirectoryExtension/Directory/'Your_tenant_id_is_here'/directoryQuickStart 
    identityMetadata: process.env.AZURE_IDENTITY_METADATA || 'https://login.microsoftonline.com/<your_tenant_name_or_id>/.well-known/openid-configuration',
       
    // This is your app's 'CLIENT ID' in AAD
    clientID:  process.env.AZURE_CLIENT_ID,
    
    // This is your app's 'key' in AAD. Required, if in the responseType, you are doing 'id_token code' or 'code',
    // and optional for 'id_token'
    clientSecret: process.env.AZURE_CLIENT_SECRET, 

    oidcIssuer: process.env.AZURE_ISSUER,
    
    // for AAD should be set to true
    skipUserProfile: process.env.AZURE_SKIP_USER_PROFILE || true,
    
    // id_token for login flow
    responseType: process.env.AZURE_RESPONSE_TYPE || 'id_token code',
    
    // we should have token passed back to us in a POST
    responseMode: process.env.AZURE_RESPONSE_MODE || 'query',
    
    // additional scopes you may wish to pass e.g. ['email', 'profile']
    // optional
    scope: process.env.AZURE_SCOPE,
    // if you have validation on, you cannot have users from multiple tenants sign in
    validateIssuer: process.env.AZURE_VALIDATE_ISSUER || true,
    
    // if you want to use the req object in your verify function for the passport strategy, set passReqToCallback true.
    // for example, if your verify function is like "function(req, profile, done)", passReqToCallback should be set true.
    passReqToCallback: process.env.AZURE_PASS_REQ_TO_CALLBACK || false,
    
    // valid are 'info', 'warn', 'error'. Error always goes to stderr in Unix.
    loggingLevel: process.env.PASSPORT_LOGGING_LEVEL || 'warn',
};