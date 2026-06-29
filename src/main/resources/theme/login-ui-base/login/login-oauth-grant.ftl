<#import "template.ftl" as layout>
<@layout.registrationLayout; section>
  <#if properties.embeddedTemplates?? && properties.embeddedTemplates == "true">
    <#include "pages/login-oauth-grant.html">
  </#if>
</@layout.registrationLayout>
