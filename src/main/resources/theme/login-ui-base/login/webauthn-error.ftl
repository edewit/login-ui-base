<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=true; section>
  <#if properties.embeddedTemplates?? && properties.embeddedTemplates == "true">
    <#include "pages/webauthn-error.html">
  </#if>
</@layout.registrationLayout>
