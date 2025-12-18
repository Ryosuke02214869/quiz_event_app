# Component Library Reference

Comprehensive reference for all Apple-style UI components with variants, states, and implementation guidelines.

## Buttons

### Primary Button
```css
.button-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 17px;
  font-weight: 500;
  line-height: 1;
  color: #ffffff;
  background: #0071e3;
  border: none;
  border-radius: 980px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  white-space: nowrap;
}

.button-primary:hover {
  background: #0077ed;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 113, 227, 0.3);
}

.button-primary:active {
  transform: translateY(0);
  box-shadow: 0 4px 8px rgba(0, 113, 227, 0.2);
}

.button-primary:disabled {
  background: #d2d2d7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
```

### Secondary Button
```css
.button-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 17px;
  font-weight: 500;
  line-height: 1;
  color: #0071e3;
  background: transparent;
  border: 2px solid #0071e3;
  border-radius: 980px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}

.button-secondary:hover {
  background: rgba(0, 113, 227, 0.1);
  border-color: #0077ed;
  transform: translateY(-2px);
}

.button-secondary:active {
  background: rgba(0, 113, 227, 0.15);
  transform: translateY(0);
}
```

### Ghost Button
```css
.button-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 17px;
  font-weight: 500;
  color: #0071e3;
  background: transparent;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button-ghost:hover {
  background: rgba(0, 113, 227, 0.08);
}

.button-ghost:active {
  background: rgba(0, 113, 227, 0.15);
}
```

### Icon Button
```css
.button-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button-icon:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}
```

### Button Sizes
```css
/* Small */
.button-sm {
  padding: 8px 16px;
  font-size: 14px;
}

/* Medium (default) */
.button-md {
  padding: 12px 24px;
  font-size: 17px;
}

/* Large */
.button-lg {
  padding: 16px 32px;
  font-size: 19px;
}
```

## Cards

### Basic Card
```css
.card {
  background: var(--bg-tertiary);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}
```

### Glass Card
```css
.card-glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

@media (prefers-color-scheme: dark) {
  .card-glass {
    background: rgba(29, 29, 31, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}
```

### Product Card
```css
.product-card {
  background: var(--bg-tertiary);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.product-card-image {
  aspect-ratio: 4 / 3;
  background: var(--bg-secondary);
  overflow: hidden;
}

.product-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover .product-card-image img {
  transform: scale(1.05);
}

.product-card-content {
  padding: 24px;
}

.product-card-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.product-card-description {
  font-size: 17px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.product-card-price {
  font-size: 14px;
  color: var(--text-tertiary);
}
```

## Forms

### Input
```css
.input {
  width: 100%;
  padding: 12px 16px;
  font-size: 17px;
  font-family: inherit;
  color: var(--text-primary);
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  transition: all 0.2s ease;
  outline: none;
}

.input:focus {
  background: var(--bg-primary);
  border-color: var(--interactive-primary);
  box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
}

.input::placeholder {
  color: var(--text-tertiary);
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Textarea
```css
.textarea {
  width: 100%;
  padding: 12px 16px;
  font-size: 17px;
  font-family: inherit;
  color: var(--text-primary);
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  transition: all 0.2s ease;
  outline: none;
  resize: vertical;
  min-height: 120px;
}

.textarea:focus {
  background: var(--bg-primary);
  border-color: var(--interactive-primary);
  box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
}
```

### Select
```css
.select {
  width: 100%;
  padding: 12px 40px 12px 16px;
  font-size: 17px;
  font-family: inherit;
  color: var(--text-primary);
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid var(--border-primary);
  border-radius: 12px;
  transition: all 0.2s ease;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236e6e73' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
}

.select:focus {
  background-color: var(--bg-primary);
  border-color: var(--interactive-primary);
  box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
}
```

### Checkbox
```css
.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: var(--interactive-primary);
}

.checkbox-label {
  font-size: 17px;
  color: var(--text-primary);
  cursor: pointer;
  user-select: none;
}
```

### Radio Button
```css
.radio-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.radio {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: var(--interactive-primary);
}

.radio-label {
  font-size: 17px;
  color: var(--text-primary);
  cursor: pointer;
  user-select: none;
}
```

### Toggle Switch
```css
.switch {
  position: relative;
  display: inline-block;
  width: 51px;
  height: 31px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #d2d2d7;
  transition: 0.3s;
  border-radius: 31px;
}

.switch-slider:before {
  position: absolute;
  content: "";
  height: 27px;
  width: 27px;
  left: 2px;
  bottom: 2px;
  background: white;
  transition: 0.3s;
  border-radius: 50%;
}

.switch input:checked + .switch-slider {
  background: #34c759;
}

.switch input:checked + .switch-slider:before {
  transform: translateX(20px);
}
```

## Navigation

### Navbar
```css
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding: 12px 0;
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-logo {
  font-size: 21px;
  font-weight: 600;
  color: var(--text-primary);
  text-decoration: none;
}

.navbar-links {
  display: flex;
  gap: 32px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navbar-link {
  font-size: 14px;
  color: var(--text-primary);
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.navbar-link:hover {
  opacity: 0.7;
}
```

### Tabs
```css
.tabs {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid var(--border-secondary);
  padding: 0 8px;
}

.tab {
  padding: 12px 20px;
  font-size: 17px;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab:hover {
  color: var(--text-primary);
}

.tab.active {
  color: var(--interactive-primary);
  border-bottom-color: var(--interactive-primary);
}
```

### Breadcrumbs
```css
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-secondary);
}

.breadcrumb-link {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--interactive-primary);
}

.breadcrumb-separator {
  color: var(--text-tertiary);
}

.breadcrumb-current {
  color: var(--text-primary);
  font-weight: 500;
}
```

## Modals & Dialogs

### Modal
```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 24px;
  animation: fadeIn 0.3s ease;
}

.modal {
  background: var(--bg-elevated);
  backdrop-filter: blur(40px) saturate(180%);
  border-radius: 28px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-header {
  padding: 24px 32px;
  border-bottom: 1px solid var(--border-secondary);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.1);
}

.modal-body {
  padding: 32px;
  overflow-y: auto;
  max-height: calc(90vh - 160px);
}

.modal-footer {
  padding: 24px 32px;
  border-top: 1px solid var(--border-secondary);
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
```

### Popover
```css
.popover {
  position: absolute;
  background: var(--bg-elevated);
  border: 1px solid var(--border-secondary);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  animation: popIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

### Toast / Notification
```css
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-secondary);
  border-radius: 12px;
  padding: 16px 20px;
  min-width: 300px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 9999;
}

.toast-success {
  border-left: 4px solid #34c759;
}

.toast-error {
  border-left: 4px solid #ff3b30;
}

.toast-warning {
  border-left: 4px solid #ff9500;
}

.toast-info {
  border-left: 4px solid #007aff;
}

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
```

## Badges & Tags

### Badge
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 12px;
  white-space: nowrap;
}

.badge-primary {
  background: rgba(0, 113, 227, 0.1);
  color: #0071e3;
}

.badge-success {
  background: rgba(52, 199, 89, 0.1);
  color: #34c759;
}

.badge-error {
  background: rgba(255, 59, 48, 0.1);
  color: #ff3b30;
}

.badge-warning {
  background: rgba(255, 149, 0, 0.1);
  color: #ff9500;
}
```

## Progress Indicators

### Progress Bar
```css
.progress {
  width: 100%;
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 8px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--interactive-primary);
  border-radius: 8px;
  transition: width 0.3s ease;
}
```

### Spinner
```css
.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--border-secondary);
  border-top-color: var(--interactive-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

## Dividers

```css
.divider {
  width: 100%;
  height: 1px;
  background: var(--border-secondary);
  margin: 32px 0;
}

.divider-vertical {
  width: 1px;
  height: 100%;
  background: var(--border-secondary);
  margin: 0 16px;
}
```

## Usage Guidelines

### Component Composition
- Use consistent spacing between components (16px, 24px, 32px)
- Maintain visual hierarchy through size and weight
- Group related components together
- Use appropriate component variants for context

### State Management
All interactive components should have these states:
- **Default**: Normal appearance
- **Hover**: Subtle indication of interactivity
- **Active/Pressed**: Clear feedback on interaction
- **Focus**: Visible focus indicator for accessibility
- **Disabled**: Reduced opacity, no interactivity

### Responsiveness
- Components should adapt to container width
- Use breakpoints consistently (640px, 768px, 1024px)
- Stack components vertically on mobile
- Reduce padding and margins on smaller screens

### Dark Mode
- All components must support dark mode
- Test contrast ratios in both modes
- Adjust opacity and blur for glass effects
- Ensure interactive elements remain visible
