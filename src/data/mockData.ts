import {
  ChallengePrompt,
  ChatThread,
  FeedPost,
  QuickUpdateTemplate,
  ReactionLabel,
  SharedSpace,
  StudentProfile,
} from '../types/union';

export const ASSETS = {
  welcomeIllustration: '/src/assets/images/union_welcome_friends_1794933121804.jpg',
  minhAnh: '/src/assets/images/avatar_minh_anh_1794933122152.jpg',
  quangHuy: '/src/assets/images/avatar_quang_huy_1794933122544.jpg',
  thaoLinh: '/src/assets/images/avatar_thao_linh_1794933124049.jpg',
  ducMinh: '/src/assets/images/avatar_duc_minh_1794933123806.jpg',
};

export const HUST_UNIVERSITY_NAME = 'Đại học Bách khoa Hà Nội (HUST)';

export const HUST_SCHOOLS: string[] = [
  'Trường Công nghệ Thông tin & Truyền thông (SoICT)',
  'Trường Điện - Điện tử (SEEE)',
  'Trường Cơ khí (SME)',
  'Trường Hóa & Khoa học Sự sống (SCLS)',
  'Trường Vật liệu (SMSE)',
  'Trường Kinh tế (SEM)',
  'Khoa Toán - Tin (FAMI)',
  'Khoa Ngoại ngữ (SOFL)',
];

export const ALL_INTEREST_TAGS: string[] = [
  'Xem phim',
  'Âm nhạc',
  'Game',
  'Anime',
  'Bóng đá',
  'Cầu lông',
  'Du lịch',
  'Nhiếp ảnh',
  'Đọc sách',
  'Lập trình',
  'Học tiếng Nhật',
  'Cà phê',
  'Chạy bộ',
  'Board game',
];

export const CONNECTION_PURPOSES: string[] = [
  'Tìm bạn trò chuyện',
  'Học nhóm cùng tiến bộ',
  'Chơi thể thao cuối tuần',
  'Đi workshop & sự kiện HUST',
  'Khám phá quán cà phê quanh Bách khoa',
];

export const INITIAL_ME: StudentProfile = {
  id: 'me',
  name: 'Minh Anh',
  hustEmail: 'anh.nm240105@sis.hust.edu.vn',
  year: 'Sinh viên năm 2 (K69)',
  university: HUST_UNIVERSITY_NAME,
  faculty: 'Trường Công nghệ Thông tin & Truyền thông (SoICT)',
  avatar: ASSETS.minhAnh,
  bio: 'Mình là sinh viên SoICT Bách khoa, thích xem phim, nghe nhạc và muốn tìm thêm bạn HUST cùng tham gia các hoạt động thú vị sau giờ học.',
  interests: ['Xem phim', 'Âm nhạc', 'Cầu lông', 'Nhiếp ảnh'],
  purposes: ['Tìm bạn trò chuyện', 'Đi workshop & sự kiện HUST', 'Chơi thể thao cuối tuần'],
  matchReason: 'Hồ sơ sinh viên HUST của bạn',
};

export const DISCOVER_PROFILES: StudentProfile[] = [
  {
    id: 'quang-huy',
    name: 'Quang Huy',
    hustEmail: 'huy.lq230812@sis.hust.edu.vn',
    year: 'Sinh viên năm 3 (K68)',
    university: HUST_UNIVERSITY_NAME,
    faculty: 'Trường Công nghệ Thông tin & Truyền thông (SoICT)',
    avatar: ASSETS.quangHuy,
    bio: 'Thích nghe nhạc indie lúc làm lab ở D9, cuối tuần hay rủ bạn HUST đi xem phim hoặc ôn tiếng Nhật N3 tại thư viện Tạ Quang Bửu.',
    interests: ['Xem phim', 'Âm nhạc', 'Lập trình', 'Học tiếng Nhật', 'Cà phê'],
    purposes: ['Tìm bạn trò chuyện', 'Học nhóm cùng tiến bộ'],
    matchReason: 'Cùng là sinh viên HUST và chung sở thích Xem phim, Âm nhạc.',
    isSimulated: true,
  },
  {
    id: 'duc-minh',
    name: 'Đức Minh',
    hustEmail: 'minh.nd241022@sis.hust.edu.vn',
    year: 'Sinh viên năm 2 (K69)',
    university: HUST_UNIVERSITY_NAME,
    faculty: 'Trường Cơ khí (SME)',
    avatar: ASSETS.ducMinh,
    bio: 'Chiều thứ Sáu nào mình cũng ra sân cầu lông nhà thi đấu Bách khoa. Rất vui được làm quen thêm bạn mới trong trường!',
    interests: ['Cầu lông', 'Bóng đá', 'Du lịch', 'Xem phim', 'Chạy bộ'],
    purposes: ['Chơi thể thao cuối tuần', 'Tìm bạn trò chuyện'],
    matchReason: 'Cùng trường HUST, chung đam mê Cầu lông và Xem phim.',
    isSimulated: true,
  },
  {
    id: 'thao-linh',
    name: 'Thảo Linh',
    hustEmail: 'linh.pt250318@sis.hust.edu.vn',
    year: 'Sinh viên năm 1 (K70)',
    university: HUST_UNIVERSITY_NAME,
    faculty: 'Trường Điện - Điện tử (SEEE)',
    avatar: ASSETS.thaoLinh,
    bio: 'K70 mới vào Bách khoa nên muốn tìm bạn cùng đi CLB nhiếp ảnh, chạy bộ quanh hồ Tiền và nghe nhạc acoustic.',
    interests: ['Nhiếp ảnh', 'Âm nhạc', 'Đọc sách', 'Du lịch', 'Cà phê'],
    purposes: ['Đi workshop & sự kiện HUST', 'Khám phá quán cà phê quanh Bách khoa'],
    matchReason: 'Cùng học tại HUST và thích Nhiếp ảnh, Âm nhạc.',
    isSimulated: true,
  },
];

export const INITIAL_FEED_POSTS: FeedPost[] = [
  {
    id: 'post-1',
    authorId: 'quang-huy',
    authorName: 'Quang Huy',
    authorAvatar: ASSETS.quangHuy,
    authorMeta: 'K68 · SoICT · HUST',
    content: 'Cuối tuần có bạn Bách khoa nào muốn đi xem phim không? Mình định xem suất tối thứ Bảy gần khu Tạ Quang Bửu.',
    tag: 'Xem phim',
    timeAgo: '15 phút trước',
    interestCount: 5,
    interestedByMe: false,
    comments: [
      {
        id: 'c1',
        authorName: 'Thảo Linh',
        text: 'Mình cũng K70 SEEE định đi xem tuần này nè, rủ thêm vài bạn HUST cho vui!',
        timeAgo: '8 phút trước',
      },
    ],
  },
  {
    id: 'post-2',
    authorId: 'quang-huy',
    authorName: 'Quang Huy',
    authorAvatar: ASSETS.quangHuy,
    authorMeta: 'K68 · SoICT · HUST',
    content: 'Có bạn HUST nào đang học tiếng Nhật N3 (chương trình HEDSPI / IT Nhật) muốn ngồi học chung ở thư viện Tạ Quang Bửu chiều thứ Tư không?',
    tag: 'Học tiếng Nhật',
    timeAgo: '1 giờ trước',
    interestCount: 4,
    interestedByMe: false,
    comments: [],
  },
  {
    id: 'post-3',
    authorId: 'duc-minh',
    authorName: 'Đức Minh',
    authorAvatar: ASSETS.ducMinh,
    authorMeta: 'K69 · Trường Cơ khí · HUST',
    content: 'Mình đang tìm bạn HUST chơi cầu lông chiều thứ Sáu ở sân khu Bách khoa. Có sẵn vợt dự phòng cho bạn mới tập luôn nhé.',
    tag: 'Cầu lông',
    timeAgo: '2 giờ trước',
    interestCount: 7,
    interestedByMe: true,
    comments: [],
  },
  {
    id: 'post-4',
    authorId: 'thao-linh',
    authorName: 'Thảo Linh',
    authorAvatar: ASSETS.thaoLinh,
    authorMeta: 'K70 · Trường Điện - Điện tử · HUST',
    content: 'Nhóm mình vừa tham gia workshop nhiếp ảnh quanh khuôn viên C1 - Parabol HUST, có bạn nào thích chủ đề này không?',
    tag: 'Nhiếp ảnh',
    timeAgo: '4 giờ trước',
    interestCount: 9,
    interestedByMe: false,
    comments: [],
  },
];

export const CHALLENGE_PROMPTS: ChallengePrompt[] = [
  {
    id: 'prompt-1',
    category: 'Điểm chung',
    question: 'Hãy tìm ra ba sở thích hoặc thói quen ở Bách khoa mà cả hai cùng thích.',
    quickReplies: [
      'Mình rất thích ngồi học bài ở tầng 3 thư viện Tạ Quang Bửu',
      'Mình hay nghe nhạc lo-fi khi chạy deadline đồ án',
      'Thích uống trà đá cổng Parabol hoặc cà phê phố Tạ Quang Bửu',
    ],
    partnerReply:
      'Ơ trùng hợp ghê! Mình cũng hay ngồi tầng 3 thư viện và chạy deadline với nhạc lo-fi. Còn điểm chung nữa: bạn có hay đi bộ dạo hồ Bảy Mẫu sau giờ học không?',
  },
  {
    id: 'prompt-2',
    category: 'Câu hỏi vui',
    question: 'Nếu được đi du lịch miễn phí 3 ngày cùng nhóm bạn HUST sau kỳ thi cuối kỳ, bạn sẽ chọn địa điểm nào?',
    quickReplies: [
      'Đà Lạt để tận hưởng không khí mát mẻ và chụp ảnh',
      'Ninh Bình hoặc Tam Đảo đi phượt nhẹ cuối tuần',
      'Hội An dạo phố cổ và ăn đặc sản',
    ],
    partnerReply:
      'Đà Lạt nghe hợp lý quá! Thi xong mà đi một chuyến cùng hội bạn Bách khoa thì xả stress hết ý luôn.',
  },
  {
    id: 'prompt-3',
    category: 'Hoạt động cặp',
    question: 'Hai bạn hãy chọn một bộ phim hoặc bản nhạc mà cả hai đều muốn thử xem/nghe tuần này.',
    quickReplies: [
      'Một bộ phim hoạt hình Ghibli nhẹ nhàng',
      'Phim trinh thám hoặc sci-fi có plot twist',
      'Một playlist nhạc Acoustic Việt Nam mới',
    ],
    partnerReply:
      'Ghibli thì đỉnh rồi! Mình chưa xem lại "Whisper of the Heart" lâu lắm rồi, cảm giác cực kỳ hợp vibe sinh viên luôn.',
  },
  {
    id: 'prompt-4',
    category: 'Nhiệm vụ nhanh',
    question: 'Đố vui nhẹ: Một điều nhỏ bé tuần vừa qua ở HUST khiến bạn mỉm cười là gì?',
    quickReplies: [
      'Qua môn thí nghiệm và nộp báo cáo đúng hạn',
      'Tìm được một quán cơm ngon gần khu KTX Bách khoa',
      'Được ngủ bù một giấc thật sâu ngày Chủ nhật',
    ],
    partnerReply:
      'Haha giống mình thật! Tuần trước nộp xong bài tập lớn ITSS đúng hạn là nhẹ cả người luôn.',
  },
];

export const INITIAL_CHAT_THREADS: ChatThread[] = [
  {
    userId: 'thao-linh',
    icebreaker: 'Bạn có muốn tiếp tục nói về buổi chụp ảnh quanh C1 hôm trước không?',
    messages: [
      {
        id: 'm1',
        sender: 'partner',
        text: 'Chào Minh Anh! Hôm trước tụi mình cùng thích nhạc acoustic với chụp ảnh, cuối tuần này CLB ở HUST có buổi giao lưu đó.',
        time: '19:15',
      },
      {
        id: 'm2',
        sender: 'me',
        text: 'Nghe hay quá Thảo Linh ơi! Mấy giờ tập trung ở sảnh C1 vậy bạn?',
        time: '19:18',
      },
    ],
  },
];

export const QUICK_UPDATE_OPTIONS: {
  title: QuickUpdateTemplate;
  subtitle: string;
  accentColor: string;
}[] = [
  {
    title: 'Hôm nay mình vui',
    subtitle: 'Một ngày có năng lượng tích cực nhẹ nhàng',
    accentColor: '#23B88A',
  },
  {
    title: 'Vừa hoàn thành một mục tiêu',
    subtitle: 'Xong bài tập, bài kiểm tra hoặc kế hoạch nhỏ',
    accentColor: '#6C63FF',
  },
  {
    title: 'Đang nghe nhạc',
    subtitle: 'Thư giãn với một playlist yêu thích',
    accentColor: '#FF6B81',
  },
  {
    title: 'Vừa xem phim',
    subtitle: 'Mới thưởng thức một bộ phim đáng nhớ',
    accentColor: '#6C63FF',
  },
  {
    title: 'Đang nghỉ ngơi',
    subtitle: 'Nạp lại năng lượng sau giờ học căng thẳng',
    accentColor: '#747B91',
  },
  {
    title: 'Chia sẻ một điều mới',
    subtitle: 'Ghi chú nhanh một khoảnh khắc trong ngày',
    accentColor: '#23B88A',
  },
];

export const LIGHT_REACTION_LABELS: ReactionLabel[] = [
  'Hay quá!',
  'Đồng cảm',
  'Cố lên!',
  'Mình cũng vậy',
];

export const INITIAL_SHARED_SPACES: SharedSpace[] = [
  {
    id: 'space-photo',
    name: 'Nhóm Workshop Nhiếp ảnh HUST',
    originEvent: 'Workshop Chụp Film quanh C1 – Bách khoa',
    description:
      'Không gian nhẹ nhàng dành riêng cho sinh viên HUST sau buổi workshop. Không cần nhắn tin mỗi ngày, chỉ cần ghé cập nhật khi bạn muốn.',
    inviteCode: 'PHOTO24',
    coverAvatar: ASSETS.thaoLinh,
    memberCount: 12,
    members: [
      { id: 'me', name: 'Minh Anh (Bạn)', avatar: ASSETS.minhAnh, role: 'Thành viên · SoICT' },
      { id: 'thao-linh', name: 'Thảo Linh', avatar: ASSETS.thaoLinh, role: 'Người tạo nhóm · SEEE' },
      { id: 'quang-huy', name: 'Quang Huy', avatar: ASSETS.quangHuy, role: 'Thành viên · SoICT' },
      { id: 'duc-minh', name: 'Đức Minh', avatar: ASSETS.ducMinh, role: 'Thành viên · SME' },
    ],
    moments: [
      {
        id: 'mom-1',
        authorId: 'me',
        authorName: 'Minh Anh',
        authorAvatar: ASSETS.minhAnh,
        statusTitle: 'Hôm nay mình vừa hoàn thành bài kiểm tra.',
        note: 'Cuối cùng cũng qua bài giữa kỳ Giải tích nhẹ nhàng!',
        timeAgo: '25 phút trước',
        reactions: [
          { label: 'Hay quá!', count: 3, reactedByMe: false },
          { label: 'Đồng cảm', count: 1, reactedByMe: false },
          { label: 'Cố lên!', count: 2, reactedByMe: false },
          { label: 'Mình cũng vậy', count: 1, reactedByMe: false },
        ],
      },
      {
        id: 'mom-2',
        authorId: 'quang-huy',
        authorName: 'Quang Huy',
        authorAvatar: ASSETS.quangHuy,
        statusTitle: 'Mình vừa xem một bộ phim khá hay.',
        note: 'Past Lives xem xong suy ngẫm mãi.',
        timeAgo: '2 giờ trước',
        reactions: [
          { label: 'Hay quá!', count: 2, reactedByMe: true },
          { label: 'Đồng cảm', count: 1, reactedByMe: false },
          { label: 'Cố lên!', count: 0, reactedByMe: false },
          { label: 'Mình cũng vậy', count: 2, reactedByMe: false },
        ],
      },
      {
        id: 'mom-3',
        authorId: 'thao-linh',
        authorName: 'Thảo Linh',
        authorAvatar: ASSETS.thaoLinh,
        statusTitle: 'Cuối tuần mình đi chụp ảnh.',
        note: 'Sẽ rửa cuộn film chụp ở sân C2 tuần trước.',
        timeAgo: 'Hôm qua',
        reactions: [
          { label: 'Hay quá!', count: 4, reactedByMe: false },
          { label: 'Đồng cảm', count: 0, reactedByMe: false },
          { label: 'Cố lên!', count: 1, reactedByMe: false },
          { label: 'Mình cũng vậy', count: 1, reactedByMe: false },
        ],
      },
    ],
  },
  {
    id: 'space-japanese',
    name: 'Nhóm Học tiếng Nhật HEDSPI · HUST',
    originEvent: 'CLB Giao lưu N3 Tạ Quang Bửu',
    description: 'Cùng chia sẻ tiến độ học kanji nhỏ mỗi tuần, không áp lực điểm danh.',
    inviteCode: 'NIHON3',
    coverAvatar: ASSETS.quangHuy,
    memberCount: 18,
    members: [
      { id: 'me', name: 'Minh Anh (Bạn)', avatar: ASSETS.minhAnh, role: 'Thành viên · SoICT' },
      { id: 'quang-huy', name: 'Quang Huy', avatar: ASSETS.quangHuy, role: 'Người tạo nhóm · SoICT' },
    ],
    moments: [
      {
        id: 'mom-j1',
        authorId: 'quang-huy',
        authorName: 'Quang Huy',
        authorAvatar: ASSETS.quangHuy,
        statusTitle: 'Vừa hoàn thành một mục tiêu',
        note: 'Ôn xong 25 chữ Kanji chương 4 ở phòng đọc Tạ Quang Bửu rồi.',
        timeAgo: '3 giờ trước',
        reactions: [
          { label: 'Hay quá!', count: 3, reactedByMe: false },
          { label: 'Đồng cảm', count: 0, reactedByMe: false },
          { label: 'Cố lên!', count: 4, reactedByMe: true },
          { label: 'Mình cũng vậy', count: 1, reactedByMe: false },
        ],
      },
    ],
  },
  {
    id: 'space-events',
    name: 'Nhóm Tình nguyện Sự kiện HUST',
    originEvent: 'Ngày hội Tân Sinh Viên Bách khoa',
    description: 'Giữ liên lạc nhẹ nhàng với các bạn chung team hậu cần sau sự kiện trường.',
    inviteCode: 'HUST24',
    coverAvatar: ASSETS.ducMinh,
    memberCount: 24,
    members: [
      { id: 'me', name: 'Minh Anh (Bạn)', avatar: ASSETS.minhAnh, role: 'Thành viên · SoICT' },
      { id: 'duc-minh', name: 'Đức Minh', avatar: ASSETS.ducMinh, role: 'Thành viên · SME' },
    ],
    moments: [
      {
        id: 'mom-e1',
        authorId: 'duc-minh',
        authorName: 'Đức Minh',
        authorAvatar: ASSETS.ducMinh,
        statusTitle: 'Đang nghỉ ngơi',
        note: 'Chạy bộ 3km quanh sân vận động Bách khoa xong giờ uống nước nghỉ xíu.',
        timeAgo: '5 giờ trước',
        reactions: [
          { label: 'Hay quá!', count: 2, reactedByMe: false },
          { label: 'Đồng cảm', count: 2, reactedByMe: false },
          { label: 'Cố lên!', count: 1, reactedByMe: false },
          { label: 'Mình cũng vậy', count: 0, reactedByMe: false },
        ],
      },
    ],
  },
  {
    id: 'space-project',
    name: 'Nhóm Đồ án ITSS2 – HUST',
    originEvent: 'Đồ án môn ITSS2 · SoICT',
    description: 'Cập nhật nhẹ tiến độ cá nhân để cả nhóm biết mình vẫn đồng hành.',
    inviteCode: 'ITSS2',
    coverAvatar: ASSETS.minhAnh,
    memberCount: 6,
    members: [
      { id: 'me', name: 'Minh Anh (Bạn)', avatar: ASSETS.minhAnh, role: 'Thành viên · SoICT' },
      { id: 'quang-huy', name: 'Quang Huy', avatar: ASSETS.quangHuy, role: 'Thành viên · SoICT' },
      { id: 'thao-linh', name: 'Thảo Linh', avatar: ASSETS.thaoLinh, role: 'Thành viên · SEEE' },
    ],
    moments: [
      {
        id: 'mom-p1',
        authorId: 'thao-linh',
        authorName: 'Thảo Linh',
        authorAvatar: ASSETS.thaoLinh,
        statusTitle: 'Đang nghe nhạc',
        note: 'Đang hoàn thiện giao diện cho buổi phỏng vấn người dùng tuần này.',
        timeAgo: '1 ngày trước',
        reactions: [
          { label: 'Hay quá!', count: 2, reactedByMe: false },
          { label: 'Đồng cảm', count: 1, reactedByMe: false },
          { label: 'Cố lên!', count: 3, reactedByMe: false },
          { label: 'Mình cũng vậy', count: 0, reactedByMe: false },
        ],
      },
    ],
  },
];
