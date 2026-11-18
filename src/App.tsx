import React, { useMemo, useState } from 'react';
import { Clock } from 'lucide-react';
import { BottomNav } from './components/mobile/BottomNav';
import {
  ChallengeActiveScreen,
  ChallengeResultScreen,
  ChallengeSetupScreen,
} from './components/mobile/ChallengeScreens';
import {
  MessagesScreen,
  QuietConnectionSpaceScreen,
  SharedConnectionsScreen,
} from './components/mobile/ConnectionScreens';
import {
  CommunityFeedScreen,
  DiscoverFriendsScreen,
  OtherUserProfileScreen,
} from './components/mobile/FeedAndDiscoverScreens';
import {
  MyProfileScreen,
  WelcomeScreen,
} from './components/mobile/OnboardingAndProfileScreens';
import {
  ASSETS,
  DISCOVER_PROFILES,
  INITIAL_CHAT_THREADS,
  INITIAL_FEED_POSTS,
  INITIAL_ME,
  INITIAL_SHARED_SPACES,
} from './data/mockData';
import {
  ChatThread,
  FeedPost,
  MessagesSubTab,
  NavTab,
  QuickUpdateTemplate,
  ReactionLabel,
  ScreenId,
  SharedSpace,
  StudentProfile,
} from './types/union';
import {
  filterProfilesBySchool,
  toggleInterestSelection,
  toggleLightReaction,
} from './utils/unionLogic';

function getInitialScreen(): ScreenId {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      return 'screen04';
    }
  }
  return 'screen01';
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(getInitialScreen);
  const [returnScreen, setReturnScreen] = useState<ScreenId>('screen04');

  // HUST Student Profile & Onboarding
  const [myProfile, setMyProfile] = useState<StudentProfile>(INITIAL_ME);
  const [onboardingInterests, setOnboardingInterests] = useState<string[]>([
    'Xem phim',
    'Âm nhạc',
  ]);
  const [onboardingFaculty, setOnboardingFaculty] = useState<string>(
    INITIAL_ME.faculty
  );
  const [onboardingEmail, setOnboardingEmail] = useState<string>(
    INITIAL_ME.hustEmail
  );

  // Discover & Filtering
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [discoverSchoolFilter, setDiscoverSchoolFilter] =
    useState<string>('Tất cả HUST');
  const [discoverIndex, setDiscoverIndex] = useState(0);
  const [selectedOtherUserId, setSelectedOtherUserId] =
    useState<string>('quang-huy');

  // Connections & Feed
  const [invitedUserIds, setInvitedUserIds] = useState<string[]>([]);
  const [connectedUserIds, setConnectedUserIds] = useState<string[]>([
    'thao-linh',
  ]);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(INITIAL_FEED_POSTS);

  // Solution 1 – 3-Minute Challenge
  const [challengePartnerId, setChallengePartnerId] =
    useState<string>('quang-huy');
  const [challengeQuickTags, setChallengeQuickTags] = useState<string[]>(
    INITIAL_ME.interests
  );
  const [discussedTopics, setDiscussedTopics] = useState<string[]>([
    'Điểm chung',
  ]);

  // Solution 2 – Messages & Quiet Spaces
  const [messagesSubTab, setMessagesSubTab] = useState<MessagesSubTab>('chat');
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(
    INITIAL_CHAT_THREADS
  );
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
  const [spaces, setSpaces] = useState<SharedSpace[]>(INITIAL_SHARED_SPACES);
  const [activeSpaceId, setActiveSpaceId] = useState<string>('space-photo');
  const [isOneTapSheetOpen, setIsOneTapSheetOpen] = useState(false);

  const availableDiscoverProfiles = useMemo(() => {
    const unblocked = DISCOVER_PROFILES.filter(
      (p) => !blockedIds.includes(p.id)
    );
    return filterProfilesBySchool(unblocked, discoverSchoolFilter);
  }, [blockedIds, discoverSchoolFilter]);

  const profilesById = useMemo(() => {
    const map: Record<string, StudentProfile> = { me: myProfile };
    DISCOVER_PROFILES.forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, [myProfile]);

  const activeOtherProfile =
    profilesById[selectedOtherUserId] ||
    availableDiscoverProfiles[0] ||
    DISCOVER_PROFILES[0];
  const challengePartner =
    profilesById[challengePartnerId] ||
    availableDiscoverProfiles[0] ||
    DISCOVER_PROFILES[0];
  const activeSpace = spaces.find((s) => s.id === activeSpaceId) || spaces[0];

  const handleSelectNavTab = (tab: NavTab) => {
    setIsOneTapSheetOpen(false);
    if (tab === 'feed') setCurrentScreen('screen03');
    if (tab === 'discover') setCurrentScreen('screen04');
    if (tab === 'messages') {
      setActiveChatUserId(null);
      setCurrentScreen(messagesSubTab === 'spaces' ? 'screen10' : 'screen09');
    }
    if (tab === 'profile') setCurrentScreen('screen02');
  };

  const ensureChatThreadForUser = (userId: string) => {
    setChatThreads((prev) => {
      if (prev.some((t) => t.userId === userId)) return prev;
      const person = profilesById[userId];
      const sharedTopic = person?.interests[0] || 'sở thích chung';
      return [
        {
          userId,
          icebreaker: `Bạn có muốn tiếp tục nói về chủ đề ${sharedTopic} lúc nãy không?`,
          messages: [],
        },
        ...prev,
      ];
    });
  };

  const handleMutualConnectUser = (userId: string) => {
    setConnectedUserIds((prev) =>
      prev.includes(userId) ? prev : [...prev, userId]
    );
    setInvitedUserIds((prev) => prev.filter((id) => id !== userId));
    ensureChatThreadForUser(userId);
  };

  const handleQuickStartChallenge = () => {
    const candidate =
      availableDiscoverProfiles[discoverIndex] ||
      availableDiscoverProfiles[0] ||
      DISCOVER_PROFILES[0];
    setChallengePartnerId(candidate.id);
    setChallengeQuickTags(myProfile.interests);
    setReturnScreen(currentScreen === 'screen01' ? 'screen04' : currentScreen);
    setIsOneTapSheetOpen(false);
    setCurrentScreen('screen06');
  };

  const activeNavTab: NavTab =
    currentScreen === 'screen03'
      ? 'feed'
      : currentScreen === 'screen02'
        ? 'profile'
        : currentScreen === 'screen09' ||
            currentScreen === 'screen10' ||
            currentScreen === 'screen11' ||
            currentScreen === 'screen12'
          ? 'messages'
          : 'discover';

  const shouldShowBottomNav =
    currentScreen === 'screen02' ||
    currentScreen === 'screen03' ||
    currentScreen === 'screen04' ||
    currentScreen === 'screen10' ||
    (currentScreen === 'screen09' && !activeChatUserId);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'screen01':
        return (
          <WelcomeScreen
            selectedInterests={onboardingInterests}
            selectedFaculty={onboardingFaculty}
            hustEmail={onboardingEmail}
            onChangeHustEmail={setOnboardingEmail}
            onSelectFaculty={setOnboardingFaculty}
            onToggleInterest={(tag) =>
              setOnboardingInterests((prev) => toggleInterestSelection(prev, tag))
            }
            onContinue={() => {
              setMyProfile((prev) => ({
                ...prev,
                hustEmail: onboardingEmail.trim(),
                faculty: onboardingFaculty,
                interests: onboardingInterests,
              }));
              setChallengeQuickTags(onboardingInterests);
              setCurrentScreen('screen04');
            }}
          />
        );

      case 'screen02':
        return (
          <MyProfileScreen
            profile={myProfile}
            onUpdateProfile={(updated) => {
              setMyProfile(updated);
              setChallengeQuickTags(updated.interests);
            }}
          />
        );

      case 'screen03':
        return (
          <CommunityFeedScreen
            posts={feedPosts.filter((p) => !blockedIds.includes(p.authorId))}
            myProfile={myProfile}
            onTogglePostInterest={(postId) =>
              setFeedPosts((prev) =>
                prev.map((post) =>
                  post.id === postId
                    ? {
                        ...post,
                        interestedByMe: !post.interestedByMe,
                        interestCount:
                          post.interestCount + (post.interestedByMe ? -1 : 1),
                      }
                    : post
                )
              )
            }
            onAddComment={(postId, text) =>
              setFeedPosts((prev) =>
                prev.map((post) =>
                  post.id === postId
                    ? {
                        ...post,
                        comments: [
                          ...post.comments,
                          {
                            id: `c-${Date.now()}`,
                            authorName: myProfile.name,
                            text,
                            timeAgo: 'Vừa xong',
                          },
                        ],
                      }
                    : post
                )
              )
            }
            onCreatePost={(content, tag) =>
              setFeedPosts((prev) => [
                {
                  id: `post-${Date.now()}`,
                  authorId: 'me',
                  authorName: myProfile.name,
                  authorAvatar: myProfile.avatar,
                  authorMeta: `${myProfile.year} · ${myProfile.faculty}`,
                  content,
                  tag,
                  timeAgo: 'Vừa xong',
                  interestCount: 1,
                  interestedByMe: true,
                  comments: [],
                },
                ...prev,
              ])
            }
            onViewAuthorProfile={(authorId) => {
              if (authorId === 'me') {
                setCurrentScreen('screen02');
                return;
              }
              setSelectedOtherUserId(authorId);
              setReturnScreen('screen03');
              setCurrentScreen('screen05');
            }}
          />
        );

      case 'screen04':
        return (
          <DiscoverFriendsScreen
            profiles={availableDiscoverProfiles}
            myInterests={myProfile.interests}
            currentIndex={discoverIndex}
            selectedSchool={discoverSchoolFilter}
            onSelectSchool={(school) => {
              setDiscoverSchoolFilter(school);
              setDiscoverIndex(0);
            }}
            invitedUserIds={invitedUserIds}
            connectedUserIds={connectedUserIds}
            onSkip={() => setDiscoverIndex((i) => i + 1)}
            onResetDeck={() => setDiscoverIndex(0)}
            onViewProfile={(profile) => {
              setSelectedOtherUserId(profile.id);
              setReturnScreen('screen04');
              setCurrentScreen('screen05');
            }}
            onSendConnectInvite={(profile) => {
              setInvitedUserIds((prev) =>
                prev.includes(profile.id) ? prev : [...prev, profile.id]
              );
            }}
            onStartChallenge={(profile) => {
              setChallengePartnerId(profile.id);
              setChallengeQuickTags(myProfile.interests);
              setReturnScreen('screen04');
              setCurrentScreen('screen06');
            }}
          />
        );

      case 'screen05':
        return (
          <OtherUserProfileScreen
            profile={activeOtherProfile}
            myInterests={myProfile.interests}
            isInvited={invitedUserIds.includes(activeOtherProfile.id)}
            isConnected={connectedUserIds.includes(activeOtherProfile.id)}
            onBack={() => setCurrentScreen(returnScreen)}
            onSendConnectInvite={() =>
              setInvitedUserIds((prev) =>
                prev.includes(activeOtherProfile.id)
                  ? prev
                  : [...prev, activeOtherProfile.id]
              )
            }
            onSimulatePartnerAccept={() =>
              handleMutualConnectUser(activeOtherProfile.id)
            }
            onOpenChat={() => {
              ensureChatThreadForUser(activeOtherProfile.id);
              setMessagesSubTab('chat');
              setActiveChatUserId(activeOtherProfile.id);
              setCurrentScreen('screen09');
            }}
            onStartChallenge={() => {
              setChallengePartnerId(activeOtherProfile.id);
              setChallengeQuickTags(myProfile.interests);
              setReturnScreen('screen05');
              setCurrentScreen('screen06');
            }}
            onBlockUser={() => {
              setBlockedIds((prev) => [...prev, activeOtherProfile.id]);
              setDiscoverIndex(0);
              setCurrentScreen('screen04');
            }}
          />
        );

      case 'screen06':
        return (
          <ChallengeSetupScreen
            partner={challengePartner}
            quickTags={challengeQuickTags}
            onToggleQuickTag={(tag) =>
              setChallengeQuickTags((prev) => toggleInterestSelection(prev, tag))
            }
            onStartChallenge={() => setCurrentScreen('screen07')}
            onLater={() => setCurrentScreen(returnScreen)}
          />
        );

      case 'screen07':
        return (
          <ChallengeActiveScreen
            partner={challengePartner}
            quickTags={challengeQuickTags}
            onFinishChallenge={(topics) => {
              setDiscussedTopics(topics);
              setCurrentScreen('screen08');
            }}
          />
        );

      case 'screen08':
        return (
          <ChallengeResultScreen
            partner={challengePartner}
            myInterests={myProfile.interests}
            discussedTopics={discussedTopics}
            onMutualSuccess={() => handleMutualConnectUser(challengePartner.id)}
            onOpenChat={() => {
              ensureChatThreadForUser(challengePartner.id);
              setMessagesSubTab('chat');
              setActiveChatUserId(challengePartner.id);
              setCurrentScreen('screen09');
            }}
            onBackToDiscover={() => setCurrentScreen('screen04')}
          />
        );

      case 'screen09':
        return (
          <MessagesScreen
            subTab={messagesSubTab}
            onSelectSubTab={(tab) => {
              setMessagesSubTab(tab);
              if (tab === 'spaces') setCurrentScreen('screen10');
            }}
            threads={chatThreads}
            profilesById={profilesById}
            activeChatUserId={activeChatUserId}
            onSelectChatUser={setActiveChatUserId}
            onSendMessage={(userId, text) =>
              setChatThreads((prev) =>
                prev.map((t) =>
                  t.userId === userId
                    ? {
                        ...t,
                        messages: [
                          ...t.messages,
                          {
                            id: `msg-${Date.now()}`,
                            sender: 'me',
                            text,
                            time: 'Bây giờ',
                          },
                        ],
                      }
                    : t
                )
              )
            }
            spaceCount={spaces.length}
          />
        );

      case 'screen10':
        return (
          <SharedConnectionsScreen
            subTab={messagesSubTab}
            onSelectSubTab={(tab) => {
              setMessagesSubTab(tab);
              if (tab === 'chat') setCurrentScreen('screen09');
            }}
            spaces={spaces}
            chatCount={chatThreads.length}
            onOpenSpace={(spaceId) => {
              setActiveSpaceId(spaceId);
              setCurrentScreen('screen11');
            }}
            onCreateSpace={(name, originEvent, description) => {
              const newSpace: SharedSpace = {
                id: `space-${Date.now()}`,
                name,
                originEvent,
                description,
                inviteCode: `HUST${Math.floor(100 + Math.random() * 900)}`,
                coverAvatar: myProfile.avatar,
                memberCount: 1,
                members: [
                  {
                    id: 'me',
                    name: `${myProfile.name} (Bạn)`,
                    avatar: myProfile.avatar,
                    role: 'Người tạo nhóm · HUST',
                  },
                ],
                moments: [],
              };
              setSpaces((prev) => [newSpace, ...prev]);
            }}
            onJoinSpaceByCode={(code) => {
              const existing = spaces.find(
                (s) => s.inviteCode.toUpperCase() === code.toUpperCase()
              );
              if (existing) {
                setActiveSpaceId(existing.id);
                setCurrentScreen('screen11');
                return true;
              }
              if (code.toUpperCase() === 'CLB2026') {
                const joined: SharedSpace = {
                  id: 'space-clb2026',
                  name: 'Nhóm CLB Âm nhạc Acoustic HUST',
                  originEvent: 'Đêm nhạc Sinh viên Bách khoa 2026',
                  description:
                    'Chia sẻ bài hát đang nghe và khoảnh khắc thư giãn sau buổi diễn tại Hội trường C2.',
                  inviteCode: 'CLB2026',
                  coverAvatar: ASSETS.quangHuy,
                  memberCount: 15,
                  members: [
                    {
                      id: 'me',
                      name: `${myProfile.name} (Bạn)`,
                      avatar: myProfile.avatar,
                      role: 'Thành viên mới · HUST',
                    },
                    {
                      id: 'quang-huy',
                      name: 'Quang Huy',
                      avatar: ASSETS.quangHuy,
                      role: 'Thành viên · SoICT',
                    },
                  ],
                  moments: [
                    {
                      id: 'mom-clb-1',
                      authorId: 'quang-huy',
                      authorName: 'Quang Huy',
                      authorAvatar: ASSETS.quangHuy,
                      statusTitle: 'Đang nghe nhạc',
                      note: 'Nghe lại bản cover tối qua ở C2 vẫn thấy chill.',
                      timeAgo: '1 giờ trước',
                      reactions: [
                        { label: 'Hay quá!', count: 2, reactedByMe: false },
                        { label: 'Đồng cảm', count: 1, reactedByMe: false },
                        { label: 'Cố lên!', count: 0, reactedByMe: false },
                        { label: 'Mình cũng vậy', count: 2, reactedByMe: false },
                      ],
                    },
                  ],
                };
                setSpaces((prev) => [joined, ...prev]);
                setActiveSpaceId(joined.id);
                setCurrentScreen('screen11');
                return true;
              }
              return false;
            }}
          />
        );

      case 'screen11':
      case 'screen12':
        if (!activeSpace) {
          return null;
        }
        return (
          <QuietConnectionSpaceScreen
            space={activeSpace}
            isOneTapSheetOpen={isOneTapSheetOpen}
            onOpenOneTapSheet={() => setIsOneTapSheetOpen(true)}
            onCloseOneTapSheet={() => setIsOneTapSheetOpen(false)}
            onPostMoment={(statusTitle: QuickUpdateTemplate, note?: string) => {
              setSpaces((prev) =>
                prev.map((s) =>
                  s.id === activeSpace.id
                    ? {
                        ...s,
                        moments: [
                          {
                            id: `mom-${Date.now()}`,
                            authorId: 'me',
                            authorName: myProfile.name,
                            authorAvatar: myProfile.avatar,
                            statusTitle,
                            note,
                            timeAgo: 'Vừa xong',
                            reactions: [
                              { label: 'Hay quá!', count: 0, reactedByMe: false },
                              { label: 'Đồng cảm', count: 0, reactedByMe: false },
                              { label: 'Cố lên!', count: 0, reactedByMe: false },
                              { label: 'Mình cũng vậy', count: 0, reactedByMe: false },
                            ],
                          },
                          ...s.moments,
                        ],
                      }
                    : s
                )
              );
            }}
            onToggleReaction={(momentId: string, label: ReactionLabel) => {
              setSpaces((prev) =>
                prev.map((s) =>
                  s.id === activeSpace.id
                    ? {
                        ...s,
                        moments: s.moments.map((m) =>
                          m.id === momentId
                            ? {
                                ...m,
                                reactions: toggleLightReaction(
                                  m.reactions,
                                  label
                                ),
                              }
                            : m
                        ),
                      }
                    : s
                )
              );
            }}
            onBack={() => {
              setIsOneTapSheetOpen(false);
              setMessagesSubTab('spaces');
              setCurrentScreen('screen10');
            }}
            onLeaveSpace={() => {
              setSpaces((prev) => prev.filter((s) => s.id !== activeSpace.id));
              setMessagesSubTab('spaces');
              setCurrentScreen('screen10');
            }}
          />
        );
    }
  };

  if (currentScreen === 'screen01') {
    return renderScreen();
  }

  const isSpacesView =
    currentScreen === 'screen10' ||
    currentScreen === 'screen11' ||
    currentScreen === 'screen12';

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#20243A] flex flex-col">
      {/* Desktop 3-Zone Top Bar */}
      <header className="hidden md:flex sticky top-0 z-40 h-16 px-8 bg-white/95 backdrop-blur-md border-b border-[#E8EAF1] items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#discover"
          onClick={(e) => {
            e.preventDefault();
            setCurrentScreen('screen04');
          }}
          className="font-display text-lg font-extrabold tracking-tight text-[#20243A] whitespace-nowrap shrink-0"
        >
          UNION HUST
        </a>

        {/* Zone 2: 5 Single-Line Navigation Links */}
        <nav
          aria-label="Điều hướng chính"
          className="flex items-center gap-6 text-sm font-medium"
        >
          <button
            type="button"
            onClick={() => setCurrentScreen('screen04')}
            className={`min-h-[44px] px-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
              currentScreen === 'screen04' ||
              currentScreen === 'screen05' ||
              currentScreen === 'screen06' ||
              currentScreen === 'screen07' ||
              currentScreen === 'screen08'
                ? 'border-[#6C63FF] text-[#6C63FF] font-semibold'
                : 'border-transparent text-[#747B91] hover:text-[#20243A]'
            }`}
          >
            Khám phá
          </button>

          <button
            type="button"
            onClick={() => setCurrentScreen('screen03')}
            className={`min-h-[44px] px-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
              currentScreen === 'screen03'
                ? 'border-[#6C63FF] text-[#6C63FF] font-semibold'
                : 'border-transparent text-[#747B91] hover:text-[#20243A]'
            }`}
          >
            Bảng tin
          </button>

          <button
            type="button"
            onClick={() => {
              setMessagesSubTab('chat');
              setActiveChatUserId(null);
              setCurrentScreen('screen09');
            }}
            className={`min-h-[44px] px-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
              currentScreen === 'screen09'
                ? 'border-[#6C63FF] text-[#6C63FF] font-semibold'
                : 'border-transparent text-[#747B91] hover:text-[#20243A]'
            }`}
          >
            Tin nhắn
          </button>

          <button
            type="button"
            onClick={() => {
              setMessagesSubTab('spaces');
              setIsOneTapSheetOpen(false);
              setCurrentScreen('screen10');
            }}
            className={`min-h-[44px] px-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
              isSpacesView
                ? 'border-[#6C63FF] text-[#6C63FF] font-semibold'
                : 'border-transparent text-[#747B91] hover:text-[#20243A]'
            }`}
          >
            Không gian chung
          </button>

          <button
            type="button"
            onClick={() => setCurrentScreen('screen02')}
            className={`min-h-[44px] px-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
              currentScreen === 'screen02'
                ? 'border-[#6C63FF] text-[#6C63FF] font-semibold'
                : 'border-transparent text-[#747B91] hover:text-[#20243A]'
            }`}
          >
            Hồ sơ
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={handleQuickStartChallenge}
            className="min-h-[40px] px-4 rounded-xl bg-[#6C63FF] text-white text-xs font-semibold hover:bg-[#5B52EE] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>Thử thách 3 phút</span>
          </button>
        </div>
      </header>

      {/* Mobile Compact Header */}
      <header className="md:hidden sticky top-0 z-30 h-13 px-4 bg-white/95 backdrop-blur-md border-b border-[#E8EAF1] flex items-center justify-between gap-3">
        <a
          href="#discover"
          onClick={(e) => {
            e.preventDefault();
            setCurrentScreen('screen04');
          }}
          className="font-display text-base font-extrabold tracking-tight text-[#20243A] whitespace-nowrap shrink-0"
        >
          UNION HUST
        </a>
        <button
          type="button"
          onClick={handleQuickStartChallenge}
          className="min-h-[36px] px-3 rounded-xl bg-[#6C63FF] text-white text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0"
        >
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>Thử thách 3 phút</span>
        </button>
      </header>

      {/* Main Web Content */}
      <main className={`flex-1 ${shouldShowBottomNav ? 'pb-24 md:pb-10' : 'pb-10'}`}>
        {renderScreen()}
      </main>

      {/* Mobile Bottom Navigation */}
      {shouldShowBottomNav && (
        <BottomNav
          activeTab={activeNavTab}
          onSelectTab={handleSelectNavTab}
          unreadChatCount={chatThreads.length}
        />
      )}
    </div>
  );
}
