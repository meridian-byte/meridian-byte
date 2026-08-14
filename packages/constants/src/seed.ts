export const sampleCalendars = [
  {
    title: 'Work & Projects',
    description: 'Client meetings, project milestones, and primary work deliverables.',
  },
  {
    title: 'Personal & Life',
    description: 'Doctor appointments, family events, gym schedules, and personal errands.',
  },
  {
    title: 'Team Operations',
    description: 'Daily standups, sprint reviews, team syncs, and system maintenance windows.',
  },
  {
    title: 'Content Pipeline',
    description: 'Blog publishing schedules, social media campaigns, and newsletter releases.',
  },
  {
    title: 'Holidays & PTO',
    description: 'Company public holidays, planned vacation days, and out-of-office schedules.',
  },
];

export const sampleEvents = [
  // ==========================================
  // 1. Work & Projects
  // ==========================================
  {
    title: 'Client Pitch: Acme Corp',
    description: 'Presenting the Q4 proposal and prototype demo to executive stakeholders.',
    start: new Date('2026-08-17T10:00:00Z'),
    end: new Date('2026-08-17T11:30:00Z'),
    allDay: false,
    location: 'Google Meet',
  },
  {
    title: 'Project Architecture Milestone',
    description: 'Final deadline for submitting the revised cloud infrastructure design docs.',
    start: new Date('2026-08-21T17:00:00Z'),
    end: new Date('2026-08-21T18:00:00Z'),
    allDay: false,
    location: 'Internal Jira / Confluence',
  },
  {
    title: 'Q3 Design Deliverables Review',
    description: 'Walkthrough of high-fidelity mobile mockups with product managers.',
    start: new Date('2026-08-25T14:00:00Z'),
    end: new Date('2026-08-25T15:00:00Z'),
    allDay: false,
    location: 'Conference Room B',
  },

  // ==========================================
  // 2. Personal & Life
  // ==========================================
  {
    title: 'Annual Dental Checkup',
    description: 'Routine cleaning and X-ray examination.',
    start: new Date('2026-08-18T08:30:00Z'),
    end: new Date('2026-08-18T09:30:00Z'),
    allDay: false,
    location: 'Downtown Dental Clinic',
  },
  {
    title: 'Weekend HIIT Workout',
    description: 'Group cardio and strength training session.',
    start: new Date('2026-08-22T09:00:00Z'),
    end: new Date('2026-08-22T10:00:00Z'),
    allDay: false,
    location: 'Equinox Gym - Studio 2',
  },
  {
    title: "Family Dinner - Mom's Birthday",
    description: 'Celebration dinner with the extended family.',
    start: new Date('2026-08-28T18:30:00Z'),
    end: new Date('2026-08-28T21:00:00Z'),
    allDay: false,
    location: 'Bistro Bella Italia',
  },

  // ==========================================
  // 3. Team Operations
  // ==========================================
  {
    title: 'Daily Engineering Standup',
    description: "15-minute quick sync on progress, blockers, and today's tickets.",
    start: new Date('2026-08-17T09:15:00Z'),
    end: new Date('2026-08-17T09:30:00Z'),
    allDay: false,
    location: 'Slack Huddle',
  },
  {
    title: 'Sprint 14 Review & Retrospective',
    description: 'Demo finished features to stakeholders and discuss process improvements.',
    start: new Date('2026-08-24T15:00:00Z'),
    end: new Date('2026-08-24T16:30:00Z'),
    allDay: false,
    location: 'Main Engineering Room',
  },
  {
    title: 'DB Cluster Maintenance Window',
    description: 'Scheduled backend database migration and minor system patch.',
    start: new Date('2026-08-29T02:00:00Z'),
    end: new Date('2026-08-29T04:00:00Z'),
    allDay: false,
    location: 'AWS Console / Ops Channel',
  },

  // ==========================================
  // 4. Content Pipeline
  // ==========================================
  {
    title: 'Publish: Tech Stack 2026 Blog',
    description: 'Release deep-dive article on modern serverless architecture.',
    start: new Date('2026-08-19T12:00:00Z'),
    end: new Date('2026-08-19T12:30:00Z'),
    allDay: false,
    location: 'CMS / Official Blog',
  },
  {
    title: 'Bi-Weekly Newsletter Dispatch',
    description: 'Send subscriber email digest covering top industry trends and product updates.',
    start: new Date('2026-08-26T14:00:00Z'),
    end: new Date('2026-08-26T14:30:00Z'),
    allDay: false,
    location: 'Mailchimp',
  },
  {
    title: 'Product Launch Social Campaign',
    description: 'Coordinated cross-platform post campaign across Twitter, LinkedIn, and YouTube.',
    start: new Date('2026-09-01T00:00:00Z'),
    end: new Date('2026-09-01T23:59:59Z'),
    allDay: true,
    location: 'Buffer / Social Platforms',
  },

  // ==========================================
  // 5. Holidays & PTO
  // ==========================================
  {
    title: 'Labor Day Holiday',
    description: 'Official public holiday - office closed.',
    start: new Date('2026-09-07T00:00:00Z'),
    end: new Date('2026-09-07T23:59:59Z'),
    allDay: true,
    location: null,
  },
  {
    title: 'Sarah - Out of Office (Vacation)',
    description: 'Annual summer break. Coverage handled by Alex.',
    start: new Date('2026-09-10T00:00:00Z'),
    end: new Date('2026-09-14T23:59:59Z'),
    allDay: true,
    location: null,
  },
  {
    title: 'Company Wellness Friday',
    description: 'Paid company-wide day off to reset and recharge.',
    start: new Date('2026-09-18T00:00:00Z'),
    end: new Date('2026-09-18T23:59:59Z'),
    allDay: true,
    location: null,
  },
];
