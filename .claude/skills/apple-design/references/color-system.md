# Color System Reference

Complete color system guide for Apple-style designs with semantic color tokens, color scales, and usage guidelines.

## Core Color Palette

### Light Mode

#### Backgrounds
```css
--bg-primary: #ffffff;           /* Main background */
--bg-secondary: #f5f5f7;         /* Subtle background */
--bg-tertiary: #fbfbfd;          /* Cards, elevated surfaces */
--bg-elevated: #ffffff;          /* Modals, popovers */
--bg-overlay: rgba(0, 0, 0, 0.5); /* Modal overlays */
```

#### Text Colors
```css
--text-primary: #1d1d1f;         /* Primary text */
--text-secondary: #6e6e73;       /* Secondary text */
--text-tertiary: #86868b;        /* Tertiary text, captions */
--text-quaternary: #a1a1a6;      /* Disabled text */
--text-inverse: #ffffff;         /* Text on dark backgrounds */
```

#### Borders & Separators
```css
--border-primary: #d2d2d7;       /* Visible borders */
--border-secondary: #e5e5e7;     /* Subtle borders */
--border-tertiary: #f5f5f7;      /* Very subtle dividers */
--border-focus: #0071e3;         /* Focus rings */
```

#### Interactive Colors
```css
--interactive-primary: #0071e3;  /* Primary actions */
--interactive-hover: #0077ed;    /* Hover state */
--interactive-active: #006edb;   /* Active/pressed state */
--interactive-disabled: #d2d2d7; /* Disabled state */
```

### Dark Mode

#### Backgrounds
```css
--bg-primary: #000000;           /* Main background */
--bg-secondary: #1d1d1f;         /* Subtle background */
--bg-tertiary: #2c2c2e;          /* Cards, elevated surfaces */
--bg-elevated: #3a3a3c;          /* Modals, popovers */
--bg-overlay: rgba(0, 0, 0, 0.7); /* Modal overlays */
```

#### Text Colors
```css
--text-primary: #f5f5f7;         /* Primary text */
--text-secondary: #a1a1a6;       /* Secondary text */
--text-tertiary: #86868b;        /* Tertiary text, captions */
--text-quaternary: #6e6e73;      /* Disabled text */
--text-inverse: #1d1d1f;         /* Text on light backgrounds */
```

#### Borders & Separators
```css
--border-primary: #38383a;       /* Visible borders */
--border-secondary: #424245;     /* Subtle borders */
--border-tertiary: #2c2c2e;      /* Very subtle dividers */
--border-focus: #2997ff;         /* Focus rings */
```

#### Interactive Colors
```css
--interactive-primary: #2997ff;  /* Primary actions */
--interactive-hover: #64d2ff;    /* Hover state */
--interactive-active: #0a84ff;   /* Active/pressed state */
--interactive-disabled: #424245; /* Disabled state */
```

## Semantic Colors

### Success
```css
/* Light Mode */
--success-bg: #d1f2eb;
--success-border: #34c759;
--success-text: #1d8348;

/* Dark Mode */
--success-bg: rgba(52, 199, 89, 0.15);
--success-border: #30d158;
--success-text: #32d74b;
```

### Warning
```css
/* Light Mode */
--warning-bg: #fff3cd;
--warning-border: #ff9500;
--warning-text: #c87000;

/* Dark Mode */
--warning-bg: rgba(255, 149, 0, 0.15);
--warning-border: #ff9f0a;
--warning-text: #ffd60a;
```

### Error
```css
/* Light Mode */
--error-bg: #ffe5e5;
--error-border: #ff3b30;
--error-text: #d32f2f;

/* Dark Mode */
--error-bg: rgba(255, 59, 48, 0.15);
--error-border: #ff453a;
--error-text: #ff6961;
```

### Info
```css
/* Light Mode */
--info-bg: #e3f2fd;
--info-border: #007aff;
--info-text: #1976d2;

/* Dark Mode */
--info-bg: rgba(0, 122, 255, 0.15);
--info-border: #0a84ff;
--info-text: #64d2ff;
```

## System Colors (iOS/macOS)

### iOS System Colors (Light Mode)
```css
--ios-blue: #007aff;
--ios-green: #34c759;
--ios-indigo: #5856d6;
--ios-orange: #ff9500;
--ios-pink: #ff2d55;
--ios-purple: #af52de;
--ios-red: #ff3b30;
--ios-teal: #5ac8fa;
--ios-yellow: #ffcc00;
```

### iOS System Colors (Dark Mode)
```css
--ios-blue-dark: #0a84ff;
--ios-green-dark: #30d158;
--ios-indigo-dark: #5e5ce6;
--ios-orange-dark: #ff9f0a;
--ios-pink-dark: #ff375f;
--ios-purple-dark: #bf5af2;
--ios-red-dark: #ff453a;
--ios-teal-dark: #64d2ff;
--ios-yellow-dark: #ffd60a;
```

## Color Scales

### Gray Scale
```css
/* Light Mode */
--gray-50: #fafafa;
--gray-100: #f5f5f7;
--gray-200: #e5e5e7;
--gray-300: #d2d2d7;
--gray-400: #a1a1a6;
--gray-500: #86868b;
--gray-600: #6e6e73;
--gray-700: #515154;
--gray-800: #3a3a3c;
--gray-900: #1d1d1f;

/* Dark Mode (inverted) */
--gray-50-dark: #1d1d1f;
--gray-100-dark: #2c2c2e;
--gray-200-dark: #38383a;
--gray-300-dark: #424245;
--gray-400-dark: #6e6e73;
--gray-500-dark: #86868b;
--gray-600-dark: #a1a1a6;
--gray-700-dark: #c7c7cc;
--gray-800-dark: #d1d1d6;
--gray-900-dark: #f5f5f7;
```

### Blue Scale (Brand)
```css
/* Light Mode */
--blue-50: #e3f2fd;
--blue-100: #bbdefb;
--blue-200: #90caf9;
--blue-300: #64b5f6;
--blue-400: #42a5f5;
--blue-500: #0071e3;  /* Primary blue */
--blue-600: #006edb;
--blue-700: #0062cc;
--blue-800: #0056b3;
--blue-900: #004999;

/* Dark Mode */
--blue-50-dark: #002d5a;
--blue-100-dark: #003d7a;
--blue-200-dark: #004d99;
--blue-300-dark: #0062cc;
--blue-400-dark: #0077ed;
--blue-500-dark: #2997ff;  /* Primary blue dark */
--blue-600-dark: #64d2ff;
--blue-700-dark: #8ae0ff;
--blue-800-dark: #a9e8ff;
--blue-900-dark: #c4f0ff;
```

## Gradients

### Hero Gradients
```css
/* Light Mode Hero */
background: linear-gradient(180deg, #f5f5f7 0%, #ffffff 100%);

/* Dark Mode Hero */
background: linear-gradient(180deg, #1d1d1f 0%, #000000 100%);

/* Radial Spotlight */
background: radial-gradient(circle at 50% 0%, #2997ff33 0%, transparent 50%);

/* Text Gradient */
background: linear-gradient(135deg, #1d1d1f 0%, #6e6e73 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### Button Gradients
```css
/* Primary Button Gradient */
background: linear-gradient(180deg, #0077ed 0%, #0071e3 100%);

/* Hover State */
background: linear-gradient(180deg, #0a84ff 0%, #0077ed 100%);

/* Glass Button */
background: linear-gradient(
  135deg,
  rgba(255, 255, 255, 0.15) 0%,
  rgba(255, 255, 255, 0.05) 100%
);
```

### Card Gradients
```css
/* Glass Card Light */
background: linear-gradient(
  135deg,
  rgba(255, 255, 255, 0.9) 0%,
  rgba(255, 255, 255, 0.7) 100%
);

/* Glass Card Dark */
background: linear-gradient(
  135deg,
  rgba(255, 255, 255, 0.1) 0%,
  rgba(255, 255, 255, 0.05) 100%
);
```

## Usage Guidelines

### Text on Backgrounds

#### Light Backgrounds
- Primary text: `#1d1d1f` (Contrast ratio: 16.9:1)
- Secondary text: `#6e6e73` (Contrast ratio: 4.5:1)
- Tertiary text: `#86868b` (Contrast ratio: 3.5:1)

#### Dark Backgrounds
- Primary text: `#f5f5f7` (Contrast ratio: 16.5:1)
- Secondary text: `#a1a1a6` (Contrast ratio: 4.6:1)
- Tertiary text: `#86868b` (Contrast ratio: 3.4:1)

### Color Combinations

#### Recommended Pairings
```css
/* Primary Action */
background: #0071e3;
color: #ffffff;

/* Secondary Action */
background: transparent;
border: 2px solid #0071e3;
color: #0071e3;

/* Success State */
background: #d1f2eb;
border: #34c759;
color: #1d8348;

/* Error State */
background: #ffe5e5;
border: #ff3b30;
color: #d32f2f;
```

### Glassmorphism

#### Light Glass
```css
background: rgba(255, 255, 255, 0.7);
backdrop-filter: blur(20px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.3);
```

#### Dark Glass
```css
background: rgba(29, 29, 31, 0.7);
backdrop-filter: blur(20px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.1);
```

#### Vibrant Glass (with color)
```css
background: rgba(0, 113, 227, 0.1);
backdrop-filter: blur(20px) saturate(180%);
border: 1px solid rgba(0, 113, 227, 0.3);
```

## Color Utilities (CSS)

### Complete CSS Custom Properties
```css
:root {
  /* Light mode colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f7;
  --bg-tertiary: #fbfbfd;
  --text-primary: #1d1d1f;
  --text-secondary: #6e6e73;
  --text-tertiary: #86868b;
  --border-primary: #d2d2d7;
  --interactive-primary: #0071e3;
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode colors */
    --bg-primary: #000000;
    --bg-secondary: #1d1d1f;
    --bg-tertiary: #2c2c2e;
    --text-primary: #f5f5f7;
    --text-secondary: #a1a1a6;
    --text-tertiary: #86868b;
    --border-primary: #38383a;
    --interactive-primary: #2997ff;
  }
}

/* Usage */
.element {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}
```

## Accessibility Notes

### WCAG Compliance
- **AA Standard**: Minimum contrast ratio of 4.5:1 for normal text
- **AAA Standard**: Minimum contrast ratio of 7:1 for normal text
- **Large Text**: Minimum contrast ratio of 3:1 (18pt+ or 14pt+ bold)

### Tested Combinations
All primary color combinations meet WCAG AA standards:
- ✅ `#1d1d1f` on `#ffffff`: 16.9:1
- ✅ `#6e6e73` on `#ffffff`: 4.5:1
- ✅ `#f5f5f7` on `#000000`: 16.5:1
- ✅ `#ffffff` on `#0071e3`: 4.6:1

### Color Blindness Considerations
- Use icons and labels alongside color-coded information
- Avoid relying solely on red/green distinctions
- Provide sufficient contrast in all modes
- Test with color blindness simulators

## Quick Reference

### Most Common Colors
```css
/* Light Mode */
background: #ffffff;
text: #1d1d1f;
accent: #0071e3;
border: #d2d2d7;

/* Dark Mode */
background: #000000;
text: #f5f5f7;
accent: #2997ff;
border: #38383a;
```
