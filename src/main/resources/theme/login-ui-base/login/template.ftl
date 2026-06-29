<#--
  Keycloak Login UI Base Theme - Base Template
  
  This template provides the HTML shell and serializes all context data
  to JSON for consumption by client-side login UIs (plain HTML/JS, Vue, Alpine.js, etc.).
  
  Child themes should provide:
  - main.js: reads pageId from context and renders the appropriate page
  - styles.css: theme-specific styles
  
  Optional: Set embeddedTemplates=true in theme.properties to enable embedded HTML templates.
  When enabled, each page .ftl file can include HTML content from pages/*.html files,
  which will be rendered inside the kc-container div. This allows child themes to
  provide pure HTML files instead of JavaScript template strings.
-->
<#macro registrationLayout bodyClass="" displayInfo=false displayMessage=true displayRequiredFields=false>
<!DOCTYPE html>
<html class="${properties.kcHtmlClass!}" lang="${lang}"<#if realm.internationalizationEnabled && locale??> dir="${(locale.rtl)?then('rtl','ltr')}"</#if>>
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light${darkMode?then(' dark', '')}">
    <meta name="robots" content="noindex, nofollow">

    <#if properties.meta?has_content>
        <#list properties.meta?split(' ') as meta>
            <meta name="${meta?split('==')[0]}" content="${meta?split('==')[1]}"/>
        </#list>
    </#if>
    
    <title>${msg("loginTitle",(realm.displayName!''))}</title>
    <link rel="icon" href="${url.resourcesPath}/img/favicon.ico" />
    
    <#-- Load common styles -->
    <#if properties.stylesCommon?has_content>
        <#list properties.stylesCommon?split(' ') as style>
            <link href="${url.resourcesCommonPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
    
    <#-- Load theme CSS -->
    <#if properties.styles?has_content>
        <#list properties.styles?split(' ') as style>
            <link href="${url.resourcesPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
    
    <#-- Import map for dependencies -->
    <script type="importmap">
        {
            "imports": {
                "rfc4648": "${url.resourcesCommonPath}/vendor/rfc4648/rfc4648.js"
            }
        }
    </script>
    
    <#-- Dark mode handler -->
    <#if darkMode>
      <script type="module" async blocking="render">
          const DARK_MODE_CLASS = "${properties.kcDarkModeClass!'pf-v5-theme-dark'}";
          const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

          updateDarkMode(mediaQuery.matches);
          mediaQuery.addEventListener("change", (event) => updateDarkMode(event.matches));

          function updateDarkMode(isEnabled) {
            const { classList } = document.documentElement;

            if (isEnabled) {
              classList.add(DARK_MODE_CLASS);
            } else {
              classList.remove(DARK_MODE_CLASS);
            }
          }
      </script>
    </#if>
    
    <#-- Load client UI bundle - child themes may provide this -->
    <script type="module" src="${url.resourcesPath}/js/main.js"></script>
    
    <#-- Additional scripts from theme properties -->
    <#if properties.scripts?has_content>
        <#list properties.scripts?split(' ') as script>
            <script src="${url.resourcesPath}/${script}" type="module"></script>
        </#list>
    </#if>
    
    <#-- Scripts added by authenticators -->
    <#if scripts??>
        <#list scripts as script>
            <script src="${script}" type="text/javascript"></script>
        </#list>
    </#if>
</head>

<body class="kc-login-ui-base" data-page-id="${pageId}">
    <#-- 
      Keycloak Context JSON
      This contains all the data that the client UI needs to render the page.
      Read this via document.getElementById('kc-context').
    -->
    <script id="kc-context" type="application/json">
    <#outputformat "JSON">
    {
        "pageId": "${pageId}",
        "locale": "${lang}",
        "lang": "${lang}",
        "darkMode": ${darkMode?c},
        
        <#-- Realm Context -->
        "realm": {
            "name": "${(realm.name!'')?json_string}",
            "displayName": "${(realm.displayName!realm.name!'')?json_string}",
            "displayNameHtml": "${(realm.displayNameHtml!realm.displayName!realm.name!'')?json_string}",
            "registrationAllowed": ${(realm.registrationAllowed!false)?c},
            "registrationEmailAsUsername": ${(realm.registrationEmailAsUsername!false)?c},
            "loginWithEmailAllowed": ${(realm.loginWithEmailAllowed!false)?c},
            "duplicateEmailsAllowed": ${(realm.duplicateEmailsAllowed!false)?c},
            "resetPasswordAllowed": ${(realm.resetPasswordAllowed!false)?c},
            "rememberMe": ${(realm.rememberMe!false)?c},
            "internationalizationEnabled": ${(realm.internationalizationEnabled!false)?c},
            "editUsernameAllowed": ${(realm.editUsernameAllowed!false)?c},
            "password": ${(realm.password!false)?c},
            "identityFederationEnabled": ${(realm.identityFederationEnabled!false)?c}
        },
        
        <#-- URL Context -->
        "url": {
            "loginAction": "${(url.loginAction)!}",
            "loginUrl": "${(url.loginUrl)!}",
            "loginRestartFlowUrl": "${(url.loginRestartFlowUrl)!}",
            "ssoLoginInOtherTabsUrl": "${(url.ssoLoginInOtherTabsUrl)!}",
            "registrationAction": "${(url.registrationAction)!}",
            "registrationUrl": "${(url.registrationUrl)!}",
            "loginResetCredentialsUrl": "${(url.loginResetCredentialsUrl)!}",
            "resourcesUrl": "${(url.resourcesUrl)!}",
            "resourcesPath": "${(url.resourcesPath)!}",
            "resourcesCommonPath": "${(url.resourcesCommonPath)!}",
            "oauthAction": "${(url.oauthAction)!}",
            "logoutConfirmAction": "${(url.logoutConfirmAction)!}"
        },
        
        <#-- Client Context -->
        <#if client??>
        "client": {
            "clientId": "${client.clientId?json_string}",
            "name": <#if client.name??>"${client.name?json_string}"<#else>null</#if>,
            "description": <#if client.description??>"${client.description?json_string}"<#else>null</#if>,
            "baseUrl": <#if client.baseUrl??>"${client.baseUrl?json_string}"<#else>null</#if>,
            "attributes": {<#if client.attributes??><#list client.attributes as key, value>"${key?json_string}": "${value?json_string}"<#sep>, </#sep></#list></#if>}
        },
        <#else>
        "client": null,
        </#if>
        
        <#-- Login Form Data -->
        <#if login??>
        "login": {
            "username": <#if login.username??>"${login.username?json_string}"<#else>null</#if>,
            "rememberMe": <#if login.rememberMe??>"${login.rememberMe}"<#else>null</#if>
        },
        <#else>
        "login": null,
        </#if>
        
        <#-- Message Context -->
        <#if message??>
        "message": {
            "type": "${message.type}",
            "summary": "${message.summary?json_string}"
        },
        <#else>
        "message": null,
        </#if>
        
        <#-- Field-specific error messages -->
        "messagesPerField": {
            <#if messagesPerField??>
            <#assign fields = ["username", "password", "password-new", "password-confirm", "email", "firstName", "lastName", "totp", "userLabel", "recoveryCodeInput", "termsAccepted"]>
            <#assign first = true>
            <#list fields as field>
                <#if messagesPerField.exists(field)>
                    <#if !first>,</#if>"${field}": "${messagesPerField.get(field)?json_string}"<#assign first = false>
                </#if>
            </#list>
            </#if>
        },
        
        <#-- Social/Identity Providers -->
        "social": {
            "providers": [<#if social?? && social.providers??>
                <#list social.providers as p>
                {
                    "alias": "${p.alias?json_string}",
                    "displayName": "${p.displayName?json_string}",
                    "providerId": "${p.providerId?json_string}",
                    "loginUrl": "${p.loginUrl?json_string}",
                    "guiOrder": <#if p.guiOrder??>"${p.guiOrder?json_string}"<#else>null</#if>,
                    "iconClasses": "${(p.iconClasses!'')?json_string}"
                }<#sep>, </#sep>
                </#list>
            </#if>]
        },
        
        <#-- Authentication Context -->
        <#if auth??>
        "auth": {
            "showUsername": ${auth.showUsername()?c},
            "showResetCredentials": ${auth.showResetCredentials()?c},
            "showTryAnotherWayLink": ${auth.showTryAnotherWayLink()?c},
            "attemptedUsername": <#if auth.attemptedUsername??>"${auth.attemptedUsername?json_string}"<#else>null</#if>,
            "selectedCredential": <#if auth.selectedCredential??>"${auth.selectedCredential?json_string}"<#else>null</#if>,
            "authenticationSelections": [<#list auth.authenticationSelections as selection>
                {
                    "authExecId": "${selection.authExecId?json_string}",
                    "displayName": "${selection.displayName?json_string}",
                    "helpText": "${(selection.helpText!'')?json_string}",
                    "iconCssClass": "${(selection.iconCssClass!'')?json_string}"
                }<#sep>, </#sep>
            </#list>]
        },
        <#else>
        "auth": null,
        </#if>
        
        <#-- Locale Information -->
        <#if locale?? && locale.supported??>
        "localeInfo": {
            "current": "${locale.current!''}",
            "currentLanguageTag": "${locale.currentLanguageTag!lang}",
            "rtl": ${(locale.rtl!false)?c},
            "supported": [<#list locale.supported as l>
                {
                    "languageTag": "${l.languageTag}",
                    "label": "${l.label}",
                    "url": "${l.url}"
                }<#sep>, </#sep>
            </#list>]
        },
        <#else>
        "localeInfo": null,
        </#if>
        
        <#-- Authentication Session -->
        <#if authenticationSession??>
        "authenticationSession": {
            "authSessionIdHash": "${authenticationSession.authSessionIdHash}",
            "tabId": "${authenticationSession.tabId}"
        },
        <#else>
        "authenticationSession": null,
        </#if>
        
        <#-- Registration/Profile Context -->
        <#if register??>
        "register": {
            "formData": {<#list register.formData as key, value>"${key}": "${value?json_string}"<#sep>, </#sep></#list>}
        },
        </#if>
        
        <#-- TOTP Configuration Context -->
        <#if totp??>
        "totp": {
            "enabled": ${totp.enabled?c},
            "totpSecret": "${totp.totpSecret}",
            "totpSecretEncoded": "${totp.totpSecretEncoded}",
            "totpSecretQrCode": "${totp.totpSecretQrCode}",
            "manualUrl": "${totp.manualUrl}",
            "qrUrl": "${totp.qrUrl}",
            "policy": {
                "type": "${totp.policy.type}",
                "algorithm": "${totp.policy.algorithm}",
                "digits": ${totp.policy.digits?c},
                "period": ${totp.policy.period?c}
            },
            "supportedApplications": [<#list totp.supportedApplications as app>"${app}"<#sep>, </#sep></#list>],
            "otpCredentials": [<#list totp.otpCredentials as cred>
                {
                    "id": "${cred.id}",
                    "userLabel": "${cred.userLabel!}"
                }<#sep>, </#sep>
            </#list>]
        },
        </#if>
        
        <#-- OTP Login Context -->
        <#if otpLogin??>
        "otpLogin": {
            "selectedCredentialId": <#if otpLogin.selectedCredentialId??>"${otpLogin.selectedCredentialId}"<#else>null</#if>,
            "userOtpCredentials": [<#list otpLogin.userOtpCredentials as cred>
                {
                    "id": "${cred.id}",
                    "userLabel": "${cred.userLabel}"
                }<#sep>, </#sep>
            </#list>],
            "policy": {
                "type": "${otpLogin.policy.type}",
                "algorithm": "${otpLogin.policy.algorithm}",
                "digits": ${otpLogin.policy.digits?c},
                "period": ${otpLogin.policy.period?c}
            }
        },
        </#if>
        
        <#-- OAuth Grant Context -->
        <#if oauth??>
        "oauth": {
            "code": "${oauth.code}",
            "client": "${oauth.client}",
            "clientScopesRequested": [<#list oauth.clientScopesRequested as scope>
                {
                    "consentScreenText": "${scope.consentScreenText}",
                    "guiOrder": <#if scope.guiOrder??>"${scope.guiOrder}"<#else>null</#if>,
                    "dynamicScopeParameter": <#if scope.dynamicScopeParameter??>"${scope.dynamicScopeParameter}"<#else>null</#if>
                }<#sep>, </#sep>
            </#list>]
        },
        </#if>
        
        <#-- Recovery Codes Config Context -->
        <#if recoveryAuthnCodesConfigBean??>
        "recoveryAuthnCodesConfigBean": {
            "generatedRecoveryAuthnCodes": [<#list recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodes as code>"${code}"<#sep>, </#sep></#list>],
            "generatedRecoveryAuthnCodesAsString": "${recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesAsString}",
            "generatedAt": ${recoveryAuthnCodesConfigBean.generatedAt?c}
        },
        </#if>
        
        <#-- Recovery Codes Input Context -->
        <#if recoveryAuthnCodesInputBean??>
        "recoveryAuthnCodesInputBean": {
            "codeNumber": ${recoveryAuthnCodesInputBean.codeNumber?c}
        },
        </#if>
        
        <#-- Code Context (for code display page) -->
        <#if code??>
        "code": {
            "code": <#if code.code??>"${code.code}"<#else>null</#if>,
            "error": <#if code.error??>"${code.error}"<#else>null</#if>
        },
        </#if>
        
        <#-- Logout Confirm Context -->
        <#if logoutConfirm??>
        "logoutConfirm": {
            "code": "${logoutConfirm.code}",
            "skipLink": <#if logoutConfirm.skipLink??>"${logoutConfirm.skipLink}"<#else>null</#if>
        },
        </#if>
        
        <#-- IDP Linking Context -->
        <#if idpAlias??>
        "idpAlias": "${idpAlias}",
        </#if>
        <#if idpDisplayName??>
        "idpDisplayName": "${idpDisplayName}",
        </#if>
        
        <#-- Broker Context -->
        <#if brokerContext??>
        "brokerContext": {
            "username": "${brokerContext.username?json_string}"
        },
        </#if>
        
        <#-- Organization Context -->
        <#if org??>
        "org": {
            "name": "${org.name}",
            "alias": "${org.alias}"
        },
        </#if>
        
        <#-- Front Channel Logout Context -->
        <#if logout??>
        "logout": {
            "clients": [<#list logout.clients as client>
                {
                    "name": "${client.name}",
                    "frontChannelLogoutUrl": "${client.frontChannelLogoutUrl}"
                }<#sep>, </#sep>
            </#list>]
        },
        </#if>
        
        <#-- Password Policies -->
        <#if passwordPolicies?? && passwordPolicies.policies??>
        "passwordPolicies": {
            "policies": [<#list passwordPolicies.policies as policy>
                {
                    "name": "${policy.name!''}",
                    "value": <#if policy.value??>"${policy.value}"<#else>null</#if>
                }<#sep>, </#sep>
            </#list>]
        },
        </#if>
        
        <#-- Additional Flags -->
        "usernameHidden": ${(usernameHidden!false)?c},
        "isAppInitiatedAction": ${(isAppInitiatedAction!false)?c},
        "execution": <#if execution??>"${execution}"<#else>null</#if>,
        <#if statusCode??>"statusCode": ${statusCode?c},</#if>
        
        <#-- Theme Properties -->
        "properties": {<#if properties??><#list properties as key, value>"${key}": "${value?json_string}"<#sep>, </#sep></#list></#if>},
        
        <#-- Additional Scripts -->
        "scripts": [<#if scripts??><#list scripts as s>"${s}"<#sep>, </#sep></#list></#if>],
        
        <#-- Internationalized Messages -->
        "msg": {
            "doLogIn": "${msg("doLogIn")?json_string}",
            "doRegister": "${msg("doRegister")?json_string}",
            "doCancel": "${msg("doCancel")?json_string}",
            "doSubmit": "${msg("doSubmit")?json_string}",
            "doBack": "${msg("doBack")?json_string}",
            "doYes": "${msg("doYes")?json_string}",
            "doNo": "${msg("doNo")?json_string}",
            "doContinue": "${msg("doContinue")?json_string}",
            "doForgotPassword": "${msg("doForgotPassword")?json_string}",
            "doClickHere": "${msg("doClickHere")?json_string}",
            "doTryAgain": "${msg("doTryAgain")?json_string}",
            "doTryAnotherWay": "${msg("doTryAnotherWay")?json_string}",
            "doLogout": "${msg("doLogout")?json_string}",
            "registerTitle": "${msg("registerTitle")?json_string}",
            "loginAccountTitle": "${msg("loginAccountTitle")?json_string}",
            "loginTotpTitle": "${msg("loginTotpTitle")?json_string}",
            "loginProfileTitle": "${msg("loginProfileTitle")?json_string}",
            "loginIdpReviewProfileTitle": "${msg("loginIdpReviewProfileTitle")?json_string}",
            "oauthGrantTitle": "${msg("oauthGrantTitle",(client.clientId)!'')?json_string}",
            "errorTitle": "${msg("errorTitle")?json_string}",
            "emailVerifyTitle": "${msg("emailVerifyTitle")?json_string}",
            "emailForgotTitle": "${msg("emailForgotTitle")?json_string}",
            "updatePasswordTitle": "${msg("updatePasswordTitle")?json_string}",
            "termsTitle": "${msg("termsTitle")?json_string}",
            "noAccount": "${msg("noAccount")?json_string}",
            "username": "${msg("username")?json_string}",
            "usernameOrEmail": "${msg("usernameOrEmail")?json_string}",
            "firstName": "${msg("firstName")?json_string}",
            "lastName": "${msg("lastName")?json_string}",
            "email": "${msg("email")?json_string}",
            "password": "${msg("password")?json_string}",
            "passwordConfirm": "${msg("passwordConfirm")?json_string}",
            "passwordNew": "${msg("passwordNew")?json_string}",
            "rememberMe": "${msg("rememberMe")?json_string}",
            "authenticatorCode": "${msg("authenticatorCode")?json_string}",
            "loginOtpOneTime": "${msg("loginOtpOneTime")?json_string}",
            "loginTotpOneTime": "${msg("loginTotpOneTime")?json_string}",
            "loginTotpDeviceName": "${msg("loginTotpDeviceName")?json_string}",
            "loginTotpScanBarcode": "${msg("loginTotpScanBarcode")?json_string}",
            "loginTotpManualStep2": "${msg("loginTotpManualStep2")?json_string}",
            "loginTotpManualStep3": "${msg("loginTotpManualStep3")?json_string}",
            "loginTotpStep1": "${msg("loginTotpStep1")?json_string}",
            "loginTotpStep2": "${msg("loginTotpStep2")?json_string}",
            "loginTotpStep3": "${msg("loginTotpStep3")?json_string}",
            "loginTotpUnableToScan": "${msg("loginTotpUnableToScan")?json_string}",
            "totpAppFreeOTPName": "${msg("totpAppFreeOTPName")?json_string}",
            "totpAppGoogleName": "${msg("totpAppGoogleName")?json_string}",
            "totpAppMicrosoftAuthenticatorName": "${msg("totpAppMicrosoftAuthenticatorName")?json_string}",
            "loginChooseAuthenticator": "${msg("loginChooseAuthenticator")?json_string}",
            "oauthGrantRequest": "${msg("oauthGrantRequest")?json_string}",
            "oauthGrantPermissions": "${msg("oauthGrantInformation",(client.clientId)!'')?json_string}",
            "emailInstruction": "${msg("emailInstruction")?json_string}",
            "backToLogin": "${msg("backToLogin")?json_string}",
            "emailVerifyInstruction1": "${msg("emailVerifyInstruction1")?json_string}",
            "emailVerifyInstruction2": "${msg("emailVerifyInstruction2")?json_string}",
            "emailVerifyInstruction3": "${msg("emailVerifyInstruction3")?json_string}",
            "pageExpiredTitle": "${msg("pageExpiredTitle")?json_string}",
            "pageExpiredMsg1": "${msg("pageExpiredMsg1")?json_string}",
            "pageExpiredMsg2": "${msg("pageExpiredMsg2")?json_string}",
            "logoutConfirmTitle": "${msg("logoutConfirmTitle")?json_string}",
            "logoutConfirmHeader": "${msg("logoutConfirmHeader")?json_string}",
            "restartLoginTooltip": "${msg("restartLoginTooltip")?json_string}",
            "confirmLinkIdpTitle": "${msg("confirmLinkIdpTitle")?json_string}",
            "emailLinkIdpTitle": "${msg("emailLinkIdpTitle",(idpDisplayName)!'')?json_string}",
            "emailLinkIdp1": "${msg("emailLinkIdp1",(idpDisplayName)!'',(brokerContext.username)!'')?json_string}",
            "emailLinkIdp2": "${msg("emailLinkIdp2")?json_string}",
            "emailLinkIdp3": "${msg("emailLinkIdp3")?json_string}",
            "backToApplication": "${msg("backToApplication")?json_string}",
            "codeSuccessTitle": "${msg("codeSuccessTitle")?json_string}",
            "copyCodeInstruction": "${msg("copyCodeInstruction")?json_string}"
        }
    }
    </#outputformat>
    </script>
    
    <#-- Application container - client UI renders here based on pageId -->
    <div id="kc-container" class="kc-login-container">
        <#-- 
          If embeddedTemplates is enabled, the nested content from page .ftl files
          will be rendered here. Otherwise, the client JavaScript renders content dynamically.
        -->
        <#nested>
    </div>
</body>
</html>
</#macro>
