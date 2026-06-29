<#import "template.ftl" as layout>
<@layout.registrationLayout displayRequiredFields=true; section>
  <#if properties.embeddedTemplates?? && properties.embeddedTemplates == "true">
    <#include "pages/webauthn-register.html">
  </#if>
</@layout.registrationLayout>
