import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateMutualConnection,
  filterFeedPosts,
  filterProfilesBySchool,
  formatCountdown,
  getSharedInterests,
  hasMinimumInterests,
  isValidHustEmail,
  toggleInterestSelection,
  toggleLightReaction,
} from './unionLogic';
import { FeedPost, MomentReaction, StudentProfile } from '../types/union';

test('isValidHustEmail restricts access strictly to HUST email domains', () => {
  assert.equal(isValidHustEmail('minh.na240001@sis.hust.edu.vn'), true);
  assert.equal(isValidHustEmail('huy.lq231234@SIS.HUST.EDU.VN'), true);
  assert.equal(isValidHustEmail('support@hust.edu.vn'), true);

  assert.equal(isValidHustEmail('student@gmail.com'), false);
  assert.equal(isValidHustEmail('student@vnu.edu.vn'), false);
  assert.equal(isValidHustEmail('student@fpt.edu.vn'), false);
  assert.equal(isValidHustEmail(''), false);
});

test('toggleInterestSelection allows selecting more than 3 tags and toggles removal', () => {
  let tags: string[] = [];
  tags = toggleInterestSelection(tags, 'Xem phim');
  tags = toggleInterestSelection(tags, 'Âm nhạc');
  tags = toggleInterestSelection(tags, 'Cầu lông');
  tags = toggleInterestSelection(tags, 'Lập trình');
  tags = toggleInterestSelection(tags, 'Nhiếp ảnh');
  tags = toggleInterestSelection(tags, 'Cà phê');
  assert.deepEqual(tags, [
    'Xem phim',
    'Âm nhạc',
    'Cầu lông',
    'Lập trình',
    'Nhiếp ảnh',
    'Cà phê',
  ]);
  assert.equal(hasMinimumInterests(tags, 3), true);

  // Toggling an existing tag removes it
  const afterRemove = toggleInterestSelection(tags, 'Âm nhạc');
  assert.deepEqual(afterRemove, [
    'Xem phim',
    'Cầu lông',
    'Lập trình',
    'Nhiếp ảnh',
    'Cà phê',
  ]);

  // Below minimum 3 returns false
  assert.equal(hasMinimumInterests(['Xem phim', 'Âm nhạc'], 3), false);
});

test('getSharedInterests calculates overlapping tags accurately', () => {
  const shared = getSharedInterests(
    ['Xem phim', 'Âm nhạc', 'Cầu lông', 'Lập trình'],
    ['Âm nhạc', 'Nhiếp ảnh', 'Cầu lông', 'Lập trình']
  );
  assert.deepEqual(shared, ['Âm nhạc', 'Cầu lông', 'Lập trình']);
});

test('filterProfilesBySchool filters HUST students by school/faculty', () => {
  const profiles: StudentProfile[] = [
    {
      id: '1',
      name: 'Quang Huy',
      hustEmail: 'huy@sis.hust.edu.vn',
      year: 'K68',
      university: 'Đại học Bách khoa Hà Nội (HUST)',
      faculty: 'Trường Công nghệ Thông tin & Truyền thông (SoICT)',
      avatar: '',
      bio: '',
      interests: ['Xem phim', 'Âm nhạc', 'Lập trình'],
      purposes: [],
      matchReason: '',
    },
    {
      id: '2',
      name: 'Đức Minh',
      hustEmail: 'minh@sis.hust.edu.vn',
      year: 'K69',
      university: 'Đại học Bách khoa Hà Nội (HUST)',
      faculty: 'Trường Cơ khí (SME)',
      avatar: '',
      bio: '',
      interests: ['Cầu lông', 'Bóng đá', 'Du lịch'],
      purposes: [],
      matchReason: '',
    },
  ];
  assert.equal(filterProfilesBySchool(profiles, 'Tất cả HUST').length, 2);
  assert.equal(
    filterProfilesBySchool(
      profiles,
      'Trường Công nghệ Thông tin & Truyền thông (SoICT)'
    ).length,
    1
  );
});

test('formatCountdown formats seconds cleanly and clamps below zero', () => {
  assert.equal(formatCountdown(180), '03:00');
  assert.equal(formatCountdown(65), '01:05');
  assert.equal(formatCountdown(5), '00:05');
  assert.equal(formatCountdown(0), '00:00');
  assert.equal(formatCountdown(-12), '00:00');
});

test('evaluateMutualConnection requires explicit consent from both users', () => {
  assert.equal(evaluateMutualConnection('connect', 'undecided'), 'pending');
  assert.equal(evaluateMutualConnection('undecided', 'connect'), 'pending');
  assert.equal(evaluateMutualConnection('connect', 'connect'), 'mutual_connected');
  assert.equal(evaluateMutualConnection('end', 'connect'), 'ended_neutrally');
  assert.equal(evaluateMutualConnection('connect', 'end'), 'ended_neutrally');
});

test('toggleLightReaction increments and decrements cleanly without negative counts', () => {
  const initial: MomentReaction[] = [
    { label: 'Hay quá!', count: 2, reactedByMe: false },
    { label: 'Cố lên!', count: 0, reactedByMe: false },
  ];
  const once = toggleLightReaction(initial, 'Hay quá!');
  assert.equal(once[0].reactedByMe, true);
  assert.equal(once[0].count, 3);

  const twice = toggleLightReaction(once, 'Hay quá!');
  assert.equal(twice[0].reactedByMe, false);
  assert.equal(twice[0].count, 2);
});

test('filterFeedPosts filters by tag and search query', () => {
  const posts: FeedPost[] = [
    {
      id: '1',
      authorId: 'u1',
      authorName: 'Quang Huy',
      authorAvatar: '',
      authorMeta: 'Năm 3 · SoICT - HUST',
      content: 'Cuối tuần đi xem phim nhé',
      tag: 'Xem phim',
      timeAgo: '10 phút trước',
      interestCount: 2,
      interestedByMe: false,
      comments: [],
    },
    {
      id: '2',
      authorId: 'u2',
      authorName: 'Đức Minh',
      authorAvatar: '',
      authorMeta: 'Năm 2 · Trường Cơ khí - HUST',
      content: 'Tìm bạn chơi cầu lông thứ Sáu',
      tag: 'Cầu lông',
      timeAgo: '1 giờ trước',
      interestCount: 4,
      interestedByMe: false,
      comments: [],
    },
  ];

  assert.equal(filterFeedPosts(posts, '', 'Tất cả').length, 2);
  assert.equal(filterFeedPosts(posts, '', 'Cầu lông').length, 1);
  assert.equal(filterFeedPosts(posts, 'phim', 'Tất cả').length, 1);
  assert.equal(filterFeedPosts(posts, 'lập trình', 'Tất cả').length, 0);
});
