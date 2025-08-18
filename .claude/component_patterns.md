# UI Component Patterns

## From Bike Kitchen Specification

### Reusable Components Priority List

1. **NavigationCard** - Large rounded cards with icon + title + subtitle
2. **BottomSheetDialog** - Slide-up modals with drag handle
3. **StatusIndicator** - Colored circles (green=completed, red=no-show, purple=pending)
4. **PrimaryButton** - Purple background, white text, rounded
5. **SecondaryButton** - White background, dark text, rounded
6. **TopNavigationBar** - Hamburger + title + user icon
7. **RoleBadge** - Small pills showing user roles
8. **CalendarWidget** - Month navigation + date grid + purple indicators
9. **InfoCard** - Booking cards with name + time + details + status
10. **ExperienceSlider** - 10-dot rating scale
11. **RepairTypeSelector** - Multi-select buttons for repair types
12. **HelpButton** - Pink question mark circle

### Mobile-First Patterns
- Bottom sheets instead of centered modals
- Full-width buttons on mobile
- Swipe gestures for navigation
- Large touch targets (min 44px)
- Sticky headers with proper safe areas

### Mantine Integration
- Use Mantine's Grid system for responsive layouts
- Leverage Mantine's Modal component for bottom sheets
- Use Mantine's Button variants consistently
- Implement Mantine's notification system