import { confirm, input, select } from "@inquirer/prompts";

export const THEME_TYPE_CHOICES = [
  {
    name: "Qute — server-rendered HTML templates",
    value: "qute",
    description: "parent=login-ui-qute",
  },
  {
    name: "Vanilla JS — client-side rendering in main.js",
    value: "vanilla-js",
    description: "parent=login-ui-base",
  },
  {
    name: "Embedded HTML + Alpine.js — pages/*.html",
    value: "embedded",
    description: "parent=login-ui-base, embeddedTemplates=true",
  },
  {
    name: "Peekaboo Bear — polished woodland starter (hide-on-password-focus)",
    value: "peekaboo",
    description: "Copy of examples/peekaboo-bear",
  },
];

export async function promptThemeName(defaultValue) {
  return input({
    message: "Theme name",
    default: defaultValue,
    validate: (value) => {
      if (!value || !/^[a-z][a-z0-9-]*$/.test(value)) {
        return "Use lowercase letters, digits, and hyphens (must start with a letter).";
      }
      return true;
    },
  });
}

export async function promptThemeType() {
  return select({
    message: "Theme type",
    choices: THEME_TYPE_CHOICES,
  });
}

export async function promptConfirm(message) {
  return confirm({
    message,
    default: false,
  });
}
