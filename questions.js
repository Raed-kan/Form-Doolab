/* ============================================================
   دولاب — بريف موحّد (تصميم · تسويق · تقنية)
   ------------------------------------------------------------
   • العميل يختار الخدمة/الخدمات أولاً
   • أسئلة تعريفية مشتركة تُسأل مرة
   • ثم أسئلة تخصصية لكل خدمة مختارة
   • كل خدمة تُرسَل لتبويبها الخاص في الشيت (form)
   ============================================================ */

const FORM_TITLE = "بريف دولاب";

/* شاشة الترحيب */
const WELCOME = {
  type: "welcome",
  title: "بريف دولاب",
  subtitle: "خلّنا نرتّب دولابك الإبداعي ✦\nاختر خدمتك، جاوب بصدق وعلى راحتك، وخلّ الباقي علينا.",
  note: "يأخذ تقريباً ٥–٨ دقائق · إجاباتك تُحفظ تلقائياً",
  button: "نبدأ"
};

/* شاشة اختيار الخدمة (اختيار متعدّد) */
const SERVICE_SELECT = {
  id: "services",
  type: "service",
  section: "الخدمة",
  title: "وش الخدمة اللي تبغاها من دولاب؟",
  subtitle: "تقدر تختار أكثر من خدمة — وكل وحدة نسألك أسئلتها الخاصة."
};

/* شاشة النهاية */
const END = {
  type: "end",
  title: "تم! استلمنا بريفك ✦",
  subtitle: "وصلت طلباتك لفريق دولاب، وبنرتّب لك كل قطعة في دولابك الإبداعي.\nبنتواصل معك قريباً.",
  button: "إرسال طلب جديد"
};

/* ============ أسئلة تعريفية مشتركة (لكل الخدمات) ============ */
const COMMON = [
  { id: "brand_name", section: "التعريف", type: "short", required: true,
    title: "وش اسم البراند أو النشاط؟", placeholder: "اسم العلامة التجارية" },

  { id: "contact_name", section: "التعريف", type: "short", required: true,
    title: "وش اسمك الكريم؟", subtitle: "عشان نعرف مع مين نتكلم 🙌", placeholder: "الاسم" },

  { id: "email", section: "التعريف", type: "email", required: true,
    title: "إيميلك؟", subtitle: "نرسل لك التحديثات عليه.", placeholder: "name@example.com" },

  { id: "phone", section: "التعريف", type: "tel", required: true,
    title: "رقم الجوال أو الواتساب؟", placeholder: "+966 5X XXX XXXX" },

  { id: "about", section: "التعريف", type: "long", required: true,
    title: "عرّفنا عن نشاطك بإيجاز", subtitle: "وش تقدّمون؟ ومنذ متى؟", placeholder: "نحن..." },

  { id: "sector", section: "التعريف", type: "short", optional: true,
    title: "مجال أو قطاع عملك؟", subtitle: "اختياري.", placeholder: "مثال: مطاعم، تقنية، أزياء…" },

  { id: "audience", section: "التعريف", type: "long", required: true,
    title: "مين جمهورك المستهدف؟", subtitle: "اوصف عميلك المثالي: فئته، اهتماماته، منطقته.", placeholder: "جمهوري هو..." },

  { id: "has_brand", section: "التعريف", type: "single",
    title: "عندك هوية بصرية جاهزة؟",
    options: ["نعم، كاملة", "نعم، بس ناقصة/قديمة", "لا، ما عندي"] }
];

/* ============ أسئلة ختامية مشتركة ============ */
const SHARED_END = [
  { id: "deadline", section: "أخيراً", type: "date", optional: true,
    title: "متى تتمنى تستلم العمل؟", subtitle: "اختياري." },

  { id: "notes", section: "أخيراً", type: "long", optional: true,
    title: "أي شي ثاني تبغى نعرفه؟",
    subtitle: "ملاحظات، أحلام للمشروع، أو أي تفصيل مهم — اختياري.", placeholder: "..." }
];

/* ============ الخدمات وأسئلتها التخصصية ============ */
const SERVICES = [
  /* ---------- التصميم والهوية ---------- */
  {
    key: "design",
    form: "identity",
    label: "الهوية والتصميم",
    desc: "شعار، هوية بصرية، وتصاميم",
    icon: "✦",
    intro: { kicker: "الهوية والتصميم", title: "نبني هويتك", subtitle: "أسئلة تساعدنا نفهم روح علامتك البصرية." },
    questions: [
      { id: "d_offering", section: "الهوية", type: "long", required: true,
        title: "وش المنتج أو الخدمة اللي تبغى الهوية تركّز عليها؟", placeholder: "أهم ما تقدّمه..." },

      { id: "d_differentiator", section: "الهوية", type: "long", required: true,
        title: "وش يميّزك عن المنافسين؟", subtitle: "ليش يختارك العميل؟", placeholder: "ما يميّزنا..." },

      { id: "d_mission", section: "الهوية", type: "long", optional: true,
        title: "وش رسالتك أو الهدف الأكبر من البراند؟", placeholder: "نسعى إلى..." },

      { id: "d_personality", section: "الهوية", type: "multi", maxChoices: 3,
        title: "لو البراند شخص، كيف شخصيته؟", subtitle: "اختر ٣ كحدٍّ أقصى.",
        options: ["عصري", "فخم وراقٍ", "مرح وودود", "جاد ومحترف", "جريء ومختلف", "أنيق ومينمال", "دافئ وإنساني", "تقني ومبتكر"] },

      { id: "d_tone", section: "الهوية", type: "single",
        title: "نبرة الصوت اللي تبغاها؟",
        options: ["رسمي ومحترف", "ودّي وقريب", "فخم وفاخر", "جريء وعفوي", "بسيط ومباشر"] },

      { id: "d_keywords", section: "الهوية", type: "short", required: true,
        title: "أعطنا ٣–٥ كلمات تبغى الناس تحسّها عن البراند", placeholder: "مثال: ثقة، فخامة، ابتكار" },

      { id: "d_mood", section: "الهوية", type: "multi",
        title: "وش الأجواء اللونية اللي تميل لها؟",
        options: ["داكن وفخم", "فاتح ونظيف", "دافئة (ترابي/برتقالي)", "باردة (أزرق/تركوازي)", "ملوّن وحيوي", "أحادي/مينمال", "ذهبي فاخر", "ما عندي تفضيل"] },

      { id: "d_colors_ref", section: "الهوية", type: "upload", optional: true, allowImage: true,
        title: "عندك ألوان تحبها؟ ارفع مود بورد أو اكتب الأكواد",
        subtitle: "صور أو أكواد ألوان (HEX) — اختياري.", notePlaceholder: "ملاحظة أو أكواد مثل ‎#24205d" },

      { id: "d_logo_style", section: "الهوية", type: "single",
        title: "ستايل اللوقو المفضّل؟",
        options: ["نصي — الاسم فقط (Wordmark)", "أيقونة رمزية + نص", "حروف أولى (Monogram)", "مجرّد/رمزي", "مو متأكد — أبغى توصيتكم"] },

      { id: "d_era", section: "الهوية", type: "scale", min: 1, max: 5,
        title: "وين تميل الهوية؟", leftLabel: "تراثي / كلاسيكي", rightLabel: "عصري / مستقبلي" },

      { id: "d_likes", section: "الهوية", type: "upload", optional: true, allowImage: true,
        title: "هويات أو علامات تعجبك؟", subtitle: "ارفع صور واكتب ليش أعجبتك — اختياري.", notePlaceholder: "أعجبني فيها..." },

      { id: "d_dislikes", section: "الهوية", type: "upload", optional: true, allowImage: true,
        title: "هويات ما تعجبك؟ (نتجنّبها)", subtitle: "اختياري.", notePlaceholder: "ما أحب..." },

      { id: "d_applications", section: "الهوية", type: "multi",
        title: "وين بتستخدم الهوية؟",
        options: ["سوشال ميديا", "موقع إلكتروني", "تطبيق", "تغليف ومنتجات", "لافتات ومحل", "مطبوعات", "إعلانات", "يونيفورم", "كل ما سبق"] },

      { id: "d_current_files", section: "الهوية", type: "upload", optional: true, allowImage: true,
        title: "لو عندك شعار/هوية حالية أو ملفات مرجعية، ارفعها", subtitle: "اختياري.", notePlaceholder: "ملاحظة عن الملفات" },

      { id: "d_budget", section: "الهوية", type: "single", optional: true,
        title: "الميزانية التقريبية للهوية؟", subtitle: "اختياري.",
        options: ["أقل من ٥٬٠٠٠ ﷼", "٥٬٠٠٠ – ١٥٬٠٠٠ ﷼", "١٥٬٠٠٠ – ٣٠٬٠٠٠ ﷼", "أكثر من ٣٠٬٠٠٠ ﷼", "أفضّل نناقشها"] }
    ]
  },

  /* ---------- التسويق ---------- */
  {
    key: "marketing",
    form: "marketing",
    label: "التسويق",
    desc: "إدارة حسابات، مؤثرين، وحملات",
    icon: "📣",
    intro: { kicker: "التسويق", title: "نكبّر وصولك", subtitle: "أسئلة تساعدنا نبني خطة تسويق تناسبك." },
    questions: [
      { id: "m_services", section: "التسويق", type: "multi",
        title: "أي خدمة تسويقية تبغاها؟", subtitle: "اختر كل ما ينطبق.",
        options: ["إدارة حسابات سوشال", "حملات مع مؤثرين", "حملات ترويجية / إعلانات ممولة", "استراتيجية ومحتوى", "تصوير وإنتاج", "أخرى"] },

      { id: "m_accounts", section: "التسويق", type: "long", optional: true,
        title: "حساباتك على السوشال حالياً؟", subtitle: "حط الروابط — اختياري.", placeholder: "انستقرام: \nتيك توك: \nX: " },

      { id: "m_platforms", section: "التسويق", type: "multi",
        title: "وش المنصات اللي تبغى نشتغل عليها؟",
        options: ["انستقرام", "تيك توك", "سناب شات", "X (تويتر)", "لينكدإن", "يوتيوب", "ثريدز", "الكل"] },

      { id: "m_goal", section: "التسويق", type: "multi",
        title: "وش الهدف الأساسي من التسويق؟",
        options: ["زيادة الوعي بالعلامة", "زيادة المتابعين والتفاعل", "زيادة المبيعات", "جمع عملاء محتملين (Leads)", "إطلاق منتج/خدمة", "بناء سمعة ومكانة"] },

      { id: "m_competitors", section: "التسويق", type: "long", optional: true,
        title: "أبرز منافسينك؟ وحسابات تعجبك كمرجع؟", subtitle: "أسماء أو روابط — اختياري.", placeholder: "منافسين: \nحسابات ملهمة: " },

      { id: "m_tone", section: "التسويق", type: "single",
        title: "نبرة المحتوى اللي تناسبك؟",
        options: ["رسمي ومحترف", "ودّي وقريب", "فخم وفاخر", "جريء وعفوي", "مرح وترفيهي"] },

      { id: "m_materials", section: "التسويق", type: "upload", optional: true, allowImage: true,
        title: "عندك مواد جاهزة (صور/فيديو/شعار)؟", subtitle: "ارفعها هنا — اختياري.", notePlaceholder: "ملاحظة عن المواد" },

      { id: "m_influencers", section: "التسويق", type: "multi", optional: true,
        title: "لو تبغى مؤثرين — أي نوع؟", subtitle: "اختياري (تخطّاه لو ما ينطبق).",
        options: ["مايكرو (أقل من ١٠٠ألف)", "ماكرو (١٠٠ألف–مليون)", "مشاهير (+مليون)", "مؤثرين متخصصين بمجالي", "مو متأكد — أبغى توصيتكم"] },

      { id: "m_budget", section: "التسويق", type: "single", optional: true,
        title: "الميزانية الشهرية التقريبية للتسويق؟", subtitle: "اختياري.",
        options: ["أقل من ٥٬٠٠٠ ﷼", "٥٬٠٠٠ – ١٥٬٠٠٠ ﷼", "١٥٬٠٠٠ – ٥٠٬٠٠٠ ﷼", "أكثر من ٥٠٬٠٠٠ ﷼", "أفضّل نناقشها"] }
    ]
  },

  /* ---------- التقنية ---------- */
  {
    key: "tech",
    form: "tech",
    label: "التقنية",
    desc: "UX/UI، مواقع، ومتاجر سلة",
    icon: "💻",
    intro: { kicker: "التقنية", title: "نبني منتجك الرقمي", subtitle: "أسئلة تساعدنا نفهم مشروعك التقني." },
    questions: [
      { id: "t_services", section: "التقنية", type: "multi",
        title: "أي خدمة تقنية تبغاها؟", subtitle: "اختر كل ما ينطبق.",
        options: ["تصميم واجهات UX/UI", "برمجة موقع إلكتروني", "متجر سلة (Salla)", "تطبيق جوال", "لوحة تحكم / نظام", "أخرى"] },

      { id: "t_type", section: "التقنية", type: "single",
        title: "نوع المشروع الأقرب؟",
        options: ["موقع تعريفي", "متجر إلكتروني", "تطبيق جوال", "لوحة تحكم/نظام إداري", "متجر سلة", "غير ذلك"] },

      { id: "t_current", section: "التقنية", type: "short", optional: true,
        title: "عندك موقع أو متجر حالي؟", subtitle: "حط الرابط — اختياري.", placeholder: "https://" },

      { id: "t_desc", section: "التقنية", type: "long", required: true,
        title: "وصف الفكرة أو المشروع", subtitle: "وش تبغى تبني بالضبط؟", placeholder: "أبغى..." },

      { id: "t_features", section: "التقنية", type: "multi",
        title: "أهم المميزات المطلوبة؟",
        options: ["دفع إلكتروني", "تسجيل دخول/حسابات", "حجز مواعيد", "لوحة تحكم", "تعدّد لغات", "ربط API/أنظمة", "مدوّنة", "إشعارات", "بحث وفلترة", "مو متأكد"] },

      { id: "t_refs", section: "التقنية", type: "upload", optional: true, allowImage: true,
        title: "أمثلة مواقع/تطبيقات تعجبك؟", subtitle: "روابط أو لقطات شاشة — اختياري.", notePlaceholder: "الرابط + وش أعجبك فيه" },

      { id: "t_content", section: "التقنية", type: "single",
        title: "المحتوى (نصوص/صور) جاهز عندك؟",
        options: ["نعم، جاهز كامل", "جزء منه", "لا، أحتاج مساعدة فيه"] },

      { id: "t_hosting", section: "التقنية", type: "single",
        title: "تبغى استضافة ودومين معنا؟",
        options: ["نعم، أبغاها كاملة", "عندي دومين بس أبغى استضافة", "عندي الاثنين", "مو متأكد"] },

      { id: "t_salla", section: "التقنية", type: "long", optional: true,
        title: "لو متجر سلة — وش المطلوب بالضبط؟",
        subtitle: "اختياري (تخطّاه لو ما ينطبق).", placeholder: "ثيم مخصص / تصميم واجهة / برمجة إضافات / ربط..." },

      { id: "t_budget", section: "التقنية", type: "single", optional: true,
        title: "الميزانية التقريبية للمشروع التقني؟", subtitle: "اختياري.",
        options: ["أقل من ١٠٬٠٠٠ ﷼", "١٠٬٠٠٠ – ٣٠٬٠٠٠ ﷼", "٣٠٬٠٠٠ – ٧٠٬٠٠٠ ﷼", "أكثر من ٧٠٬٠٠٠ ﷼", "أفضّل نناقشها"] }
    ]
  }
];
