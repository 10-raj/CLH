export interface AIResponse {
  text: string;
  navigationLinks?: { label: string; path: string }[];
}

export const CONTACT_INFO = {
  email: 'acharyaraj2005@gmail.com',
  phone: '98767262762',
};

const SITE_KNOWLEDGE = {
  about: `CleanHike Nepal is an eco-tourism and environmental conservation initiative based in Kathmandu, Nepal. We organize community clean hikes, trail cleanups, and conservation campaigns throughout Nepal's mountain regions. Our mission is to preserve Nepal's natural beauty while promoting sustainable adventure tourism.`,
  mission: `Our mission is threefold: 1) Organize regular community clean hikes and trail cleanups, 2) Promote eco-conscious trekking practices across Nepal, and 3) Support local communities through responsible tourism. We believe every step on a trail is an opportunity to leave nature better than we found it.`,
  team: `CleanHike Nepal is run by passionate volunteers including professional guides, environmental advocates, and community organizers from across Nepal. Our core team manages hike logistics, donor relations, and environmental campaigns.`,
  hikes: `We offer a range of treks in Nepal including Annapurna Base Camp, Everest View, Langtang Valley, Mardi Himal, Manaslu Circuit, Ghorepani Poon Hill, Upper Mustang, and Gokyo Lakes. Difficulty ranges from Easy to Challenging. All hikes include a cleanup component.`,
  completedHikes: `Completed hikes include: Annapurna Base Camp (115km, 10 days), Everest View Trek (65km, 8 days), Langtang Valley (77km, 7 days), Mardi Himal (55km, 6 days), Manaslu Circuit (177km, 14 days), Ghorepani Poon Hill (45km, 4 days), Upper Mustang (145km, 12 days), Gokyo Lakes (85km, 10 days).`,
  donate: `You can support CleanHike Nepal by donating through eSewa, Khalti, Mobile Banking, or Bank Transfer. Every rupee goes directly to trail cleanup, equipment, and local community programs. There is no minimum donation amount.`,
  gallery: `Our gallery showcases photos from our hikes, cleanups, and community events. Browse images across categories: Hikes, Nature, Community, and Events.`,
  contact: `You can reach CleanHike Nepal at acharyaraj2005@gmail.com or call/WhatsApp +977 98767262762. Our office is in Dakshinkali, Kathmandu. Working hours: Mon–Sat, 9AM–6PM.`,
  sponsors: `CleanHike Nepal is supported by sponsors and partners at Platinum, Gold, Silver, and Bronze tiers. Sponsors gain visibility, team building opportunities, and CSR impact. Contact us to become a sponsor.`,
  volunteer: `Volunteers are the backbone of CleanHike Nepal. You can join as a trail guide, cleanup crew, photographer, event organizer, or community outreach volunteer. No prior experience required — just enthusiasm!`,
  faq: `Common questions:
Q: Is any trekking experience required? A: No, we welcome all fitness levels. We have treks from Easy to Challenging.
Q: What should I bring? A: Water, snacks, proper footwear, sunscreen, and a garbage bag for cleanup.
Q: Are guides provided? A: Yes, all our organized hikes include experienced local guides.
Q: How do I join a hike? A: Fill out the contact form on our website or email us directly.
Q: Are donations tax-deductible? A: Contact us for current certification status.`,
  statistics: `CleanHike Nepal statistics: 500+ donors, Rs. 2,50,000+ raised, 15+ conservation projects, 12+ completed hikes, 200+ volunteers, 500+ kg waste collected, 8+ regions covered, 10+ partner organizations.`,
  upcomingHike: `Our next community clean hike is scheduled for Saturday, 15 August 2026 at Champadevi Trail, Dakshinkali. Meeting time: 7:00 AM at Champadevi Trailhead. Difficulty: Easy. All are welcome — no registration fee required.`,
};

type RouteKey = 'home' | 'hikes' | 'about' | 'gallery' | 'donate' | 'sponsors' | 'contact';

const ROUTES: Record<RouteKey, { path: string; label: string }> = {
  home: { path: '/', label: 'Home' },
  hikes: { path: '/hikes', label: 'View All Hikes' },
  about: { path: '/about', label: 'About Us' },
  gallery: { path: '/gallery', label: 'Photo Gallery' },
  donate: { path: '/donate', label: 'Donate Now' },
  sponsors: { path: '/sponsors', label: 'Our Sponsors' },
  contact: { path: '/contact', label: 'Contact Us' },
};

function fallback(): AIResponse {
  return {
    text: `I couldn't find that information in the current website. Please contact our team for further assistance.`,
    navigationLinks: [
      { label: 'Contact Us', path: '/contact' },
    ],
  };
}

function contactBlock(): string {
  return `\n\nFor further help:\n• Email: ${CONTACT_INFO.email}\n• Phone: ${CONTACT_INFO.phone}`;
}

export function processUserQueryAdvanced(query: string): AIResponse {
  const q = query.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|namaste|good\s*(morning|evening|afternoon))/.test(q)) {
    return {
      text: `Namaste! Welcome to CleanHike Nepal. I'm here to help you learn about our hikes, donation options, events, sponsors, and more. What would you like to know?`,
      navigationLinks: [
        ROUTES.hikes,
        ROUTES.donate,
        ROUTES.contact,
      ],
    };
  }

  // Gallery navigation
  if (q.includes('gallery') || q.includes('photo') || q.includes('picture') || q.includes('image')) {
    return {
      text: `Our gallery showcases stunning photos from our hikes, nature trails, community events, and cleanup operations across Nepal. Browse through all categories below.`,
      navigationLinks: [ROUTES.gallery],
    };
  }

  // Donation / donate
  if (q.includes('donat') || q.includes('fund') || q.includes('support us') || q.includes('contribute') || q.includes('give') || q.includes('money')) {
    return {
      text: `Thank you for wanting to support CleanHike Nepal! ${SITE_KNOWLEDGE.donate}\n\nClick below to make a donation:`,
      navigationLinks: [ROUTES.donate],
    };
  }

  // Contact
  if (q.includes('contact') || q.includes('reach') || q.includes('email') || q.includes('phone') || q.includes('call') || q.includes('get in touch') || q.includes('message')) {
    return {
      text: `${SITE_KNOWLEDGE.contact}\n\nYou can also fill out our online contact form for any inquiry:`,
      navigationLinks: [ROUTES.contact],
    };
  }

  // Upcoming / next hike
  if ((q.includes('upcoming') || q.includes('next') || q.includes('schedule') || q.includes('when')) && (q.includes('hike') || q.includes('trek') || q.includes('clean') || q.includes('event'))) {
    return {
      text: `${SITE_KNOWLEDGE.upcomingHike}\n\nJoin us and register through the contact form:`,
      navigationLinks: [
        { path: '/contact', label: 'Join the Hike' },
        ROUTES.hikes,
      ],
    };
  }

  // Sponsors
  if (q.includes('sponsor') || q.includes('partner') || q.includes('corporate') || q.includes('partnership')) {
    return {
      text: `${SITE_KNOWLEDGE.sponsors}\n\nLearn more and see our current sponsors:`,
      navigationLinks: [ROUTES.sponsors, ROUTES.contact],
    };
  }

  // Hikes / treks list
  if ((q.includes('hike') || q.includes('trek') || q.includes('trail') || q.includes('route') || q.includes('mountain')) && !q.includes('next') && !q.includes('upcoming')) {
    return {
      text: `${SITE_KNOWLEDGE.hikes}\n\nExplore all our treks:`,
      navigationLinks: [ROUTES.hikes],
    };
  }

  // Completed hikes
  if (q.includes('complet') || q.includes('past') || q.includes('previous') || q.includes('done') || q.includes('finished')) {
    return {
      text: `${SITE_KNOWLEDGE.completedHikes}\n\nView details on our hikes page:`,
      navigationLinks: [ROUTES.hikes],
    };
  }

  // About / mission
  if (q.includes('about') || q.includes('who are') || q.includes('what is') || q.includes('cleanhike') || q.includes('organization') || q.includes('ngo')) {
    return {
      text: `${SITE_KNOWLEDGE.about}`,
      navigationLinks: [ROUTES.about],
    };
  }

  if (q.includes('mission') || q.includes('goal') || q.includes('purpose') || q.includes('why')) {
    return {
      text: `${SITE_KNOWLEDGE.mission}`,
      navigationLinks: [ROUTES.about],
    };
  }

  // Team
  if (q.includes('team') || q.includes('staff') || q.includes('who runs') || q.includes('founder') || q.includes('organizer')) {
    return {
      text: `${SITE_KNOWLEDGE.team}\n\nLearn more about us:`,
      navigationLinks: [ROUTES.about],
    };
  }

  // Volunteer
  if (q.includes('volunteer') || q.includes('join') || q.includes('participate') || q.includes('help out') || q.includes('involved')) {
    return {
      text: `${SITE_KNOWLEDGE.volunteer}\n\nGet involved today:`,
      navigationLinks: [{ path: '/contact', label: 'Volunteer Sign Up' }],
    };
  }

  // Statistics / impact
  if (q.includes('statistic') || q.includes('impact') || q.includes('number') || q.includes('how many') || q.includes('achievement') || q.includes('result')) {
    return {
      text: `Here is CleanHike Nepal's current impact:\n\n${SITE_KNOWLEDGE.statistics}`,
      navigationLinks: [ROUTES.about],
    };
  }

  // FAQ
  if (q.includes('faq') || q.includes('question') || q.includes('how to') || q.includes('help') || q.includes('guide') || q.includes('what should')) {
    return {
      text: `${SITE_KNOWLEDGE.faq}`,
      navigationLinks: [ROUTES.contact, ROUTES.hikes],
    };
  }

  // Events
  if (q.includes('event') || q.includes('activity') || q.includes('program') || q.includes('cleanup')) {
    return {
      text: `CleanHike Nepal regularly organizes community clean hikes, trail cleanup drives, environmental awareness campaigns, and photography expeditions. Our next event:\n\n${SITE_KNOWLEDGE.upcomingHike}`,
      navigationLinks: [ROUTES.contact, ROUTES.hikes],
    };
  }

  // Home
  if (q === 'home' || q === 'homepage' || q.includes('go home') || q.includes('main page')) {
    return {
      text: `Navigate to the CleanHike Nepal homepage:`,
      navigationLinks: [ROUTES.home],
    };
  }

  // Nepal travel / info
  if (q.includes('nepal') || q.includes('kathmandu') || q.includes('himalaya') || q.includes('everest') || q.includes('annapurna')) {
    return {
      text: `Nepal is home to some of the world's most spectacular mountain trails. CleanHike Nepal organizes eco-friendly treks in regions including Annapurna, Everest, Langtang, Mustang, and more — all with a cleanup component to protect these treasures.\n\nExplore our treks:`,
      navigationLinks: [ROUTES.hikes],
    };
  }

  // Social media
  if (q.includes('instagram') || q.includes('facebook') || q.includes('social') || q.includes('follow')) {
    return {
      text: `Follow CleanHike Nepal on social media:\n\n• Instagram: @cleanhike.np\n• Facebook: /cleanhikenepal\n• YouTube: /cleanhikenepal\n\nFor direct contact:`,
      navigationLinks: [ROUTES.contact],
    };
  }

  // Default fallback
  return {
    ...fallback(),
    text: `I couldn't find specific information about that on our website. Please contact our team for further assistance.${contactBlock()}`,
  };
}
