import React, { useState } from 'react';
import { Check, Edit3, GraduationCap, Mail, X } from 'lucide-react';
import {
  ALL_INTEREST_TAGS,
  ASSETS,
  CONNECTION_PURPOSES,
  HUST_SCHOOLS,
  HUST_UNIVERSITY_NAME,
} from '../../data/mockData';
import { StudentProfile } from '../../types/union';
import {
  hasMinimumInterests,
  isValidHustEmail,
  toggleInterestSelection,
} from '../../utils/unionLogic';
import { SafeImage } from './SafeImage';

interface WelcomeScreenProps {
  selectedInterests: string[];
  selectedFaculty: string;
  hustEmail: string;
  onChangeHustEmail: (email: string) => void;
  onSelectFaculty: (faculty: string) => void;
  onToggleInterest: (tag: string) => void;
  onContinue: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  selectedInterests,
  selectedFaculty,
  hustEmail,
  onChangeHustEmail,
  onSelectFaculty,
  onToggleInterest,
  onContinue,
}) => {
  const hasMinInterests = hasMinimumInterests(selectedInterests, 3);
  const emailValid = isValidHustEmail(hustEmail);
  const showEmailError = hustEmail.trim().length > 0 && !emailValid;
  const canContinue = hasMinInterests && emailValid;

  return (
    <div className="min-h-dvh bg-[#F8F9FC] text-[#20243A] flex flex-col justify-center">
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Web Brand Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 lg:mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#6C63FF] text-white font-display font-extrabold text-lg flex items-center justify-center shadow-xs">
              U
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-[#20243A] whitespace-nowrap">
              UNION HUST
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-[#6C63FF] flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 shrink-0" />
            <span>Nền tảng web dành riêng cho sinh viên Đại học Bách khoa Hà Nội</span>
          </p>
        </div>

        {/* 2-Column Web Hero + Interest Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Left Hero Story */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-[#20243A] text-balance">
                Kết nối từ điểm chung, duy trì tình bạn không áp lực.
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#747B91] leading-relaxed">
                Không gian web kết nối dành riêng cho cộng đồng sinh viên HUST. Xác thực email Bách khoa và chọn từ 3 sở thích trở lên (không giới hạn số lượng) để tìm bạn cùng tần số.
              </p>
            </div>

            <div className="rounded-3xl overflow-hidden bg-white border border-[#E8EAF1] shadow-xs">
              <SafeImage
                src={ASSETS.welcomeIllustration}
                alt="Sinh viên HUST kết nối bạn bè qua sở thích chung"
                className="w-full h-48 sm:h-56 lg:h-64 object-cover"
              />
            </div>
          </div>

          {/* Right Interactive Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8EAF1] p-5 sm:p-7 shadow-xs space-y-5">
            <div className="space-y-4">
              {/* HUST Student Email Verification */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label
                    htmlFor="hust-email-input"
                    className="text-xs font-semibold text-[#747B91]"
                  >
                    Email sinh viên HUST (@sis.hust.edu.vn)
                  </label>
                  <span
                    className={`text-xs font-medium ${
                      showEmailError
                        ? 'text-[#D93855]'
                        : emailValid
                          ? 'text-[#168A65]'
                          : 'text-[#747B91]'
                    }`}
                  >
                    {showEmailError
                      ? 'Email không thuộc HUST'
                      : emailValid
                        ? 'Đã xác thực HUST'
                        : 'Bắt buộc'}
                  </span>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#747B91] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="hust-email-input"
                    type="email"
                    value={hustEmail}
                    onChange={(e) => onChangeHustEmail(e.target.value)}
                    placeholder="ten.mssv@sis.hust.edu.vn"
                    className={`w-full min-h-[44px] pl-10 pr-3.5 rounded-xl bg-[#F8F9FC] border text-sm font-medium text-[#20243A] focus:outline-none ${
                      showEmailError
                        ? 'border-[#FF6B81] focus:border-[#FF6B81]'
                        : 'border-[#E8EAF1] focus:border-[#6C63FF]'
                    }`}
                  />
                </div>
                {showEmailError && (
                  <p className="mt-1.5 text-xs font-medium text-[#D93855]">
                    Chỉ chấp nhận email sinh viên HUST (@sis.hust.edu.vn hoặc @hust.edu.vn).
                  </p>
                )}
              </div>

              {/* HUST School Selector */}
              <div>
                <label
                  htmlFor="hust-faculty-select"
                  className="block text-xs font-semibold text-[#747B91] mb-1.5"
                >
                  Trường / Khoa trực thuộc HUST
                </label>
                <select
                  id="hust-faculty-select"
                  value={selectedFaculty}
                  onChange={(e) => onSelectFaculty(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-xl bg-[#F8F9FC] border border-[#E8EAF1] text-sm font-medium text-[#20243A] focus:outline-none focus:border-[#6C63FF]"
                >
                  {HUST_SCHOOLS.map((school) => (
                    <option key={school} value={school}>
                      {school}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Multi-Interest Picker (>= 3, unlimited upper bound) */}
            <div>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-[#20243A]">
                  Sở thích (chọn từ 3 trở lên, không giới hạn)
                </h2>
                <span
                  data-testid="interest-counter"
                  className={`text-xs font-semibold tabular-nums shrink-0 whitespace-nowrap ${
                    hasMinInterests ? 'text-[#168A65]' : 'text-[#6C63FF]'
                  }`}
                >
                  Đã chọn {selectedInterests.length} sở thích
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {ALL_INTEREST_TAGS.map((tag) => {
                  const selected = selectedInterests.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => onToggleInterest(tag)}
                      aria-pressed={selected}
                      className={`min-h-[42px] px-3.5 py-2 rounded-xl text-sm font-medium transition-colors duration-150 flex items-center gap-1.5 border ${
                        selected
                          ? 'bg-[#6C63FF] text-white border-[#6C63FF] shadow-xs'
                          : 'bg-[#F8F9FC] text-[#20243A] border-[#E8EAF1] hover:border-[#6C63FF]/50 hover:bg-white'
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      <span className="whitespace-nowrap">{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8EAF1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-[#747B91]">
                Phạm vi truy cập · Chỉ dành cho sinh viên Đại học Bách khoa Hà Nội
              </span>
              <button
                type="button"
                onClick={onContinue}
                disabled={!canContinue}
                className={`min-h-[48px] px-6 rounded-2xl font-semibold text-sm transition-colors duration-150 flex items-center justify-center shrink-0 whitespace-nowrap ${
                  canContinue
                    ? 'bg-[#6C63FF] text-white hover:bg-[#5B52EE] shadow-sm'
                    : 'bg-[#E8EAF1] text-[#747B91] cursor-not-allowed'
                }`}
              >
                {!emailValid
                  ? 'Cần email sinh viên HUST hợp lệ'
                  : !hasMinInterests
                    ? `Chọn thêm ${3 - selectedInterests.length} sở thích nữa`
                    : 'Khám phá bạn bè HUST'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MyProfileScreenProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
}

export const MyProfileScreen: React.FC<MyProfileScreenProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(profile.name);
  const [draftEmail, setDraftEmail] = useState(profile.hustEmail);
  const [draftYear, setDraftYear] = useState(profile.year);
  const [draftFaculty, setDraftFaculty] = useState(profile.faculty);
  const [draftBio, setDraftBio] = useState(profile.bio);
  const [draftInterests, setDraftInterests] = useState<string[]>(profile.interests);
  const [draftPurposes, setDraftPurposes] = useState<string[]>(profile.purposes);

  const openEditor = () => {
    setDraftName(profile.name);
    setDraftEmail(profile.hustEmail);
    setDraftYear(profile.year);
    setDraftFaculty(profile.faculty);
    setDraftBio(profile.bio);
    setDraftInterests(profile.interests);
    setDraftPurposes(profile.purposes);
    setIsEditing(true);
  };

  const togglePurpose = (purpose: string) => {
    setDraftPurposes((prev) =>
      prev.includes(purpose) ? prev.filter((p) => p !== purpose) : [...prev, purpose]
    );
  };

  const draftEmailValid = isValidHustEmail(draftEmail);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftName.trim() || !draftEmailValid || draftInterests.length < 3) return;
    onUpdateProfile({
      ...profile,
      name: draftName.trim(),
      hustEmail: draftEmail.trim(),
      year: draftYear.trim() || profile.year,
      university: HUST_UNIVERSITY_NAME,
      faculty: draftFaculty,
      bio: draftBio.trim() || profile.bio,
      interests: draftInterests,
      purposes: draftPurposes.length > 0 ? draftPurposes : profile.purposes,
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-[#20243A]">
            Hồ sơ sinh viên HUST của tôi
          </h1>
          <p className="text-xs sm:text-sm text-[#747B91] mt-0.5">
            Đại học Bách khoa Hà Nội · {profile.hustEmail}
          </p>
        </div>
        <button
          type="button"
          onClick={openEditor}
          className="min-h-[44px] px-4 rounded-2xl bg-white border border-[#E8EAF1] text-sm font-semibold text-[#6C63FF] hover:border-[#6C63FF] flex items-center gap-2 transition-colors shrink-0 whitespace-nowrap"
        >
          <Edit3 className="w-4 h-4" />
          <span>Chỉnh sửa hồ sơ</span>
        </button>
      </div>

      {/* 2-Column Web Profile Card */}
      <div className="bg-white rounded-3xl border border-[#E8EAF1] shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-[320px_1fr]">
        <div className="relative h-72 md:h-full min-h-[300px] bg-[#EEF0F7]">
          <SafeImage
            src={profile.avatar}
            alt={`Ảnh đại diện của ${profile.name}`}
            className="w-full h-full object-cover"
            fallbackLabel={profile.name}
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
          <div className="absolute inset-x-5 bottom-5 text-white">
            <h2 className="font-display text-2xl font-bold leading-tight">
              {profile.name}
            </h2>
            <p className="mt-1 text-xs text-white/90">{profile.year}</p>
            <p className="text-xs text-white/85 mt-0.5">{profile.university}</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <h3 className="text-xs font-semibold text-[#747B91]">
              Đơn vị đào tạo tại HUST
            </h3>
            <p className="mt-1 text-sm font-semibold text-[#20243A]">
              {profile.faculty}
            </p>
            <p className="mt-1 text-xs text-[#168A65] font-medium">
              Email xác thực HUST: {profile.hustEmail}
            </p>
          </div>

          <div className="border-t border-[#E8EAF1] pt-4">
            <h3 className="text-xs font-semibold text-[#747B91]">
              Giới thiệu ngắn
            </h3>
            <p className="mt-1.5 text-sm text-[#20243A] leading-relaxed">
              {profile.bio}
            </p>
          </div>

          <div className="border-t border-[#E8EAF1] pt-4">
            <h3 className="text-xs font-semibold text-[#747B91]">
              Sở thích đã chọn ({profile.interests.length})
            </h3>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {profile.interests.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-lg bg-[#6C63FF]/10 text-[#6C63FF] text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-[#E8EAF1] pt-4">
            <h3 className="text-xs font-semibold text-[#747B91]">
              Mục đích kết bạn tại Bách khoa
            </h3>
            <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {profile.purposes.map((purpose) => (
                <li
                  key={purpose}
                  className="text-sm text-[#20243A] flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-[#23B88A] shrink-0" />
                  <span>{purpose}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal / Bottom Sheet */}
      {isEditing && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Chỉnh sửa hồ sơ cá nhân"
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-end md:items-center md:justify-center md:p-4"
        >
          <form
            onSubmit={handleSave}
            className="w-full md:max-w-xl max-h-[90dvh] bg-white rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden shadow-xl"
          >
            <div className="md:hidden w-10 h-1.5 bg-[#E8EAF1] rounded-full mx-auto mt-3" />
            <div className="px-5 py-3.5 border-b border-[#E8EAF1] flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-[#20243A]">
                Chỉnh sửa hồ sơ sinh viên HUST
              </h2>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                aria-label="Đóng chỉnh sửa hồ sơ"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#747B91] hover:bg-[#F8F9FC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#747B91] mb-1">
                    Tên hiển thị
                  </label>
                  <input
                    type="text"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E8EAF1] text-sm focus:outline-none focus:border-[#6C63FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#747B91] mb-1">
                    Khóa / Năm học
                  </label>
                  <input
                    type="text"
                    value={draftYear}
                    onChange={(e) => setDraftYear(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E8EAF1] text-sm focus:outline-none focus:border-[#6C63FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#747B91] mb-1">
                    Email sinh viên HUST
                  </label>
                  <input
                    type="email"
                    value={draftEmail}
                    onChange={(e) => setDraftEmail(e.target.value)}
                    className={`w-full min-h-[44px] px-3.5 rounded-xl border text-sm focus:outline-none ${
                      draftEmailValid
                        ? 'border-[#E8EAF1] focus:border-[#6C63FF]'
                        : 'border-[#FF6B81] focus:border-[#FF6B81]'
                    }`}
                    required
                  />
                  {!draftEmailValid && (
                    <p className="mt-1 text-xs text-[#D93855]">
                      Phải là email @sis.hust.edu.vn hoặc @hust.edu.vn
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#747B91] mb-1">
                    Đại học (Cố định theo cộng đồng)
                  </label>
                  <input
                    type="text"
                    value={HUST_UNIVERSITY_NAME}
                    disabled
                    className="w-full min-h-[44px] px-3.5 rounded-xl bg-[#F8F9FC] border border-[#E8EAF1] text-sm text-[#747B91]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#747B91] mb-1">
                  Trường / Khoa trực thuộc HUST
                </label>
                <select
                  value={draftFaculty}
                  onChange={(e) => setDraftFaculty(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-xl border border-[#E8EAF1] text-sm bg-white focus:outline-none focus:border-[#6C63FF]"
                >
                  {HUST_SCHOOLS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#747B91] mb-1">
                  Giới thiệu ngắn
                </label>
                <textarea
                  rows={3}
                  value={draftBio}
                  onChange={(e) => setDraftBio(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-[#E8EAF1] text-sm focus:outline-none focus:border-[#6C63FF]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#747B91]">
                    Sở thích (chọn từ 3 sở thích trở lên, không giới hạn · đã chọn {draftInterests.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_INTEREST_TAGS.map((tag) => {
                    const active = draftInterests.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          setDraftInterests((prev) =>
                            toggleInterestSelection(prev, tag)
                          )
                        }
                        className={`min-h-[40px] px-3 rounded-xl text-xs font-medium border transition-colors ${
                          active
                            ? 'bg-[#6C63FF] text-white border-[#6C63FF]'
                            : 'bg-[#F8F9FC] text-[#20243A] border-[#E8EAF1]'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-[#747B91] mb-2">
                  Mục đích kết nối
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {CONNECTION_PURPOSES.map((purpose) => {
                    const active = draftPurposes.includes(purpose);
                    return (
                      <button
                        key={purpose}
                        type="button"
                        onClick={() => togglePurpose(purpose)}
                        className={`min-h-[40px] px-3 rounded-xl text-xs font-medium border ${
                          active
                            ? 'bg-[#23B88A]/12 text-[#168A65] border-[#23B88A]/40'
                            : 'bg-[#F8F9FC] text-[#747B91] border-[#E8EAF1]'
                        }`}
                      >
                        {purpose}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E8EAF1] bg-white">
              <button
                type="submit"
                disabled={draftInterests.length < 3 || !draftEmailValid}
                className="w-full min-h-[48px] rounded-2xl bg-[#6C63FF] text-white font-semibold text-sm hover:bg-[#5B52EE] disabled:bg-[#E8EAF1] disabled:text-[#747B91]"
              >
                {!draftEmailValid
                  ? 'Cần email sinh viên HUST hợp lệ'
                  : draftInterests.length < 3
                    ? 'Cần chọn ít nhất 3 sở thích'
                    : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
