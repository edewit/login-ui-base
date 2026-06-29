<#import "template.ftl" as layout>
<@layout.registrationLayout displayRequiredFields=true displayMessage=!messagesPerField.existsError('firstName','lastName','email','username'); section>
  <#if properties.embeddedTemplates?? && properties.embeddedTemplates == "true">
    <#include "pages/login-update-profile.html">
  </#if>
</@layout.registrationLayout>
