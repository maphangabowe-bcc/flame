
import React from 'react';
import { RantGroup, Rant, User } from './types.ts';
import { Flame, Coffee, Briefcase, Car, Globe, Heart, Utensils, Users, Brain } from 'lucide-react';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Ventor',
  username: 'alex_vents',
  avatar: 'https://picsum.photos/seed/alex/100/100'
};

export const MOCK_GROUPS: RantGroup[] = [
  { id: 'g1', name: 'Workplace Woes', description: 'Office politics, bad coffee, and meetings that could have been emails.', category: 'Work', memberCount: 1250, icon: 'Briefcase' },
  { id: 'g2', name: 'Traffic Terrors', description: 'For those who spend half their lives stuck behind a slow truck.', category: 'Life', memberCount: 840, icon: 'Car' },
  { id: 'g3', name: 'Tech Tantrums', description: 'When code doesn\'t compile and printers exist just to spite you.', category: 'Tech', memberCount: 2100, icon: 'Flame' },
  { id: 'g4', name: 'Relationship Rants', description: 'Dating apps, dirty dishes, and all things matters of the heart.', category: 'Personal', memberCount: 560, icon: 'Heart' },
  { id: 'g5', name: 'Global Gripes', description: 'Everything wrong with the world today. No topic is too big.', category: 'World', memberCount: 3200, icon: 'Globe' },
  { id: 'g6', name: 'Culinary Crimes', description: 'Soggy fries, overcooked steak, and people who put pineapple on pizza.', category: 'Food', memberCount: 1100, icon: 'Zap' },
  { id: 'g7', name: 'Family Feuds', description: 'Awkward holidays, intrusive relatives, and the "when are you getting married?" talk.', category: 'Family', memberCount: 950, icon: 'Zap' },
  { id: 'g8', name: 'Vanishing Common Sense', description: 'Observing the absolute lack of basic logic in everyday public life.', category: 'Commonsense', memberCount: 4500, icon: 'Zap' }
];

export const INITIAL_RANTS: Rant[] = [
  {
    id: 'r1',
    userId: 'u2',
    userName: 'AngryCoder',
    userAvatar: 'https://picsum.photos/seed/angry/100/100',
    groupId: 'g3',
    groupName: 'Tech Tantrums',
    content: "Why is the CSS box model like this?! I just wanted to center a div and now my entire site is underwater. I've been at this for 4 hours. 4 HOURS!",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    heatLevel: 8,
    agreements: 42,
    comments: 2,
    commentsList: [
      {
        id: 'c1',
        userId: 'u5',
        userName: 'FlexboxFan',
        userAvatar: 'https://picsum.photos/seed/flex/100/100',
        content: "Just use display: flex and justify-content: center. It's 2024!",
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString()
      },
      {
        id: 'c2',
        userId: 'u6',
        userName: 'GridGuru',
        userAvatar: 'https://picsum.photos/seed/grid/100/100',
        content: "Place-items: center is even shorter. Don't let the box model win.",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString()
      }
    ],
    aiResponse: "Breathe in, breathe out. Centering a div is a rite of passage. Have you tried flexbox or grid? Or perhaps a new career in pottery?"
  },
  {
    id: 'r2',
    userId: 'u3',
    userName: 'CommuterQueen',
    userAvatar: 'https://picsum.photos/seed/queen/100/100',
    groupId: 'g2',
    groupName: 'Traffic Terrors',
    content: "To the person who decided to change lanes without signaling in the middle of a rainstorm: I hope your pillow is warm on both sides tonight.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    heatLevel: 9,
    agreements: 156,
    comments: 0,
    commentsList: []
  },
  {
    id: 'r3',
    userId: 'u4',
    userName: 'LogicLover',
    userAvatar: 'https://picsum.photos/seed/logic/100/100',
    groupId: 'g8',
    groupName: 'Vanishing Common Sense',
    content: "Just saw someone try to push a door that clearly says PULL for a solid minute, then walk away like the building was closed. My faith in humanity is oscillating at dangerous lows.",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    heatLevel: 7,
    agreements: 89,
    comments: 1,
    commentsList: [
      {
        id: 'c3',
        userId: 'u1',
        userName: 'Alex Ventor',
        userAvatar: 'https://picsum.photos/seed/alex/100/100',
        content: "The PULL/PUSH struggle is the ultimate test of survival.",
        timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString()
      }
    ],
    aiResponse: "Intelligence is a constant, but the population is growing. You've witnessed a local frequency drop in basic logic."
  }
];

export const CATEGORIES = ['All', 'Work', 'Life', 'Tech', 'Personal', 'World', 'Food', 'Family', 'Commonsense'];
