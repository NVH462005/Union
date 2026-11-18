import {
  ConsentChoice,
  FeedPost,
  MomentReaction,
  MutualStatus,
  ReactionLabel,
  StudentProfile,
} from '../types/union';

/**
 * Validates that an email belongs to Hanoi University of Science and Technology (HUST).
 * Accepts @sis.hust.edu.vn (student email) and @hust.edu.vn.
 */
export function isValidHustEmail(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed) return false;
  return /^[a-zA-Z0-9._%+-]+@(sis\.)?hust\.edu\.vn$/i.test(trimmed);
}

/**
 * Toggles an interest tag. Supports selecting more than 3 interests
 * (no upper limit unless maxAllowed is explicitly provided).
 */
export function toggleInterestSelection(
  current: string[],
  tag: string,
  maxAllowed?: number
): string[] {
  if (current.includes(tag)) {
    return current.filter((item) => item !== tag);
  }
  if (typeof maxAllowed === 'number' && current.length >= maxAllowed) {
    return current;
  }
  return [...current, tag];
}

/**
 * Checks whether the student has chosen at least the minimum required interests (default 3).
 */
export function hasMinimumInterests(
  selected: string[],
  minRequired = 3
): boolean {
  return selected.length >= minRequired;
}

/**
 * Computes shared interests between the current user and another HUST student profile.
 */
export function getSharedInterests(
  userInterests: string[],
  otherInterests: string[]
): string[] {
  const userSet = new Set(userInterests);
  return otherInterests.filter((tag) => userSet.has(tag));
}

/**
 * Filters discoverable HUST student profiles by selected school/faculty.
 */
export function filterProfilesBySchool(
  profiles: StudentProfile[],
  schoolFilter: string
): StudentProfile[] {
  if (!schoolFilter || schoolFilter === 'Tất cả HUST') {
    return profiles;
  }
  return profiles.filter((p) => p.faculty === schoolFilter);
}

/**
 * Formats remaining countdown seconds into MM:SS with zero padding.
 */
export function formatCountdown(secondsRemaining: number): string {
  const clamped = Math.max(0, Math.floor(secondsRemaining));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Enforces strict two-way mutual consent before confirming a friendship connection.
 * Never confirms connection if either side has not explicitly opted in.
 */
export function evaluateMutualConnection(
  userChoice: ConsentChoice,
  partnerChoice: ConsentChoice
): MutualStatus {
  if (userChoice === 'end' || partnerChoice === 'end') {
    return 'ended_neutrally';
  }
  if (userChoice === 'connect' && partnerChoice === 'connect') {
    return 'mutual_connected';
  }
  return 'pending';
}

/**
 * Toggles a light one-tap reaction on a quiet connection moment.
 */
export function toggleLightReaction(
  reactions: MomentReaction[],
  targetLabel: ReactionLabel
): MomentReaction[] {
  return reactions.map((reaction) => {
    if (reaction.label !== targetLabel) {
      return reaction;
    }
    const nextReacted = !reaction.reactedByMe;
    return {
      ...reaction,
      reactedByMe: nextReacted,
      count: Math.max(0, reaction.count + (nextReacted ? 1 : -1)),
    };
  });
}

/**
 * Filters community feed posts by search text and optional interest tag.
 */
export function filterFeedPosts(
  posts: FeedPost[],
  searchQuery: string,
  selectedTag: string
): FeedPost[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  return posts.filter((post) => {
    const matchesTag = selectedTag === 'Tất cả' || post.tag === selectedTag;
    if (!matchesTag) return false;
    if (!normalizedQuery) return true;
    return (
      post.content.toLowerCase().includes(normalizedQuery) ||
      post.authorName.toLowerCase().includes(normalizedQuery) ||
      post.tag.toLowerCase().includes(normalizedQuery)
    );
  });
}
