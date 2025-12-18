# Animation & Motion Reference

Complete guide for animations, transitions, and motion design in Apple-style interfaces.

## Core Principles

### Apple Motion Philosophy
1. **Purposeful**: Every animation serves a function
2. **Subtle**: Movements are refined, never distracting
3. **Fast**: Animations complete quickly (200-600ms)
4. **Natural**: Motion follows real-world physics
5. **Consistent**: Similar actions use similar animations

## Easing Functions

### Standard Easings
```css
/* Ease Out - Elements entering */
--ease-out: cubic-bezier(0, 0, 0.2, 1);

/* Ease In - Elements exiting */
--ease-in: cubic-bezier(0.4, 0, 1, 1);

/* Ease In Out - General transitions */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Ease - Default CSS easing */
--ease: cubic-bezier(0.25, 0.1, 0.25, 1);
```

### Custom Apple Easings
```css
/* Spring - Natural bounce */
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);

/* Sharp - Decisive movement */
--ease-sharp: cubic-bezier(0.4, 0, 0.6, 1);

/* Smooth - Fluid movement */
--ease-smooth: cubic-bezier(0.45, 0.05, 0.55, 0.95);

/* Emphasized - Attention-grabbing */
--ease-emphasized: cubic-bezier(0.2, 0, 0, 1);
```

### Usage Guidelines
```css
/* Entering elements */
.fade-in {
  animation: fadeIn 0.4s cubic-bezier(0, 0, 0.2, 1);
}

/* Exiting elements */
.fade-out {
  animation: fadeOut 0.3s cubic-bezier(0.4, 0, 1, 1);
}

/* Interactive elements (hover, click) */
.interactive {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Duration Scale

### Timing Standards
```css
/* Micro - Very fast (tooltips, hover states) */
--duration-micro: 150ms;

/* Fast - Quick feedback (buttons, checkboxes) */
--duration-fast: 200ms;

/* Base - Standard transitions (modals, dropdowns) */
--duration-base: 300ms;

/* Medium - Deliberate animations (panels, drawers) */
--duration-medium: 400ms;

/* Slow - Emphasis animations (page transitions) */
--duration-slow: 500ms;

/* Slower - Special animations (complex transitions) */
--duration-slower: 600ms;
```

### Duration by Element Type
```css
/* Buttons, links */
transition-duration: 200ms;

/* Dropdowns, tooltips */
transition-duration: 300ms;

/* Modals, dialogs */
transition-duration: 400ms;

/* Page transitions, drawers */
transition-duration: 500ms;
```

## Common Animations

### Fade In
```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn 0.4s cubic-bezier(0, 0, 0.2, 1);
}
```

### Fade In Up
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.5s cubic-bezier(0, 0, 0.2, 1);
}
```

### Fade In Down
```css
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-down {
  animation: fadeInDown 0.5s cubic-bezier(0, 0, 0.2, 1);
}
```

### Scale In
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.scale-in {
  animation: scaleIn 0.3s cubic-bezier(0, 0, 0.2, 1);
}
```

### Slide In Right
```css
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-in-right {
  animation: slideInRight 0.4s cubic-bezier(0, 0, 0.2, 1);
}
```

### Slide In Left
```css
@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-in-left {
  animation: slideInLeft 0.4s cubic-bezier(0, 0, 0.2, 1);
}
```

### Slide Up
```css
@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.slide-up {
  animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Zoom In
```css
@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.zoom-in {
  animation: zoomIn 0.3s cubic-bezier(0, 0, 0.2, 1);
}
```

### Blur In
```css
@keyframes blurIn {
  from {
    opacity: 0;
    filter: blur(10px);
  }
  to {
    opacity: 1;
    filter: blur(0);
  }
}

.blur-in {
  animation: blurIn 0.6s cubic-bezier(0, 0, 0.2, 1);
}
```

## Interactive Animations

### Hover Effects

#### Lift (Elevation increase)
```css
.lift-on-hover {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.lift-on-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}
```

#### Scale
```css
.scale-on-hover {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.scale-on-hover:hover {
  transform: scale(1.05);
}
```

#### Glow
```css
.glow-on-hover {
  transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glow-on-hover:hover {
  box-shadow: 0 0 20px rgba(0, 113, 227, 0.4);
}
```

#### Image Zoom (Ken Burns)
```css
.image-container {
  overflow: hidden;
  border-radius: 20px;
}

.image-zoom {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-container:hover .image-zoom {
  transform: scale(1.1);
}
```

### Click/Tap Effects

#### Press Down
```css
.press-effect {
  transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1);
}

.press-effect:active {
  transform: scale(0.95);
}
```

#### Ripple Effect
```css
.ripple {
  position: relative;
  overflow: hidden;
}

.ripple::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.ripple:active::after {
  width: 300px;
  height: 300px;
}
```

### Focus Effects
```css
.focus-ring {
  outline: none;
  transition: box-shadow 0.2s cubic-bezier(0, 0, 0.2, 1);
}

.focus-ring:focus {
  box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.15);
}

.focus-ring:focus-visible {
  box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.3);
}
```

## Loading States

### Skeleton Loading
```css
@keyframes skeleton {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-secondary) 25%,
    var(--bg-tertiary) 50%,
    var(--bg-secondary) 75%
  );
  background-size: 200% 100%;
  animation: skeleton 1.5s ease-in-out infinite;
  border-radius: 8px;
}
```

### Pulse
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Spin (Spinner)
```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spin {
  animation: spin 0.8s linear infinite;
}
```

### Progress Bar Fill
```css
@keyframes fillProgress {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.progress-fill {
  transform-origin: left;
  animation: fillProgress 2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Page Transitions

### Fade Transition
```css
.page-fade-enter {
  opacity: 0;
}

.page-fade-enter-active {
  opacity: 1;
  transition: opacity 0.4s cubic-bezier(0, 0, 0.2, 1);
}

.page-fade-exit {
  opacity: 1;
}

.page-fade-exit-active {
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.4, 0, 1, 1);
}
```

### Slide Transition
```css
.page-slide-enter {
  transform: translateX(100%);
}

.page-slide-enter-active {
  transform: translateX(0);
  transition: transform 0.4s cubic-bezier(0, 0, 0.2, 1);
}

.page-slide-exit {
  transform: translateX(0);
}

.page-slide-exit-active {
  transform: translateX(-100%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 1, 1);
}
```

## Scroll Animations

### Fade In on Scroll
```css
.scroll-fade {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s cubic-bezier(0, 0, 0.2, 1),
              transform 0.6s cubic-bezier(0, 0, 0.2, 1);
}

.scroll-fade.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Parallax Effect
```css
.parallax {
  transition: transform 0.1s ease-out;
}

/* Applied via JavaScript based on scroll position */
.parallax {
  transform: translateY(calc(var(--scroll) * 0.5));
}
```

### Sticky Header Shrink
```css
.header {
  padding: 24px 0;
  transition: padding 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header.scrolled {
  padding: 12px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
```

## Staggered Animations

### Sequential Fade In
```css
.stagger-item {
  opacity: 0;
  animation: fadeInUp 0.5s cubic-bezier(0, 0, 0.2, 1) forwards;
}

.stagger-item:nth-child(1) { animation-delay: 0s; }
.stagger-item:nth-child(2) { animation-delay: 0.1s; }
.stagger-item:nth-child(3) { animation-delay: 0.2s; }
.stagger-item:nth-child(4) { animation-delay: 0.3s; }
.stagger-item:nth-child(5) { animation-delay: 0.4s; }
```

### CSS Custom Property Method
```css
.stagger-item {
  opacity: 0;
  animation: fadeInUp 0.5s cubic-bezier(0, 0, 0.2, 1) forwards;
  animation-delay: calc(var(--stagger-index) * 0.1s);
}
```

## Performance Optimization

### Use Transform and Opacity
```css
/* ✅ Good - GPU accelerated */
.optimized {
  transform: translateX(100px);
  opacity: 0.5;
}

/* ❌ Avoid - Triggers layout recalculation */
.not-optimized {
  left: 100px;
  visibility: hidden;
}
```

### Will Change
```css
/* Use sparingly - only for elements that will definitely animate */
.will-animate {
  will-change: transform, opacity;
}

/* Remove after animation completes */
.animation-done {
  will-change: auto;
}
```

### Hardware Acceleration
```css
.hardware-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
```

## Reduced Motion

### Respect User Preferences
```css
/* Default animations */
.animated {
  animation: fadeInUp 0.5s cubic-bezier(0, 0, 0.2, 1);
}

/* Reduced motion alternative */
@media (prefers-reduced-motion: reduce) {
  .animated {
    animation: none;
    opacity: 1;
  }

  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Complete Animation Utilities

```css
/* Animation utilities */
:root {
  /* Durations */
  --duration-micro: 150ms;
  --duration-fast: 200ms;
  --duration-base: 300ms;
  --duration-medium: 400ms;
  --duration-slow: 500ms;

  /* Easings */
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Utility classes */
.animate-fade-in { animation: fadeIn 0.4s var(--ease-out); }
.animate-fade-in-up { animation: fadeInUp 0.5s var(--ease-out); }
.animate-fade-in-down { animation: fadeInDown 0.5s var(--ease-out); }
.animate-scale-in { animation: scaleIn 0.3s var(--ease-out); }
.animate-slide-in-right { animation: slideInRight 0.4s var(--ease-out); }
.animate-slide-in-left { animation: slideInLeft 0.4s var(--ease-out); }

/* Transition utilities */
.transition-all { transition: all 0.3s var(--ease-in-out); }
.transition-fast { transition-duration: var(--duration-fast); }
.transition-base { transition-duration: var(--duration-base); }
.transition-slow { transition-duration: var(--duration-slow); }

/* Hover utilities */
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.hover-scale:hover {
  transform: scale(1.05);
}
```

## Best Practices

### DO:
- Use subtle, purposeful animations
- Keep durations between 200-600ms
- Use `transform` and `opacity` for performance
- Provide `prefers-reduced-motion` alternatives
- Test animations on low-end devices
- Use consistent easing functions
- Stagger grouped animations by 50-100ms
- Animate on state changes, not continuously

### DON'T:
- Over-animate or distract users
- Use animations longer than 600ms
- Animate `width`, `height`, `top`, `left`
- Ignore accessibility preferences
- Use animations without purpose
- Mix different easing functions randomly
- Create janky 30fps animations
- Animate on page load excessively

## JavaScript Animation Helpers

### Intersection Observer for Scroll Animations
```javascript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.scroll-fade').forEach(el => {
  observer.observe(el);
});
```

### Stagger Animation Helper
```javascript
function staggerElements(selector, delay = 100) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((el, index) => {
    el.style.setProperty('--stagger-index', index);
  });
}
```

## Quick Reference

### Most Common Animations
```css
/* Fade in content */
animation: fadeIn 0.4s cubic-bezier(0, 0, 0.2, 1);

/* Button hover */
transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
transform: translateY(-2px);

/* Modal entrance */
animation: scaleIn 0.3s cubic-bezier(0, 0, 0.2, 1);

/* Card hover */
transition: all 0.3s ease;
transform: translateY(-4px);
box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
```
