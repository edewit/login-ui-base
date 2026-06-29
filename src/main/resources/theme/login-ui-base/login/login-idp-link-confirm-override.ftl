<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true; section>
  <#if properties.embeddedTemplates?? && properties.embeddedTemplates == "true">
    <#include "pages/login-idp-link-confirm-override.html">
  </#if>
</@layout.registrationLayout>
