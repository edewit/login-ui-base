<#import "template.ftl" as layout>
<@layout.registrationLayout; section>
  <#if properties.embeddedTemplates?? && properties.embeddedTemplates == "true">
    <#include "pages/code.html">
  </#if>
</@layout.registrationLayout>
