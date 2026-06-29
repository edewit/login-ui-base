<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('totp'); section>
  <#if properties.embeddedTemplates?? && properties.embeddedTemplates == "true">
    <#include "pages/login-otp.html">
  </#if>
</@layout.registrationLayout>
