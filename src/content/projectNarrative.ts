import type { L10n } from "./site";

export type ProjectNarrative = {
  insight: L10n;
  takeaway: L10n;
};

// Strategic narrative only. Performance figures remain in projects.ts and are
// shown only where ANBU already has a confirmed campaign result.
export const projectNarrativeBySlug: Record<string, ProjectNarrative> = {
  "shopee-beauty-club": {
    insight: {
      vi: "Trong ngành làm đẹp, người dùng không tham gia một cộng đồng chỉ vì ưu đãi. Họ tham gia khi cộng đồng đó giúp mình khám phá sản phẩm, học hỏi từ người có gu và có lý do để quay lại. Vì vậy, bài toán ra mắt không dừng ở việc tạo tiếng vang cho một chương trình mới, mà phải biến Beauty Club thành một điểm hẹn có giá trị rõ ràng.",
      en: "In beauty, people do not join a community for discounts alone. They join when it helps them discover products, learn from trusted voices and find a reason to return. The launch therefore had to make Beauty Club feel like a valuable destination, not simply a new Shopee feature.",
    },
    takeaway: {
      vi: "Dấu ấn của chiến dịch nằm ở việc kết nối nội dung creator với hành vi ngay trên sàn. KOL không chỉ tạo nhận biết; mỗi video còn đóng vai trò mở đầu cho hành trình khám phá, tham gia và mua sắm trong Beauty Club.",
      en: "The campaign connected creator content with actions inside the platform. KOL content did more than build awareness; each video opened a path toward discovery, membership and shopping within Beauty Club.",
    },
  },
  "honkai-impact-3-birthday": {
    insight: {
      vi: "Sinh nhật game là một cột mốc cảm xúc của cộng đồng, không chỉ là ngày phát hành thêm nội dung. Người chơi muốn nhìn thấy hành trình họ đã cùng tạo nên được công nhận ở quy mô xứng đáng. Vì thế, chiến dịch cần đồng thời tạo niềm tự hào cho người chơi hiện tại và đủ ngoạn mục để thu hút những người chưa từng bước vào thế giới Honkai.",
      en: "A game anniversary is an emotional community milestone, not merely another content update. Existing players want their shared journey recognized at scale, while newcomers need a compelling reason to look in. The campaign had to serve both needs at once.",
    },
    takeaway: {
      vi: "Khi OOH, sự kiện và social cùng kể một câu chuyện, chiến dịch sinh nhật vượt khỏi phạm vi khuyến mãi để trở thành một khoảnh khắc văn hóa của cộng đồng game.",
      en: "By aligning OOH, events and social around one story, the anniversary moved beyond promotion and became a cultural moment for the gaming community.",
    },
  },
  "momo-influencer": {
    insight: {
      vi: "Với sản phẩm tài chính, độ nổi tiếng không tự động tạo ra niềm tin. Người dùng cần thấy ứng dụng xuất hiện trong những tình huống đời sống quen thuộc và được giải thích bằng ngôn ngữ họ sử dụng hằng ngày. Việc lựa chọn creator vì vậy phải dựa trên vai trò thuyết phục, không chỉ dựa vào lượng người theo dõi.",
      en: "For a financial product, fame does not automatically create trust. People need to see the app in familiar everyday situations, explained in language they actually use. Creator selection therefore had to be based on persuasive role, not follower count alone.",
    },
    takeaway: {
      vi: "Một hệ KOL đa tầng giúp MoMo vừa có độ phủ từ gương mặt lớn, vừa có tính gần gũi từ các cộng đồng nhỏ. Giá trị lớn nhất là biến tính năng tài chính thành những câu chuyện sử dụng dễ hiểu và dễ thử.",
      en: "A layered KOL portfolio gave MoMo both broad visibility and niche credibility. Its strongest contribution was turning financial features into simple, relatable use cases.",
    },
  },
  "mu-vinh-du-game": {
    insight: {
      vi: "Người chơi MU lâu năm không chỉ tìm một game mới; họ tìm cảm giác quen thuộc của lớp nhân vật, bang hội và những trận săn boss từng gắn với ký ức. Nhưng nếu chỉ nói về hoài niệm, sản phẩm khó thuyết phục người chơi mới. Chiến dịch cần cân bằng di sản MU với lý do trải nghiệm ngay ở thời điểm ra mắt.",
      en: "Veteran MU players are not simply looking for another game; they are looking for the familiar feeling of classes, guilds and boss hunts. Yet nostalgia alone cannot recruit new players. The launch needed to balance legacy with a clear reason to play now.",
    },
    takeaway: {
      vi: "KOL, báo chí và nội dung sản phẩm được vận hành như một hệ thống ra mắt thống nhất. Câu chuyện di sản tạo sự chú ý, còn hướng dẫn trải nghiệm và cộng đồng giúp sự chú ý chuyển thành hành động.",
      en: "KOL, press and product content operated as one launch system. Legacy earned attention, while gameplay education and community converted that attention into action.",
    },
  },
  "summoners-war-revival": {
    insight: {
      vi: "Với một tựa game lâu năm, thách thức không phải giới thiệu lại từ đầu mà là trả lời câu hỏi: vì sao người chơi nên quay lại lúc này? Mỗi thị trường lại có một cộng đồng, ngôn ngữ creator và động lực tái nhập game khác nhau, nên chiến dịch không thể dùng chung một công thức cho toàn khu vực.",
      en: "For a mature game, the challenge is not reintroduction but answering one question: why return now? Each market has different communities, creator languages and comeback motivations, so a single regional formula would not be enough.",
    },
    takeaway: {
      vi: "Chiến dịch tái kích hoạt hiệu quả khi creator có thể nối ký ức cũ với giá trị mới. Theo dõi dữ liệu theo thị trường giúp đội ngũ nhận ra nội dung nào khơi lại tò mò và nội dung nào thực sự thúc đẩy người chơi trở lại.",
      en: "Reactivation works when creators connect old memories with new value. Market-level monitoring helped distinguish content that sparked curiosity from content that genuinely encouraged return.",
    },
  },
  "dibao-ev": {
    insight: {
      vi: "Xe điện là một quyết định mua có mức cân nhắc cao: người dùng vừa quan tâm thiết kế, vừa cần tin vào khả năng sử dụng thực tế. Một gương mặt đại diện chỉ hiệu quả khi hình ảnh của họ giúp thương hiệu trở nên gần gũi mà không làm lu mờ sản phẩm.",
      en: "An electric bike is a high-consideration purchase: people care about design but also need confidence in daily usability. A brand ambassador only works when their image makes the brand relatable without overshadowing the product.",
    },
    takeaway: {
      vi: "Sự kết hợp giữa đại diện hình ảnh, KOL/KOC và video sản phẩm giúp Dibao đi từ nhận biết đến cân nhắc. Mỗi lớp nội dung giải quyết một câu hỏi khác nhau của khách hàng thay vì lặp lại cùng một thông điệp quảng cáo.",
      en: "The combination of ambassador, KOL/KOC and product video moved Dibao from awareness toward consideration. Each content layer answered a different customer question instead of repeating one advertising message.",
    },
  },
  "nguyet-mong": {
    insight: {
      vi: "Nguyệt Mộng có nhiều điểm hấp dẫn nhưng cũng dễ bị truyền thông phân tán giữa cốt truyện, thời trang và chiến thuật. Cơ hội nằm ở việc dùng lựa chọn và định mệnh làm sợi dây chung: người yêu câu chuyện, người thích tạo hình và người chơi đội hình đều có thể nhìn thấy một lý do riêng để bước vào cùng một thế giới.",
      en: "Nguyệt Mộng offered several attractive layers, but communications could easily fragment across story, fashion and strategy. Choice and destiny became the unifying thread, giving narrative fans, visual explorers and tactical players different reasons to enter the same world.",
    },
    takeaway: {
      vi: "Một thế giới game trở nên đáng nhớ khi từng nội dung không đứng riêng lẻ mà cùng mở rộng một lời hứa chung. Hệ thống nhân vật và chủ đề định mệnh giúp ANBU duy trì sự nhất quán xuyên suốt teaser, launch và hậu ra mắt.",
      en: "A game world becomes memorable when every asset expands one shared promise. The character system and destiny theme kept communications consistent across teaser, launch and post-launch phases.",
    },
  },
  focallure: {
    insight: {
      vi: "Với một thương hiệu mỹ phẩm mới, người dùng không chỉ cần biết sản phẩm tồn tại; họ cần nhìn thấy màu, chất liệu và kết quả trên những gương mặt gần với mình. Review có giá trị nhất khi creator giúp người xem tự trả lời: sản phẩm này có hợp với nhu cầu, phong cách và ngân sách của tôi không?",
      en: "For a new beauty brand, awareness is not enough. People need to see color, texture and performance on faces they can relate to. A useful review helps each viewer answer whether the product fits their needs, style and budget.",
    },
    takeaway: {
      vi: "ANBU phân vai nền tảng và định dạng thay vì sao chép một video lên mọi kênh. Nội dung dài xây niềm tin, short-form tạo ham muốn khám phá, còn social commerce rút ngắn khoảng cách từ quan tâm đến mua hàng.",
      en: "ANBU assigned distinct jobs to each platform instead of duplicating one video everywhere. Long-form content built trust, short-form sparked discovery and social commerce shortened the path from interest to purchase.",
    },
  },
  "douluo-soul-master-duel": {
    insight: {
      vi: "Sức mạnh IP tạo ra nhận biết nhanh nhưng cũng kéo theo kỳ vọng cao từ fan nguyên tác. Nếu nội dung chỉ nhắc tên nhân vật, người chơi mới khó hiểu gameplay; nếu chỉ nói cơ chế, chiến dịch lại mất chất Đấu La. Giải pháp là để từng nhóm creator đảm nhận một vai trò giải thích khác nhau.",
      en: "A strong IP creates instant awareness but also high expectations. Character references alone do not explain gameplay, while mechanics alone lose the Soul Land identity. Different creator groups therefore needed distinct explanatory roles.",
    },
    takeaway: {
      vi: "Cấu trúc creator theo ba lớp giúp chiến dịch giữ được chiều sâu IP mà vẫn dễ tiếp cận. Câu chuyện thu hút fan, nội dung hệ thống giảm rào cản nhập môn và hoạt động cộng đồng tạo lý do thảo luận sau ngày ra mắt.",
      en: "A three-layer creator structure protected IP depth while remaining accessible. Storytelling attracted fans, system content lowered onboarding barriers and community formats sustained conversation after launch.",
    },
  },
  "goi-ta-dai-chuong-quy": {
    insight: {
      vi: "Game mô phỏng kinh doanh thường có nhiều hệ thống nhưng khó truyền tải bằng quảng cáo tính năng. Người xem dễ nhớ một tình huống hài hước, một quyết định lời–lỗ hoặc hành trình đổi đời hơn là danh sách cơ chế. Vì vậy, gameplay cần được chuyển thành câu chuyện ngắn có nhân vật và xung đột.",
      en: "Business simulation games contain many systems that are difficult to sell through feature lists. Audiences remember a funny situation, a profit-or-loss decision or a rise-to-success story more easily than mechanics. Gameplay therefore needed to become short stories with characters and tension.",
    },
    takeaway: {
      vi: "Khi creator được trao một vai diễn rõ ràng, nội dung quảng bá trở thành giải trí trước khi trở thành quảng cáo. Đây là cách chiến dịch mở rộng khỏi tệp game thủ mà vẫn dẫn người xem trở lại trải nghiệm quản lý trong game.",
      en: "When creators receive a clear role, promotional content becomes entertainment before it becomes advertising. This broadened reach beyond gamers while still leading audiences back to the management experience.",
    },
  },
  "thien-tai-kinh-doanh": {
    insight: {
      vi: "Khát vọng làm chủ hấp dẫn không phải vì con số tài sản, mà vì cảm giác được tự quyết định và nhìn thấy lựa chọn tạo ra kết quả. Nội dung cần khiến người xem tự đặt mình vào vị trí điều hành: nếu là bạn, bạn sẽ đầu tư, tuyển người hay mở rộng theo cách nào?",
      en: "The fantasy of ownership is compelling not because of wealth alone, but because of agency and visible consequences. Content needed to place viewers in the executive seat: what would you invest in, whom would you hire and how would you expand?",
    },
    takeaway: {
      vi: "Thay vì chỉ khoe sự giàu có trong game, chiến dịch tập trung vào lựa chọn và năng lực điều hành. Điều đó tạo ra nhiều chủ đề tranh luận tự nhiên hơn, đồng thời giúp gameplay trở nên dễ hình dung ngay cả với người chưa từng chơi thể loại này.",
      en: "Instead of showing wealth alone, the campaign focused on choices and executive ability. That created more natural debate topics and made the gameplay understandable even to category newcomers.",
    },
  },
  "tam-quoc-cong-thanh-thien-ha": {
    insight: {
      vi: "Trong một thị trường có nhiều game Tam Quốc, hình ảnh danh tướng không còn đủ tạo khác biệt. Người chơi chiến thuật muốn thấy quyết định của mình có trọng lượng: chọn liên minh, xây trận hình và phối hợp công thành phải tạo ra câu chuyện thắng–thua mà cộng đồng có thể bàn luận.",
      en: "In a crowded Three Kingdoms category, famous generals alone are no longer distinctive. Strategy players want decisions to carry weight: alliances, formations and siege coordination should create win-or-loss stories worth discussing.",
    },
    takeaway: {
      vi: "ANBU đưa chiến thuật ra phía trước thay vì chỉ dựa vào IP. Livestream, phân tích đội hình và đối đầu liên minh biến chiều sâu hệ thống thành nội dung có kịch tính, giúp thương hiệu game tạo được tiếng nói riêng.",
      en: "ANBU put strategy ahead of IP familiarity. Livestreams, formation analysis and alliance rivalry turned system depth into dramatic content and gave the title a distinct voice.",
    },
  },
  "mu-vuot-thoi-dai": {
    insight: {
      vi: "Di sản MU là lợi thế lớn nhưng cũng có thể khiến truyền thông chỉ nói với người chơi cũ. Để mở rộng tệp, chiến dịch cần giữ những biểu tượng quen thuộc cho thế hệ kỳ cựu, đồng thời dùng creator và định dạng hiện đại để giải thích vì sao trải nghiệm vẫn phù hợp hôm nay.",
      en: "MU heritage is a powerful asset but can make communications speak only to veterans. Growth required familiar symbols for long-time players alongside modern creator formats that explained why the experience still matters today.",
    },
    takeaway: {
      vi: "Cách tiếp cận đa thế hệ giúp hoài niệm trở thành điểm khởi đầu chứ không phải toàn bộ thông điệp. Ký ức tạo sự nhận ra; nội dung trải nghiệm mới tạo lý do tham gia.",
      en: "A cross-generation approach made nostalgia the opening, not the entire message. Memory created recognition; new-experience content created a reason to participate.",
    },
  },
  "football-master-2": {
    insight: {
      vi: "Người hâm mộ bóng đá luôn có quan điểm về đội hình, cầu thủ và chiến thuật. Đó chính là chất liệu nội dung tự nhiên nhất cho một game quản lý: thay vì giải thích tính năng, hãy tạo tình huống để creator bảo vệ lựa chọn của mình và mời cộng đồng phản biện.",
      en: "Football fans always have opinions about squads, players and tactics. That is the most natural content material for a management game: rather than explaining features, creators defend choices and invite the community to challenge them.",
    },
    takeaway: {
      vi: "Khi lịch nội dung bám nhịp bóng đá thật, game không còn đứng ngoài cuộc trò chuyện. Dự đoán, tranh luận và thử thách đội hình giúp sản phẩm xuất hiện như một công cụ để người hâm mộ thể hiện hiểu biết của mình.",
      en: "By following the real football calendar, the game joined an existing conversation. Predictions, debates and squad challenges positioned it as a way for fans to express their football knowledge.",
    },
  },
  "life-makeover": {
    insight: {
      vi: "Life Makeover cạnh tranh không chỉ với game thời trang mà còn với toàn bộ nội dung self-expression trên social. Người xem bị thu hút khi họ thấy một ý tưởng có thể biến thành phong cách, nhân vật hoặc không gian mang dấu ấn cá nhân, chứ không chỉ khi được giới thiệu thêm một bộ trang phục đẹp.",
      en: "Life Makeover competes not only with fashion games but with the wider world of social self-expression. Audiences respond when an idea becomes a personal style, character or space, not simply when another beautiful outfit is shown.",
    },
    takeaway: {
      vi: "Việc phân nhóm fashion, beauty và lifestyle creator mở ra nhiều cửa vào sản phẩm. Mỗi creator kể một phần khác nhau của thế giới game, còn transformation và UGC giúp cộng đồng trở thành đồng tác giả của chiến dịch.",
      en: "Fashion, beauty and lifestyle creator groups created multiple entry points. Each told a different part of the product story, while transformation formats and UGC made the community a co-author of the campaign.",
    },
  },
  "onmyoji-arena": {
    insight: {
      vi: "Trong MOBA, người mới cần được giảm cảm giác phức tạp còn người chơi lâu năm cần nội dung đủ sâu để tôn trọng hiểu biết của họ. Bản sắc mỹ thuật giúp Onmyoji Arena được nhận ra, nhưng nội dung vai trò, meta và kỹ năng mới là thứ giữ cuộc trò chuyện tiếp tục.",
      en: "In a MOBA, newcomers need complexity reduced while veterans need depth that respects their knowledge. Visual identity earns recognition, but role, meta and skill content keeps conversation alive.",
    },
    takeaway: {
      vi: "Hệ creator theo cấp độ và vị trí giúp một chiến dịch phục vụ nhiều tầng người chơi mà không làm loãng thông điệp. Nội dung nhập môn mở cửa, livestream và phân tích meta tạo chiều sâu, còn highlight giữ nhịp cảm xúc cộng đồng.",
      en: "A creator system organized by skill level and role served multiple player groups without diluting the message. Onboarding opened the door, livestream and meta analysis added depth, and highlights sustained emotion.",
    },
  },
};
