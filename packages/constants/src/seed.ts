export const adjustEventsToCurrentMonth = (events: any[]) => {
  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth(); // 0-indexed (0 = Jan, 11 = Dec)

  return events.map((event) => {
    const start = new Date(event.start);
    const end = new Date(event.end);

    // Set year and month while preserving day, hours, minutes, seconds
    start.setUTCFullYear(currentYear, currentMonth);
    end.setUTCFullYear(currentYear, currentMonth);

    return {
      ...event,
      start,
      end,
    };
  });
};

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

export const sampleEvents = adjustEventsToCurrentMonth([
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
    start: new Date('2026-08-28T16:30:00Z'),
    end: new Date('2026-08-28T18:30:00Z'),
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
    start: new Date('2026-09-01T10:00:00Z'),
    end: new Date('2026-09-01T11:00:00Z'),
    allDay: false,
    location: 'Buffer / Social Platforms',
  },

  // ==========================================
  // 5. Holidays & PTO
  // ==========================================
  {
    title: 'Labor Day Holiday',
    description: 'Official public holiday - office closed.',
    start: new Date('2026-08-06 21:00:00Z'),
    end: new Date('2026-08-07 21:00:00Z'),
    allDay: true,
    location: null,
  },
  {
    title: 'Sarah - Out of Office',
    description: 'Annual summer break. Coverage handled by Alex.',
    start: new Date('2026-08-10T10:00:00Z'),
    end: new Date('2026-08-10T17:00:00Z'),
    allDay: false,
    location: null,
  },
  {
    title: 'Company Wellness Friday',
    description: 'Paid company-wide day off to reset and recharge.',
    start: new Date('2026-08-17 21:00:00Z'),
    end: new Date('2026-08-18 21:00:00Z'),
    allDay: true,
    location: null,
  },
]);

export const sampleTaskLists = [
  {
    key: 'work',
    title: 'Work & Projects',
    description: 'Projects, deliverables, and professional priorities.',
  },
  {
    key: 'personal',
    title: 'Personal',
    description: 'Personal errands, health, and life admin.',
  },
  {
    key: 'content',
    title: 'Content Pipeline',
    description: 'Content creation, publishing, and marketing tasks.',
  },
  {
    key: 'someday',
    title: 'Someday / Maybe',
    description: 'Ideas and tasks that are not urgent.',
  },
];

const now = new Date();

const daysFromNow = (days: number, hours = 12) => {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  date.setHours(hours, 0, 0, 0);
  return date;
};

export const sampleTasks = [
  // ==========================================
  // INBOX
  // ==========================================
  {
    title: 'Review new project request',
    description: 'Review the request and decide whether it should become a formal project.',
    dueDate: null,
    complete: false,
    priority: 'NOT_URGENT_IMPORTANT',
    taskListKey: null,
  },
  {
    title: 'Reply to outstanding emails',
    description: 'Clear the remaining emails that need a response.',
    dueDate: daysFromNow(0, 17),
    complete: false,
    priority: 'URGENT_IMPORTANT',
    taskListKey: null,
  },

  // ==========================================
  // WORK & PROJECTS
  // ==========================================
  {
    title: 'Send revised project proposal',
    description: 'Send the updated proposal to the client after incorporating feedback.',
    dueDate: daysFromNow(-3, 15),
    complete: false,
    priority: 'URGENT_IMPORTANT',
    taskListKey: 'work',
  },
  {
    title: 'Update project documentation',
    description: 'Bring the architecture and deployment documentation up to date.',
    dueDate: daysFromNow(-2, 16),
    complete: false,
    priority: 'URGENT_UNIMPORTANT',
    taskListKey: 'work',
  },
  {
    title: 'Finalize Acme Corp pitch deck',
    description: 'Review the proposal and make final adjustments before the client pitch.',
    dueDate: daysFromNow(0, 16),
    complete: false,
    priority: 'URGENT_IMPORTANT',
    taskListKey: 'work',
  },
  {
    title: 'Review cloud architecture document',
    description: 'Make sure the revised infrastructure design is ready for submission.',
    dueDate: daysFromNow(2, 15),
    complete: false,
    priority: 'URGENT_IMPORTANT',
    taskListKey: 'work',
  },
  {
    title: 'Prepare sprint retrospective notes',
    description: 'Collect wins, blockers, and improvement opportunities from the team.',
    dueDate: daysFromNow(5, 12),
    complete: false,
    priority: 'NOT_URGENT_IMPORTANT',
    taskListKey: 'work',
  },
  {
    title: 'Clean up old Jira tickets',
    description: 'Close stale tickets and update tickets that still need action.',
    dueDate: null,
    complete: false,
    priority: 'NOT_URGENT_UNIMPORTANT',
    taskListKey: 'work',
  },
  {
    title: 'Submit weekly status report',
    description: 'Send the completed status report to the team.',
    dueDate: daysFromNow(-1, 15),
    complete: true,
    priority: 'NOT_URGENT_IMPORTANT',
    taskListKey: 'work',
  },

  // ==========================================
  // PERSONAL
  // ==========================================
  {
    title: 'Order birthday gift',
    description: 'Purchase and arrange delivery of Mom’s birthday gift.',
    dueDate: daysFromNow(-1, 17),
    complete: false,
    priority: 'URGENT_IMPORTANT',
    taskListKey: 'personal',
  },
  {
    title: 'Buy groceries for the week',
    description: 'Restock vegetables, fruit, coffee, and household essentials.',
    dueDate: daysFromNow(1, 17),
    complete: false,
    priority: 'NOT_URGENT_IMPORTANT',
    taskListKey: 'personal',
  },
  {
    title: 'Confirm dental appointment',
    description: 'Call the clinic and confirm the appointment time.',
    dueDate: daysFromNow(-1, 7),
    complete: true,
    priority: 'URGENT_IMPORTANT',
    taskListKey: 'personal',
  },

  // ==========================================
  // CONTENT PIPELINE
  // ==========================================
  {
    title: 'Publish Tech Stack article',
    description: 'Complete the final publishing checklist and release the article.',
    dueDate: daysFromNow(0, 18),
    complete: false,
    priority: 'URGENT_IMPORTANT',
    taskListKey: 'content',
  },
  {
    title: 'Create newsletter draft',
    description: 'Write the first draft of this week’s industry newsletter.',
    dueDate: daysFromNow(5, 14),
    complete: false,
    priority: 'NOT_URGENT_IMPORTANT',
    taskListKey: 'content',
  },
  {
    title: 'Prepare social campaign assets',
    description: 'Create graphics and copy for the product launch campaign.',
    dueDate: daysFromNow(9, 16),
    complete: false,
    priority: 'URGENT_IMPORTANT',
    taskListKey: 'content',
  },

  // ==========================================
  // SOMEDAY / MAYBE
  // ==========================================
  {
    title: 'Research new project management tools',
    description: 'Compare alternatives and note useful features.',
    dueDate: null,
    complete: false,
    priority: 'NOT_URGENT_UNIMPORTANT',
    taskListKey: 'someday',
  },
  {
    title: 'Plan next personal project',
    description: 'Write down possible ideas and decide which one is worth pursuing.',
    dueDate: null,
    complete: false,
    priority: 'NOT_URGENT_IMPORTANT',
    taskListKey: 'someday',
  },
];
