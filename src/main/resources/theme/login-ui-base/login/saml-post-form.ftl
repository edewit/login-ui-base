<#import "template.ftl" as layout>
<@layout.registrationLayout; section>
  <#if properties.embeddedTemplates?? && properties.embeddedTemplates == "true">
    <#include "pages/saml-post-form.html">
  </#if>
</@layout.registrationLayout>
