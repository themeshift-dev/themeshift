# 🎨 Design Tokens: How to Use the System

This project uses a **3-layer design token architecture** designed for clarity, scalability, and easy customization.

> **Rule of thumb:** Always use the highest-level token that makes sense.

---

## 🧱 The 3 Layers

### 1. Primitive Tokens

Raw values.

Examples:

- color.gray.200
- space.4
- radius.medium

These tokens:

- represent raw design values
- are not tied to UI meaning
- should rarely be used directly in components

👉 Think of these as your “materials”.

---

### 2. Semantic Tokens

Describe meaning in the UI.

Examples:

- background.surface
- text.primary
- border.default

These tokens:

- define how the UI behaves visually
- adapt automatically across themes (light/dark)
- are the default choice for most styling

👉 These should be your go-to tokens.

---

### 3. Component Tokens

Component-specific customization points.

Examples:

- components.button.variant.primary.background
- components.input.border.focus

These tokens:

- provide fine-grained control
- are part of the public theming API
- are intended for overrides

👉 Use these when semantic tokens aren’t specific enough.

---

## 🧠 How to Choose the Right Token

Follow this order:

### 1. Use semantic tokens first

- background.surface
- text.primary

---

### 2. Use component tokens if needed

- components.button.variant.primary.background

Use when:

- styling a specific component
- customizing variants (primary, secondary, etc.)
- targeting states (hover, active, disabled)

---

### 3. Only use primitives as a last resort

- color.gray.200

Only if:

- no semantic or component token exists
- you are defining new tokens

---

## 🎨 Theming

Themes (light/dark) are handled by changing values, not token names.

✅ Good:

- components.button.variant.primary.background

❌ Avoid:

- components.button.dark.primary.background

The same token path is used across all themes—the value changes underneath.

---

## 🧩 Customizing Components

Override component tokens to change appearance.

Example:

```json
{
  "components": {
    "button": {
      "variant": {
        "primary": {
          "background": {
            "$value": "hotpink"
          }
        }
      }
    }
  }
}
```
