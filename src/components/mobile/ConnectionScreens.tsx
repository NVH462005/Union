import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  KeyRound,
  LogOut,
  Plus,
  Send,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import {
  LIGHT_REACTION_LABELS,
  QUICK_UPDATE_OPTIONS,
} from '../../data/mockData';
import {
  ChatThread,
  MessagesSubTab,
  QuickUpdateTemplate,
  ReactionLabel,
  SharedSpace,
  StudentProfile,
} from '../../types/union';
import { SafeImage } from './SafeImage';

interface MessagesAndSpacesHeaderProps {
  subTab: MessagesSubTab;
  onSelectSubTab: (tab: MessagesSubTab) => void;
  spaceCount: number;
  chatCount: number;
}

const MobileSubTabs: React.FC<MessagesAndSpacesHeaderProps> = ({
  subTab,
  onSelectSubTab,
  spaceCount,
  chatCount,
}) => (
  <div
    role="tablist"
    aria-label="Chuyển giữa tin nhắn và không gian chung"
    className="md:hidden grid grid-cols-2 gap-1 p-1 rounded-2xl bg-white border border-[#E8EAF1] mb-4"
  >
    <button
      type="button"
      role="tab"
      aria-selected={subTab === 'chat'}
      onClick={() => onSelectSubTab('chat')}
      className={`min-h-[40px] rounded-xl text-xs font-semibold transition-all tabular-nums ${
        subTab === 'chat'
          ? 'bg-[#6C63FF] text-white'
          : 'text-[#747B91] hover:text-[#20243A]'
      }`}
    >
      Tin nhắn ({chatCount})
    </button>
    <button
      type="button"
      role="tab"
      aria-selected={subTab === 'spaces'}
      onClick={() => onSelectSubTab('spaces')}
      className={`min-h-[40px] rounded-xl text-xs font-semibold transition-all tabular-nums ${
        subTab === 'spaces'
          ? 'bg-[#6C63FF] text-white'
          : 'text-[#747B91] hover:text-[#20243A]'
      }`}
    >
      Không gian chung ({spaceCount})
    </button>
  </div>
);

interface MessagesScreenProps {
  subTab: MessagesSubTab;
  onSelectSubTab: (tab: MessagesSubTab) => void;
  threads: ChatThread[];
  profilesById: Record<string, StudentProfile>;
  activeChatUserId: string | null;
  onSelectChatUser: (userId: string | null) => void;
  onSendMessage: (userId: string, text: string) => void;
  spaceCount: number;
}

export const MessagesScreen: React.FC<MessagesScreenProps> = ({
  subTab,
  onSelectSubTab,
  threads,
  profilesById,
  activeChatUserId,
  onSelectChatUser,
  onSendMessage,
  spaceCount,
}) => {
  const [draft, setDraft] = useState('');

  // On desktop split-pane, auto-select first thread if none selected
  const effectiveActiveUserId = activeChatUserId || threads[0]?.userId || null;
  const activeThread = threads.find((t) => t.userId === effectiveActiveUserId);
  const activePartner = effectiveActiveUserId
    ? profilesById[effectiveActiveUserId]
    : null;

  const showMobileThreadOnly = Boolean(activeChatUserId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <MobileSubTabs
        subTab={subTab}
        onSelectSubTab={onSelectSubTab}
        spaceCount={spaceCount}
        chatCount={threads.length}
      />

      <div className="mb-4 hidden md:block">
        <h1 className="font-display text-2xl font-bold text-[#20243A]">
          Tin nhắn kết nối hai chiều
        </h1>
        <p className="text-sm text-[#747B91] mt-0.5">
          Chỉ những sinh viên HUST đã đồng thuận hai chiều mới có thể trò chuyện riêng tại đây.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8EAF1] shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-[300px_1fr] h-[calc(100dvh-12rem)] md:h-[calc(100dvh-12.5rem)] min-h-[460px]">
        {/* Left: Connected friends list */}
        <div
          className={`border-r border-[#E8EAF1] p-3 space-y-2 overflow-y-auto ${
            showMobileThreadOnly ? 'hidden md:block' : 'block'
          }`}
        >
          <p className="px-2 pt-1 text-xs font-semibold text-[#747B91]">
            Bạn bè đã kết nối ({threads.length})
          </p>
          {threads.map((thread) => {
            const person = profilesById[thread.userId];
            if (!person) return null;
            const lastMsg = thread.messages[thread.messages.length - 1];
            const isSelected = effectiveActiveUserId === thread.userId;
            return (
              <button
                key={thread.userId}
                type="button"
                onClick={() => onSelectChatUser(thread.userId)}
                className={`w-full min-h-[68px] rounded-2xl p-3 flex items-center gap-3 text-left transition-colors ${
                  isSelected
                    ? 'bg-[#6C63FF]/8 border border-[#6C63FF]/30'
                    : 'hover:bg-[#F8F9FC] border border-transparent'
                }`}
              >
                <SafeImage
                  src={person.avatar}
                  alt={person.name}
                  className="w-11 h-11 rounded-full object-cover border border-[#E8EAF1] shrink-0"
                  fallbackLabel={person.name}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-[#20243A] truncate">
                      {person.name}
                    </span>
                    <span className="text-[11px] text-[#747B91] tabular-nums shrink-0">
                      {lastMsg ? lastMsg.time : 'Mới'}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#747B91] truncate">
                    {lastMsg
                      ? lastMsg.text
                      : `Gợi ý: ${thread.icebreaker}`}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Active Chat Conversation */}
        <div
          className={`flex flex-col min-h-0 ${
            showMobileThreadOnly ? 'flex' : 'hidden md:flex'
          }`}
        >
          {activeThread && activePartner ? (
            <>
              <header className="shrink-0 h-16 px-4 bg-white border-b border-[#E8EAF1] flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onSelectChatUser(null)}
                  aria-label="Quay lại danh sách tin nhắn"
                  className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#20243A] hover:bg-[#F8F9FC]"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <SafeImage
                  src={activePartner.avatar}
                  alt={activePartner.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#E8EAF1]"
                  fallbackLabel={activePartner.name}
                />
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-bold text-[#20243A] truncate">
                    {activePartner.name}
                  </h2>
                  <p className="text-xs text-[#747B91] truncate">
                    {activePartner.year} · {activePartner.faculty}
                  </p>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#F8F9FC]/60">
                {activeThread.messages.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-[#E8EAF1] p-6 text-center max-w-md mx-auto my-8">
                    <p className="text-sm font-semibold text-[#20243A]">
                      Hai bạn vừa kết nối thành công!
                    </p>
                    <p className="mt-1 text-xs text-[#747B91]">
                      Bạn có thể dùng gợi ý mở lời bên dưới để tiếp tục trò chuyện tự nhiên.
                    </p>
                  </div>
                ) : (
                  activeThread.messages.map((msg) => {
                    const isMe = msg.sender === 'me';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            isMe
                              ? 'bg-[#6C63FF] text-white rounded-br-sm'
                              : 'bg-white border border-[#E8EAF1] text-[#20243A] rounded-bl-sm'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="mt-1 text-[11px] text-[#747B91] tabular-nums">
                          {msg.time}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="shrink-0 bg-white border-t border-[#E8EAF1] p-4 space-y-2.5">
                <button
                  type="button"
                  onClick={() => setDraft(activeThread.icebreaker)}
                  className="w-full min-h-[40px] px-3.5 py-2 rounded-2xl bg-[#6C63FF]/8 text-left text-xs text-[#6C63FF] font-medium flex items-center gap-2 hover:bg-[#6C63FF]/12 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    Gợi ý mở lời: &ldquo;{activeThread.icebreaker}&rdquo;
                  </span>
                </button>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!draft.trim()) return;
                    onSendMessage(activeThread.userId, draft.trim());
                    setDraft('');
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Nhắn tin cho bạn HUST..."
                    aria-label="Nhập nội dung tin nhắn"
                    className="flex-1 min-h-[44px] px-4 rounded-xl bg-[#F8F9FC] border border-[#E8EAF1] text-sm focus:outline-none focus:border-[#6C63FF]"
                  />
                  <button
                    type="submit"
                    aria-label="Gửi tin nhắn"
                    className="min-w-[44px] min-h-[44px] px-4 rounded-xl bg-[#6C63FF] text-white flex items-center justify-center hover:bg-[#5B52EE]"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="m-auto p-6 text-center text-sm text-[#747B91]">
              Chọn một người bạn để bắt đầu trò chuyện.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface SharedConnectionsScreenProps {
  subTab: MessagesSubTab;
  onSelectSubTab: (tab: MessagesSubTab) => void;
  spaces: SharedSpace[];
  chatCount: number;
  onOpenSpace: (spaceId: string) => void;
  onCreateSpace: (name: string, originEvent: string, description: string) => void;
  onJoinSpaceByCode: (code: string) => boolean;
}

export const SharedConnectionsScreen: React.FC<SharedConnectionsScreenProps> = ({
  subTab,
  onSelectSubTab,
  spaces,
  chatCount,
  onOpenSpace,
  onCreateSpace,
  onJoinSpaceByCode,
}) => {
  const [modalMode, setModalMode] = useState<'create' | 'join' | null>(null);
  const [spaceName, setSpaceName] = useState('');
  const [originEvent, setOriginEvent] = useState('');
  const [description, setDescription] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [joinFeedback, setJoinFeedback] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spaceName.trim() || !originEvent.trim()) return;
    onCreateSpace(
      spaceName.trim(),
      originEvent.trim(),
      description.trim() || 'Không gian giữ kết nối nhẹ nhàng sau hoạt động chung tại HUST.'
    );
    setSpaceName('');
    setOriginEvent('');
    setDescription('');
    setModalMode(null);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    const found = onJoinSpaceByCode(inviteCode.trim());
    if (!found) {
      setJoinFeedback('Không tìm thấy mã mời này. Bạn thử mã PHOTO24 hoặc CLB2026 nhé.');
      return;
    }
    setInviteCode('');
    setJoinFeedback(null);
    setModalMode(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      <MobileSubTabs
        subTab={subTab}
        onSelectSubTab={onSelectSubTab}
        spaceCount={spaces.length}
        chatCount={chatCount}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-[#20243A]">
            Không gian kết nối chung (Quiet Connection)
          </h1>
          <p className="text-xs sm:text-sm text-[#747B91] mt-0.5">
            Duy trì cảm giác gắn bó sau sự kiện HUST bằng cập nhật nhẹ nhàng, không áp lực nhắn tin liên tục.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setModalMode('create')}
            className="min-h-[44px] px-4 rounded-2xl bg-[#6C63FF] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 hover:bg-[#5B52EE]"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo không gian</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setJoinFeedback(null);
              setModalMode('join');
            }}
            className="min-h-[44px] px-4 rounded-2xl bg-white border border-[#E8EAF1] text-[#20243A] text-xs sm:text-sm font-semibold flex items-center gap-1.5 hover:border-[#6C63FF]"
          >
            <KeyRound className="w-4 h-4 text-[#6C63FF]" />
            <span>Nhập mã mời</span>
          </button>
        </div>
      </div>

      {/* Spaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {spaces.map((space) => {
          const latest = space.moments[0];
          return (
            <button
              key={space.id}
              type="button"
              onClick={() => onOpenSpace(space.id)}
              className="w-full bg-white rounded-3xl border border-[#E8EAF1] p-5 text-left hover:border-[#6C63FF]/50 transition-colors shadow-xs space-y-3"
            >
              <div className="flex items-center gap-3.5">
                <SafeImage
                  src={space.coverAvatar}
                  alt={space.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-[#E8EAF1] shrink-0"
                  fallbackLabel={space.name}
                />
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-base font-bold text-[#20243A] truncate">
                    {space.name}
                  </h2>
                  <p className="text-xs text-[#747B91] truncate mt-0.5">
                    {space.originEvent} · {space.memberCount} thành viên HUST
                  </p>
                </div>
              </div>

              {latest && (
                <div className="rounded-2xl bg-[#F8F9FC] px-4 py-3">
                  <p className="text-xs text-[#20243A] truncate">
                    <span className="font-semibold">{latest.authorName}:</span>{' '}
                    &ldquo;{latest.statusTitle}&rdquo;
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#747B91]">
                    Cập nhật {latest.timeAgo}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Create / Join Modal */}
      {modalMode && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={
            modalMode === 'create'
              ? 'Tạo không gian kết nối chung'
              : 'Tham gia không gian bằng mã mời'
          }
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-end md:items-center md:justify-center md:p-4"
        >
          <div className="w-full md:max-w-lg bg-white rounded-t-3xl md:rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="md:hidden w-10 h-1.5 bg-[#E8EAF1] rounded-full mx-auto" />
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-[#20243A]">
                {modalMode === 'create'
                  ? 'Tạo không gian sau sự kiện HUST'
                  : 'Tham gia bằng mã mời'}
              </h2>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                aria-label="Đóng hộp thoại"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#747B91]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalMode === 'create' ? (
              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#747B91] mb-1">
                    Tên không gian
                  </label>
                  <input
                    type="text"
                    value={spaceName}
                    onChange={(e) => setSpaceName(e.target.value)}
                    placeholder="Ví dụ: Nhóm CLB Cầu lông Bách khoa"
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E8EAF1] text-sm focus:outline-none focus:border-[#6C63FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#747B91] mb-1">
                    Sự kiện hoặc hoạt động gốc
                  </label>
                  <input
                    type="text"
                    value={originEvent}
                    onChange={(e) => setOriginEvent(e.target.value)}
                    placeholder="Ví dụ: Giao lưu cầu lông liên viện HUST"
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E8EAF1] text-sm focus:outline-none focus:border-[#6C63FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#747B91] mb-1">
                    Lời giới thiệu nhẹ nhàng
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Chia sẻ khoảnh khắc khi rảnh, không áp lực"
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E8EAF1] text-sm focus:outline-none focus:border-[#6C63FF]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full min-h-[48px] rounded-2xl bg-[#6C63FF] text-white font-semibold text-sm hover:bg-[#5B52EE]"
                >
                  Tạo không gian riêng
                </button>
              </form>
            ) : (
              <form onSubmit={handleJoin} className="space-y-3">
                <p className="text-xs text-[#747B91] leading-relaxed">
                  Chỉ sinh viên HUST từng tham gia sự kiện có mã mời mới có thể tham gia. Thử mã mẫu: <strong className="text-[#20243A]">CLB2026</strong>.
                </p>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="Nhập mã mời (ví dụ: CLB2026)"
                  aria-label="Mã mời không gian chung"
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E8EAF1] text-sm font-mono uppercase focus:outline-none focus:border-[#6C63FF]"
                  required
                />
                {joinFeedback && (
                  <p className="text-xs text-[#FF6B81] font-medium">{joinFeedback}</p>
                )}
                <button
                  type="submit"
                  className="w-full min-h-[48px] rounded-2xl bg-[#6C63FF] text-white font-semibold text-sm hover:bg-[#5B52EE]"
                >
                  Tham gia không gian
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface QuietConnectionSpaceScreenProps {
  space: SharedSpace;
  isOneTapSheetOpen: boolean;
  onOpenOneTapSheet: () => void;
  onCloseOneTapSheet: () => void;
  onPostMoment: (statusTitle: QuickUpdateTemplate, note?: string) => void;
  onToggleReaction: (momentId: string, label: ReactionLabel) => void;
  onBack: () => void;
  onLeaveSpace: () => void;
}

export const QuietConnectionSpaceScreen: React.FC<QuietConnectionSpaceScreenProps> = ({
  space,
  isOneTapSheetOpen,
  onOpenOneTapSheet,
  onCloseOneTapSheet,
  onPostMoment,
  onToggleReaction,
  onBack,
  onLeaveSpace,
}) => {
  const [showMembers, setShowMembers] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<QuickUpdateTemplate>(
    'Hôm nay mình vui'
  );
  const [customNote, setCustomNote] = useState('');

  const handleConfirmMoment = (e: React.FormEvent) => {
    e.preventDefault();
    onPostMoment(selectedTemplate, customNote.trim() || undefined);
    setCustomNote('');
    onCloseOneTapSheet();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] px-3 rounded-xl text-sm font-semibold text-[#20243A] hover:bg-white border border-transparent hover:border-[#E8EAF1] flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Không gian chung</span>
        </button>

        <button
          type="button"
          onClick={() => setShowMembers(true)}
          className="min-h-[44px] px-3.5 rounded-xl bg-white border border-[#E8EAF1] text-xs font-semibold text-[#6C63FF] hover:border-[#6C63FF] flex items-center gap-2"
        >
          <Users className="w-4 h-4" />
          <span>Thành viên ({space.memberCount})</span>
        </button>
      </div>

      {/* Intro + One-Tap Trigger */}
      <div className="bg-white rounded-3xl border border-[#E8EAF1] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-xl font-bold text-[#20243A]">
            {space.name}
          </h1>
          <p className="text-xs text-[#747B91]">
            {space.originEvent} · Mã mời <span className="font-mono font-semibold text-[#20243A]">{space.inviteCode}</span>
          </p>
          <p className="text-sm text-[#747B91] leading-relaxed pt-1">
            {space.description}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenOneTapSheet}
          className="min-h-[48px] px-5 rounded-2xl bg-[#6C63FF] text-white text-sm font-semibold hover:bg-[#5B52EE] flex items-center justify-center gap-2 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cập nhật khoảnh khắc một chạm</span>
        </button>
      </div>

      {/* Moments Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {space.moments.map((moment) => (
          <article
            key={moment.id}
            className="bg-white rounded-3xl border border-[#E8EAF1] p-5 shadow-xs space-y-3"
          >
            <div className="flex items-center gap-3">
              <SafeImage
                src={moment.authorAvatar}
                alt={moment.authorName}
                className="w-10 h-10 rounded-full object-cover border border-[#E8EAF1] shrink-0"
                fallbackLabel={moment.authorName}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#20243A] truncate">
                  {moment.authorName}
                </p>
                <p className="text-xs text-[#747B91]">{moment.timeAgo}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#F8F9FC] px-4 py-3">
              <p className="text-sm font-semibold text-[#20243A]">
                {moment.statusTitle}
              </p>
              {moment.note && (
                <p className="mt-1 text-xs text-[#747B91] leading-relaxed">
                  {moment.note}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {LIGHT_REACTION_LABELS.map((label) => {
                const reaction = moment.reactions.find(
                  (r) => r.label === label
                ) || { label, count: 0, reactedByMe: false };
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => onToggleReaction(moment.id, label)}
                    aria-pressed={reaction.reactedByMe}
                    className={`min-h-[38px] px-3 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                      reaction.reactedByMe
                        ? 'bg-[#6C63FF]/12 text-[#6C63FF] border-[#6C63FF]/40 font-semibold'
                        : 'bg-white text-[#747B91] border-[#E8EAF1] hover:text-[#20243A]'
                    }`}
                  >
                    <span>{label}</span>
                    {reaction.count > 0 && (
                      <span className="tabular-nums text-[11px]">
                        {reaction.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </div>

      {/* Screen 12 – One-Tap Update Modal / Bottom Sheet */}
      {isOneTapSheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Cập nhật khoảnh khắc một chạm"
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-end md:items-center md:justify-center md:p-4"
        >
          <form
            onSubmit={handleConfirmMoment}
            className="w-full md:max-w-lg max-h-[88dvh] bg-white rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden shadow-xl"
          >
            <div className="md:hidden w-10 h-1.5 bg-[#E8EAF1] rounded-full mx-auto mt-3" />
            <div className="px-5 py-3.5 border-b border-[#E8EAF1] flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-bold text-[#20243A]">
                  Cập nhật nhanh bằng một chạm
                </h2>
                <p className="text-xs text-[#747B91]">
                  Không cần viết dài · Chỉ chia sẻ khi bạn thấy thoải mái
                </p>
              </div>
              <button
                type="button"
                onClick={onCloseOneTapSheet}
                aria-label="Đóng bảng cập nhật khoảnh khắc"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#747B91]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              <div className="grid grid-cols-1 gap-2">
                {QUICK_UPDATE_OPTIONS.map((option) => {
                  const selected = selectedTemplate === option.title;
                  return (
                    <button
                      key={option.title}
                      type="button"
                      onClick={() => setSelectedTemplate(option.title)}
                      aria-pressed={selected}
                      className={`min-h-[54px] px-4 py-2.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-colors ${
                        selected
                          ? 'bg-[#6C63FF]/8 border-[#6C63FF]'
                          : 'bg-[#F8F9FC] border-[#E8EAF1] hover:border-[#6C63FF]/40'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#20243A]">
                          {option.title}
                        </p>
                        <p className="text-xs text-[#747B91]">
                          {option.subtitle}
                        </p>
                      </div>
                      {selected && (
                        <Check className="w-5 h-5 text-[#6C63FF] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-1">
                <label className="block text-xs font-semibold text-[#747B91] mb-1">
                  Ghi chú thêm (không bắt buộc)
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Thêm một câu ngắn nếu bạn muốn..."
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E8EAF1] text-sm focus:outline-none focus:border-[#6C63FF]"
                />
              </div>
            </div>

            <div className="p-4 border-t border-[#E8EAF1] bg-white">
              <button
                type="submit"
                className="w-full min-h-[48px] rounded-2xl bg-[#6C63FF] text-white font-semibold text-sm hover:bg-[#5B52EE]"
              >
                Chia sẻ vào không gian chung
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Members & Leave Space Modal */}
      {showMembers && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Thành viên không gian chung"
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-end md:items-center md:justify-center md:p-4"
        >
          <div className="w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="md:hidden w-10 h-1.5 bg-[#E8EAF1] rounded-full mx-auto" />
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-[#20243A]">
                Thành viên HUST ({space.memberCount})
              </h2>
              <button
                type="button"
                onClick={() => setShowMembers(false)}
                aria-label="Đóng danh sách thành viên"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#747B91]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#747B91]">
              Mã mời không gian: <strong className="font-mono text-[#20243A]">{space.inviteCode}</strong>
            </p>

            <ul className="space-y-2.5 max-h-56 overflow-y-auto">
              {space.members.map((m) => (
                <li key={m.id} className="flex items-center gap-3">
                  <SafeImage
                    src={m.avatar}
                    alt={m.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#E8EAF1]"
                    fallbackLabel={m.name}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#20243A] truncate">
                      {m.name}
                    </p>
                    <p className="text-xs text-[#747B91]">{m.role}</p>
                  </div>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => {
                setShowMembers(false);
                onLeaveSpace();
              }}
              className="w-full min-h-[48px] rounded-2xl border border-[#FF6B81]/40 text-[#FF6B81] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#FF6B81]/8"
            >
              <LogOut className="w-4 h-4" />
              <span>Rời không gian chung</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
