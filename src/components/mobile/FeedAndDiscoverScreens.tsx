import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Clock,
  MessageCircle,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Search,
  ShieldAlert,
  Sparkles,
  ThumbsUp,
  UserPlus,
  X,
} from 'lucide-react';
import { ALL_INTEREST_TAGS, HUST_SCHOOLS } from '../../data/mockData';
import { FeedPost, StudentProfile } from '../../types/union';
import { filterFeedPosts, getSharedInterests } from '../../utils/unionLogic';
import { SafeImage } from './SafeImage';

interface CommunityFeedScreenProps {
  posts: FeedPost[];
  myProfile: StudentProfile;
  onTogglePostInterest: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onCreatePost: (content: string, tag: string) => void;
  onViewAuthorProfile: (authorId: string) => void;
}

const FEED_FILTERS = ['Tất cả', 'Xem phim', 'Cầu lông', 'Học tiếng Nhật', 'Nhiếp ảnh', 'Âm nhạc', 'Lập trình'];

export const CommunityFeedScreen: React.FC<CommunityFeedScreenProps> = ({
  posts,
  myProfile,
  onTogglePostInterest,
  onAddComment,
  onCreatePost,
  onViewAuthorProfile,
}) => {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('Tất cả');
  const [openCommentsFor, setOpenCommentsFor] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [showComposer, setShowComposer] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState(myProfile.interests[0] || 'Xem phim');

  const filteredPosts = filterFeedPosts(posts, search, selectedTag);

  const submitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    onCreatePost(newContent.trim(), newTag);
    setNewContent('');
    setShowComposer(false);
  };

  const submitComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(postId, commentInput.trim());
    setCommentInput('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Header + Search + Filter */}
      <div className="bg-white rounded-3xl border border-[#E8EAF1] p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#20243A]">
              Bảng tin sinh viên HUST
            </h1>
            <p className="text-xs sm:text-sm text-[#747B91] mt-0.5">
              Tìm bạn Bách khoa cùng xem phim, chơi thể thao, học nhóm hoặc tham gia CLB
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowComposer(true)}
            className="min-h-[44px] px-4 rounded-2xl bg-[#6C63FF] text-white text-sm font-semibold flex items-center gap-1.5 hover:bg-[#5B52EE] transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Đăng bài mới</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center">
          <div className="relative">
            <Search className="w-4 h-4 text-[#747B91] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm hoạt động, sở thích hoặc sinh viên HUST..."
              aria-label="Tìm kiếm bài đăng cộng đồng"
              className="w-full min-h-[44px] pl-10 pr-4 rounded-xl bg-[#F8F9FC] border border-[#E8EAF1] text-sm text-[#20243A] placeholder:text-[#747B91] focus:outline-none focus:border-[#6C63FF]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {FEED_FILTERS.map((tag) => {
              const active = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`min-h-[38px] px-3.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors border ${
                    active
                      ? 'bg-[#20243A] text-white border-[#20243A]'
                      : 'bg-[#F8F9FC] text-[#747B91] border-[#E8EAF1] hover:text-[#20243A]'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feed Grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8EAF1] p-8 text-center">
          <p className="text-sm font-medium text-[#20243A]">
            Chưa có bài viết phù hợp với bộ lọc hiện tại.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedTag('Tất cả');
            }}
            className="mt-3 min-h-[44px] px-4 rounded-xl bg-[#F8F9FC] text-xs font-semibold text-[#6C63FF] border border-[#E8EAF1]"
          >
            Xem tất cả bài đăng
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {filteredPosts.map((post) => {
            const showComments = openCommentsFor === post.id;
            return (
              <article
                key={post.id}
                className="bg-white rounded-3xl border border-[#E8EAF1] p-5 shadow-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onViewAuthorProfile(post.authorId)}
                    className="flex items-center gap-3 text-left min-h-[44px] group focus-visible:outline-2 focus-visible:outline-[#6C63FF] rounded-xl"
                  >
                    <SafeImage
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-11 h-11 rounded-full object-cover shrink-0 border border-[#E8EAF1]"
                      fallbackLabel={post.authorName}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#20243A] group-hover:text-[#6C63FF] transition-colors truncate">
                        {post.authorName}
                      </p>
                      <p className="text-xs text-[#747B91] truncate">
                        {post.authorMeta} · {post.timeAgo}
                      </p>
                    </div>
                  </button>
                  <span className="text-xs font-semibold text-[#6C63FF] shrink-0">
                    #{post.tag}
                  </span>
                </div>

                <p className="mt-3.5 text-sm text-[#20243A] leading-relaxed">
                  {post.content}
                </p>

                <div className="mt-4 pt-3 border-t border-[#E8EAF1] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onTogglePostInterest(post.id)}
                      className={`min-h-[44px] px-3 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors ${
                        post.interestedByMe
                          ? 'bg-[#6C63FF]/10 text-[#6C63FF]'
                          : 'text-[#747B91] hover:bg-[#F8F9FC] hover:text-[#20243A]'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="tabular-nums">
                        Quan tâm ({post.interestCount})
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setOpenCommentsFor(showComments ? null : post.id)
                      }
                      className="min-h-[44px] px-3 rounded-xl text-xs font-medium text-[#747B91] hover:bg-[#F8F9FC] hover:text-[#20243A] flex items-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="tabular-nums">
                        Bình luận ({post.comments.length})
                      </span>
                    </button>
                  </div>

                  {post.authorId !== 'me' && (
                    <button
                      type="button"
                      onClick={() => onViewAuthorProfile(post.authorId)}
                      className="min-h-[44px] px-3 rounded-xl text-xs font-semibold text-[#6C63FF] hover:bg-[#6C63FF]/8 transition-colors"
                    >
                      Xem hồ sơ
                    </button>
                  )}
                </div>

                {showComments && (
                  <div className="mt-3 pt-3 border-t border-[#E8EAF1] space-y-2.5">
                    {post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-[#F8F9FC] rounded-2xl px-3.5 py-2.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#20243A]">
                            {comment.authorName}
                          </span>
                          <span className="text-[#747B91]">{comment.timeAgo}</span>
                        </div>
                        <p className="mt-1 text-xs text-[#20243A] leading-relaxed">
                          {comment.text}
                        </p>
                      </div>
                    ))}
                    <form
                      onSubmit={(e) => submitComment(post.id, e)}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Viết phản hồi nhẹ nhàng..."
                        className="flex-1 min-h-[44px] px-3.5 rounded-xl bg-[#F8F9FC] border border-[#E8EAF1] text-xs focus:outline-none focus:border-[#6C63FF]"
                      />
                      <button
                        type="submit"
                        className="min-h-[44px] px-3.5 rounded-xl bg-[#6C63FF] text-white text-xs font-semibold"
                      >
                        Gửi
                      </button>
                    </form>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* New Post Modal / Bottom Sheet */}
      {showComposer && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tạo bài viết tìm bạn HUST mới"
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-end md:items-center md:justify-center md:p-4"
        >
          <form
            onSubmit={submitPost}
            className="w-full md:max-w-lg bg-white rounded-t-3xl md:rounded-3xl p-5 space-y-4 shadow-xl"
          >
            <div className="md:hidden w-10 h-1.5 bg-[#E8EAF1] rounded-full mx-auto" />
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-[#20243A]">
                Đăng lời rủ sinh viên HUST
              </h2>
              <button
                type="button"
                onClick={() => setShowComposer(false)}
                aria-label="Đóng khung đăng bài"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#747B91]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#747B91] mb-1.5">
                Chủ đề sở thích
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_INTEREST_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setNewTag(tag)}
                    className={`min-h-[36px] px-3 rounded-xl text-xs font-medium border ${
                      newTag === tag
                        ? 'bg-[#6C63FF] text-white border-[#6C63FF]'
                        : 'bg-[#F8F9FC] text-[#20243A] border-[#E8EAF1]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#747B91] mb-1.5">
                Nội dung lời rủ
              </label>
              <textarea
                rows={3}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Ví dụ: Thứ Bảy có bạn HUST nào muốn ngồi học bài ở tầng 3 Tạ Quang Bửu không?"
                className="w-full p-3.5 rounded-2xl border border-[#E8EAF1] text-sm focus:outline-none focus:border-[#6C63FF]"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full min-h-[48px] rounded-2xl bg-[#6C63FF] text-white font-semibold text-sm hover:bg-[#5B52EE]"
            >
              Đăng lên bảng tin HUST
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

interface DiscoverFriendsScreenProps {
  profiles: StudentProfile[];
  myInterests: string[];
  currentIndex: number;
  selectedSchool: string;
  onSelectSchool: (school: string) => void;
  invitedUserIds: string[];
  connectedUserIds: string[];
  onSkip: () => void;
  onResetDeck: () => void;
  onViewProfile: (profile: StudentProfile) => void;
  onSendConnectInvite: (profile: StudentProfile) => void;
  onStartChallenge: (profile: StudentProfile) => void;
}

export const DiscoverFriendsScreen: React.FC<DiscoverFriendsScreenProps> = ({
  profiles,
  myInterests,
  currentIndex,
  selectedSchool,
  onSelectSchool,
  invitedUserIds,
  connectedUserIds,
  onSkip,
  onResetDeck,
  onViewProfile,
  onSendConnectInvite,
  onStartChallenge,
}) => {
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  const profile = profiles[currentIndex];

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragStartX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartX === null) return;
    setDragOffsetX(e.clientX - dragStartX);
  };

  const handlePointerEnd = () => {
    if (dragStartX === null) return;
    if (dragOffsetX < -85) {
      onSkip();
    } else if (dragOffsetX > 85 && profile) {
      onSendConnectInvite(profile);
    }
    setDragStartX(null);
    setDragOffsetX(0);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-[#20243A]">
            Khám phá bạn bè HUST
          </h1>
          <p className="text-xs sm:text-sm text-[#747B91] mt-0.5">
            Gợi ý sinh viên Đại học Bách khoa Hà Nội có chung sở thích với bạn
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <select
            aria-label="Lọc theo Trường hoặc Khoa tại HUST"
            value={selectedSchool}
            onChange={(e) => onSelectSchool(e.target.value)}
            className="min-h-[40px] max-w-[230px] px-3 rounded-xl bg-white border border-[#E8EAF1] text-xs font-medium text-[#20243A] focus:outline-none focus:border-[#6C63FF]"
          >
            <option value="Tất cả HUST">Tất cả trường/khoa HUST</option>
            {HUST_SCHOOLS.map((school) => (
              <option key={school} value={school}>
                {school}
              </option>
            ))}
          </select>
          <span className="text-xs font-semibold text-[#747B91] tabular-nums whitespace-nowrap">
            {profile ? `Hồ sơ ${currentIndex + 1}/${profiles.length}` : 'Hết gợi ý'}
          </span>
        </div>
      </div>

      {!profile ? (
        <div className="bg-white rounded-3xl border border-[#E8EAF1] p-8 text-center shadow-xs">
          <h2 className="font-display text-lg font-bold text-[#20243A]">
            {profiles.length === 0
              ? 'Chưa có gợi ý nào thuộc đơn vị đào tạo này'
              : 'Bạn đã xem hết gợi ý sinh viên HUST hiện tại'}
          </h2>
          <p className="mt-2 text-sm text-[#747B91] leading-relaxed max-w-md mx-auto">
            {profiles.length === 0
              ? 'Bạn có thể chuyển sang xem tất cả trường/khoa trong Đại học Bách khoa Hà Nội.'
              : 'Bạn có thể xem lại danh sách hoặc ghé Bảng tin HUST để tham gia các hoạt động cuối tuần.'}
          </p>
          <button
            type="button"
            onClick={() => {
              if (profiles.length === 0) {
                onSelectSchool('Tất cả HUST');
              } else {
                onResetDeck();
              }
            }}
            className="mt-5 min-h-[48px] px-5 rounded-2xl bg-[#6C63FF] text-white text-sm font-semibold inline-flex items-center gap-2 hover:bg-[#5B52EE]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>
              {profiles.length === 0 ? 'Xem tất cả sinh viên HUST' : 'Xem lại gợi ý'}
            </span>
          </button>
        </div>
      ) : (
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          style={{
            transform: `translateX(${dragOffsetX}px) rotate(${dragOffsetX * 0.02}deg)`,
          }}
          className="bg-white rounded-3xl border border-[#E8EAF1] shadow-sm overflow-hidden transition-transform duration-150 select-none touch-pan-y grid grid-cols-1 md:grid-cols-[360px_1fr]"
        >
          {/* Portrait */}
          <div className="relative h-60 sm:h-72 md:h-[440px] bg-[#EEF0F7]">
            <SafeImage
              src={profile.avatar}
              alt={`Ảnh đại diện của ${profile.name}`}
              className="w-full h-full object-cover"
              fallbackLabel={profile.name}
            />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
            <div className="absolute inset-x-5 bottom-5 text-white">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-display text-2xl font-bold">{profile.name}</h2>
                <span className="text-xs font-medium text-white/90">{profile.year}</span>
              </div>
              <p className="mt-1 text-xs text-white/90">{profile.university}</p>
              <p className="text-xs text-white/80 mt-0.5">{profile.faculty}</p>
            </div>
          </div>

          {/* Info + Actions */}
          {(() => {
            const shared = getSharedInterests(myInterests, profile.interests);
            const isInvited = invitedUserIds.includes(profile.id);
            const isConnected = connectedUserIds.includes(profile.id);
            return (
              <div className="p-5 sm:p-6 flex flex-col justify-between gap-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#6C63FF]">
                      {shared.length > 0
                        ? `Bạn và ${profile.name} có ${shared.length} sở thích chung`
                        : 'Gợi ý kết bạn cùng trường HUST'}
                    </p>
                    {isConnected ? (
                      <span className="text-xs font-semibold text-[#23B88A]">
                        Đã kết nối
                      </span>
                    ) : isInvited ? (
                      <span className="text-xs font-semibold text-[#747B91]">
                        Đã gửi lời mời
                      </span>
                    ) : null}
                  </div>

                  <p className="text-sm text-[#20243A] leading-relaxed">
                    {profile.bio}
                  </p>

                  <div>
                    <h3 className="text-xs font-semibold text-[#747B91] mb-2">
                      Sở thích ({profile.interests.length})
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.interests.map((tag) => {
                        const isShared = shared.includes(tag);
                        return (
                          <span
                            key={tag}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                              isShared
                                ? 'bg-[#6C63FF]/12 text-[#6C63FF] font-semibold'
                                : 'bg-[#F8F9FC] text-[#747B91] border border-[#E8EAF1]'
                            }`}
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-[#E8EAF1]">
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={onSkip}
                      className="min-h-[48px] rounded-2xl bg-[#F8F9FC] border border-[#E8EAF1] text-[#747B91] text-xs font-semibold hover:bg-white hover:text-[#20243A] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Bỏ qua</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onViewProfile(profile)}
                      className="min-h-[48px] rounded-2xl bg-[#F8F9FC] border border-[#E8EAF1] text-[#20243A] text-xs font-semibold hover:bg-white flex items-center justify-center transition-colors"
                    >
                      Xem hồ sơ
                    </button>

                    <button
                      type="button"
                      onClick={() => onSendConnectInvite(profile)}
                      disabled={isInvited || isConnected}
                      className={`min-h-[48px] rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        isConnected
                          ? 'bg-[#23B88A]/12 text-[#168A65] border border-[#23B88A]/30'
                          : isInvited
                            ? 'bg-[#F8F9FC] text-[#747B91] border border-[#E8EAF1]'
                            : 'bg-[#FF6B81] text-white hover:bg-[#F05A71]'
                      }`}
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>
                        {isConnected ? 'Bạn bè' : isInvited ? 'Đã mời' : 'Kết nối'}
                      </span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onStartChallenge(profile)}
                    className="w-full min-h-[50px] rounded-2xl bg-[#6C63FF] text-white text-sm font-semibold hover:bg-[#5B52EE] shadow-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Thử thách 3 phút · Mở lời tự nhiên</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

interface OtherUserProfileScreenProps {
  profile: StudentProfile;
  myInterests: string[];
  isInvited: boolean;
  isConnected: boolean;
  onBack: () => void;
  onSendConnectInvite: () => void;
  onSimulatePartnerAccept: () => void;
  onOpenChat: () => void;
  onStartChallenge: () => void;
  onBlockUser: () => void;
}

export const OtherUserProfileScreen: React.FC<OtherUserProfileScreenProps> = ({
  profile,
  myInterests,
  isInvited,
  isConnected,
  onBack,
  onSendConnectInvite,
  onSimulatePartnerAccept,
  onOpenChat,
  onStartChallenge,
  onBlockUser,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const shared = getSharedInterests(myInterests, profile.interests);
  const otherInterests = profile.interests.filter((t) => !shared.includes(t));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] px-3 rounded-xl text-sm font-semibold text-[#20243A] hover:bg-white border border-transparent hover:border-[#E8EAF1] flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Tùy chọn quyền riêng tư"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#747B91] hover:bg-white border border-transparent hover:border-[#E8EAF1]"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-12 z-30 w-56 bg-white rounded-2xl border border-[#E8EAF1] shadow-lg p-1.5">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onBlockUser();
                }}
                className="w-full min-h-[44px] px-3 rounded-xl text-left text-xs font-medium text-[#FF6B81] hover:bg-[#FF6B81]/8 flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Ẩn hồ sơ & Chặn người này</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden border border-[#E8EAF1] shadow-xs grid grid-cols-1 md:grid-cols-[320px_1fr]">
        <div className="relative h-72 md:h-full min-h-[300px] bg-[#EEF0F7]">
          <SafeImage
            src={profile.avatar}
            alt={profile.name}
            className="w-full h-full object-cover"
            fallbackLabel={profile.name}
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
          <div className="absolute inset-x-5 bottom-5 text-white">
            <h1 className="font-display text-2xl font-bold">{profile.name}</h1>
            <p className="text-xs text-white/90 mt-1">{profile.year}</p>
            <p className="text-xs text-white/85 mt-0.5">
              {profile.university} · {profile.faculty}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-2xl bg-[#6C63FF]/8 p-4">
            <p className="text-xs font-semibold text-[#6C63FF]">
              Lý do gợi ý kết nối trong HUST
            </p>
            <p className="mt-1 text-xs text-[#20243A] leading-relaxed">
              {profile.matchReason}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold text-[#747B91]">
              Giới thiệu bản thân
            </h2>
            <p className="mt-1 text-sm text-[#20243A] leading-relaxed">
              {profile.bio}
            </p>
          </div>

          <div className="border-t border-[#E8EAF1] pt-3.5">
            <h2 className="text-xs font-semibold text-[#747B91]">
              Sở thích chung ({shared.length}) · Tổng {profile.interests.length} sở thích
            </h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {shared.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-[#6C63FF]/12 text-[#6C63FF] text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
              {otherInterests.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-[#F8F9FC] text-[#747B91] border border-[#E8EAF1] text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-[#E8EAF1] pt-3.5">
            <h2 className="text-xs font-semibold text-[#747B91]">
              Mục đích tìm bạn
            </h2>
            <ul className="mt-2 space-y-1.5">
              {profile.purposes.map((p) => (
                <li key={p} className="text-xs text-[#20243A] flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#23B88A]" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {isInvited && !isConnected && (
            <div className="rounded-2xl bg-[#F8F9FC] border border-[#E8EAF1] p-3.5 space-y-2">
              <p className="text-xs text-[#747B91] leading-relaxed">
                Đã gửi lời mời kết nối. Hai người chỉ mở trò chuyện khi {profile.name} cũng đồng ý.
              </p>
              <button
                type="button"
                onClick={onSimulatePartnerAccept}
                className="min-h-[40px] px-3 rounded-xl bg-white border border-[#E8EAF1] text-xs font-semibold text-[#6C63FF] hover:bg-[#6C63FF]/6"
              >
                Mô phỏng {profile.name} đồng ý kết nối (Demo)
              </button>
            </div>
          )}

          <div className="pt-3 border-t border-[#E8EAF1] grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {isConnected ? (
              <button
                type="button"
                onClick={onOpenChat}
                className="min-h-[48px] rounded-2xl bg-[#23B88A] text-white text-sm font-semibold hover:bg-[#1FA37A] flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Nhắn tin</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onSendConnectInvite}
                disabled={isInvited}
                className={`min-h-[48px] rounded-2xl text-sm font-semibold flex items-center justify-center gap-1.5 ${
                  isInvited
                    ? 'bg-[#F8F9FC] text-[#747B91] border border-[#E8EAF1]'
                    : 'bg-[#FF6B81] text-white hover:bg-[#F05A71]'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>{isInvited ? 'Đã mời kết nối' : 'Mời kết nối'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onStartChallenge}
              className="min-h-[48px] rounded-2xl bg-[#6C63FF] text-white text-sm font-semibold hover:bg-[#5B52EE] flex items-center justify-center gap-1.5"
            >
              <Clock className="w-4 h-4" />
              <span>Thử thách 3 phút</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
