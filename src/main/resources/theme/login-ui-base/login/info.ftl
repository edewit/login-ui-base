<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=false; section>
  <#if properties.embeddedTemplates?? && properties.embeddedTemplates == "true">
    <#include "pages/info.html">
  </#if>
</@layout.registrationLayout>
