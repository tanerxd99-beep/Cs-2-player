export interface SocialItem {
  id: string;
  name: string;
  username: string;
  url: string;
  iconName: string;
  themeColor: string;
  hoverColor: string;
}

export interface SpecItem {
  category: string;
  name: string;
  value: string;
}

export interface CS2Setting {
  label: string;
  value: string;
  category: string;
}

export interface FAQItem {
  questionTR: string;
  questionEN: string;
  answerTR: string;
  answerEN: string;
}

export interface PlaylistItem {
  id?: string;
  title: string;
  videoCount: number;
  thumbnail: string;
  url: string;
}

export interface ShortItem {
  id: string;
  title: string;
  views: string;
  thumbnail: string;
  duration: string;
  youtubeId: string;
}

export interface TranslationDict {
  navHome: string;
  navSystem: string;
  navCrosshair: string;
  navSettings: string;
  navAbout: string;
  navContact: string;
  
  socialMediaTitle: string;
  socialMediaSub: string;
  socialMediaFollow: string;
  
  kickLiveTitle: string;
  kickLiveSub: string;
  kickOffline: string;
  kickLive: string;
  kickGoToStream: string;
  kickChatTitle: string;
  kickJoinChat: string;
  kickSendMessage: string;
  kickStreamStatusText: string;
  
  shortsTitle: string;
  shortsSub: string;
  shortsFetchError: string;
  shortsRetry: string;
  
  playlistsTitle: string;
  playlistsSub: string;
  playlistsButton: string;
  
  aboutTitle: string;
  aboutSub: string;
  aboutBio: string;
  aboutStatsTitle: string;
  aboutFavGames: string;
  
  contactTitle: string;
  contactSub: string;
  contactName: string;
  contactEmail: string;
  contactMessage: string;
  contactSubmit: string;
  contactSuccess: string;
  
  systemTitle: string;
  systemSub: string;
  systemPart: string;
  systemSpec: string;
  
  crossTitle: string;
  crossSub: string;
  crossCopyCode: string;
  crossCopied: string;
  crossPreviewOn: string;
  crossBgDesert: string;
  crossBgIndustrial: string;
  crossBgNight: string;
  crossBgAim: string;
  
  settingsTitle: string;
  settingsSub: string;
  settingsLaunchOptions: string;
  settingsMouse: string;
  settingsVideo: string;
  
  footerDesc: string;
  footerSocial: string;
  footerOther: string;
  footerRights: string;

  navGiveaway: string;
  navCommunity: string;
  giveawayTitle: string;
  giveawaySub: string;
  communityTitle: string;
  communitySub: string;
}

export interface GiveawayItem {
  id: string;
  prize: string;
  descriptionTR: string;
  descriptionEN: string;
  endTime: string; // ISO string
  status: "active" | "completed" | "cancelled";
  winner: string | null;
  entrants: string[];
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  badge: "user" | "sub" | "vip" | "mod" | "streamer" | "admin";
  content: string;
  timestamp: string;
  likes: number;
  isPinned?: boolean;
}

export interface CrosshairItem {
  id: string;
  name: string;
  code: string;
  type: "small" | "regular" | "large" | "thick" | "dot" | "plus" | "dot-cross";
  color: string;
  size?: number;
  gap?: number;
  thickness?: number;
  outline?: boolean;
  group: "main" | "liked";
  videoUrl?: string;
  customIcon?: string;
}

export interface Announcement {
  id: string;
  titleTR: string;
  titleEN: string;
  contentTR: string;
  contentEN: string;
  date: string;
  badgeTR?: string;
  badgeEN?: string;
  importance?: "high" | "medium" | "low";
  active: boolean;
}

