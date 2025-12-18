# Accessibility Guidelines Reference

Complete accessibility guide for creating inclusive Apple-style designs that work for everyone.

## Core Principles

### WCAG 2.1 Standards
Apple designs should meet at least **WCAG 2.1 Level AA** compliance:
- **Perceivable**: Content must be presentable to users
- **Operable**: UI components must be operable by all users
- **Understandable**: Information must be understandable
- **Robust**: Content must work with assistive technologies

## Color & Contrast

### Contrast Ratios

#### WCAG AA Requirements
```
Normal text (< 18pt): 4.5:1 minimum
Large text (≥ 18pt or 14pt bold): 3:1 minimum
UI components & graphics: 3:1 minimum
```

#### WCAG AAA Requirements (Recommended)
```
Normal text: 7:1 minimum
Large text: 4.5:1 minimum
```

### Tested Color Combinations

#### Light Mode - AA Compliant
```css
/* Primary text on background */
#1d1d1f on #ffffff: 16.9:1 ✅ AAA

/* Secondary text on background */
#6e6e73 on #ffffff: 4.5:1 ✅ AA

/* Interactive elements */
#ffffff on #0071e3: 4.6:1 ✅ AA

/* Links */
#0071e3 on #ffffff: 5.2:1 ✅ AA

/* Error text */
#d32f2f on #ffffff: 7.1:1 ✅ AAA

/* Success text */
#1d8348 on #ffffff: 5.8:1 ✅ AA
```

#### Dark Mode - AA Compliant
```css
/* Primary text on background */
#f5f5f7 on #000000: 16.5:1 ✅ AAA

/* Secondary text on background */
#a1a1a6 on #000000: 4.6:1 ✅ AA

/* Interactive elements */
#ffffff on #2997ff: 4.2:1 ✅ AA

/* Links */
#2997ff on #000000: 5.8:1 ✅ AA
```

### Color Independence

Never rely solely on color to convey information:

```html
<!-- ❌ Bad: Color only -->
<span style="color: red;">Error</span>
<span style="color: green;">Success</span>

<!-- ✅ Good: Color + icon + text -->
<span class="status-error">
  <svg aria-hidden="true">...</svg>
  Error: Invalid input
</span>

<span class="status-success">
  <svg aria-hidden="true">...</svg>
  Success: Saved successfully
</span>
```

### Color Blindness Considerations

Test designs with color blindness simulators:
- Protanopia (red-blind)
- Deuteranopia (green-blind)
- Tritanopia (blue-blind)
- Achromatopsia (no color)

#### Safe Color Combinations
```css
/* Use different brightness levels, not just hues */
--success: #34c759; /* Green with high brightness */
--error: #ff3b30;   /* Red with high saturation */
--warning: #ff9500; /* Orange, distinct from both */

/* Pair with icons and patterns */
.status-indicator {
  border-left: 4px solid var(--status-color);
  /* Border provides non-color distinction */
}
```

## Typography & Readability

### Font Size Standards

#### Minimum Sizes
```css
/* Body text */
font-size: 16px; /* Minimum for mobile */
font-size: 17px; /* Recommended for mobile */

/* Small text / captions */
font-size: 14px; /* Absolute minimum */

/* Never go below 12px for any readable text */
```

#### Responsive Scaling
```css
/* Allow user zoom up to 200% without horizontal scroll */
@viewport {
  zoom: 1;
  min-zoom: 1;
  max-zoom: 2;
}

/* Use relative units */
font-size: 1rem; /* Respects user preferences */
```

### Line Height & Spacing
```css
/* Body text */
line-height: 1.5; /* Minimum for readability */
line-height: 1.6; /* Recommended for long-form */

/* Headlines */
line-height: 1.2; /* Tighter for large text */

/* Paragraph spacing */
margin-bottom: 1em;

/* Letter spacing for small text */
letter-spacing: 0.02em; /* For 14px and below */
```

### Line Length
```css
/* Optimal reading width: 50-75 characters */
.content {
  max-width: 65ch;
}

/* Maximum: 90 characters per line */
.content-wide {
  max-width: 80ch;
}
```

## Semantic HTML

### Proper Structure
```html
<!-- ✅ Good: Semantic HTML -->
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Page Title</h1>
    <section>
      <h2>Section Title</h2>
      <p>Content...</p>
    </section>
  </article>
</main>

<footer>
  <p>&copy; 2024 Company</p>
</footer>

<!-- ❌ Bad: Non-semantic divs -->
<div class="header">
  <div class="nav">
    <div class="link">Home</div>
  </div>
</div>
```

### Heading Hierarchy
```html
<!-- ✅ Good: Proper hierarchy -->
<h1>Main Page Title</h1>
  <h2>Section 1</h2>
    <h3>Subsection 1.1</h3>
  <h2>Section 2</h2>
    <h3>Subsection 2.1</h3>

<!-- ❌ Bad: Skipping levels -->
<h1>Main Title</h1>
  <h3>Skipped H2</h3> <!-- Don't skip levels -->
```

## ARIA Labels & Roles

### Labeling Interactive Elements

#### Buttons
```html
<!-- ✅ Text button (no ARIA needed) -->
<button>Submit</button>

<!-- ✅ Icon button with label -->
<button aria-label="Close dialog">
  <svg>...</svg>
</button>

<!-- ✅ Icon button with visible label -->
<button>
  <svg aria-hidden="true">...</svg>
  <span>Delete</span>
</button>
```

#### Links
```html
<!-- ✅ Descriptive link text -->
<a href="/products">View all products</a>

<!-- ❌ Non-descriptive -->
<a href="/products">Click here</a>

<!-- ✅ Icon link with label -->
<a href="/cart" aria-label="Shopping cart (3 items)">
  <svg>...</svg>
  <span class="visually-hidden">Shopping cart</span>
  <span aria-label="3 items">3</span>
</a>
```

#### Form Fields
```html
<!-- ✅ Proper label association -->
<label for="email">Email address</label>
<input type="email" id="email" name="email" required>

<!-- ✅ With helper text -->
<label for="password">Password</label>
<input
  type="password"
  id="password"
  aria-describedby="password-hint"
  required
>
<span id="password-hint">Must be at least 8 characters</span>

<!-- ✅ Error state -->
<label for="username">Username</label>
<input
  type="text"
  id="username"
  aria-invalid="true"
  aria-describedby="username-error"
>
<span id="username-error" role="alert">
  Username is already taken
</span>
```

### ARIA Roles

#### Landmarks
```html
<header role="banner">
<nav role="navigation" aria-label="Main">
<main role="main">
<aside role="complementary">
<footer role="contentinfo">
```

#### Widgets
```html
<!-- Tab interface -->
<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="panel1">
    Tab 1
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel2">
    Tab 2
  </button>
</div>
<div role="tabpanel" id="panel1">Panel 1 content</div>

<!-- Dialog/Modal -->
<div
  role="dialog"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
  aria-modal="true"
>
  <h2 id="dialog-title">Confirmation</h2>
  <p id="dialog-description">Are you sure?</p>
</div>

<!-- Alert -->
<div role="alert" aria-live="assertive">
  Your changes have been saved
</div>
```

## Keyboard Navigation

### Focus Management

#### Visible Focus Indicator
```css
/* ✅ Good: Clear focus indicator */
.interactive:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.3);
  border-radius: 4px;
}

/* ❌ Bad: No focus indicator */
button:focus {
  outline: none; /* Never do this without alternative */
}
```

#### Focus Order
```html
<!-- Ensure logical tab order -->
<nav>
  <a href="/">Home</a> <!-- Tab 1 -->
  <a href="/about">About</a> <!-- Tab 2 -->
  <a href="/contact">Contact</a> <!-- Tab 3 -->
</nav>

<!-- Use tabindex only when necessary -->
<div tabindex="0">Focusable div</div>
<button tabindex="-1">Not in tab order</button>
```

### Keyboard Shortcuts

#### Common Patterns
```
Enter/Space: Activate button or link
Escape: Close modal or cancel action
Arrow keys: Navigate lists or tabs
Tab: Move forward through interactive elements
Shift + Tab: Move backward
```

#### Implementation
```javascript
// Modal keyboard handling
modal.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// Tab keyboard navigation
tablist.addEventListener('keydown', (e) => {
  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  const currentIndex = tabs.indexOf(e.target);

  if (e.key === 'ArrowRight') {
    const nextIndex = (currentIndex + 1) % tabs.length;
    tabs[nextIndex].focus();
  } else if (e.key === 'ArrowLeft') {
    const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    tabs[prevIndex].focus();
  }
});
```

### Focus Trap (Modals)
```javascript
// Keep focus within modal
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  });

  firstFocusable.focus();
}
```

## Touch Targets

### Minimum Sizes
```css
/* Minimum touch target: 44x44px (Apple HIG) */
.button {
  min-width: 44px;
  min-height: 44px;
}

/* Recommended: 48x48px (Material Design) */
.button-large {
  min-width: 48px;
  min-height: 48px;
}

/* Ensure spacing between targets */
.button-group {
  gap: 8px; /* Minimum 8px spacing */
}
```

### Implementation
```html
<!-- ✅ Good: Large enough touch target -->
<button style="padding: 12px 24px;">
  Submit
</button>

<!-- ❌ Bad: Too small -->
<button style="padding: 4px 8px;">
  Submit
</button>

<!-- ✅ Good: Icon with adequate padding -->
<button class="icon-button" style="width: 44px; height: 44px;">
  <svg width="20" height="20">...</svg>
</button>
```

## Screen Reader Support

### Visually Hidden Content
```css
/* Hide visually but keep for screen readers */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Skip Links
```html
<!-- Allow keyboard users to skip to main content -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<style>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--bg-elevated);
  color: var(--text-primary);
  padding: 8px;
  text-decoration: none;
  z-index: 10000;
}

.skip-link:focus {
  top: 0;
}
</style>
```

### Live Regions
```html
<!-- Announce dynamic content -->
<div aria-live="polite" aria-atomic="true">
  <!-- Screen reader announces when content changes -->
</div>

<div aria-live="assertive">
  <!-- Immediately interrupt to announce -->
</div>

<!-- Status messages -->
<div role="status" aria-live="polite">
  Loading...
</div>

<!-- Alerts -->
<div role="alert" aria-live="assertive">
  Error: Form submission failed
</div>
```

## Images & Media

### Alternative Text
```html
<!-- ✅ Informative image -->
<img src="chart.png" alt="Bar chart showing 50% increase in sales">

<!-- ✅ Decorative image -->
<img src="decorative.png" alt="" role="presentation">

<!-- ✅ Complex image with description -->
<figure>
  <img src="complex.png" alt="Organizational chart"
       aria-describedby="chart-description">
  <figcaption id="chart-description">
    Detailed description of the organizational structure...
  </figcaption>
</figure>

<!-- ❌ Bad: No alt text -->
<img src="image.png">

<!-- ❌ Bad: Redundant alt text -->
<img src="logo.png" alt="Image of logo">
```

### Video Captions
```html
<!-- ✅ Video with captions and transcript -->
<video controls>
  <source src="video.mp4" type="video/mp4">
  <track kind="captions" src="captions.vtt" srclang="en" label="English">
  <track kind="descriptions" src="descriptions.vtt" srclang="en">
</video>

<details>
  <summary>Transcript</summary>
  <p>Full video transcript...</p>
</details>
```

## Motion & Animation

### Reduced Motion
```css
/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Provide alternatives */
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none;
    opacity: 1; /* Show final state immediately */
  }
}
```

### Safe Animations
```css
/* Avoid rapid flashing (seizure risk) */
/* Never flash more than 3 times per second */

/* ❌ Dangerous */
@keyframes flash {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0; }
}
.flashing {
  animation: flash 0.2s infinite; /* Too fast! */
}

/* ✅ Safe */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
.pulsing {
  animation: pulse 2s ease-in-out infinite; /* Gentle */
}
```

## Forms & Validation

### Accessible Forms
```html
<form>
  <!-- Required fields -->
  <label for="name">
    Name <span aria-label="required">*</span>
  </label>
  <input
    type="text"
    id="name"
    name="name"
    required
    aria-required="true"
  >

  <!-- Field with helper text -->
  <label for="email">Email</label>
  <input
    type="email"
    id="email"
    name="email"
    aria-describedby="email-hint"
  >
  <span id="email-hint" class="helper-text">
    We'll never share your email
  </span>

  <!-- Error state -->
  <label for="password">Password</label>
  <input
    type="password"
    id="password"
    name="password"
    aria-invalid="true"
    aria-describedby="password-error"
  >
  <span id="password-error" class="error-text" role="alert">
    Password must be at least 8 characters
  </span>

  <!-- Submit button -->
  <button type="submit">
    Create Account
  </button>
</form>
```

### Error Handling
```javascript
// Announce errors to screen readers
function showError(inputId, message) {
  const input = document.getElementById(inputId);
  const errorId = `${inputId}-error`;

  // Create or update error message
  let errorEl = document.getElementById(errorId);
  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.id = errorId;
    errorEl.className = 'error-text';
    errorEl.setAttribute('role', 'alert');
    input.parentNode.appendChild(errorEl);
  }

  errorEl.textContent = message;

  // Update input attributes
  input.setAttribute('aria-invalid', 'true');
  input.setAttribute('aria-describedby', errorId);

  // Focus the input
  input.focus();
}
```

## Testing Checklist

### Manual Testing
- [ ] Navigate entire site with keyboard only
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Verify color contrast ratios
- [ ] Test with browser zoom at 200%
- [ ] Check focus indicators are visible
- [ ] Verify all images have alt text
- [ ] Test with browser extensions disabled
- [ ] Use with reduced motion settings
- [ ] Test with high contrast mode

### Automated Testing Tools
- **axe DevTools**: Browser extension for accessibility testing
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Built into Chrome DevTools
- **Pa11y**: Command-line accessibility testing
- **axe-core**: JavaScript library for testing

### Screen Readers
- **NVDA** (Windows - Free)
- **JAWS** (Windows - Paid)
- **VoiceOver** (macOS/iOS - Built-in)
- **TalkBack** (Android - Built-in)

## Quick Reference

### Essential Attributes
```html
<!-- Images -->
<img src="..." alt="descriptive text">

<!-- Buttons -->
<button aria-label="Close">×</button>

<!-- Links -->
<a href="..." aria-label="descriptive text">Icon</a>

<!-- Forms -->
<input aria-describedby="hint-id">
<input aria-invalid="true">
<input aria-required="true">

<!-- Modals -->
<div role="dialog" aria-modal="true" aria-labelledby="title">

<!-- Live regions -->
<div aria-live="polite" aria-atomic="true">
```

### CSS Requirements
```css
/* Focus indicators */
:focus-visible {
  outline: 2px solid var(--interactive-primary);
  outline-offset: 2px;
}

/* Touch targets */
.button { min-width: 44px; min-height: 44px; }

/* Color contrast */
color: #1d1d1f; /* 16.9:1 on white */

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```
