import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MessageSquare,
  RefreshCw,
  Send,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { ALL_INTEREST_TAGS, CHALLENGE_PROMPTS } from '../../data/mockData';
import {
  ChallengeMessage,
  ConsentChoice,
  StudentProfile,
} from '../../types/union';
import {
  evaluateMutualConnection,
  formatCountdown,
  getSharedInterests,
} from '../../utils/unionLogic';
import { SafeImage } from './SafeImage';

interface ChallengeSetupScreenProps {
  partner: StudentProfile;
  quickTags: string[];
  onToggleQuickTag: (tag: string) => void;
  onStartChallenge: () => void;
  onLater: () => void;
}

export const ChallengeSetupScreen: React.FC<ChallengeSetupScreenProps> = ({
  partner,
  quickTags,
  onToggleQuickTag,
  onStartChallenge,
  onLater,
}) => {
  const [partnerAgreed, setPartnerAgreed] = useState(true);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onLater}
          className="min-h-[44px] px-3 rounded-xl text-sm font-semibold text-[#20243A] hover:bg-white border border-transparent hover:border-[#E8EAF1] flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>
        <h1 className="font-display text-lg sm:text-xl font-bold text-[#20243A]">
          Chuẩn bị thử thách 3 phút
        </h1>
        <div className="w-20" />
      </div>

      {/* Partner Preview */}
      <div className="bg-white rounded-3xl border border-[#E8EAF1] p-5 shadow-xs flex items-center gap-4">
        <SafeImage
          src={partner.avatar}
          alt={partner.name}
          className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-[#E8EAF1]"
          fallbackLabel={partner.name}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-base font-bold text-[#20243A] truncate">
              {partner.name}
            </h2>
            <span className="text-xs font-semibold text-[#6C63FF] shrink-0">
              Sinh viên HUST mô phỏng
            </span>
          </div>
          <p className="text-xs text-[#747B91] mt-0.5 truncate">
            {partner.year} · {partner.faculty}
          </p>
          <p className="text-xs text-[#23B88A] font-medium mt-1">
            {partnerAgreed
              ? `${partner.name} đã sẵn sàng tham gia cùng bạn`
              : `Đang chờ ${partner.name} xác nhận tham gia...`}
          </p>
        </div>
      </div>

      {/* Challenge Info Box */}
      <div className="bg-white rounded-3xl border border-[#E8EAF1] p-5 space-y-3.5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6C63FF]">
            Thử thách mở lời tự nhiên · Solution 1
          </span>
          <span className="font-mono text-sm font-bold text-[#20243A] tabular-nums flex items-center gap-1">
            <Clock className="w-4 h-4 text-[#6C63FF]" />
            03:00
          </span>
        </div>

        <p className="text-sm text-[#20243A] leading-relaxed">
          Hai bạn sẽ cùng trả lời một câu hỏi ngắn hoặc tìm điểm chung dựa trên các chủ đề đã chọn. Nhiệm vụ chung giúp bạn mở lời thoải mái mà không lo bị từ chối.
        </p>

        <div className="rounded-2xl bg-[#23B88A]/10 px-4 py-3 flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#168A65] shrink-0" />
          <p className="text-xs font-medium text-[#168A65] leading-snug">
            Không có đáp án đúng sai. Bạn có thể đổi câu hỏi hoặc dừng bất cứ lúc nào mà không cần giải thích.
          </p>
        </div>
      </div>

      {/* Quick Interest Tags (>= 3 allowed, no upper cap) */}
      <div className="bg-white rounded-3xl border border-[#E8EAF1] p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#20243A]">
            Chủ đề quan tâm cho thử thách (tối thiểu 3, có thể chọn nhiều hơn)
          </h3>
          <span
            data-testid="challenge-tag-counter"
            className={`text-xs font-semibold tabular-nums ${
              quickTags.length >= 3 ? 'text-[#168A65]' : 'text-[#6C63FF]'
            }`}
          >
            Đã chọn {quickTags.length}
          </span>
        </div>
        <p className="text-xs text-[#747B91]">
          Hệ thống gợi ý câu hỏi xoay quanh các sở thích bạn chọn. Không giới hạn số lượng tối đa.
        </p>
        <div className="flex flex-wrap gap-2">
          {ALL_INTEREST_TAGS.map((tag) => {
            const selected = quickTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onToggleQuickTag(tag)}
                aria-pressed={selected}
                className={`min-h-[40px] px-3.5 rounded-xl text-xs font-medium border transition-colors ${
                  selected
                    ? 'bg-[#6C63FF] text-white border-[#6C63FF]'
                    : 'bg-[#F8F9FC] text-[#20243A] border-[#E8EAF1] hover:border-[#6C63FF]/40'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulated mutual consent toggle */}
      <div className="rounded-2xl bg-[#EEF0F7] px-4 py-3 flex items-center justify-between gap-2">
        <span className="text-xs text-[#747B91]">
          Mô phỏng trạng thái sinh viên HUST đối phương:
        </span>
        <button
          type="button"
          onClick={() => setPartnerAgreed((v) => !v)}
          className="min-h-[38px] px-3.5 rounded-xl bg-white border border-[#E8EAF1] text-xs font-semibold text-[#20243A]"
        >
          {partnerAgreed ? 'Đã đồng ý' : 'Chưa đồng ý'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={onLater}
          className="col-span-1 min-h-[48px] rounded-2xl bg-white border border-[#E8EAF1] text-sm font-semibold text-[#747B91] hover:text-[#20243A]"
        >
          Để sau
        </button>
        <button
          type="button"
          onClick={onStartChallenge}
          disabled={!partnerAgreed || quickTags.length < 3}
          className="col-span-2 min-h-[48px] rounded-2xl bg-[#6C63FF] text-white text-sm font-semibold hover:bg-[#5B52EE] disabled:bg-[#E8EAF1] disabled:text-[#747B91]"
        >
          {!partnerAgreed
            ? 'Chờ đối phương đồng ý'
            : quickTags.length < 3
              ? 'Chọn ít nhất 3 chủ đề để bắt đầu'
              : 'Bắt đầu thử thách'}
        </button>
      </div>
    </div>
  );
};

interface ChallengeActiveScreenProps {
  partner: StudentProfile;
  quickTags: string[];
  onFinishChallenge: (discussedTopics: string[]) => void;
}

export const ChallengeActiveScreen: React.FC<ChallengeActiveScreenProps> = ({
  partner,
  quickTags,
  onFinishChallenge,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(180);
  const [promptIndex, setPromptIndex] = useState(0);
  const [discussedPrompts, setDiscussedPrompts] = useState<string[]>([
    CHALLENGE_PROMPTS[0].category,
  ]);
  const [messages, setMessages] = useState<ChallengeMessage[]>([
    {
      id: 'sys-0',
      sender: 'system',
      text: `Chủ đề gợi ý từ ${quickTags.join(', ')}. Cả hai có 3 phút trò chuyện thoải mái!`,
      timestamp: '03:00',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const currentPrompt = CHALLENGE_PROMPTS[promptIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) {
      onFinishChallenge(discussedPrompts);
    }
  }, [secondsLeft, discussedPrompts, onFinishChallenge]);

  const sendReply = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const nowLabel = formatCountdown(secondsLeft);
    const userMsg: ChallengeMessage = {
      id: `me-${Date.now()}`,
      sender: 'me',
      text: trimmed,
      timestamp: nowLabel,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    window.setTimeout(() => {
      const partnerMsg: ChallengeMessage = {
        id: `partner-${Date.now()}`,
        sender: 'partner',
        text: currentPrompt.partnerReply,
        timestamp: formatCountdown(Math.max(0, secondsLeft - 2)),
      };
      setMessages((prev) => [...prev, partnerMsg]);
    }, 450);
  };

  const handleChangeQuestion = () => {
    const nextIdx = (promptIndex + 1) % CHALLENGE_PROMPTS.length;
    const nextPrompt = CHALLENGE_PROMPTS[nextIdx];
    setPromptIndex(nextIdx);
    setDiscussedPrompts((prev) =>
      prev.includes(nextPrompt.category) ? prev : [...prev, nextPrompt.category]
    );
    setMessages((prev) => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        sender: 'system',
        text: `Đã đổi câu hỏi mới: "${nextPrompt.question}"`,
        timestamp: formatCountdown(secondsLeft),
      },
    ]);
  };

  const progressPercent = (secondsLeft / 180) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="bg-white rounded-3xl border border-[#E8EAF1] shadow-xs overflow-hidden flex flex-col h-[calc(100dvh-6rem)] md:h-[calc(100dvh-8rem)] min-h-[520px]">
        {/* Header with Live 03:00 Timer & Safe Exit */}
        <header className="shrink-0 bg-white border-b border-[#E8EAF1] px-5 pt-4 pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <SafeImage
                src={partner.avatar}
                alt={partner.name}
                className="w-10 h-10 rounded-full object-cover border border-[#E8EAF1] shrink-0"
                fallbackLabel={partner.name}
              />
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#20243A] truncate">
                  {partner.name}
                </p>
                <p className="text-xs text-[#747B91] truncate">
                  Thử thách 3 phút · Sinh viên HUST mô phỏng
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div
                data-testid="challenge-timer"
                aria-label="Thời gian còn lại"
                className="px-3 py-1.5 rounded-xl bg-[#6C63FF]/10 text-[#6C63FF] font-mono text-sm font-bold tabular-nums"
              >
                {formatCountdown(secondsLeft)}
              </div>
              <button
                type="button"
                onClick={() => onFinishChallenge(discussedPrompts)}
                className="min-h-[40px] px-3.5 rounded-xl border border-[#E8EAF1] text-xs font-semibold text-[#747B91] hover:text-[#20243A] hover:bg-[#F8F9FC]"
              >
                Kết thúc
              </button>
            </div>
          </div>

          <div className="mt-3 h-1.5 w-full rounded-full bg-[#E8EAF1] overflow-hidden">
            <div
              className="h-full bg-[#6C63FF] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </header>

        {/* Shared Challenge Prompt Card */}
        <div className="shrink-0 p-4 bg-[#F8F9FC] border-b border-[#E8EAF1]">
          <div className="bg-white rounded-2xl border border-[#E8EAF1] p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#6C63FF]">
                Nhiệm vụ chung · {currentPrompt.category}
              </span>
              <button
                type="button"
                onClick={handleChangeQuestion}
                className="min-h-[38px] px-3 rounded-xl bg-[#F8F9FC] border border-[#E8EAF1] text-xs font-semibold text-[#20243A] flex items-center gap-1.5 hover:border-[#6C63FF]/50"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#6C63FF]" />
                <span>Đổi câu hỏi</span>
              </button>
            </div>
            <p className="mt-2 font-display text-base sm:text-lg font-bold text-[#20243A] leading-snug">
              {currentPrompt.question}
            </p>
          </div>
        </div>

        {/* Interactive Conversation Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 space-y-3 bg-[#F8F9FC]/60">
          {messages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <div key={msg.id} className="text-center py-1">
                  <span className="text-xs text-[#747B91] leading-relaxed">
                    {msg.text}
                  </span>
                </div>
              );
            }
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
                  {isMe ? 'Bạn' : partner.name} · còn {msg.timestamp}
                </span>
              </div>
            );
          })}
        </div>

        {/* Quick Reply Chips + Input Bar */}
        <div className="shrink-0 bg-white border-t border-[#E8EAF1] p-4 space-y-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {currentPrompt.quickReplies.map((reply) => (
              <button
                key={reply}
                type="button"
                onClick={() => sendReply(reply)}
                className="min-h-[38px] px-3.5 rounded-xl bg-[#F8F9FC] border border-[#E8EAF1] text-xs font-medium text-[#20243A] whitespace-nowrap shrink-0 hover:border-[#6C63FF] hover:text-[#6C63FF] transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendReply(inputText);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập chia sẻ ngắn của bạn..."
              aria-label="Nhập tin nhắn thử thách"
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
      </div>
    </div>
  );
};

interface ChallengeResultScreenProps {
  partner: StudentProfile;
  myInterests: string[];
  discussedTopics: string[];
  onMutualSuccess: () => void;
  onOpenChat: () => void;
  onBackToDiscover: () => void;
}

export const ChallengeResultScreen: React.FC<ChallengeResultScreenProps> = ({
  partner,
  myInterests,
  discussedTopics,
  onMutualSuccess,
  onOpenChat,
  onBackToDiscover,
}) => {
  const [userChoice, setUserChoice] = useState<ConsentChoice>('undecided');
  const [partnerChoice, setPartnerChoice] = useState<ConsentChoice>('undecided');

  const shared = getSharedInterests(myInterests, partner.interests);
  const status = evaluateMutualConnection(userChoice, partnerChoice);

  const handleChooseConnect = () => {
    setUserChoice('connect');
    window.setTimeout(() => {
      setPartnerChoice('connect');
      onMutualSuccess();
    }, 550);
  };

  const handleChooseEnd = () => {
    setUserChoice('end');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">
      <div className="bg-white rounded-3xl border border-[#E8EAF1] p-7 text-center shadow-xs">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#23B88A]/12 text-[#23B88A] flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold text-[#20243A]">
          Bạn và {partner.name} đã hoàn thành thử thách 3 phút!
        </h1>
        <p className="mt-2 text-sm text-[#747B91] leading-relaxed">
          Cảm ơn bạn đã dành 3 phút làm quen nhẹ nhàng. Không có áp lực phải tiếp tục nếu bạn chưa thấy phù hợp.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8EAF1] p-6 space-y-4 shadow-xs">
        <div>
          <h2 className="text-xs font-semibold text-[#747B91]">
            Chủ đề đã trao đổi
          </h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {discussedTopics.map((topic) => (
              <span
                key={topic}
                className="px-3 py-1.5 rounded-lg bg-[#F8F9FC] border border-[#E8EAF1] text-xs font-medium text-[#20243A]"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-[#E8EAF1] pt-4">
          <h2 className="text-xs font-semibold text-[#747B91]">
            Điểm chung đã phát hiện
          </h2>
          <p className="mt-1 text-sm font-medium text-[#6C63FF]">
            {shared.length > 0
              ? `Cùng yêu thích: ${shared.join(', ')}`
              : 'Cả hai đều là sinh viên HUST cởi mở tìm bạn mới qua sở thích'}
          </p>
        </div>
      </div>

      {status === 'pending' && userChoice === 'connect' && (
        <div className="rounded-3xl bg-white border border-[#E8EAF1] p-5 text-center">
          <p className="text-sm font-semibold text-[#20243A]">
            Đã ghi nhận mong muốn của bạn
          </p>
          <p className="mt-1 text-xs text-[#747B91]">
            Đang chờ phản hồi tự nguyện từ {partner.name} (mô phỏng)...
          </p>
        </div>
      )}

      {status === 'mutual_connected' && (
        <div className="rounded-3xl bg-[#23B88A]/10 border border-[#23B88A]/30 p-5 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-[#168A65] font-display font-bold text-base">
            <Users className="w-5 h-5" />
            <span>Kết nối hai chiều thành công!</span>
          </div>
          <p className="text-xs text-[#20243A] leading-relaxed">
            Cả bạn và {partner.name} đều muốn giữ liên lạc. Hai bạn đã có thể nhắn tin riêng với nhau.
          </p>
        </div>
      )}

      {status === 'ended_neutrally' && (
        <div className="rounded-3xl bg-white border border-[#E8EAF1] p-5 text-center space-y-1.5">
          <p className="text-sm font-semibold text-[#20243A]">
            Cảm ơn bạn đã tham gia thử thách hôm nay
          </p>
          <p className="text-xs text-[#747B91] leading-relaxed">
            Lựa chọn của bạn luôn được tôn trọng riêng tư. Bạn có thể tiếp tục khám phá những bạn sinh viên HUST khác.
          </p>
        </div>
      )}

      <div className="pt-1">
        {status === 'mutual_connected' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onBackToDiscover}
              className="min-h-[48px] rounded-2xl bg-white border border-[#E8EAF1] text-sm font-semibold text-[#20243A]"
            >
              Khám phá tiếp
            </button>
            <button
              type="button"
              onClick={onOpenChat}
              className="min-h-[48px] rounded-2xl bg-[#6C63FF] text-white text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-[#5B52EE]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Nhắn tin ngay</span>
            </button>
          </div>
        ) : status === 'ended_neutrally' ? (
          <button
            type="button"
            onClick={onBackToDiscover}
            className="w-full min-h-[48px] rounded-2xl bg-[#6C63FF] text-white text-sm font-semibold hover:bg-[#5B52EE]"
          >
            Quay về Khám phá bạn bè HUST
          </button>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleChooseEnd}
              disabled={userChoice === 'connect'}
              className="min-h-[48px] rounded-2xl bg-white border border-[#E8EAF1] text-sm font-semibold text-[#747B91] hover:text-[#20243A]"
            >
              Kết thúc tại đây
            </button>
            <button
              type="button"
              onClick={handleChooseConnect}
              disabled={userChoice === 'connect'}
              className="min-h-[48px] rounded-2xl bg-[#6C63FF] text-white text-sm font-semibold hover:bg-[#5B52EE] disabled:opacity-60"
            >
              {userChoice === 'connect'
                ? 'Đang chờ xác nhận...'
                : 'Muốn tiếp tục kết nối'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
