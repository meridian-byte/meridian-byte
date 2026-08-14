import { getRandomColorName } from './colors';

export const sampleCalendars = [
  {
    title: 'Work & Projects',
    description: 'Client meetings, project milestones, and primary work deliverables.',
    color: getRandomColorName(),
  },
  {
    title: 'Personal & Life',
    description: 'Doctor appointments, family events, gym schedules, and personal errands.',
    color: getRandomColorName(),
  },
  {
    title: 'Team Operations',
    description: 'Daily standups, sprint reviews, team syncs, and system maintenance windows.',
    color: getRandomColorName(),
  },
  {
    title: 'Content Pipeline',
    description: 'Blog publishing schedules, social media campaigns, and newsletter releases.',
    color: getRandomColorName(),
  },
  {
    title: 'Holidays & PTO',
    description: 'Company public holidays, planned vacation days, and out-of-office schedules.',
    color: getRandomColorName(),
  },
];
