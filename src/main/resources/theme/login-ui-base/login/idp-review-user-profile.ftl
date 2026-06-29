<#import "template.ftl" as layout>
<@layout.registrationLayout displayRequiredFields=true displayMessage=!messagesPerField.existsError('firstName','lastName','email','username'); section>
  <#if properties.embeddedTemplates?? && properties.embeddedTemplates == "true">
    <#include "pages/idp-review-user-profile.html">
  </#if>
</@layout.registrationLayout>
