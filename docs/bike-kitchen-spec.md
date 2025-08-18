# Bike Kitchen App Specification

## Reusable UI Components

### **Navigation & Layout**
1. **TopNavigationBar**
   - Left: Hamburger menu icon
   - Center: Page title
   - Right: User/search icon
   - Consistent purple/gray background

2. **SlideOutMenu**
   - Overlay menu with rounded navigation buttons
   - Active state (purple) vs inactive state (white/gray)
   - Close button (X) and hamburger icon

### **Buttons & Interactive Elements**
3. **PrimaryButton**
   - Purple background, white text, rounded corners
   - Used for main actions: "I understand!", "Submit", "Save", "Post Event"

4. **SecondaryButton**
   - White/light background, dark text, rounded corners
   - Used for secondary actions: "Edit", "Cancel", "Delete"

5. **NavigationCard**
   - Large rounded container with avatar icon + title + subtitle
   - Purple (primary) vs white/light (secondary) variants
   - Consistent across Home, Booking, Host App, Admin, Member sections

### **Form Elements**
6. **TextInput**
   - Rounded input fields with "Value" placeholder
   - Used in booking forms, event creation, walk-in recording

7. **ToggleSelector**
   - Binary choice component (Yes/No, Member/Non-member)
   - Purple selected state, white unselected

8. **DateTimePicker**
   - Time slot grid (14:00, 14:30, etc.)
   - Calendar widget with month/year navigation
   - Purple selected state

### **Data Display**
9. **StatusIndicator**
   - Circular icons with different states:
     - Green circle + checkmark (completed)
     - Red circle + X (no-show/error)
     - Purple circle + A (pending/active)
     - Light purple circle (neutral)

10. **InfoCard**
    - Booking/appointment cards with time, details, status
    - Consistent format: Name + time, repair details, status indicator

11. **RoleBadge**
    - Small rounded pills showing user roles
    - "Member", "Participant", "Admin", etc.
    - White background with role text

### **Modal & Dialog System**
12. **BottomSheetDialog**
    - Slide-up modal with rounded top corners
    - Drag handle indicator at top
    - Used for details, editing, help throughout app

13. **WelcomeModal**
    - Full-screen overlay with purple background
    - Rounded corners, white text
    - Dismissible with X button

### **Interactive Lists**
14. **EventCard**
    - Date header + event details
    - Avatar icon + title + subtitle format
    - Edit icon on right side (for admin)

15. **BookingListItem**
    - Customer name + time
    - Repair details
    - Status indicator
    - Clickable for details

### **Calendar Components**
16. **CalendarWidget**
    - Month/year navigation arrows
    - 7-day week grid
    - Purple circles for active dates
    - Filled vs outline states

17. **ScheduleView**
    - Date headers (Mon 03, Wed 12, etc.)
    - Event cards underneath
    - Chronological layout

### **Specialized Components**
18. **ExperienceSlider**
    - 10-dot rating scale
    - Purple filled dots, gray empty dots
    - Used for skill level input

19. **RepairTypeSelector**
    - Multi-select button group
    - Options: Tire/Tube, Chain, Brakes, Gears, Other
    - Purple selected, white unselected

20. **HelpButton**
    - Pink question mark circle icon
    - Consistent placement at bottom of sections
    - Triggers context-specific help

### **Utility Components**
21. **Avatar**
    - Circular icon with letter "A"
    - White on purple (primary) or purple on light (secondary)
    - Consistent sizing across contexts

22. **PillButton**
    - Small rounded buttons for tags/categories
    - Used for dates, roles, options
    - Various states: purple (selected), white (unselected)

23. **ProgressIndicator**
    - Shows booking form progress
    - Section numbering (1. About BK, 2. Details, etc.)

## Design System

**Color Palette:**
- Primary: Purple (#8B5CF6 or similar)
- Success: Green (for completed states)
- Error: Red/Pink (for no-show, cancel)
- Neutral: White, light gray, dark gray

**Typography Hierarchy:**
- Large titles: Bold, dark
- Section headers: Medium weight
- Body text: Regular weight
- Purple accent text for emphasis

**Spacing & Layout:**
- Consistent padding/margins
- Rounded corners throughout
- Card-based design system
- Bottom sheet modal pattern

---

## Global Layout Components

### Navigation Menu (Slide-out Left)
- **Header**: "Menu" title with close (X) and hamburger icons
- **Layout**: Overlay menu sliding from left
- **Menu Items**: Large rounded buttons with navigation:
  - **Home** (purple when active)
  - **Booking** (white/gray when inactive)
  - **Host App** (white/gray when inactive)
  - **Membership** (white/gray when inactive)
  - **Admin** (white/gray when inactive)
  - **Become a member** (white/gray when inactive)
- **Styling**: Purple accent color, rounded button design
- **Behavior**: Clicking outside menu or X closes it

### Top Navigation Bar
- **Left**: Hamburger menu icon (3 lines)
- **Center**: Current page name
- **Right**: User/profile icon (people symbol)
- **Background**: Light purple/gray
- **Consistent across all authenticated pages**

---

### 1. Home Page (`/home`)
**Layout**: Standard page with top nav
**Auth Required**: Yes

#### Page Header
- **Title**: "Home" in top navigation
- **User roles displayed**: Based on user permissions

#### Welcome Dialog (First-time Users)
**Component**: Modal overlay (dismissible)
- **Title**: "Welcome to the new Bike Kitchen app!"
- **Content**:
  - "There may be bugs! Sorry, I'm a team of one :)"
  - "At the bottom of each page you'll find a 'Help' button. You can write anything to me here."
  - "Broken link, incorrect data, something not loading, or you just don't like it? Let me know. I'll try and fix it ASAP. Thanks!"
  - "- sahir"
- **Styling**: Purple background, white text, rounded corners
- **Dismiss**: X button (top right)

#### My Roles Section
- **Title**: "My Roles"
- **Display**: Horizontal row of role badges
- **Role Types**: Member, Participant, Mechanic, Host, Admin
- **Styling**: Rounded gray buttons/pills
- **Behavior**: Read-only display of user's current roles

#### Quick Links Section
- **Title**: "Quick Links"
- **Empty State**: Large rounded rectangle with "+" icon
- **Populated State**: Shows added quick links with:
  - Circular avatar icon (with letter "A")
  - Primary text (e.g., "Booking form")
  - Secondary text (e.g., "Make an appointment")
  - Drag handle indicators (right side)
- **Action**: Clicking "+" triggers Add Quick Links dialog (1.1)

#### Widgets Section
- **Title**: "Widgets"
- **Empty State**: Large rounded rectangle with "+" icon
- **Populated State**: Shows widgets like:
  - "Upcoming Events" (empty widget container)
  - "Next appointment" (empty widget container)
- **Action**: Clicking "+" triggers Add Widgets dialog (1.2)

#### Help Section
- **Component**: Rounded button at bottom
- **Icon**: Pink question mark circle
- **Text**: "Help with the homepage"
- **Action**: Triggers standard help dialog (1.3)

#### Bottom Sheet Dialogs:

**1.1 Add Quick Links Dialog**
- **Title**: "Add Quick Link"
- **Available Options** (each with avatar icon and description):
  - "Booking form" - "Make an appointment"
  - "Host app" - "Manage today's bookings"
  - "Event calendar" - "Members-only!"
  - "My data" - "Involvement history"
- **Styling**: Each option in rounded container with drag indicators
- **Behavior**: Select to add to Quick Links section

**1.2 Add Widgets Dialog**
- **Title**: "Add Widget"
- **Available Widgets**:
  - "Upcoming Events" (large empty container)
  - "Next appointment" (large empty container)
- **Styling**: Widget preview containers
- **Behavior**: Select to add to Widgets section

**1.3 Help Dialog (Standard)**
- **Purpose**: Universal help/feedback system
- **Content**: Form for user feedback and bug reports
- **Contact**: Direct communication with developer (sahir)

---

### 2. Booking (`/booking`)
**Auth Required**: Yes
**Layout**: Standard page with top nav showing user roles

#### Page Header
- **Title**: "Booking" in top navigation
- **User Context**: "Connected roles: Member, Participant" (role badges)

#### Links Section
- **Title**: "Links"
- **Navigation Cards**:
  - **Booking Form** (purple background)
    - Icon: Circular "A" avatar
    - Title: "Booking form"
    - Subtitle: "Make an appointment"
    - Action: → New booking flow (2.1)
  - **Manage Bookings** (white/light background)
    - Icon: Circular "A" avatar (light purple)
    - Title: "Manage bookings"
    - Subtitle: "See upcoming and previous appointments"
    - Action: → Manage bookings subpage (2.2)

#### Help Section
- **Component**: Help button at bottom
- **Icon**: Pink question mark circle
- **Text**: "Help with bookings"
- **Action**: Triggers booking help dialog (2.3)

#### 2.1 Booking Form Subpage (`/booking/new`)
**Layout**: Same as root booking flow but with authenticated context
**Header**: Navigation bar with "Booking Form" title
**User Flow**: 
- Skips authentication check (user already logged in)
- Goes directly to booking form with user context
- Shows "logged in as [Name] - participant/member" subtitle
- Pre-filled email and user preferences

#### 2.2 Manage Bookings Subpage (`/booking/manage`)
**Header**: Navigation bar with "Manage Bookings" title
**User Context**: "Connected roles: Member, Participant"

**Upcoming Section**:
- **Title**: "Upcoming:"
- **Booking Cards**: Purple background cards showing:
  - Circular "A" avatar (white)
  - **Repair Type**: "Tire/Tube"
  - **Date/Time**: "Monday, 25th August - 14:30"
- **Empty State**: (when no upcoming bookings)

**Bottom Sheet Dialogs**:

**2.2.1 Previous Booking Details** (View Only)
- **Title**: "View Details"
- **Content**:
  - **Repair type**: "Tire/Tube (Front), City Bike"
  - **Date**: "17-08-2025 (Monday)"
  - **Mechanic**: "Woy-tek"
- **Actions**: View only, no edit options
- **Styling**: Clean detail view format

**2.2.2 Upcoming Booking Details** (Edit/Cancel)
- **Title**: "Your Appointment"
- **Content**:
  - **Repair type**: "Tire/Tube (Front), City Bike"
  - **Date**: "25-08-2025 (Monday)"
  - **Mechanic**: "Woy-tek"
- **Actions**:
  - **Edit** button (purple, with edit icon)
  - **Cancel** button (white, with X icon)
- **Behavior**: 
  - Edit → Returns to booking form with pre-filled data
  - Cancel → Confirmation dialog → Remove booking

**2.2.3 Help Dialog** 
- Standard help system for booking-related questions

**Page-level**:
- **2.3 Help Dialog** (standard help for booking section)

**Step 2: Complete Booking Form** (`/booking/form`)
- **Header**: Back arrow + "Booking Form" + search icon
- **Title**: "Make an appointment:"
- **Subtitle**: "not logged in - Guest" (or "logged in - [Username]")

**Section 1: About the BK**
- **Explanation**: "At the Bike Kitchen, you repair your own bike:"
- **Rules** (bullet points):
  - "We have the tools, but you need to bring your own parts."
  - "This is a learning space - are you ready to get your hands dirty?"
- **Agreement Button**: "I understand!" (purple background, full width)
- **Legal Text**: "By proceeding, you agree to the UvA Privacy Policy" (linked)

**Section 2: The Details**
- **Experience Level**: "How much experience do you have fixing bikes?" (with info icon)
  - **Scale**: 10-dot slider (purple filled dots for selection, light gray empty)
- **Repair Type**: "Which part of your bike needs repair?" (with info icon)
  - **Options**: Multi-select buttons
    - "Tire/Tube" (purple when selected)
    - "Chain", "Brakes", "Gears", "Other" (white when unselected)

**Section 2b: Follow-up**
- **Dynamic content** based on repair selection:
  - Shows selected repair type in purple pill: "Tire/Tube"
  - **Duration question**: "The duration of this repair can depend on some other information:"
  - **Bike Type**: "Is it a city bike or a road/mountain/touring bike?" (with info icon)
    - Options: "city bike" (purple pill), "road/mountain/touring bike" (white pill)
  - **Component**: "Is the repair for the front or the tire/tube?" (with info icon)
    - Options: "front", "tire/tube" (button selection)
  - **Additional info**: Blue info icon with "about these questions"
  - **Time estimate**: "Your repair will take around 45 minutes."
  - **Disclaimer**: "Keep in mind that this is an estimate - we don't like to rush at the Bike Kitchen!"

**Section 3: The Calendar**
- **Date Selection**: "What day?"
  - **Month/Year selector**: "Aug 2025" with left/right arrows
  - **Calendar grid**: Standard 7-day week layout
    - Today (17th) highlighted in purple circle
    - Available dates clickable, unavailable dates grayed out
- **Time Selection**: "What time?"
  - **Time slots**: Grid of available times
    - "14:00", "14:30", "15:30" (purple when selected)
    - "16:00", "17:00" (white when available)

**Section 4: Confirmation**
- **Summary**: "Your appointment to repair your chain will be at 14:00 on Monday, August 25th"
- **Confirmation button**: "Looks good!" (purple, full width)

**Section 5: Add to Calendar**
- **Calendar integration options**:
  - "Google Calendar" (purple button)
  - "Outlook", "Apple" (white buttons)
- **Email confirmation**: "You will also receive a confirmation email at sahirde@gmail.com"
- **Completion**: "That's all" + "See you soon!"

**Step 2B: Logged-in Booking Form** (`/booking/form?type=user`)
- **Subtitle**: "logged in as [Username] - participant/member" (shows user role)
- Same sections as guest variant
- Email pre-populated for confirmation
- User data persistence between sessions

**Section 2a: Conditional Disclaimer** (appears for "Other" repair selection)
- **Title**: "2a. A Disclaimer"
- **Warning text**: "You selected Other - tell us more about the repair, but be aware that for more tricky problems the first appointment may be a diagnosis only:"
- **Example input**: Text area with placeholder like "There's a clicking noise every time I turn the pedals and I'm not sure where it's coming from!!!"
- **Acknowledgment**: "I understand" button (purple)
- **Conditional display**: Only shows when "Other" is selected in repair type

**Section 4: Confirmation (Updated)**
- **Summary**: "Your appointment to repair your [repair_type] will be at [time] on [date]"
  - Dynamic text based on selections
  - Key details shown in rounded gray boxes: "chain", "14:00", "Monday, August 25th"
- **Email collection**: "What is your email address?"
  - For guests: Empty input field
  - For authenticated users: Pre-filled with account email "sahirde@gmail.com" (purple text, underlined)
- **Final confirmation**: "Looks good!" (purple button)

**Section 5: Add to Calendar (Updated)**
- **Calendar options**: 
  - "Google Calendar" (purple, selected)
  - "Outlook" (white)
  - "Apple" (white)
- **Email confirmation**: "You will also receive a confirmation email at [email]" 
  - Email shown in purple background pill
- **Completion**: "That's all" + "See you soon!"

**Form Validation & UX Notes**:
- Progressive disclosure: sections reveal as previous ones are completed
- Conditional Section 2a only appears for "Other" repair type
- Dynamic content in Section 2b based on repair type selection
- Real-time time estimation based on repair complexity
- Calendar shows only available dates/times
- Form state persistence for authenticated users
- User role displayed in subtitle (participant/member/host/admin)

**Authentication Modals**:

**Login Modal**:
- **Title**: "Bike Kitchen UvA" + tagline
- **Form Fields**:
  - **Email**: Text input with "Value" placeholder
  - **Password**: Password input with "Value" placeholder
- **Actions**:
  - **Primary**: "Sign In" (black button, full width)
  - **Secondary**: "Forgot password?" (text link)
  - **Alternative**: "Or make an account" (button link)

**Registration Modal**:
- **Title**: "Bike Kitchen UvA" + tagline  
- **Form Fields**:
  - **Email**: Text input
  - **Password**: Password input
  - **Repeat Password**: Password input
- **Action**: "Sign Up" (black button, full width)

#### 2.2 Manage Bookings Subpage (`/booking/manage`)
**Bottom Sheet Dialogs**:
- 2.2.1 **Previous Booking Details** (view-only)
- 2.2.2 **Upcoming Booking Details** (view/edit/cancel)
- 2.2.3 **Help Dialog** (standard)

**Page-level**:
- 2.3 **Help Dialog** (standard help for booking section)

---

### 3. Host App (`/host`)
**Purpose**: Tools for hosts/volunteers
**Auth Required**: Yes (host role)
**Layout**: Standard page with top nav showing elevated roles

#### Page Header
- **Title**: "Host App" in top navigation
- **User Context**: "Connected roles: Mechanic, Host, Admin" (role badges)

#### Host App Main Page (`/host`)
**Links Section**:
- **Title**: "Links"
- **Navigation Cards**:
  - **Today's Bookings** (purple background)
    - Icon: Circular "A" avatar (white)
    - Title: "Today's Bookings"
    - Subtitle: "Manage appointments"
    - Action: → Today's bookings subpage (3.1)
  - **Record Walk-in** (white/light background)
    - Icon: Circular "A" avatar (light purple)
    - Title: "Record walk-in"
    - Action: → Record walk-in dialog (3.2.1)

#### 3.1 Today's Bookings Subpage (`/host/bookings`)
**Purpose**: Manage current day's scheduled appointments
**Header**: Navigation bar with "Host App" title

**Today's Bookings Section**:
- **Title**: "Today's Bookings"
- **Booking List**: Time-ordered appointment cards showing:
  - **Customer Name & Time**: "Sahir - 14:00"
  - **Repair Details**: "Tire/Tube (Front), City Bike" 
  - **Status Indicators**:
    - **Completed**: Green circle with checkmark
    - **No-show**: Pink/red circle with X
    - **Pending/Upcoming**: Purple circle with "A"
    - **Current/Active**: Purple background card

**Bottom Sheet Dialog - Booking Details (3.1.1)**:
- **Customer & Time**: "Sahir - 16:00"
- **User Type**: "Community Member"
- **Booking Information**:
  - **Repair type**: "Tire/Tube (Front), City Bike"
  - **Experience level**: "3" (1-10 scale)
  - **Current Status**: Dynamic status indicator
- **Host Actions**: Mark Completed/No-show buttons → Edit button after status change

**3.1.2 Help Dialog**: "Help with today's bookings"

#### 3.2 Walk-in Management

**3.2.1 Record Walk-in Dialog** (Bottom Sheet)
**Title**: "Add Walk-In"
**Form Fields**:
- **Community Member?**: Toggle selector
  - "Yes" (purple selected) / "No" (white unselected)
- **Amount paid**: Text input field with "Value" placeholder
- **Submit**: Purple button

**3.2.2 Today's Walk-ins Subpage** (`/host/walk-ins`)
**Purpose**: View and manage walk-ins recorded today
**Header**: Navigation bar with "Host App" title

**Today's Walk-ins Section**:
- **Title**: "Today's Walk-ins"
- **Walk-in List**: Time-ordered cards showing:
  - **Payment Amount**: "€5,00" or "Community Member"
  - **Timestamp**: "recorded at 14:04"
  - **Avatar**: Circular "A" icon

**Bottom Sheet Dialogs**:

**3.2.2.1 Walk-in Details** (View/Edit)
- **Payment Amount**: "€5,00"
- **Timestamp**: "Recorded at 14:07"
- **Actions**:
  - **Edit** button (purple, with edit icon)
  - **Delete** button (white, with trash icon)

**3.2.2.2 Edit Walk-in Dialog**
- **Title**: "Edit Walk-In"
- **Form Fields**: Same as add dialog but pre-populated
- **Community Member?**: Toggle (shows current state)
- **Amount paid**: Pre-filled value
- **Action**: "Save" button (purple)

**3.2.2.3 Help Dialog**: "Help with recording/editing walk-ins"

#### 3.3 Shift Calendar Subpage (`/host/shifts`)
**Purpose**: Manage host/volunteer shift scheduling
**Header**: Navigation bar with "Host App" title

**Shift Calendar Section**:
- **Title**: "Shift Calendar"
- **Calendar Widget**:
  - **Month/Year Navigation**: "Aug 2025" with arrows
  - **Calendar Grid**: Standard 7-day week layout
  - **Shift Indicators**: Purple circles on scheduled shift dates
    - Filled purple circles: Confirmed shifts (3rd, 10th, 17th, 24th)
    - Empty purple circles: Available/unconfirmed shifts

**Your Upcoming Shifts Section**:
- **Title**: "Your upcoming shifts:"
- **Shift List**: Date cards showing:
  - "Monday, 3rd August"
  - "Monday, 10th August"
  - "Monday, 17th August"
  - "Monday, 24th August"

**Shift Management (Edit Mode)**:
- **Add shifts**: Purple pills for available dates
  - "20 Aug", "27 Aug"
- **Remove shifts**: White pills for current shifts to remove
  - "3 Aug", "10 Aug"
- **Save**: Purple button to confirm changes

**Bottom Sheet Dialog - Shift Details (3.3.1)**:
- **Shift Date**: "Monday, 3rd August"
- **Shift Time**: "14:00 - 18:00"
- **Mechanic**: "Sahir" (purple pill)
- **Hosts**: "David", "Maud" (white pills)

**3.3.2 Help Dialog**: "Help with the shift calendar"

#### 3.4 Inventory Subpage (`/host/inventory`)
**Title**: "Inventory"
**Content**: "This section is still being built."
**Status**: Placeholder page for future development

**Technical Requirements for Host App**:

```javascript
hostData: {
  todaysBookings: [{
    id: string,
    customerName: string,
    time: string,
    repairType: string,
    status: 'pending' | 'completed' | 'no-show',
    experienceLevel: number
  }],
  walkIns: [{
    id: string,
    amount: number | 'Community Member',
    timestamp: string,
    isCommunityMember: boolean
  }],
  shifts: [{
    date: string,
    startTime: string,
    endTime: string,
    mechanic: string,
    hosts: string[]
  }]
}
```

**Key Features**:
- **Real-time Status Management**: Booking status changes reflect immediately
- **Walk-in Tracking**: Quick recording and editing of unscheduled visitors
- **Shift Planning**: Visual calendar with add/remove shift functionality
- **Role-based Access**: Only hosts/mechanics can access these tools

#### 3.2 Walk-ins Management
**Bottom Sheet**: 3.2.1 **Record Walk-in** (triggered by "Record Walk-in" button)
**Subpage**: 3.2.2 **Today's Walk-ins** (`/host/walk-ins`)
- Bottom sheets:
  - 3.2.2.1 **Walk-in Details** (view/edit/delete)
  - 3.2.2.2 **Help Dialog** (standard)

#### 3.3 Shift Calendar Subpage (`/host/shifts`)
**Bottom Sheet Dialogs**:
- 3.3.1 **My Shift Details** (view/edit/cancel upcoming shifts)
- 3.3.2 **Help Dialog** (standard)

#### 3.4 Inventory Subpage (`/host/inventory`)
**Status**: Out of scope - placeholder text only

**Page-level**:
- 3.5 **Help Dialog** (standard help for host section)

---

### 4. Member Info (`/membership`)
**Auth Required**: Yes (member role)
**Layout**: Standard page with top nav showing member status

#### Page Header
- **Title**: "Member Info" in top navigation
- **User Context**: "Connected roles: Member" (role badge)

#### Member Info Main Page (`/membership`)
**Links Section**:
- **Title**: "Links"
- **Navigation Cards**:
  - **Event Calendar** (purple background)
    - Icon: Circular "A" avatar (white)
    - Title: "Event Calendar"
    - Subtitle: "See this month's plan"
    - Action: → Event calendar subpage (4.2)
  - **Manage Membership** (white/light background)
    - Icon: Circular "A" avatar (light purple)
    - Title: "Manage Membership"
    - Action: → Manage membership dialog (4.1)

#### Help Section
- **Component**: Help button at bottom
- **Icon**: Pink question mark circle
- **Text**: "I have a question about my membership"
- **Action**: Triggers membership help dialog (4.3)

#### Bottom Sheet Dialogs:

**4.1 Manage Membership Dialog**
- **Title**: "Hi, [Username]"
- **Membership Status**: "You have been a member since [date]"
  - Example: "You have been a member since 02-12-2024."

**Cancel Membership Section**:
- **Title**: "Cancel monthly contribution"
- **Instructions**: 
  - "If you want to cancel your monthly contribution to the Bike Kitchen, mail universiteitsfonds@uva.nl."
  - "Don't forget to mention 'cancel Bike Kitchen contribution' in the e-mail."
- **Confirmation Button**: "I've cancelled my membership" (purple button)

#### 4.2 Event Calendar Subpage (`/membership/events`)
**Purpose**: View member-exclusive events and activities
**Header**: Navigation bar with "Member Info" title

**Event Calendar Section**:
- **Title**: "Event Calendar"
- **Month Display**: "August" (current month)

**Events List** (chronological by date):
- **Date Headers**: Day abbreviation + date number
  - "Mon 03", "Wed 12", "Sat 20", "Thu 28"
- **Event Cards**: Each showing:
  - **Avatar**: Circular "A" icon (light purple)
  - **Event Title**: "Ride Out", "Workshop", "Upcycling", "Community Borrel"
  - **Event Details**: 
    - "Gooi&Vecht" (location/organizer)
    - "Gears and shifters" (topic)
    - "@ De Sering" (venue)

**Event Types Examples**:
- **Ride Out**: Organized bike rides (Gooi&Vecht)
- **Workshop**: Educational sessions (Gears and shifters)
- **Upcycling**: Sustainability activities (@ De Sering)
- **Community Borrel**: Social gatherings

**Help Section**:
- **4.2.2 Help Dialog**: "I have a question about an event"
- **Icon**: Pink question mark circle

**Bottom Sheet Dialog - Event Details (4.2.1)**:
- **Event Title**: "Ride-Out Gooi & Vecht"
- **Date**: "Monday, 03 August"
- **Event Poster**: Full-size promotional image
  - Title: "Ride-Out Waterland"
  - Subtitle: "w/ bike kitchen uva"
  - Image: Lighthouse/coastal scene
  - Details: "May 24th, 12:00-16:00 @ Central Station"
  - Additional: "meet at the ferry station (ijzijde)"
  - QR Code: For easy sharing/sign-up
- **Action Button**: "Join WhatsApp group" (purple button)

**Event Detail Features**:
- **Visual Design**: Professional event posters with branding
- **Location Information**: Specific meeting points and venues
- **Time Details**: Start and end times clearly displayed
- **Social Integration**: WhatsApp group joining for coordination
- **QR Codes**: For easy event sharing and sign-up

**Page-level**:
- **4.3 Help Dialog** (standard help for membership section)

**Technical Requirements for Member Info**:

```javascript
memberData: {
  user: {
    name: string,
    memberSince: string, // "02-12-2024"
    status: 'active' | 'cancelled'
  },
  events: [{
    id: string,
    title: 'Ride Out',
    subtitle: 'Gooi&Vecht',
    date: '03',
    dayOfWeek: 'Mon',
    month: 'August',
    poster?: string, // URL to event poster
    whatsappGroup?: string, // WhatsApp join link
    location: string,
    time: string
  }]
}
```

**Key Features**:
- **Membership Management**: Self-service cancellation with clear instructions
- **Event Discovery**: Visual calendar of member-exclusive events
- **Event Details**: Rich media event information with posters
- **Social Integration**: WhatsApp group coordination
- **Help System**: Targeted support for membership questions

---

### 5. Admin Panel (`/admin`)
**Auth Required**: Yes (admin role)
**Layout**: Standard page with top nav showing admin status

#### Page Header
- **Title**: "Admin Panel" in top navigation
- **User Context**: "Connected roles: Admin" (role badge)

#### Admin Panel Main Page (`/admin`)
**Links Section**:
- **Title**: "Links"
- **Navigation Cards**:
  - **Manage Timeslots** (purple background)
    - Icon: Circular "A" avatar (white)
    - Title: "Manage Timeslots"
    - Subtitle: "Open shifts for bookings"
    - Action: → Manage timeslots subpage (5.1)
  - **Manage Events** (white/light background)
    - Icon: Circular "A" avatar (light purple)
    - Title: "Manage Events"
    - Action: → Manage events subpage (5.2)
  - **Manage Team** (white/light background)
    - Icon: Circular "A" avatar (light purple)
    - Title: "Manage team"
    - Subtitle: "Change roles/access"
    - Action: → Manage team subpage (5.3)

#### Help Section
- **Component**: Help button at bottom
- **Icon**: Pink question mark circle
- **Text**: "Help with the admin panel"
- **Action**: Triggers admin help dialog

#### 5.1 Manage Timeslots Subpage (`/admin/timeslots`)
**Purpose**: Configure available booking slots and workshop schedule
**Header**: Navigation bar with "Admin Panel" title

**Timeslots Calendar Section**:
- **Title**: "Manage Timeslots"
- **Calendar Widget**:
  - **Month/Year Navigation**: "Aug 2025" with arrows
  - **Calendar Grid**: Standard 7-day week layout
  - **Timeslot Indicators**: Purple circles on available booking dates
    - Filled purple circles: Currently available timeslots
    - Empty purple circles: Previously available, now closed

**Timeslot Management (Edit Mode)**:
- **Open shifts for booking**: Purple pills for dates to add
  - "20 Aug", "27 Aug"
- **Close shifts**: White pills for dates to remove
  - "3 Aug", "10 Aug"
- **Save**: Purple button to confirm changes

**Visual States**:
- **View Mode**: Shows current timeslot availability
- **Edit Mode**: Shows add/remove options with save functionality

#### 5.2 Manage Events Subpage (`/admin/events`)
**Purpose**: Create and manage member events and activities
**Header**: Navigation bar with "Admin Panel" title

**Event Management Section**:
- **Title**: "Manage Events"
- **Primary Action**: "Create new event" (purple button)

**Upcoming Events Section**:
- **Title**: "Upcoming events"
- **Month Display**: "August" (current month)
- **Events List** (chronological by date):
  - **Date Headers**: Day abbreviation + date number
  - **Event Cards**: Each showing:
    - **Avatar**: Circular "A" icon (light purple)
    - **Event Title & Details**: "Ride Out - Gooi&Vecht"
    - **Edit Icon**: Pencil icon (right side)

**Help Section**:
- **5.2.4 Help Dialog**: "Help with event management"

**Bottom Sheet Dialogs**:

**5.2.1 Create Event Dialog**:
- **Title**: "Create event"
- **Form Fields**:
  - **Title**: Text input with "Value" placeholder
  - **Subtitle**: Text input with "Value" placeholder
  - **Date**: Date input with "Value" placeholder
  - **WhatsApp link (optional)**: URL input with "Value" placeholder
- **Media Upload**: "📎 Attach Poster" (purple button)
- **Action**: "Post Event" (purple button)

**5.2.2 Edit Event Dialog**:
- **Title**: "Edit event"
- **Form Fields**: Same as create dialog but pre-populated
- **Actions**:
  - **Save**: "✏ Save" (purple button)
  - **Delete**: "🗑 Delete" (white button)

**5.2.3 Event Details Dialog** (View Mode):
- **Event Title**: "Ride-Out Gooi & Vecht"
- **Date**: "Monday, 03 August"
- **Event Poster**: Full-size promotional image display
- **Action Button**: "Join WhatsApp group" (purple button)
- **Purpose**: Preview of how event appears to members

#### 5.3 Manage Team Subpage (`/admin/team`)
**Purpose**: Manage user roles and permissions
**Header**: Navigation bar with "Admin Panel" title

**Team Management Section**:
- **Title**: "Manage Team"

**Role-based Team Lists**:

**Admins Section**:
- **Title**: "Admins:"
- **Team Members**: Pills showing names
  - "Sahir", "Chain"

**Mechanics Section**:
- **Title**: "Mechanics:"
- **Specialization Pills**: Organized by repair type
  - "Tire/Tube", "Chain", "Brakes", "Gears", "Other"

**Hosts Section**:
- **Title**: "Hosts:"
- **Host Pills**: Multiple entries showing availability
  - "Tire/Tube", "Chain", "Brakes", "Gears", "Other" (multiple rows)

**Help Section**:
- **5.3.2 Help Dialog**: "Help with team management"

**Bottom Sheet Dialog - User Role Management (5.3.1)**:
- **User Info**: "Sahir"
- **Current Role**: "Role: Admin"
- **Role Assignment Section**:
  - **Title**: "Set Role:"
  - **Role Options**: Selectable pills
    - "Admin", "Mechanic", "Host"
- **Action**: "Save" (purple button)

**Technical Requirements for Admin Panel**:

```javascript
adminData: {
  timeslots: {
    availableDates: string[],
    pendingChanges: {
      toAdd: string[],
      toRemove: string[]
    }
  },
  events: [{
    id: string,
    title: string,
    subtitle: string,
    date: string,
    whatsappLink?: string,
    poster?: File | string
  }],
  team: {
    admins: string[],
    mechanics: {
      [repairType]: string[]
    },
    hosts: string[]
  }
}
```

**Key Admin Features**:
- **Timeslot Management**: Visual calendar with add/remove functionality
- **Event Creation**: Full event lifecycle with poster upload
- **Role Management**: Granular permission control by repair specialization
- **Team Organization**: Clear role-based team structure
- **Media Support**: Event poster upload and display capabilities

**Admin Operations**:
```javascript
adminOperations: {
  timeslots: {
    addDates: (dates) => void,
    removeDates: (dates) => void,
    saveChanges: () => void
  },
  events: {
    create: (eventData, poster?) => void,
    edit: (id, eventData) => void,
    delete: (id) => void
  },
  team: {
    setUserRole: (userId, role, specialization?) => void,
    getUsersByRole: (role) => userList
  }
}
```
---

### 6. Become a Member (`/become-member`)
**Auth Required**: No (public access)
**Layout**: Standard page with top nav

#### Page Header
- **Title**: "Become a Member" in top navigation

#### Become a Member Main Page (`/become-member`)
**Primary Action**: External link to membership signup

**Membership Information Section**:
- **Title**: "Great that you want to join!"
- **Pricing**: "For €4/month, you get:"
- **Benefits List**:
  - "unlimited access to the BK space"
  - "join monthly workshops"
  - "join monthly community borrels"
  - "be part of a repair-enthusiast community"
  - "support our goal - we are run on donations"

**How to Join Section**:
- **Title**: "How to join:"
- **Instructions** (numbered steps):
  1. "go to the AUF page below"
  2. "choose 'I donate → monthly' → €4 (or more)"
  3. "fill in your details"
  4. "Done! Return to this page and select 'I became a member already'"

**Action Buttons**:
- **Primary**: "Join the community" (purple button)
  - Icon: Circular "A" avatar (white)
  - URL: "doneren.auf.nl/bike-kitchen"
  - Action: External link to university donation system
- **Secondary**: "I became a member already!" (purple button)
  - Icon: Circular "A" avatar (white)
  - Action: → Membership confirmation flow (6.1)

#### 6.1 Membership Confirmation Flow
**Trigger**: "I became a member already" button
**Sequential Pages**:

**Step 1: Set Name Page** (`/become-member/name`)
- **Title**: "Welcome, member!"
- **Subtitle**: "What's your name?"
- **Form Field**: 
  - **Name Input**: Text field with user's name
  - Pre-filled example: "Sahir" (purple text)
- **Privacy Notice**: 
  - "*I can't pull data from AUF for privacy reasons. Therefore, this runs on the honour system. I trust that you did pay for your membership."
- **Action**: "Onwards!" (purple button)

**Step 2: Membership Details Page** (`/become-member/details`)
- **Title**: "Welcome, [Name]!" (personalized with purple name)
- **Confirmation Message**: "You will have a few new options in the BK-app now."

**New Features Available**:
1. **Member Info Access**: "Check out the Member Info tab"
2. **Enhanced Booking**: "New pages for managing your bookings and seeing previous bookings"
3. **Community Involvement**: "Become more involved in the Bike Kitchen by volunteering or reach out directly to me (Sahir) for vacancies"

**Navigation Guidance**:
- **Instructions**: "You can find all of these links/pages in the app from now on by using the menu, or the search icon in the top left corner."

**Technical Requirements for Become a Member**:

```javascript
membershipFlow: {
  externalSignup: {
    url: 'doneren.auf.nl/bike-kitchen',
    target: '_blank' // Opens in new tab/window
  },
  confirmationFlow: {
    collectName: (name) => void,
    activateMemberFeatures: () => void,
    updateUserRole: (userId, 'member') => void
  }
}
```

**Key Features**:
- **External Integration**: Links to university donation system
- **Honor System**: Self-service membership confirmation due to privacy constraints
- **Feature Activation**: Unlocks member-only app sections
- **Onboarding**: Guides new members to available features
- **Trust-based Model**: Relies on user honesty for membership verification

**User Journey**:
1. **Discovery**: User learns about membership benefits
2. **External Signup**: Redirected to university donation system
3. **Return & Confirm**: User returns and confirms membership
4. **Name Collection**: App collects user's name for personalization
5. **Feature Unlock**: Member sections become available
6. **Onboarding**: Guided tour of new capabilities

**Business Model Integration**:
- **University Partnership**: Uses existing AUF donation infrastructure
- **Privacy Compliance**: No direct financial data collection
- **Community Trust**: Honor system maintains privacy while enabling features
- **Conversion Optimization**: Clear benefits and simple signup process

---

## Technical Notes

### Authentication States
- **Guest**: Can book appointments, limited access
- **Member**: Full booking access, member features
- **Host**: Member + host tools
- **Admin**: Full system access

### Common Patterns
- **Standard Help Dialog**: Reusable help component across all sections
- **Bottom Sheet Dialogs**: Primary interaction pattern for details/forms
- **Sequential Flows**: Booking and membership signup use step-by-step progression

### Route Structure
```
/
/home
/booking
  /new
  /manage
/host
  /bookings
  /walk-ins
  /shifts
  /inventory
/membership
  /events
/admin
  /timeslots
  /events
  /team
/become-member
  /name
  /details
```