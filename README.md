# Tech Linkup

Tech Linkup is a platform and community for tech enthusiasts, organizers, and professionals to discover, host, and attend tech events locally. Whether it's meetups, hackathons, workshops, or conferences, Tech Linkup helps bridge the gap between communities and opportunities in tech.

---

## 📖 Table of Contents

- [Vision & Mission](#vision--mission)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## 🎯 Vision & Mission

### Vision

To create a thriving and connected tech ecosystem, where individuals and organizations can easily discover, share, and engage in technology events in their region.

### Mission

- Empower organizers to promote tech events with ease.
- Enable attendees to find relevant events near them (or online).
- Foster collaboration, learning, and networking across tech communities.

---

## 🛠 Features

- **Event Discovery**: Browse tech events by location, category, date, and tags.
- **State/Location Filter**: Select state (e.g. in Nigeria) and view events in that location.
- **Search & Pagination**: Search by keywords, filter, and paginate results.
- **Event Cards**: Display event information including title, category, date & time, location, price, link, and calendar integration.
- **Event Submission**: Public event submission with admin approval workflow and tracking IDs.
- **Email Notifications**: Automated email notifications powered by Resend + React Email:
  - Admins notified when new events are submitted
  - Organizers notified when events are approved/rejected
  - Beautiful, responsive HTML email templates
- **Charts & Analytics**: Visualize trends (e.g. events by category) using charts.
- **Share & RSVP**: Share events via social/sharing APIs and add to calendar.
- **User Context / Filters**: Persist filters, preferences, and UI state.
- **Responsive & Accessible UI**: Works well on desktop and mobile; supports keyboard navigation, ARIA, etc.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Database (Supabase)

### Setup

Clone the repo:

```bash
git clone https://github.com/tochukwunwosa/tech-linkup.git
cd tech-linkup
```

Install dependencies:

```bash
npm install
# or
yarn install
```

Configure environment variables (e.g. `.env.local`):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_url_here
SUPABASE_SERVICE_ROLE_KEY=your_role_key_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Analytics
NEXT_PUBLIC_UMAMI_WEBSITE_ID=umami_website_ID  # visit https://umami.is/

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://tech-linkup.vercel.app

# Google Maps API (Geocoding only)
# Get your API key from https://console.cloud.google.com
# Required API: Geocoding API (enable in Google Cloud Console)
GOOGLE_MAPS_API_KEY=your_key_here

# Email Notifications (Resend)
RESEND_API_KEY=your_resend_api_key  # Get from https://resend.com
REPLY_TO_EMAIL=your-email@example.com  # Optional
```

See `claude-notes/RESEND_SETUP.md` for complete email setup instructions.

Run development server:

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the UI.

---

## 🦯 Usage

### Home / Hero

- The hero section shows a background image with overlay.
- There’s a state / location combobox that allows selecting a state. Once selected, it scrolls or navigates to the events section.

### Filters & Search

- Use categories, formats (online / in-person), and dates to filter.
- Multi-tag input for categories.
- Filters persist in context so as you navigate, your preferences remain.

### Event Listing & Cards

- Events display in cards.
- Cards show title, categories, date/time (with local conversion), location, price, and description snippet.
- Buttons to **Add to Calendar**, **Read More**, and optional **Share**.

### Charts & Analytics

- Category chart that shows the number of events per category (aggregated).
- Labels for each bar appear **above** the bar, remaining visible regardless of bar height.

---

## 🧹 Contributing

We welcome your contributions! Here’s how to get started:

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Make changes & commit with clear messages.
4. Push to your fork.
5. Open a Pull Request with a description and screenshots (if applicable).

Please follow the existing code style and patterns.

---

## 📦 Roadmap

- [ ] Event submission flow (for organizers)
- [ ] User authentication / profiles
- [ ] Social sharing & embeds
- [ ] Advanced filtering (by tags, speakers, sponsors)
- [ ] Notifications & email reminders
- [ ] Analytics dashboard (views, clicks, attendance)
- [ ] Multilingual / localization support
- [ ] Mobile app or PWA

---

## 📄 License

Distributed under the **MIT License**. See the `LICENSE` file for details.

---

## 🙏 Acknowledgments

- Thanks to the open source community, Recharts, shadcn/ui, lucide-react, and others.
- Inspiration from event listing platforms and community tech hubs.
