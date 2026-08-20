# FarmHawk - Design System & Color Palette

## Color Palette

### Primary Colors

- **Dark Green (Primary)**: `#1b5e20` - Main brand color for buttons, headers, and primary actions
- **Light Green (Primary Light)**: `#2d7f3e` - Hover states and secondary highlights
- **Dark Green (Primary Dark)**: `#0d3b1a` - Active states and darker backgrounds

### Secondary Colors

- **White**: `#ffffff` - Primary background and card backgrounds
- **Light Gray**: `#f5f5f5` - Secondary backgrounds and input fields
- **Border Gray**: `#e0e0e0` - Borders and dividers

### Semantic Colors

- **Success**: `#4caf50` - Positive actions, completed scans
- **Danger**: `#d32f2f` - Destructive actions, critical alerts
- **Warning**: `#f57c00` - Warnings, pending scans
- **Info**: `#1976d2` - Information, additional details

### Text Colors

- **Dark Text**: `#1a1a1a` - Primary text
- **Light Text**: `#666` - Secondary text

## Design Principles

### Simplicity & Elegance

- Clean, minimal design with purposeful use of whitespace
- Professional appearance suitable for agricultural industry
- Dark green creates trust and reliability

### Typography

- System font stack for optimal performance
- Professional sans-serif families
- Clear hierarchy with weighted font sizes

### Shadows & Depth

- Subtle shadows for depth and hierarchy
- Layered elevation system:
  - Shadow: `0 2px 8px rgba(27, 94, 32, 0.08)`
  - Shadow MD: `0 4px 12px rgba(27, 94, 32, 0.12)`
  - Shadow LG: `0 8px 24px rgba(27, 94, 32, 0.15)`

### Border Radius

- Card corners: `12px` - Modern, friendly
- Button corners: `8px` - Professional appearance
- Input corners: `6px` - Refined, clean

### Animations

- Smooth transitions: `0.3s ease`
- Meaningful animations for user feedback
- Animations use cubic-bezier curves for natural motion

## Component Styles

### Buttons

- **Primary Button**: Dark green gradient background, white text
- **Secondary Button**: Light gray background, dark text
- **Hover State**: Darker gradient, slight elevation
- **Active State**: Darker gradient, shadow emphasis

### Cards

- White background with subtle shadow
- Border-top accent color (#1b5e20)
- Smooth hover animation with increased shadow
- Rounded corners (12px) for modern appearance

### Forms

- Light gray input background
- Subtle border (1px #e0e0e0)
- Dark green focus state with soft shadow
- Clear input labels above fields

### Status Indicators

- **Active**: Green background with green border
- **Inactive**: Gray background with gray border
- **Pending**: Orange background with orange border
- **Completed**: Green background with checkmark

### Navigation Bar

- Linear gradient: Dark green to light green
- White text and icons
- Dark green bottom border for depth
- Responsive mobile menu

## Responsive Design

### Breakpoints

- **Desktop**: 1400px max-width containers
- **Tablet**: 768px and below - adjusted spacing and font sizes
- **Mobile**: Full width with 15px horizontal padding

### Grid System

- Auto-fit columns with minimum 250px width
- Gap spacing: 20px (desktop), 15px (tablets/mobile)
- Single column layout on mobile devices

## Typography Scale

- **Display**: 2rem - Page headings
- **Heading 1**: 1.5rem - Section headers
- **Heading 2**: 1.3rem - Subsection headers
- **Heading 3**: 1.1rem - Card titles
- **Body**: 0.95rem - Standard text
- **Small**: 0.85rem - Labels and metadata
- **Tiny**: 0.8rem - Badges and tags

## White Space

- Container padding: 20px (desktop), 15px (mobile)
- Section gaps: 30-40px
- Component spacing: 16-20px
- Element gaps: 8-12px

## Accessibility Features

- High contrast text (7.5:1 WCAG AAA compliance)
- Clear focus states on interactive elements
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Sufficient touch target sizes (minimum 44px)

## Brand Guidelines

### Logo & Icons

- Drone icon with animation for visual interest
- Lucide React icons for consistency
- Icon colors match context (primary green for main actions)

### Imagery

- Clean, professional appearance
- Agricultural/nature themes
- High-quality and optimized assets

### Tone

- Professional yet approachable
- Hindi as primary language
- English as secondary language
- Clear and informative messaging

## Implementation Notes

### CSS Variables

All colors and common values use CSS variables for easy maintenance:

```css
:root {
  --primary-color: #1b5e20;
  --primary-light: #2d7f3e;
  --primary-dark: #0d3b1a;
  --shadow-lg: 0 8px 24px rgba(27, 94, 32, 0.15);
}
```

### Gradient Backgrounds

Professional gradients for visual hierarchy:

- Navigation: `linear-gradient(90deg, #1b5e20 0%, #2d7f3e 100%)`
- Buttons: `linear-gradient(135deg, #1b5e20 0%, #2d7f3e 100%)`
- Login: `linear-gradient(135deg, #1b5e20 0%, #2d7f3e 50%, #0d3b1a 100%)`

---

**Design by**: FarmHawk Team
**Last Updated**: August 2026
**Version**: 1.0
