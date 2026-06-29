/**
 * Replace {{key}} placeholders in template strings.
 */
export function render(template, values) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in values)) {
      throw new Error(`Missing template value: ${key}`);
    }
    return String(values[key]);
  });
}
