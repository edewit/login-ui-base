<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=true; section>
  <#if properties.embeddedTemplates?? && properties.embeddedTemplates == "true">
    <#include "pages/delete-credential.html">
  </#if>
</@layout.registrationLayout>
