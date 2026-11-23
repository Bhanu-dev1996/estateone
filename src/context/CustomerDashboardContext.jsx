import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { SAMPLE_PROPERTIES } from '../data/properties';

const CustomerDashboardContext = createContext(null);

// Initial Seed Data for Demo Customer Ananya Rao (usr-buyer-01)
const INITIAL_ENQUIRIES = [
  {
    id: 'enq-101',
    propertyId: 'prop-1',
    propertyTitle: 'The Grand Horizon Penthouse',
    propertyLocation: 'Worli, Mumbai',
    propertyPrice: '₹14.50 Cr',
    propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    reference: 'ENQ-89241',
    agentName: 'Vikramaditya Singhania',
    agency: 'EstateOne Premier Advisory',
    agentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    agentPhone: '+91 98201 44820',
    submittedDate: '16 Nov 2026, 10:30 AM',
    lastUpdated: '17 Nov 2026, 04:15 PM',
    status: 'Agent replied',
    statusHistory: [
      { status: 'Submitted', time: '16 Nov 2026, 10:30 AM', note: 'Enquiry received by EstateOne concierge' },
      { status: 'Received', time: '16 Nov 2026, 11:00 AM', note: 'Assigned to verified partner advisor' },
      { status: 'In progress', time: '16 Nov 2026, 02:45 PM', note: 'Advisor reviewing listing availability' },
      { status: 'Agent replied', time: '17 Nov 2026, 04:15 PM', note: 'Private tour schedule proposed by advisor' }
    ],
    originalMessage: 'I am interested in scheduling a private weekend walkthrough for this 4 BHK penthouse. Please confirm available afternoon slots.',
    contactUsed: {
      name: 'Ananya Rao',
      email: 'buyer@estateone.in',
      phone: '+91 98201 11223',
      method: 'Email and WhatsApp'
    },
    conversationId: 'conv-1',
    relatedVisitId: 'vis-201'
  },
  {
    id: 'enq-102',
    propertyId: 'prop-2',
    propertyTitle: 'Greenwood Manor Luxury Villa',
    propertyLocation: 'Whitefield, Bengaluru',
    propertyPrice: '₹4.85 Cr',
    propertyImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
    reference: 'ENQ-87114',
    agentName: 'Pooja Singhania',
    agency: 'Prime Bengaluru Residences',
    agentAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    agentPhone: '+91 98450 12890',
    submittedDate: '14 Nov 2026, 02:15 PM',
    lastUpdated: '15 Nov 2026, 11:00 AM',
    status: 'Visit requested',
    statusHistory: [
      { status: 'Submitted', time: '14 Nov 2026, 02:15 PM', note: 'Enquiry submitted online' },
      { status: 'Received', time: '14 Nov 2026, 03:00 PM', note: 'Forwarded to resident partner' },
      { status: 'In progress', time: '15 Nov 2026, 09:30 AM', note: 'Site inspection request initiated' },
      { status: 'Visit requested', time: '15 Nov 2026, 11:00 AM', note: 'Site visit request registered with security clearance' }
    ],
    originalMessage: 'Please share legal verification documents and floor layouts for plot area details.',
    contactUsed: {
      name: 'Ananya Rao',
      email: 'buyer@estateone.in',
      phone: '+91 98201 11223',
      method: 'Phone call'
    },
    conversationId: 'conv-2',
    relatedVisitId: 'vis-202'
  },
  {
    id: 'enq-103',
    propertyId: 'prop-8',
    propertyTitle: 'The Camellias Sky Villa',
    propertyLocation: 'Golf Course Road, Gurugram',
    propertyPrice: '₹28.50 Cr',
    propertyImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    reference: 'ENQ-76503',
    agentName: 'Arjun Mehta',
    agency: 'Capital Realty Partners',
    agentAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    agentPhone: '+91 98110 98214',
    submittedDate: '10 Nov 2026, 05:40 PM',
    lastUpdated: '12 Nov 2026, 01:20 PM',
    status: 'In progress',
    statusHistory: [
      { status: 'Submitted', time: '10 Nov 2026, 05:40 PM', note: 'Enquiry submitted online' },
      { status: 'Received', time: '11 Nov 2026, 10:00 AM', note: 'Under preliminary title review' },
      { status: 'In progress', time: '12 Nov 2026, 01:20 PM', note: 'Developer liaison checking private club house membership' }
    ],
    originalMessage: 'Is this unit overlooking the golf fairway? Does it include 4 dedicated basement car parks?',
    contactUsed: {
      name: 'Ananya Rao',
      email: 'buyer@estateone.in',
      phone: '+91 98201 11223',
      method: 'Email and WhatsApp'
    },
    conversationId: null,
    relatedVisitId: null
  },
  {
    id: 'enq-104',
    propertyId: 'prop-4',
    propertyTitle: 'One Horizon Commercial Suite',
    propertyLocation: 'Golf Course Road, Gurugram',
    propertyPrice: '₹2.80 L / month',
    propertyImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    reference: 'ENQ-65201',
    agentName: 'Vikramaditya Singhania',
    agency: 'EstateOne Commercial Desk',
    agentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    agentPhone: '+91 98201 44820',
    submittedDate: '01 Nov 2026, 11:00 AM',
    lastUpdated: '06 Nov 2026, 06:00 PM',
    status: 'Closed',
    statusHistory: [
      { status: 'Submitted', time: '01 Nov 2026, 11:00 AM', note: 'Enquiry registered' },
      { status: 'Received', time: '01 Nov 2026, 01:00 PM', note: 'Assigned to commercial specialist' },
      { status: 'Agent replied', time: '02 Nov 2026, 11:30 AM', note: 'Brochure and lease terms shared' },
      { status: 'Closed', time: '06 Nov 2026, 06:00 PM', note: 'Customer shortlisted residential instead' }
    ],
    originalMessage: 'Requesting floor layout for Grade A office fitout with 60 workstations.',
    contactUsed: {
      name: 'Ananya Rao',
      email: 'buyer@estateone.in',
      phone: '+91 98201 11223',
      method: 'Email'
    },
    conversationId: null,
    relatedVisitId: null
  }
];

const INITIAL_SITE_VISITS = [
  {
    id: 'vis-201',
    propertyId: 'prop-1',
    propertyTitle: 'The Grand Horizon Penthouse',
    propertyLocation: 'Worli, Mumbai',
    propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    bookingRef: 'SV-88412',
    visitDate: '20 Nov 2026',
    timeSlot: '11:30 AM',
    visitType: 'In person',
    agentName: 'Vikramaditya Singhania',
    agentPhone: '+91 98201 44820',
    agentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    status: 'Upcoming',
    customerNote: 'Visiting with architect for terrace verification.',
    meetingInstructions: 'Security clearance confirmed. Valet parking at tower lobby reception. Please carry personal photo identity.',
    virtualLink: null,
    timeline: [
      { status: 'Requested', time: '16 Nov 2026, 10:35 AM', note: 'Selected slot Thursday morning' },
      { status: 'Confirmed', time: '17 Nov 2026, 04:30 PM', note: 'Confirmed by advisor with tower pass' }
    ]
  },
  {
    id: 'vis-202',
    propertyId: 'prop-2',
    propertyTitle: 'Greenwood Manor Luxury Villa',
    propertyLocation: 'Whitefield, Bengaluru',
    propertyImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
    bookingRef: 'SV-77190',
    visitDate: '22 Nov 2026',
    timeSlot: '03:00 PM',
    visitType: 'In person',
    agentName: 'Pooja Singhania',
    agentPhone: '+91 98450 12890',
    agentAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    status: 'Pending confirmation',
    customerNote: 'Need daylight walkthrough of private lawn and clubhouse amenities.',
    meetingInstructions: 'Community gate pass pending clubhouse authority confirmation.',
    virtualLink: null,
    timeline: [
      { status: 'Requested', time: '15 Nov 2026, 11:00 AM', note: 'Slot requested for Sunday afternoon' }
    ]
  },
  {
    id: 'vis-203',
    propertyId: 'prop-7',
    propertyTitle: 'Malabar Crest Duplex',
    propertyLocation: 'Malabar Hill, Mumbai',
    propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    bookingRef: 'SV-55421',
    visitDate: '08 Nov 2026',
    timeSlot: '05:00 PM',
    visitType: 'Virtual',
    agentName: 'Vikramaditya Singhania',
    agentPhone: '+91 98201 44820',
    agentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    status: 'Completed',
    customerNote: 'Requested 3D live camera walkthrough before making physical visit.',
    meetingInstructions: 'High definition walkthrough completed with live advisor narration.',
    virtualLink: 'https://meet.estateone.in/live-tour-malabar-crest',
    timeline: [
      { status: 'Requested', time: '05 Nov 2026, 09:00 AM' },
      { status: 'Confirmed', time: '05 Nov 2026, 02:00 PM' },
      { status: 'Completed', time: '08 Nov 2026, 05:45 PM', note: 'Tour concluded successfully' }
    ]
  },
  {
    id: 'vis-204',
    propertyId: 'prop-8',
    propertyTitle: 'The Camellias Sky Villa',
    propertyLocation: 'Golf Course Road, Gurugram',
    propertyImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    bookingRef: 'SV-33290',
    visitDate: '28 Oct 2026',
    timeSlot: '02:00 PM',
    visitType: 'In person',
    agentName: 'Arjun Mehta',
    agentPhone: '+91 98110 98214',
    agentAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    status: 'Cancelled',
    customerNote: 'Client had flight schedule rescheduling conflict.',
    cancellationReason: 'Rescheduled travel itinerary',
    meetingInstructions: 'Cancelled upon customer request. No penalty applied.',
    virtualLink: null,
    timeline: [
      { status: 'Requested', time: '24 Oct 2026, 03:00 PM' },
      { status: 'Cancelled', time: '26 Oct 2026, 11:30 AM', note: 'Cancelled by customer' }
    ]
  }
];

const INITIAL_CONVERSATIONS = [
  {
    id: 'conv-1',
    enquiryId: 'enq-101',
    propertyId: 'prop-1',
    propertyTitle: 'The Grand Horizon Penthouse',
    propertyPrice: '₹14.50 Cr',
    propertyLocation: 'Worli, Mumbai',
    propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    agentName: 'Vikramaditya Singhania',
    agentRole: 'Verified Premier Advisor',
    agency: 'EstateOne Premier Advisory',
    agentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    unreadCount: 1,
    lastUpdated: '17 Nov 2026, 04:30 PM',
    messages: [
      {
        id: 'msg-1',
        sender: 'customer',
        senderName: 'Ananya Rao',
        text: 'Hello Vikramaditya, I submitted an enquiry for The Grand Horizon Penthouse in Worli. We would like to inspect the private terrace and pool area this Thursday morning.',
        time: '16 Nov 2026, 10:30 AM',
        attachments: []
      },
      {
        id: 'msg-2',
        sender: 'agent',
        senderName: 'Vikramaditya Singhania',
        text: 'Namaste Ananya. Thank you for your interest. The residence on the 32nd floor is completely ready for viewing. Thursday at 11:30 AM works smoothly for our concierge team.',
        time: '17 Nov 2026, 04:15 PM',
        attachments: []
      },
      {
        id: 'msg-3',
        sender: 'agent',
        senderName: 'Vikramaditya Singhania',
        text: 'I have scheduled your site visit and issued the visitor entry pass. The tower concierge will welcome you at the main lobby.',
        time: '17 Nov 2026, 04:30 PM',
        attachments: [
          { name: 'Worli_Penthouse_Floorplan.pdf', size: '2.4 MB' }
        ]
      }
    ]
  },
  {
    id: 'conv-2',
    enquiryId: 'enq-102',
    propertyId: 'prop-2',
    propertyTitle: 'Greenwood Manor Luxury Villa',
    propertyPrice: '₹4.85 Cr',
    propertyLocation: 'Whitefield, Bengaluru',
    propertyImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
    agentName: 'Pooja Singhania',
    agentRole: 'Verified Partner Advisor',
    agency: 'Prime Bengaluru Residences',
    agentAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    unreadCount: 0,
    lastUpdated: '15 Nov 2026, 11:15 AM',
    messages: [
      {
        id: 'msg-201',
        sender: 'customer',
        senderName: 'Ananya Rao',
        text: 'Hi Pooja, please let me know if this villa includes pre fitted solar water heating and power backup.',
        time: '14 Nov 2026, 02:15 PM',
        attachments: []
      },
      {
        id: 'msg-202',
        sender: 'agent',
        senderName: 'Pooja Singhania',
        text: 'Hello Ananya. Yes, Greenwood Manor villas feature 100 percent generator backup and integrated rooftop solar heating. I have also submitted your weekend walkthrough request.',
        time: '15 Nov 2026, 11:15 AM',
        attachments: []
      }
    ]
  }
];

const INITIAL_SEARCH_HISTORY = [
  {
    id: 'search-1',
    query: 'Worli & Bandra luxury apartments',
    location: 'Mumbai',
    intent: 'buy',
    filtersSummary: '3 to 4 BHK, Ready to move, ₹12 Cr to ₹35 Cr',
    date: '17 Nov 2026',
    resultCount: 8,
    filters: {
      city: 'Mumbai',
      locality: 'Worli',
      type: 'Apartment',
      intent: 'buy',
      bedrooms: '4 BHK'
    }
  },
  {
    id: 'search-2',
    query: 'Whitefield luxury gated villas',
    location: 'Bengaluru',
    intent: 'buy',
    filtersSummary: '4 BHK Villas, Gated community, ₹4 Cr to ₹8 Cr',
    date: '15 Nov 2026',
    resultCount: 6,
    filters: {
      city: 'Bengaluru',
      locality: 'Whitefield',
      type: 'Villa',
      intent: 'buy',
      bedrooms: '4 BHK'
    }
  },
  {
    id: 'search-3',
    query: 'Golf Course Road penthouses',
    location: 'Gurugram',
    intent: 'buy',
    filtersSummary: 'Penthouses, Sea / Golf view, ₹20 Cr+',
    date: '12 Nov 2026',
    resultCount: 5,
    filters: {
      city: 'Gurugram',
      locality: 'Golf Course Road',
      type: 'Penthouse',
      intent: 'buy',
      bedrooms: '4 BHK'
    }
  },
  {
    id: 'search-4',
    query: 'Bandra West sea facing flats',
    location: 'Mumbai',
    intent: 'rent',
    filtersSummary: 'Furnished rentals, ₹3.5 L to ₹7 L / month',
    date: '08 Nov 2026',
    resultCount: 4,
    filters: {
      city: 'Mumbai',
      locality: 'Bandra West',
      type: 'Apartment',
      intent: 'rent',
      bedrooms: '3 BHK'
    }
  }
];

const INITIAL_SEARCH_ALERTS = [
  {
    id: 'alert-1',
    name: 'South Mumbai Sea View 4 BHK',
    intent: 'buy',
    location: 'Mumbai (Worli, Malabar Hill, Marine Lines)',
    propertyType: 'Penthouse or Apartment',
    budgetMin: '₹12 Cr',
    budgetMax: '₹45 Cr',
    bedrooms: '4 BHK',
    frequency: 'Daily',
    channels: ['Email', 'In app'],
    isActive: true,
    matchingCount: 3,
    lastNotified: 'Today at 09:00 AM'
  },
  {
    id: 'alert-2',
    name: 'Bengaluru Premium Gated Villas',
    intent: 'buy',
    location: 'Bengaluru (Whitefield, Indiranagar)',
    propertyType: 'Villa',
    budgetMin: '₹4 Cr',
    budgetMax: '₹10 Cr',
    bedrooms: '4 BHK',
    frequency: 'Weekly',
    channels: ['Email'],
    isActive: true,
    matchingCount: 5,
    lastNotified: '15 Nov 2026'
  },
  {
    id: 'alert-3',
    name: 'Gurugram Golf Facing Penthouses',
    intent: 'buy',
    location: 'Gurugram (Golf Course Road)',
    propertyType: 'Penthouse',
    budgetMin: '₹20 Cr',
    budgetMax: '₹40 Cr',
    bedrooms: '4 BHK',
    frequency: 'Instant',
    channels: ['Email', 'In app'],
    isActive: false,
    matchingCount: 2,
    lastNotified: '10 Nov 2026'
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'visit',
    title: 'Site visit confirmed',
    body: 'Your private walkthrough for The Grand Horizon Penthouse is confirmed for 20 Nov at 11:30 AM.',
    time: '1 hour ago',
    unread: true,
    route: '/dashboard/site-visits/vis-201'
  },
  {
    id: 'notif-2',
    type: 'message',
    title: 'New message from Vikramaditya Singhania',
    body: 'I have scheduled your site visit and issued the visitor entry pass.',
    time: '2 hours ago',
    unread: true,
    route: '/dashboard/messages/conv-1'
  },
  {
    id: 'notif-3',
    type: 'alert',
    title: '3 new listings match your alert',
    body: 'South Mumbai Sea View 4 BHK alert found new verified listings in Worli.',
    time: '1 day ago',
    unread: false,
    route: '/dashboard/alerts'
  },
  {
    id: 'notif-4',
    type: 'saved',
    title: 'Listing update on saved property',
    body: 'Greenwood Manor Luxury Villa has updated floor plans and video walkthroughs.',
    time: '2 days ago',
    unread: false,
    route: '/dashboard/saved'
  },
  {
    id: 'notif-5',
    type: 'security',
    title: 'Security check successful',
    body: 'New login session verified from Chrome on Windows.',
    time: '3 days ago',
    unread: false,
    route: '/dashboard/settings'
  }
];

const INITIAL_SUPPORT_TICKETS = [
  {
    id: 'ticket-301',
    reference: 'TCK-4821',
    subject: 'Request legal title copy for The Grand Horizon Penthouse',
    category: 'Enquiry support',
    relatedEntity: 'The Grand Horizon Penthouse (ENQ-89241)',
    status: 'In progress',
    submittedDate: '17 Nov 2026',
    lastUpdated: '18 Nov 2026',
    preferredContact: 'Email',
    description: 'We need the RERA registration certificate copy and title chain clearance report for our legal advisor prior to walkthrough.',
    history: [
      { sender: 'Customer', time: '17 Nov 2026, 11:00 AM', message: 'Ticket opened.' },
      { sender: 'EstateOne Legal Support', time: '17 Nov 2026, 03:30 PM', message: 'We have requested the verified title deed packet from the developer legal team. We will share it within 24 hours.' }
    ]
  }
];

const INITIAL_REPORTED_LISTINGS = [
  {
    id: 'rep-401',
    reference: 'REP-9102',
    propertyTitle: 'Prestige Boulevard Heights',
    propertyLocation: 'Whitefield, Bengaluru',
    reason: 'Duplicate listing',
    description: 'Found another identical listing with different developer contact details.',
    submittedDate: '12 Nov 2026',
    status: 'Under moderation review'
  }
];

const INITIAL_PROFILE = {
  firstName: 'Ananya',
  lastName: 'Rao',
  email: 'buyer@estateone.in',
  phone: '+91 98201 11223',
  preferredContactMethod: 'Email and WhatsApp',
  preferredLanguage: 'English',
  emailVerified: true,
  phoneVerified: true,
  intent: 'buy',
  preferredLocations: ['Worli, Mumbai', 'Bandra West, Mumbai', 'Whitefield, Bengaluru'],
  preferredTypes: ['Penthouse', 'Apartment', 'Villa'],
  minBudget: 100000000,
  maxBudget: 450000000,
  preferredBedrooms: '4 BHK',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
};

export function CustomerDashboardProvider({ children }) {
  const { toastSuccess, toastInfo, toastWarning } = useToast();
  const { user } = useAuth();

  // 1. Enquiries state
  const [enquiries, setEnquiries] = useState(() => {
    try {
      const stored = localStorage.getItem('estateone_customer_enquiries');
      return stored ? JSON.parse(stored) : INITIAL_ENQUIRIES;
    } catch {
      return INITIAL_ENQUIRIES;
    }
  });

  // 2. Site Visits state
  const [siteVisits, setSiteVisits] = useState(() => {
    try {
      const stored = localStorage.getItem('estateone_customer_site_visits');
      return stored ? JSON.parse(stored) : INITIAL_SITE_VISITS;
    } catch {
      return INITIAL_SITE_VISITS;
    }
  });

  // 3. Conversations & Messages state
  const [conversations, setConversations] = useState(() => {
    try {
      const stored = localStorage.getItem('estateone_customer_conversations');
      return stored ? JSON.parse(stored) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  // 4. Search History state
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('estateone_customer_search_history');
      return stored ? JSON.parse(stored) : INITIAL_SEARCH_HISTORY;
    } catch {
      return INITIAL_SEARCH_HISTORY;
    }
  });

  // 5. Search Alerts state
  const [searchAlerts, setSearchAlerts] = useState(() => {
    try {
      const stored = localStorage.getItem('estateone_customer_search_alerts');
      return stored ? JSON.parse(stored) : INITIAL_SEARCH_ALERTS;
    } catch {
      return INITIAL_SEARCH_ALERTS;
    }
  });

  // 6. Notifications state
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem('estateone_customer_notifications');
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // 7. Support Tickets state
  const [supportTickets, setSupportTickets] = useState(() => {
    try {
      const stored = localStorage.getItem('estateone_customer_support_tickets');
      return stored ? JSON.parse(stored) : INITIAL_SUPPORT_TICKETS;
    } catch {
      return INITIAL_SUPPORT_TICKETS;
    }
  });

  // 8. Reported Listings state
  const [reportedListings, setReportedListings] = useState(() => {
    try {
      const stored = localStorage.getItem('estateone_customer_reported_listings');
      return stored ? JSON.parse(stored) : INITIAL_REPORTED_LISTINGS;
    } catch {
      return INITIAL_REPORTED_LISTINGS;
    }
  });

  // 9. Customer Profile & Preferences
  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('estateone_customer_profile');
      return stored ? JSON.parse(stored) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  // Sync back to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('estateone_customer_enquiries', JSON.stringify(enquiries));
      localStorage.setItem('estateone_customer_site_visits', JSON.stringify(siteVisits));
      localStorage.setItem('estateone_customer_conversations', JSON.stringify(conversations));
      localStorage.setItem('estateone_customer_search_history', JSON.stringify(searchHistory));
      localStorage.setItem('estateone_customer_search_alerts', JSON.stringify(searchAlerts));
      localStorage.setItem('estateone_customer_notifications', JSON.stringify(notifications));
      localStorage.setItem('estateone_customer_support_tickets', JSON.stringify(supportTickets));
      localStorage.setItem('estateone_customer_reported_listings', JSON.stringify(reportedListings));
      localStorage.setItem('estateone_customer_profile', JSON.stringify(profile));
    } catch {
      // storage unavailable
    }
  }, [enquiries, siteVisits, conversations, searchHistory, searchAlerts, notifications, supportTickets, reportedListings, profile]);

  // Calculated unread counters
  const unreadMessagesCount = conversations.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);
  const unreadNotificationsCount = notifications.filter((n) => n.unread).length;
  const activeEnquiriesCount = enquiries.filter((e) => e.status !== 'Closed').length;
  const upcomingVisitsCount = siteVisits.filter((v) => v.status === 'Upcoming' || v.status === 'Pending confirmation').length;

  // Actions: Enquiry management
  const createEnquiry = useCallback((enquiryData) => {
    const newRef = `ENQ-${Math.floor(10000 + Math.random() * 90000)}`;
    const newEnquiry = {
      id: `enq-${Date.now()}`,
      propertyId: enquiryData.propertyId || 'prop-1',
      propertyTitle: enquiryData.propertyTitle || 'Luxury Property',
      propertyLocation: enquiryData.propertyLocation || 'Mumbai',
      propertyPrice: enquiryData.propertyPrice || '₹10 Cr',
      propertyImage: enquiryData.propertyImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
      reference: newRef,
      agentName: enquiryData.agentName || 'Vikramaditya Singhania',
      agency: enquiryData.agency || 'EstateOne Premier Advisory',
      agentAvatar: enquiryData.agentAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      agentPhone: enquiryData.agentPhone || '+91 98201 44820',
      submittedDate: 'Just now',
      lastUpdated: 'Just now',
      status: 'Submitted',
      statusHistory: [
        { status: 'Submitted', time: 'Just now', note: 'Enquiry received by EstateOne concierge' }
      ],
      originalMessage: enquiryData.message || 'I am interested in this verified listing.',
      contactUsed: {
        name: profile.firstName + ' ' + profile.lastName,
        email: profile.email,
        phone: profile.phone,
        method: profile.preferredContactMethod
      },
      conversationId: null,
      relatedVisitId: null
    };

    setEnquiries((prev) => [newEnquiry, ...prev]);

    // Also push a notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      type: 'enquiry',
      title: 'Enquiry submitted successfully',
      body: `Your enquiry for ${newEnquiry.propertyTitle} (${newRef}) has been assigned to a verified partner.`,
      time: 'Just now',
      unread: true,
      route: `/dashboard/enquiries/${newEnquiry.id}`
    };
    setNotifications((prev) => [newNotif, ...prev]);

    toastSuccess('Enquiry registered', `Reference ${newRef} created. Our verified advisor will connect shortly.`);
    return newEnquiry;
  }, [profile, toastSuccess]);

  const updateEnquiryStatus = useCallback((enquiryId, newStatus, note = '') => {
    setEnquiries((prev) => prev.map((e) => {
      if (e.id === enquiryId) {
        return {
          ...e,
          status: newStatus,
          lastUpdated: 'Just now',
          statusHistory: [
            ...e.statusHistory,
            { status: newStatus, time: 'Just now', note: note || `Status updated to ${newStatus}` }
          ]
        };
      }
      return e;
    }));
    toastInfo('Enquiry updated', `Status changed to ${newStatus}`);
  }, [toastInfo]);

  // Actions: Site visit management
  const scheduleVisit = useCallback((visitData) => {
    const bookingRef = `SV-${Math.floor(10000 + Math.random() * 90000)}`;
    const newVisit = {
      id: `vis-${Date.now()}`,
      propertyId: visitData.propertyId || 'prop-1',
      propertyTitle: visitData.propertyTitle || 'Luxury Property',
      propertyLocation: visitData.propertyLocation || 'Mumbai',
      propertyImage: visitData.propertyImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
      bookingRef,
      visitDate: visitData.visitDate || '25 Nov 2026',
      timeSlot: visitData.timeSlot || '11:00 AM',
      visitType: visitData.visitType || 'In person',
      agentName: visitData.agentName || 'Vikramaditya Singhania',
      agentPhone: visitData.agentPhone || '+91 98201 44820',
      agentAvatar: visitData.agentAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      status: 'Pending confirmation',
      customerNote: visitData.customerNote || 'Private inspection requested.',
      meetingInstructions: 'Entry instructions will be issued once the resident manager confirms the visitor slot.',
      virtualLink: visitData.visitType === 'Virtual' ? 'https://meet.estateone.in/virtual-walkthrough' : null,
      timeline: [
        { status: 'Requested', time: 'Just now', note: `Requested slot ${visitData.timeSlot} on ${visitData.visitDate}` }
      ]
    };

    setSiteVisits((prev) => [newVisit, ...prev]);

    // Push notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      type: 'visit',
      title: 'Site visit request registered',
      body: `Visit ${bookingRef} for ${newVisit.propertyTitle} is pending confirmation.`,
      time: 'Just now',
      unread: true,
      route: `/dashboard/site-visits/${newVisit.id}`
    };
    setNotifications((prev) => [newNotif, ...prev]);

    toastSuccess('Visit request sent', `Booking ref ${bookingRef}. We will notify you once confirmed.`);
    return newVisit;
  }, [toastSuccess]);

  const rescheduleVisit = useCallback((visitId, newDate, newSlot, customerNote = '') => {
    setSiteVisits((prev) => prev.map((v) => {
      if (v.id === visitId) {
        return {
          ...v,
          visitDate: newDate,
          timeSlot: newSlot,
          status: 'Pending confirmation',
          customerNote: customerNote || v.customerNote,
          timeline: [
            ...v.timeline,
            { status: 'Rescheduled', time: 'Just now', note: `Rescheduled to ${newDate} at ${newSlot}` }
          ]
        };
      }
      return v;
    }));

    toastSuccess('Visit rescheduled', `Your request for ${newDate} at ${newSlot} is pending advisor confirmation.`);
  }, [toastSuccess]);

  const cancelVisit = useCallback((visitId, reason = '') => {
    setSiteVisits((prev) => prev.map((v) => {
      if (v.id === visitId) {
        return {
          ...v,
          status: 'Cancelled',
          cancellationReason: reason,
          timeline: [
            ...v.timeline,
            { status: 'Cancelled', time: 'Just now', note: reason ? `Reason: ${reason}` : 'Cancelled by customer' }
          ]
        };
      }
      return v;
    }));

    toastWarning('Visit cancelled', 'The scheduled site visit has been cancelled.');
  }, [toastWarning]);

  // Actions: Messages & Conversations
  const sendMessage = useCallback((conversationId, text, attachments = []) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'customer',
      senderName: profile.firstName + ' ' + profile.lastName,
      text,
      time: 'Just now',
      attachments: attachments || []
    };

    setConversations((prev) => prev.map((c) => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastUpdated: 'Just now',
          messages: [...c.messages, newMessage]
        };
      }
      return c;
    }));

    toastSuccess('Message sent', 'Your message has been delivered to the advisor.');
  }, [profile, toastSuccess]);

  // Actions: Search history & Alerts
  const addSearchHistory = useCallback((query, location, intent, filters, resultCount) => {
    const item = {
      id: `search-${Date.now()}`,
      query,
      location,
      intent,
      filtersSummary: `${filters.bedrooms || 'Any BHK'}, ${filters.type || 'All types'}, ${location || 'All cities'}`,
      date: 'Today',
      resultCount: resultCount || 6,
      filters
    };
    setSearchHistory((prev) => [item, ...prev.slice(0, 15)]);
  }, []);

  const deleteSearchHistory = useCallback((id) => {
    setSearchHistory((prev) => prev.filter((s) => s.id !== id));
    toastInfo('Search deleted', 'Removed from your recent searches.');
  }, [toastInfo]);

  const clearAllSearchHistory = useCallback(() => {
    setSearchHistory([]);
    toastInfo('History cleared', 'Your search history has been wiped.');
  }, [toastInfo]);

  const createAlert = useCallback((alertData) => {
    const newAlert = {
      id: `alert-${Date.now()}`,
      name: alertData.name || 'New Property Alert',
      intent: alertData.intent || 'buy',
      location: alertData.location || 'All cities',
      propertyType: alertData.propertyType || 'All types',
      budgetMin: alertData.budgetMin || 'Any',
      budgetMax: alertData.budgetMax || 'Any',
      bedrooms: alertData.bedrooms || 'Any',
      frequency: alertData.frequency || 'Daily',
      channels: alertData.channels || ['Email'],
      isActive: true,
      matchingCount: Math.floor(2 + Math.random() * 5),
      lastNotified: 'Just now'
    };

    setSearchAlerts((prev) => [newAlert, ...prev]);
    toastSuccess('Alert created', `You will receive ${newAlert.frequency.toLowerCase()} updates on matching properties.`);
    return newAlert;
  }, [toastSuccess]);

  const toggleAlertActive = useCallback((alertId) => {
    setSearchAlerts((prev) => prev.map((a) => {
      if (a.id === alertId) {
        const nextState = !a.isActive;
        toastInfo(nextState ? 'Alert activated' : 'Alert paused', `Notifications ${nextState ? 'resumed' : 'paused'}.`);
        return { ...a, isActive: nextState };
      }
      return a;
    }));
  }, [toastInfo]);

  const deleteAlert = useCallback((alertId) => {
    setSearchAlerts((prev) => prev.filter((a) => a.id !== alertId));
    toastInfo('Alert removed', 'Search alert deleted successfully.');
  }, [toastInfo]);

  // Actions: Notifications
  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, unread: false } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    toastInfo('All notifications marked read', 'Your inbox is up to date.');
  }, [toastInfo]);

  const deleteNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Actions: Profile & Settings
  const updateProfile = useCallback((newProfileData) => {
    setProfile((prev) => ({ ...prev, ...newProfileData }));
    toastSuccess('Profile updated', 'Your personal details and search preferences have been saved.');
  }, [toastSuccess]);

  // Actions: Support tickets
  const createSupportTicket = useCallback((ticketData) => {
    const ref = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket = {
      id: `ticket-${Date.now()}`,
      reference: ref,
      subject: ticketData.subject,
      category: ticketData.category || 'General assistance',
      relatedEntity: ticketData.relatedEntity || 'None',
      status: 'Submitted',
      submittedDate: 'Today',
      lastUpdated: 'Today',
      preferredContact: ticketData.preferredContact || 'Email',
      description: ticketData.description,
      history: [
        { sender: 'Customer', time: 'Just now', message: ticketData.description }
      ]
    };

    setSupportTickets((prev) => [newTicket, ...prev]);
    toastSuccess('Ticket submitted', `Reference ${ref} logged. A concierge officer will respond.`);
    return newTicket;
  }, [toastSuccess]);

  // Actions: Report listing
  const reportListing = useCallback((reportData) => {
    const ref = `REP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReport = {
      id: `rep-${Date.now()}`,
      reference: ref,
      propertyTitle: reportData.propertyTitle || 'Property listing',
      propertyLocation: reportData.propertyLocation || 'India',
      reason: reportData.reason || 'Incorrect details',
      description: reportData.description || '',
      submittedDate: 'Today',
      status: 'Under moderation review'
    };

    setReportedListings((prev) => [newReport, ...prev]);
    toastSuccess('Listing report submitted', `Reference ${ref}. Our legal moderation team will investigate this listing.`);
    return newReport;
  }, [toastSuccess]);

  return (
    <CustomerDashboardContext.Provider
      value={{
        enquiries,
        createEnquiry,
        updateEnquiryStatus,
        activeEnquiriesCount,
        siteVisits,
        scheduleVisit,
        rescheduleVisit,
        cancelVisit,
        upcomingVisitsCount,
        conversations,
        sendMessage,
        unreadMessagesCount,
        searchHistory,
        addSearchHistory,
        deleteSearchHistory,
        clearAllSearchHistory,
        searchAlerts,
        createAlert,
        toggleAlertActive,
        deleteAlert,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        unreadNotificationsCount,
        supportTickets,
        createSupportTicket,
        reportedListings,
        reportListing,
        profile,
        updateProfile
      }}
    >
      {children}
    </CustomerDashboardContext.Provider>
  );
}

export function useCustomerDashboard() {
  const context = useContext(CustomerDashboardContext);
  if (!context) {
    throw new Error('useCustomerDashboard must be used within a CustomerDashboardProvider');
  }
  return context;
}
