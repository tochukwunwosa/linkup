# OG Image Specifications for LinkUp

## Overview
This document provides specifications for creating a new Open Graph (OG) image that emphasizes LinkUp's community-driven approach to tech event discovery.

## Technical Requirements

### Dimensions & Format
- **Optimal Size**: 1200 x 630 pixels (1.91:1 aspect ratio)
- **File Format**: PNG (preferred) or JPG
- **File Size**: Under 1MB (smaller is better for faster loading)
- **File Name**: `linkup-og-community-1200x630.png`
- **Location**: `/public/assets/images/linkup-og-community-1200x630.png`

### Platform Compatibility
These dimensions work perfectly for:
- Facebook (1200x630)
- Twitter/X Large Card (1200x630)
- LinkedIn (1200x627)
- WhatsApp, Slack, Discord previews

## Design Guidelines

### Visual Theme: Community-Driven

The image should convey:
1. **Community & Collaboration**: Multiple people, diverse groups, networking
2. **Tech Focus**: Modern, digital, innovative atmosphere
3. **Nigerian Context**: Recognizable Nigerian elements (optional but recommended)
4. **Excitement & Energy**: Events, gatherings, active participation

### Design Elements to Include

#### 1. Primary Text
```
LinkUp
Community-Driven Tech Event Discovery
```
- Font: Bold, modern sans-serif (e.g., Inter, Poppins, DM Sans)
- Text should be large and readable even at thumbnail size
- High contrast with background

#### 2. Supporting Text (Optional)
```
Discover. Connect. Grow.
```
or
```
Nigeria's Tech Event Ecosystem
```
- Smaller font, secondary color
- Adds context without cluttering

#### 3. Visual Elements
Choose ONE primary visual approach:

**Option A: People-Focused**
- Photo/illustration of diverse tech community members
- People collaborating, networking, or at events
- Faces create emotional connection
- Use inclusive, diverse representation

**Option B: Icon-Based**
- Connected nodes/network visualization
- Community icons (people + technology symbols)
- Abstract representation of ecosystem
- More scalable, timeless design

**Option C: Hybrid**
- Subtle background image of tech event/people
- Strong text overlay with gradient or solid background
- Icons or illustrations as accents

#### 4. Color Palette
Based on current LinkUp branding:
- **Primary Blue**: #0066cc (current theme color)
- **Supporting Colors**:
  - White/Light gray for backgrounds
  - Dark gray/black for text
  - Accent colors: Green (#10b981), Purple (#8b5cf6), or Orange (#f59e0b)
- Use gradients for modern look (e.g., blue to purple)

#### 5. Branding
- Include LinkUp logo (available at: `/public/assets/Logo/linkup-logo.png`)
- Position: Top-left or bottom-left corner
- Size: Visible but not dominating (10-15% of image height)

### Layout Recommendations

#### Layout 1: Text-Focused with Background
```
┌────────────────────────────────────────┐
│  [Logo]                                │
│                                        │
│     Community-Driven                   │
│     Tech Event Discovery               │
│                                        │
│     [Small icons: calendar, location,  │
│      people, etc.]                     │
│                                        │
│     Nigeria's Tech Ecosystem           │
└────────────────────────────────────────┘
```

#### Layout 2: Split Design
```
┌────────────────────────────────────────┐
│  [Left: Image/      │ [Logo]           │
│   Illustration]     │                  │
│                     │ LinkUp           │
│  [People at tech    │                  │
│   event or         │ Community-Driven  │
│   network visual]   │ Tech Events      │
│                     │                  │
│                     │ #TechNigeria     │
└────────────────────────────────────────┘
```

#### Layout 3: Centered with Overlay
```
┌────────────────────────────────────────┐
│    [Background: Blurred tech event    │
│     or gradient]                       │
│                                        │
│          [Logo]                        │
│          LinkUp                        │
│                                        │
│    Community-Driven Tech Events        │
│    Discover • Connect • Grow           │
│                                        │
└────────────────────────────────────────┘
```

## Design Tools & Resources

### Recommended Design Tools
1. **Figma** (free, collaborative, web-based)
   - Templates: Search "OG image template 1200x630"
   - URL: https://figma.com

2. **Canva** (free tier available, easy to use)
   - Pre-made social media templates
   - URL: https://canva.com

3. **Adobe Express** (free tier, professional)
   - Social media image templates
   - URL: https://express.adobe.com

4. **Photoshop/Illustrator** (professional, paid)
   - Full creative control

### Free Stock Photos (if needed)
- **Unsplash**: https://unsplash.com
  - Search: "tech event", "networking", "conference", "diverse team"
- **Pexels**: https://pexels.com
- **Pixabay**: https://pixabay.com

### Free Icons (if needed)
- **Lucide Icons**: https://lucide.dev (matches your UI)
- **Heroicons**: https://heroicons.com
- **Phosphor Icons**: https://phosphoricons.com

## Testing the OG Image

After creating the image:

1. **Save the file** as: `/public/assets/images/linkup-og-community-1200x630.png`

2. **Test with Social Media Debug Tools**:
   - Facebook Debugger: https://developers.facebook.com/tools/debug/
   - Twitter Card Validator: https://cards-dev.twitter.com/validator
   - LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

3. **Verify**:
   - Image loads correctly
   - Text is readable at small sizes
   - No important elements cut off
   - File size is reasonable (< 1MB)

## Implementation

The OG image path is already configured in:
- `lib/metadata.ts` (lines 67, 83)

Once you create and save the image at the specified location, it will automatically be used for:
- Open Graph (Facebook, LinkedIn, WhatsApp)
- Twitter Cards
- Social media link previews

## Best Practices

✅ **DO:**
- Keep text large and bold (readable at thumbnail size)
- Use high contrast between text and background
- Include your logo/branding
- Test on multiple platforms
- Use professional, high-quality images
- Convey emotion and purpose

❌ **DON'T:**
- Use small text (minimum 60px font size for main text)
- Overcrowd the image with too many elements
- Use low-resolution or pixelated images
- Rely solely on color to convey information
- Use copyrighted images without permission

## Quick Start Option

If you need a quick placeholder:

1. Create a solid gradient background (blue #0066cc to purple #8b5cf6)
2. Add centered white text: "LinkUp"
3. Add subtitle: "Community-Driven Tech Event Discovery"
4. Add LinkUp logo
5. Export as PNG 1200x630

This simple design will work while you develop a more sophisticated version.

## Need Help?

If you need design assistance:
- Hire a designer on Fiverr or Upwork
- Use AI image generators (with caution for branding)
- Request help from the LinkUp community

## Example Prompt for AI Tools (DALL-E, Midjourney, etc.)

```
Create a modern OG image (1200x630px) for a tech events platform called "LinkUp".
Theme: Community-driven tech event discovery in Nigeria.
Include: Diverse group of tech professionals networking at an event, modern gradient
background (blue to purple), bold text "LinkUp - Community-Driven Tech Events",
clean professional design, high contrast, readable at small sizes.
Style: Modern, vibrant, professional, inclusive.
```

---

**File Location**: Save final image to:
`C:\Users\KINPLUS\Documents\Tochi\Projects\linkup\public\assets\images\linkup-og-community-1200x630.png`

**Status**: Once saved, the image will be automatically used (already configured in metadata)
