
export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
}

export interface Rant {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  groupId: string;
  groupName: string;
  content: string;
  timestamp: string;
  heatLevel: number; // 1-10 (Intensity)
  agreements: number;
  comments: number;
  commentsList?: Comment[];
  aiResponse?: string;
  mediaUrl?: string;
  mediaMimeType?: string;
}

export interface RantGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  icon: string;
}

export enum ViewMode {
  FEED = 'FEED',
  GROUPS = 'GROUPS',
  TRENDS = 'TRENDS',
  PROFILE = 'PROFILE'
}
