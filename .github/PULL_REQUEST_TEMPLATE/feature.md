## Changes

<!-- What changed and why? Keep this short and concrete. -->

## Release Impact

- Breaking change: `yes` | `no`
- If yes, migration notes:

## Screenshots or Recordings

<!-- Add before/after screenshots or a short video/GIF for visual/interaction changes. -->

## How To Verify

<!-- Commands run + manual smoke-test steps -->

## Audit Summary

- Scope: `<component(s)>`
- Status: `Pass` | `Pass with follow-ups` | `Blocked`

# Component Library Audit Checklist

For deeper audits, use: [`COMPONENT_LIBRARY_AUDIT_CHECKLIST.md`](https://github.com/themeshift-dev/themeshift/blob/develop/COMPONENT_LIBRARY_AUDIT_CHECKLIST.md)

If an item is not applicable, check the box and append `N/A: <reason>`.

## 1. Accessibility Smoke Test

- [ ] Keyboard-only flow works (focus order, visible focus, no trap).
- [ ] Screen reader naming/context is correct for main interactions.
- [ ] Visual accessibility basics pass (contrast and not color-only meaning).
- [ ] RTL/LTR behavior is correct for any directional layout/placement.

## 2. Documentation Quality

- [ ] Public API docs were updated for behavioral/a11y changes.
- [ ] Guide examples were updated for changed behavior.
- [ ] At least one example shows accessible usage for this change.
- [ ] Direction usage is documented when start/end behavior exists.

## 3. Test Coverage

- [ ] Unit tests cover core behavior and critical edge/state transitions.
- [ ] `jest-axe` coverage exists for representative rendered states.
- [ ] Manual smoke test completed for changed UX paths.
- [ ] Typecheck + format pass for touched files.

## 4. Risk and Follow-ups

- [ ] Breaking changes are documented (or `N/A: none`).
- [ ] Any known gaps are tracked with a follow-up item.
- [ ] PR description includes clear rollback/mitigation notes when needed.
- [ ] Reviewer focus areas are called out explicitly.

## Optional Reviewer Notes

- Reviewer focus:
  - `<highest-risk area>`
  - `<second-risk area>`
- Out of scope:
  - `<explicitly not covered in this PR>`
- Performance impact:
- Browser/device edge cases:
- Localization nuances:
- Additional follow-up tickets:
