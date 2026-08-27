# Design System — Motion & Interface Standard

This is the standing design standard for any screen, component, or
interaction built in this project's UI. It applies whenever new UI work is
started, not just when something is explicitly flagged as a "design task."

The through-line: an interface feels alive when motion starts from the
element's current on-screen value, inherits the user's velocity, projects
momentum forward, and can be grabbed and reversed at any instant. Springs are
the tool for this, because they're inherently interruptible and
velocity-aware — prefer them over fixed-duration CSS transitions or
`@keyframes` for anything the user can touch or drag.

## Core rules

1. **Kill latency first.** Respond to a press on pointer-down, not on
   release. Every interaction with visible lag reads as broken, no matter how
   good the motion underneath it is.
2. **Direct manipulation is 1:1.** Dragged content stays glued to the
   pointer, respecting the offset from where it was grabbed — never snapping
   to center.
3. **Everything gesture-driven must be interruptible.** A user can grab a
   moving element mid-flight and reverse it without waiting for the
   animation to finish. Always animate from the element's current
   on-screen value, never from the target value — starting from the target
   causes a visible jump on interrupt.
4. **Default to critically damped springs** (no overshoot) for ordinary UI
   transitions. Reserve bounce/overshoot for interactions where the gesture
   itself carried momentum — a flick, a throw, a drag release — not for
   things that just fade or slide in on their own.
5. **Enter and exit along the same path.** A panel that opens from the right
   dismisses to the right. Anchor menus, popovers, and sheets to the element
   that triggered them.
6. **Translucent surfaces encode hierarchy, not decoration.** Use
   `backdrop-filter` layers for floating chrome (toolbars, sheets) with
   content scrolling underneath, and keep text on translucent surfaces
   legible with real contrast, not flat gray.
7. **Respect reduced-motion, reduced-transparency, and high-contrast
   preferences** as first-class states, not an afterthought — cross-fade
   instead of sliding/springing, raise background opacity instead of relying
   on blur, and use a solid contrasting border instead of translucency when
   the user has asked for it.
8. **Typography scales with size, not a fixed value.** Tighten tracking and
   leading on large display text; loosen both for body copy. Build
   hierarchy from weight, size, and leading together, not size alone.

## Underlying principles

Every rule above serves one of these, in priority order when they conflict:

- **Purpose** — build with intention; deciding what not to build is part of
  the design.
- **Agency** — keep the user in control, with easy undo for reversible
  actions and confirmation only for genuinely destructive ones.
- **Responsibility** — anticipate misuse, ask for sensitive access only at
  the moment it's needed, and disclose what the system is doing.
- **Familiarity** — build on metaphors and patterns people already know;
  only break one if it's demonstrably better, and prove that with real
  testing, not assumption.
- **Flexibility** — adapt to device, context, and the full range of user
  ability.
- **Simplicity** — strip the unnecessary so the core purpose is obvious;
  simplicity is not the same as minimalism, and sometimes adding context
  (a scrubber that shows time remaining) is what makes something simple to
  use.
- **Craft** — every spacing, timing, and alignment value should be a
  deliberate, defensible choice, not a default left untouched.
- **Delight** — the result of getting the rest right, not an effect added
  on top.

## When this applies

Any change that touches a component's layout, transition, gesture handling,
or visual hierarchy in the wizard UI. It does not apply to the term-authoring
pipeline's own dialogue logic (`wizard-pipeline/prompts/`), which is backend
Socratic-dialogue content with no visual surface of its own.
