---
name: apple-design
description: Create elegant, minimalist Apple-style designs with clean layouts, subtle shadows, SF Pro typography, and modern UI components. Use when designing websites, apps, or interfaces that need a premium, sophisticated Apple aesthetic with glassmorphism, smooth animations, and intuitive user experience.
---

# Apple Design

Create beautiful, minimalist designs inspired by Apple's design language featuring clean layouts, elegant typography, subtle depth, and premium aesthetics.

## When to Use This Skill

- Creating modern, minimalist website designs
- Building iOS/macOS-inspired web applications
- Designing landing pages with premium aesthetics
- Implementing glassmorphism and depth effects
- Creating product showcases or portfolio sites
- Designing clean, intuitive user interfaces
- Building marketing pages with Apple-style visuals

## Core Design Principles

Apple's design philosophy centers on:

1. **Simplicity**: Remove unnecessary elements, focus on content
2. **Clarity**: Clear visual hierarchy and readable typography
3. **Depth**: Subtle shadows and layers for dimensionality
4. **Consistency**: Unified design language across components
5. **Motion**: Smooth, purposeful animations
6. **Whitespace**: Generous spacing for breathing room

## Design System Overview

This skill includes a comprehensive design system with detailed references for:

- **[Color System](references/color-system.md)**: Complete color palette, semantic colors, gradients, and accessibility-tested combinations
- **[Typography](references/typography.md)**: Font families, type scales, line heights, and responsive text styles
- **[Components](references/components.md)**: Full component library with buttons, cards, forms, navigation, and more
- **[Animation & Motion](references/animation.md)**: Easing functions, transitions, keyframe animations, and performance optimization
- **[Accessibility](references/accessibility.md)**: WCAG compliance, ARIA labels, keyboard navigation, and inclusive design practices

### Quick Color Reference

**Light Mode**:
- Background: `#ffffff`, `#f5f5f7`, `#fbfbfd`
- Text: `#1d1d1f`, `#86868b`, `#6e6e73`
- Accent: `#0071e3`, `#06c`, `#007aff`
- Borders: `#d2d2d7`, `#e5e5e7`

**Dark Mode**:
- Background: `#000000`, `#161617`, `#1d1d1f`
- Text: `#f5f5f7`, `#a1a1a6`, `#86868b`
- Accent: `#2997ff`, `#0a84ff`, `#64d2ff`
- Borders: `#424245`, `#38383a`

For complete color documentation including semantic colors, gradients, and color scales, see [Color System Reference](references/color-system.md).

### Typography

**System Fonts**:
```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display',
             'SF Pro Text', 'Helvetica Neue', sans-serif;
```

**Type Scale**:
- Hero: 56-80px (bold, tight letter-spacing)
- H1: 48px (semibold)
- H2: 40px (semibold)
- H3: 32px (semibold)
- H4: 24px (medium)
- Body Large: 21px (regular)
- Body: 17px (regular)
- Small: 14px (regular)
- Caption: 12px (regular)

**Font Weights**:
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### Spacing System

Use multiples of 4px for consistent spacing:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px
- 4xl: 96px

### Border Radius

- Small (buttons, inputs): 8-12px
- Medium (cards, modals): 16-20px
- Large (sections, images): 24-28px
- Extra Large: 32px+

## Component Patterns

### 1. Hero Section

```html
<section class="hero">
  <div class="hero-content">
    <h1 class="hero-title">iPhone 15 Pro</h1>
    <p class="hero-subtitle">Titanium. So strong. So light. So Pro.</p>
    <div class="hero-cta">
      <a href="#" class="button-primary">Buy</a>
      <a href="#" class="button-secondary">Learn more</a>
    </div>
  </div>
</section>
```

```css
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(to bottom, #f5f5f7, #ffffff);
}

.hero-title {
  font-size: 64px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
  color: #1d1d1f;
}

.hero-subtitle {
  font-size: 28px;
  font-weight: 400;
  color: #6e6e73;
  margin-bottom: 32px;
}
```

### 2. Glassmorphism Card

```css
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .glass-card {
    background: rgba(29, 29, 31, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}
```

### 3. Primary Button

```css
.button-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  font-size: 17px;
  font-weight: 500;
  color: #ffffff;
  background: #0071e3;
  border: none;
  border-radius: 980px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}

.button-primary:hover {
  background: #0077ed;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 113, 227, 0.3);
}

.button-primary:active {
  transform: translateY(0);
}
```

### 4. Product Card

```html
<div class="product-card">
  <div class="product-image">
    <img src="product.jpg" alt="Product">
  </div>
  <div class="product-info">
    <h3 class="product-name">MacBook Pro 14"</h3>
    <p class="product-description">The most powerful MacBook Pro ever.</p>
    <p class="product-price">From $1,999</p>
  </div>
</div>
```

```css
.product-card {
  background: #fbfbfd;
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.product-image {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #f5f5f7;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: 24px;
}

.product-name {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1d1d1f;
}

.product-description {
  font-size: 17px;
  color: #6e6e73;
  margin-bottom: 12px;
}

.product-price {
  font-size: 14px;
  color: #86868b;
}
```

### 5. Navigation Bar

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
  color: #1d1d1f;
  text-decoration: none;
}

.navbar-links {
  display: flex;
  gap: 32px;
  list-style: none;
}

.navbar-link {
  font-size: 14px;
  color: #1d1d1f;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.navbar-link:hover {
  opacity: 0.7;
}
```

## Shadows and Depth

### Elevation System

```css
/* Small elevation - subtle lift */
.shadow-sm {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06),
              0 1px 2px rgba(0, 0, 0, 0.08);
}

/* Medium elevation - cards */
.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05),
              0 2px 4px rgba(0, 0, 0, 0.06);
}

/* Large elevation - modals */
.shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.08),
              0 4px 6px rgba(0, 0, 0, 0.05);
}

/* Extra large elevation - floating elements */
.shadow-xl {
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1),
              0 10px 10px rgba(0, 0, 0, 0.04);
}
```

## Animations

### Smooth Transitions

```css
/* Easing functions */
:root {
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
}

/* Fade in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.6s var(--ease-out) forwards;
}

/* Scale on hover */
.scale-hover {
  transition: transform 0.3s var(--ease-in-out);
}

.scale-hover:hover {
  transform: scale(1.02);
}
```

## Responsive Design

### Breakpoints

```css
/* Mobile first approach */
/* xs: 0-639px (default) */
/* sm: 640px+ */
/* md: 768px+ */
/* lg: 1024px+ */
/* xl: 1280px+ */
/* 2xl: 1536px+ */

.container {
  width: 100%;
  padding: 0 16px;
}

@media (min-width: 640px) {
  .container {
    padding: 0 24px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 32px;
  }
}
```

## Best Practices

### DO:
- Use generous whitespace between sections (64px - 128px)
- Implement smooth, subtle animations (0.3s - 0.6s)
- Keep text readable with proper contrast ratios
- Use system fonts for optimal performance
- Add blur effects to frosted glass elements
- Implement dark mode support
- Use semantic HTML for accessibility
- Optimize images (WebP format, lazy loading)
- Test on multiple screen sizes

### DON'T:
- Overcrowd the design with elements
- Use harsh, sudden animations
- Mix too many different styles
- Use small, hard-to-read fonts
- Overuse colors or effects
- Ignore mobile responsiveness
- Skip accessibility considerations
- Use low-quality images

## AI Assistant Instructions

When this skill is activated, you should:

1. **Analyze Requirements**: Understand what type of design is needed (landing page, app UI, product showcase, etc.)

2. **Choose Components**: Select appropriate Apple-style components from the patterns provided

3. **Generate Code**: Create clean, semantic HTML with modern CSS following Apple's design principles

4. **Apply Design System**:
   - Use the specified color palette
   - Apply consistent spacing (multiples of 4px)
   - Use system fonts with proper type scale
   - Add appropriate shadows and depth
   - Implement smooth animations

5. **Ensure Responsiveness**: Make designs mobile-first and test across breakpoints

6. **Add Dark Mode**: Include dark mode support using `@media (prefers-color-scheme: dark)`

7. **Optimize Performance**:
   - Use CSS transforms over position changes
   - Implement backdrop-filter for glassmorphism
   - Add will-change for animated elements
   - Lazy load images

8. **Accessibility**:
   - Use semantic HTML
   - Ensure proper contrast ratios
   - Add ARIA labels where needed
   - Support keyboard navigation

Always:
- Prioritize clean, minimal design over complexity
- Use subtle, elegant effects rather than flashy ones
- Maintain generous whitespace
- Follow the spacing and typography system strictly
- Include both light and dark mode styles
- Write clean, well-commented code
- Provide responsive layouts

Never:
- Create cluttered, busy designs
- Use gaudy colors or effects
- Ignore the established design system
- Skip accessibility features
- Use outdated CSS practices
- Forget mobile responsiveness

## Example: Complete Landing Page

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Apple-Style Landing Page</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background: #ffffff;
      color: #1d1d1f;
    }

    /* Navigation */
    .navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(20px) saturate(180%);
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
      color: #1d1d1f;
      text-decoration: none;
    }

    /* Hero Section */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 64px 24px;
      background: linear-gradient(to bottom, #f5f5f7, #ffffff);
    }

    .hero-title {
      font-size: clamp(48px, 8vw, 80px);
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 16px;
      background: linear-gradient(135deg, #1d1d1f, #6e6e73);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: clamp(21px, 3vw, 28px);
      font-weight: 400;
      color: #6e6e73;
      margin-bottom: 32px;
      line-height: 1.4;
    }

    .hero-cta {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .button-primary {
      padding: 12px 24px;
      font-size: 17px;
      font-weight: 500;
      color: #ffffff;
      background: #0071e3;
      border: none;
      border-radius: 980px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
    }

    .button-primary:hover {
      background: #0077ed;
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 113, 227, 0.3);
    }

    .button-secondary {
      padding: 12px 24px;
      font-size: 17px;
      font-weight: 500;
      color: #0071e3;
      background: transparent;
      border: 2px solid #0071e3;
      border-radius: 980px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
    }

    .button-secondary:hover {
      background: #0071e3;
      color: #ffffff;
      transform: translateY(-2px);
    }

    /* Features Section */
    .features {
      padding: 96px 24px;
      background: #fbfbfd;
    }

    .features-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .features-title {
      font-size: 48px;
      font-weight: 600;
      text-align: center;
      margin-bottom: 64px;
      color: #1d1d1f;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 32px;
    }

    .feature-card {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(0, 0, 0, 0.05);
      border-radius: 20px;
      padding: 40px;
      transition: all 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .feature-icon {
      font-size: 40px;
      margin-bottom: 16px;
    }

    .feature-title {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 12px;
      color: #1d1d1f;
    }

    .feature-description {
      font-size: 17px;
      line-height: 1.5;
      color: #6e6e73;
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      body {
        background: #000000;
        color: #f5f5f7;
      }

      .navbar {
        background: rgba(29, 29, 31, 0.8);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .navbar-logo {
        color: #f5f5f7;
      }

      .hero {
        background: linear-gradient(to bottom, #1d1d1f, #000000);
      }

      .hero-title {
        background: linear-gradient(135deg, #f5f5f7, #a1a1a6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .hero-subtitle {
        color: #a1a1a6;
      }

      .features {
        background: #1d1d1f;
      }

      .features-title {
        color: #f5f5f7;
      }

      .feature-card {
        background: rgba(29, 29, 31, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .feature-title {
        color: #f5f5f7;
      }

      .feature-description {
        color: #a1a1a6;
      }
    }
  </style>
</head>
<body>
  <nav class="navbar">
    <div class="navbar-content">
      <a href="#" class="navbar-logo">Product</a>
    </div>
  </nav>

  <section class="hero">
    <div class="hero-content">
      <h1 class="hero-title">Think Different</h1>
      <p class="hero-subtitle">Experience the future of design.<br>Simple. Beautiful. Powerful.</p>
      <div class="hero-cta">
        <a href="#" class="button-primary">Get Started</a>
        <a href="#" class="button-secondary">Learn More</a>
      </div>
    </div>
  </section>

  <section class="features">
    <div class="features-container">
      <h2 class="features-title">Features</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3 class="feature-title">Lightning Fast</h3>
          <p class="feature-description">Optimized for speed and performance. Experience instant loading and smooth interactions.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3 class="feature-title">Beautiful Design</h3>
          <p class="feature-description">Carefully crafted with attention to every detail. Minimalist and elegant.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔒</div>
          <h3 class="feature-title">Secure & Private</h3>
          <p class="feature-description">Your data is protected with industry-leading security standards.</p>
        </div>
      </div>
    </div>
  </section>
</body>
</html>
```

## Extended Documentation

For comprehensive, detailed documentation on specific areas:

### Design System References
- **[Color System](references/color-system.md)**: Complete color palette with semantic tokens, color scales, gradients, glassmorphism effects, and WCAG-compliant color combinations
- **[Typography System](references/typography.md)**: Font families, type scales, line heights, letter spacing, responsive typography, and text styling utilities
- **[Component Library](references/components.md)**: Full component documentation including buttons, cards, forms, navigation, modals, badges, and progress indicators with all variants and states
- **[Animation & Motion](references/animation.md)**: Comprehensive animation guide with easing functions, durations, keyframe animations, interactive effects, loading states, and performance optimization
- **[Accessibility Guidelines](references/accessibility.md)**: WCAG 2.1 compliance guide covering color contrast, semantic HTML, ARIA labels, keyboard navigation, screen reader support, and inclusive design

### Templates & Examples
- **[Modal Component](templates/modal.html)**: Apple-style modal with animations and dark mode
- **[Input Forms](templates/input-form.html)**: Complete form components with validation states
- **[Product Showcase](examples/product-showcase.html)**: Full landing page example with hero, features, and responsive design

### External Resources
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [SF Pro Font Family](https://developer.apple.com/fonts/)
- [Apple Design Resources](https://developer.apple.com/design/resources/)
- [WebKit CSS Reference](https://webkit.org/blog/)
