<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=false; section>
  <#if properties.embeddedTemplates?? && properties.embeddedTemplates == "true">
    <#include "pages/terms.html">
  </#if>
</@layout.registrationLayout>
