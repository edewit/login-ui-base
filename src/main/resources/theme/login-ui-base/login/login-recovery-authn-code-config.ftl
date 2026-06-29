<#import "template.ftl" as layout>
<@layout.registrationLayout displayRequiredFields=true; section>
  <#if properties.embeddedTemplates?? && properties.embeddedTemplates == "true">
    <#include "pages/login-recovery-authn-code-config.html">
  </#if>
</@layout.registrationLayout>
