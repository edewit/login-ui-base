<#import "template.ftl" as layout>
<@layout.registrationLayout displayRequiredFields=true displayMessage=!messagesPerField.existsError('totp','userLabel'); section>
  <#if properties.embeddedTemplates?? && properties.embeddedTemplates == "true">
    <#include "pages/login-config-totp.html">
  </#if>
</@layout.registrationLayout>
