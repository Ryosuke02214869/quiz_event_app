# Typography System Reference

Complete typography guide for Apple-style designs including font families, type scales, line heights, and text styling.

## Font Families

### System Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont,
             'SF Pro Display', 'SF Pro Text',
             'Helvetica Neue', 'Helvetica', 'Arial',
             sans-serif;
```

### Font Family Breakdown

#### Primary (Display)
```css
--font-display: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
```
Use for: Headlines, large text (20px+), hero sections

#### Secondary (Text)
```css
--font-text: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
```
Use for: Body text, paragraphs, UI elements (19px and below)

#### Monospace
```css
--font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Courier New', monospace;
```
Use for: Code, technical content, fixed-width data

## Type Scale

### Display Sizes (Headlines)
```css
--text-display-2xl: 80px;    /* Hero headlines */
--text-display-xl: 64px;     /* Large headlines */
--text-display-lg: 56px;     /* Section headlines */
--text-display-md: 48px;     /* Subsection headlines */
--text-display-sm: 40px;     /* Card headlines */
```

### Heading Sizes
```css
--text-h1: 32px;             /* H1 */
--text-h2: 28px;             /* H2 */
--text-h3: 24px;             /* H3 */
--text-h4: 21px;             /* H4 */
--text-h5: 19px;             /* H5 */
--text-h6: 17px;             /* H6 */
```

### Body Sizes
```css
--text-body-xl: 21px;        /* Large body text */
--text-body-lg: 19px;        /* Emphasized body */
--text-body: 17px;           /* Default body text */
--text-body-sm: 15px;        /* Small body text */
--text-body-xs: 14px;        /* Captions, labels */
```

### Utility Sizes
```css
--text-caption: 12px;        /* Fine print, captions */
--text-overline: 11px;       /* Overline text, tags */
```

## Font Weights

### Weight Scale
```css
--font-thin: 100;            /* Rarely used */
--font-extralight: 200;      /* Rarely used */
--font-light: 300;           /* Light emphasis */
--font-regular: 400;         /* Body text */
--font-medium: 500;          /* Subtle emphasis */
--font-semibold: 600;        /* Strong emphasis, headings */
--font-bold: 700;            /* Very strong emphasis */
--font-extrabold: 800;       /* Rarely used */
--font-black: 900;           /* Rarely used */
```

### Recommended Weights by Use Case

#### Display Text
- Hero: 700 (Bold)
- Large Headlines: 600-700 (Semibold to Bold)
- Section Headers: 600 (Semibold)

#### Body Text
- Emphasis: 500-600 (Medium to Semibold)
- Normal: 400 (Regular)
- De-emphasized: 400 with reduced opacity

#### UI Elements
- Buttons: 500 (Medium)
- Navigation: 400-500 (Regular to Medium)
- Labels: 500 (Medium)

## Line Heights

### Tight (Headlines)
```css
--leading-tight: 1.1;        /* 110% - Large display */
--leading-snug: 1.2;         /* 120% - Headlines */
```

### Normal (Body)
```css
--leading-normal: 1.5;       /* 150% - Body text */
--leading-relaxed: 1.6;      /* 160% - Long-form content */
```

### Loose (Special Cases)
```css
--leading-loose: 1.8;        /* 180% - Poetry, special layouts */
```

### By Text Size
```css
/* Display (48px+) */
line-height: 1.1;

/* Headings (24-40px) */
line-height: 1.2;

/* Body (17-21px) */
line-height: 1.5;

/* Small (14px and below) */
line-height: 1.4;
```

## Letter Spacing

### Tracking Values
```css
--tracking-tighter: -0.03em;  /* -3% - Very large text */
--tracking-tight: -0.02em;    /* -2% - Large headlines */
--tracking-normal: 0em;       /* 0% - Body text */
--tracking-wide: 0.02em;      /* +2% - Small caps, overlines */
--tracking-wider: 0.04em;     /* +4% - Very small text */
```

### By Text Size
```css
/* Display (64px+) */
letter-spacing: -0.03em;

/* Large Headlines (48-64px) */
letter-spacing: -0.02em;

/* Headlines (24-48px) */
letter-spacing: -0.01em;

/* Body (17-21px) */
letter-spacing: 0;

/* Small/Caps (12-15px) */
letter-spacing: 0.02em;
```

## Text Styles

### Complete Style Definitions

#### Display 2XL
```css
.text-display-2xl {
  font-size: 80px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  font-family: var(--font-display);
}
```

#### Display XL
```css
.text-display-xl {
  font-size: 64px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-family: var(--font-display);
}
```

#### Display LG
```css
.text-display-lg {
  font-size: 56px;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-family: var(--font-display);
}
```

#### H1
```css
.text-h1 {
  font-size: 32px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;
  font-family: var(--font-display);
}
```

#### H2
```css
.text-h2 {
  font-size: 28px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;
  font-family: var(--font-display);
}
```

#### H3
```css
.text-h3 {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0;
  font-family: var(--font-display);
}
```

#### Body Large
```css
.text-body-lg {
  font-size: 21px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0;
  font-family: var(--font-text);
}
```

#### Body (Default)
```css
.text-body {
  font-size: 17px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0;
  font-family: var(--font-text);
}
```

#### Body Small
```css
.text-body-sm {
  font-size: 15px;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: 0;
  font-family: var(--font-text);
}
```

#### Caption
```css
.text-caption {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: 0.01em;
  font-family: var(--font-text);
}
```

## Responsive Typography

### Fluid Type Scale (clamp)
```css
/* Hero Title */
.hero-title {
  font-size: clamp(48px, 8vw, 96px);
}

/* Section Title */
.section-title {
  font-size: clamp(32px, 5vw, 64px);
}

/* Body Text */
.body-text {
  font-size: clamp(15px, 2vw, 17px);
}
```

### Breakpoint-based Scale
```css
/* Mobile (< 640px) */
.text-display-xl {
  font-size: 48px;
  line-height: 1.1;
}

/* Tablet (640px - 1024px) */
@media (min-width: 640px) {
  .text-display-xl {
    font-size: 56px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .text-display-xl {
    font-size: 64px;
  }
}
```

## Text Decorations

### Link Styles
```css
.link {
  color: var(--interactive-primary);
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.link:hover {
  opacity: 0.7;
  text-decoration: underline;
}

.link:active {
  opacity: 0.5;
}
```

### Emphasis
```css
/* Strong */
strong, .strong {
  font-weight: 600;
}

/* Emphasis */
em, .emphasis {
  font-style: italic;
  font-weight: 500;
}

/* Code */
code {
  font-family: var(--font-mono);
  font-size: 0.9em;
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
}
```

### Text Transformations
```css
/* Uppercase */
.text-uppercase {
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.875em;
  font-weight: 600;
}

/* Capitalize */
.text-capitalize {
  text-transform: capitalize;
}

/* Truncate */
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Line Clamp */
.text-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

## Text Alignment

```css
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-justify { text-align: justify; }
```

## Text Gradients

### Gradient Text Effect
```css
.text-gradient {
  background: linear-gradient(135deg, #1d1d1f, #6e6e73);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .text-gradient {
    background: linear-gradient(135deg, #f5f5f7, #a1a1a6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
```

### Brand Gradient
```css
.text-gradient-brand {
  background: linear-gradient(135deg, #0071e3, #64d2ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

## Paragraph Styles

### Body Copy
```css
.paragraph {
  font-size: 17px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 1em;
}

.paragraph:last-child {
  margin-bottom: 0;
}
```

### Lead Paragraph
```css
.lead {
  font-size: 21px;
  line-height: 1.5;
  color: var(--text-primary);
  font-weight: 400;
}
```

### Small Print
```css
.small {
  font-size: 14px;
  line-height: 1.4;
  color: var(--text-tertiary);
}
```

## Lists

### Unordered Lists
```css
ul {
  list-style: none;
  padding-left: 1.5em;
}

ul li {
  position: relative;
  margin-bottom: 0.5em;
}

ul li::before {
  content: '•';
  position: absolute;
  left: -1.5em;
  color: var(--text-tertiary);
}
```

### Ordered Lists
```css
ol {
  list-style: none;
  counter-reset: item;
  padding-left: 1.5em;
}

ol li {
  position: relative;
  margin-bottom: 0.5em;
  counter-increment: item;
}

ol li::before {
  content: counter(item) '.';
  position: absolute;
  left: -1.5em;
  color: var(--text-tertiary);
  font-weight: 500;
}
```

## Text Rendering

### Optimization
```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-feature-settings: 'kern' 1;
  font-kerning: normal;
}
```

## Usage Guidelines

### Hierarchy Best Practices

1. **One Display per Section**: Use only one display-size heading per major section
2. **Skip Levels Carefully**: Avoid skipping heading levels (h1 → h3)
3. **Consistent Scaling**: Maintain consistent size relationships throughout

### Readability Guidelines

#### Line Length
- **Optimal**: 50-75 characters per line
- **Maximum**: 90 characters per line
- **Implementation**: Use `max-width` on text containers

```css
.content {
  max-width: 65ch; /* 65 characters */
}
```

#### Contrast
- Body text: Minimum 4.5:1 contrast ratio
- Large text (18pt+): Minimum 3:1 contrast ratio
- Always test in both light and dark modes

### Mobile Considerations

1. **Minimum Sizes**: Never go below 15px for body text on mobile
2. **Touch Targets**: Text links should have at least 44px touch area
3. **Line Length**: Reduce line length on mobile (45-65 characters)

## Complete CSS Variables

```css
:root {
  /* Font Families */
  --font-display: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  --font-text: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', monospace;

  /* Font Sizes */
  --text-display-2xl: 80px;
  --text-display-xl: 64px;
  --text-display-lg: 56px;
  --text-h1: 32px;
  --text-h2: 28px;
  --text-h3: 24px;
  --text-body-lg: 21px;
  --text-body: 17px;
  --text-body-sm: 15px;
  --text-caption: 12px;

  /* Font Weights */
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* Line Heights */
  --leading-tight: 1.1;
  --leading-snug: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.6;

  /* Letter Spacing */
  --tracking-tight: -0.02em;
  --tracking-normal: 0em;
  --tracking-wide: 0.02em;
}
```

## Quick Reference

### Most Common Combinations

```css
/* Hero Title */
font: 700 64px/1.1 var(--font-display);
letter-spacing: -0.02em;

/* Section Heading */
font: 600 32px/1.2 var(--font-display);

/* Body Text */
font: 400 17px/1.5 var(--font-text);

/* Button Text */
font: 500 17px/1 var(--font-text);

/* Caption */
font: 400 12px/1.4 var(--font-text);
letter-spacing: 0.01em;
```
