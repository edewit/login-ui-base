<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true; section>
  <#if properties.embeddedTemplates?? && properties.embeddedTemplates == "true">
    <#include "pages/login-verify-email.html">
  </#if>
</@layout.registrationLayout>
