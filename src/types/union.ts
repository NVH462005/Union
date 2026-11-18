export type ScreenId =
  | 'screen01'
  | 'screen02'
  | 'screen03'
  | 'screen04'
  | 'screen05'
  | 'screen06'
  | 'screen07'
  | 'screen08'
  | 'screen09'
  | 'screen10'
  | 'screen11'
  | 'screen12';

export type NavTab = 'feed' | 'discover' | 'messages' | 'profile';

export type MessagesSubTab = 'chat' | 'spaces';

export type ReactionLabel = 'Hay quá!' | 'Đồng cảm' | 'Cố lên!' | 'Mình cũng vậy';

export type QuickUpdateTemplate =
  | 'Hôm nay mình vui'
  | 'Vừa hoàn thành một mục tiêu'
  | 'Đang nghe nhạc'
  | 'Vừa xem phim'
  | 'Đang nghỉ ngơi'
  | 'Chia sẻ một điều mới';

export interface StudentProfile {
  id: string;
  name: string;
  hustEmail: string;
  year: string;
  university: string;
  faculty: string;
  avatar: string;
  bio: string;
  interests: string[];
  purposes: string[];
  matchReason: string;
  isSimulated?: boolean;
}

export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorMeta: string;
  content: string;
  tag: string;
  timeAgo: string;
  interestCount: number;
  interestedByMe: boolean;
  comments: { id: string; authorName: string; text: string; timeAgo: string }[];
}

export interface ChallengePrompt {
  id: string;
  question: string;
  category: string;
  quickReplies: string[];
  partnerReply: string;
}

export interface ChallengeMessage {
  id: string;
  sender: 'me' | 'partner' | 'system';
  text: string;
  timestamp: string;
}

export interface ChatThread {
  userId: string;
  icebreaker: string;
  messages: {
    id: string;
    sender: 'me' | 'partner';
    text: string;
    time: string;
  }[];
}

export interface MomentReaction {
  label: ReactionLabel;
  count: number;
  reactedByMe: boolean;
}

export interface QuietMoment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  statusTitle: string;
  note?: string;
  timeAgo: string;
  reactions: MomentReaction[];
}

export interface SharedSpace {
  id: string;
  name: string;
  originEvent: string;
  description: string;
  inviteCode: string;
  coverAvatar: string;
  memberCount: number;
  members: { id: string; name: string; avatar: string; role: string }[];
  moments: QuietMoment[];
}

export type ConsentChoice = 'undecided' | 'connect' | 'end';

export type MutualStatus = 'pending' | 'mutual_connected' | 'ended_neutrally';

export interface InterviewChecklist {
  selectedThreeInterests: boolean;
  completedChallenge: boolean;
  mutualConnected: boolean;
  openedQuietSpace: boolean;
  postedOneTapUpdate: boolean;
  reactedLightly: boolean;
}
