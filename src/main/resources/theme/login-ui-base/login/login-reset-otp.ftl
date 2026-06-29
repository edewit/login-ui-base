<#import "template.ftl" as layout>
<@layout.registrationLayout; section>
  <#if properties.embeddedTemplates?? && properties.embeddedTemplates == "true">
    <#include "pages/login-reset-otp.html">
  </#if>
</@layout.registrationLayout>
