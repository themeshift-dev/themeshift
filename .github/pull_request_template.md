## Audit summary

<!-- Add a short summary of what you audited. -->
<!-- Set scope + status. For non-applicable checks, mark the checkbox as complete and append `N/A: <reason>`. -->

- Scope: `<component(s)>`
- Status: `Pass` | `Pass with follow-ups` | `Blocked`

# Component Library Audit Checklist

Use this checklist when creating or reviewing UI components in `packages/ui`.

## How to use this

- Run this checklist before merging component PRs.
- Include a short audit summary in the PR description.
- If an item is not applicable, check the box and add `N/A: <one-line reason>`.

## 1. Semantics and Structure

- [ ] Uses correct native element semantics before adding ARIA.
- [ ] Interactive controls are real interactive elements (`button`, `a`, `input`, etc.).
- [ ] No redundant or conflicting ARIA roles/attributes.
- [ ] Decorative icons/ornaments are hidden from assistive tech (`aria-hidden="true"`).
- [ ] Component can receive a clear accessible name when needed.

## 2. Keyboard and Focus

- [ ] Full functionality is available with keyboard only.
- [ ] Tab order follows visual and logical reading order.
- [ ] Focus is always visible and has sufficient contrast.
- [ ] No keyboard trap.
- [ ] `disabled`, `readOnly`, and other non-interactive states are correctly enforced.

## 3. Screen Reader Behavior

- [ ] Labels, descriptions, errors, and hints are announced correctly.
- [ ] State changes are announced appropriately (`aria-live` only when needed).
- [ ] Dynamic content does not cause noisy/redundant announcements.
- [ ] Numeric/status indicators include context (for example: "Notifications, 3 unread").
- [ ] Decorative counters/badges are hidden from AT when parent already announces context.

## 4. RTL, LTR, and Internationalization

- [ ] Uses logical CSS properties (`margin-inline`, `padding-inline`, `inset-inline`, etc.).
- [ ] Start/end placement behaves correctly in both `dir="ltr"` and `dir="rtl"`.
- [ ] No hardcoded left/right positioning unless intentionally direction-agnostic.
- [ ] Works with long translated strings (no critical overflow or clipping).
- [ ] Handles mixed-direction content without broken layout.

## 5. Visual Accessibility

- [ ] Text and UI color contrast meets WCAG expectations for component usage.
- [ ] Information is not conveyed by color alone.
- [ ] Touch/mouse targets are large enough for intended usage.
- [ ] Component remains usable at 200%+ zoom and in narrow viewports.
- [ ] Supports high-contrast / forced-colors mode where relevant.

## 6. Motion and Sensory Considerations

- [ ] Animations are not required to understand state.
- [ ] Honors `prefers-reduced-motion` where motion exists.
- [ ] No flashing/strobing behavior.
- [ ] Loading/skeleton behavior does not create confusion for assistive tech.

## 7. API and Documentation Quality

- [ ] API docs explain accessibility expectations and pitfalls.
- [ ] Guide includes at least one accessible usage example.
- [ ] Guide includes direction-aware example (LTR/RTL) when layout/placement is directional.
- [ ] Docs clarify when to use `aria-label`, `aria-labelledby`, `aria-hidden`, and `aria-live`.
- [ ] Examples avoid anti-patterns (placeholder-only labels, contextless numbers, etc.).

## 8. Testing and Verification

- [ ] `jest-axe` coverage exists for representative states.
- [ ] Manual keyboard test completed.
- [ ] Manual screen reader smoke test completed (VoiceOver/NVDA/JAWS as available).
- [ ] LTR and RTL visual behavior checked.

## Follow-ups

1. `<item or N/A>`
2. `<item or N/A>`
