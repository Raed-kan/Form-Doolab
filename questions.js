/* ============================================================
   دولاب — بريف الهوية البصرية
   بنية الأسئلة. لإضافة استبيان جديد (تسويق / تقنية) لاحقاً،
   انسخ هذا الملف بنفس الصيغة وغيّر FORM_ID و FORM_TITLE.
   ============================================================ */

const FORM_ID    = "identity";              // يُرسل للشيت لتمييز نوع الاستبيان
const FORM_TITLE = "بريف الهوية البصرية";

/* أنواع الأسئلة المدعومة:
   welcome  | statement | short | long | email | tel
   single   | multi     | scale | date | upload | end
*/

const QUESTIONS = [
  {
    type: "welcome",
    title: "بريف الهوية البصرية",
    subtitle: "خلّنا نرتّب دولابك الإبداعي ✦\nجاوب بصدق وعلى راحتك — كل إجابة تقرّبنا لهوية تشبهك تماماً.",
    note: "يأخذ تقريباً ٥–٧ دقائق · إجاباتك تُحفظ تلقائياً",
    button: "نبدأ"
  },

  /* ── القسم الأول: الأساسيات ── */
  { type: "statement", kicker: "القسم الأول", title: "نتعرّف عليك", subtitle: "معلومات سريعة نبدأ فيها." },

  { id: "brand_name", section: "الأساسيات", type: "short", required: true,
    title: "وش اسم البراند أو النشاط؟",
    placeholder: "اكتب اسم العلامة التجارية هنا" },

  { id: "contact_name", section: "الأساسيات", type: "short", required: true,
    title: "وش اسمك الكريم؟",
    subtitle: "عشان نعرف مع مين نتكلم 🙌",
    placeholder: "الاسم" },

  { id: "email", section: "الأساسيات", type: "email", required: true,
    title: "إيميلك؟",
    subtitle: "نرسل لك التحديثات والملفات عليه.",
    placeholder: "name@example.com" },

  { id: "phone", section: "الأساسيات", type: "tel", required: true,
    title: "رقم الجوال أو الواتساب؟",
    placeholder: "+966 5X XXX XXXX" },

  { id: "about", section: "الأساسيات", type: "long", required: true,
    title: "عرّفنا عن نشاطك بإيجاز",
    subtitle: "وش تقدّمون؟ ومتى بدأتم؟",
    placeholder: "نحن..." },

  /* ── القسم الثاني: العمل والسوق ── */
  { type: "statement", kicker: "القسم الثاني", title: "شغلك وسوقك", subtitle: "نفهم مجالك وجمهورك ومنافسيك." },

  { id: "main_offering", section: "العمل والسوق", type: "long", required: true,
    title: "وش المنتج أو الخدمة الرئيسية اللي تبغى الهوية تركّز عليها؟",
    placeholder: "أهم ما تقدّمه..." },

  { id: "audience_age", section: "العمل والسوق", type: "multi",
    title: "الفئة العمرية لجمهورك؟",
    subtitle: "اختر كل ما ينطبق.",
    options: ["١٨–٢٥", "٢٦–٣٥", "٣٦–٤٥", "أكثر من ٤٥", "كل الفئات"] },

  { id: "ideal_customer", section: "العمل والسوق", type: "long", required: true,
    title: "اوصف لنا عميلك المثالي",
    subtitle: "اهتماماته، أسلوب حياته، وش يهمّه؟",
    placeholder: "عميلي المثالي هو..." },

  { id: "competitors", section: "العمل والسوق", type: "long", optional: true,
    title: "مين أبرز منافسينك؟",
    subtitle: "أسماء أو روابط حساباتهم — اختياري.",
    placeholder: "منافس ١ — رابط\nمنافس ٢ — رابط" },

  { id: "differentiator", section: "العمل والسوق", type: "long", required: true,
    title: "وش يميّزك عن المنافسين؟",
    subtitle: "ليش يختارك العميل أنت بالذات؟",
    placeholder: "ما يميّزنا..." },

  /* ── القسم الثالث: جوهر العلامة ── */
  { type: "statement", kicker: "القسم الثالث", title: "روح العلامة", subtitle: "شخصية البراند وصوته وإحساسه." },

  { id: "mission", section: "جوهر العلامة", type: "long", required: true,
    title: "وش رسالتك أو الهدف الأكبر من البراند؟",
    placeholder: "نسعى إلى..." },

  { id: "personality", section: "جوهر العلامة", type: "multi", maxChoices: 3,
    title: "لو البراند شخص، كيف شخصيته؟",
    subtitle: "اختر ٣ كحدٍّ أقصى.",
    options: ["عصري", "فخم وراقٍ", "مرح وودود", "جاد ومحترف", "جريء ومختلف", "أنيق ومينمال", "دافئ وإنساني", "تقني ومبتكر"] },

  { id: "tone", section: "جوهر العلامة", type: "single",
    title: "نبرة الصوت اللي تبغاها في التواصل؟",
    options: ["رسمي ومحترف", "ودّي وقريب", "فخم وفاخر", "جريء وعفوي", "بسيط ومباشر"] },

  { id: "keywords", section: "جوهر العلامة", type: "short", required: true,
    title: "أعطنا ٣–٥ كلمات تبغى الناس تحسّها عن البراند",
    placeholder: "مثال: ثقة، فخامة، ابتكار" },

  /* ── القسم الرابع: الاتجاه البصري ── */
  { type: "statement", kicker: "القسم الرابع", title: "الاتجاه البصري", subtitle: "الألوان، الستايل، والمراجع — هنا تقدر ترفع صور 🎨" },

  { id: "mood", section: "الاتجاه البصري", type: "multi",
    title: "وش الأجواء اللونية اللي تميل لها؟",
    options: ["داكن وفخم", "فاتح ونظيف", "دافئة (ترابي/برتقالي)", "باردة (أزرق/تركوازي)", "ملوّن وحيوي", "أحادي/مينمال", "ذهبي فاخر", "ما عندي تفضيل"] },

  { id: "colors_ref", section: "الاتجاه البصري", type: "upload", optional: true, allowImage: true,
    title: "عندك ألوان تحبها؟ ارفع مود بورد أو اكتب الأكواد",
    subtitle: "صور، لقطات، أو أكواد ألوان (HEX) — اختياري.",
    notePlaceholder: "ملاحظة أو أكواد ألوان مثل ‎#24205d" },

  { id: "logo_style", section: "الاتجاه البصري", type: "single",
    title: "ستايل اللوقو المفضّل؟",
    options: ["نصي — الاسم فقط (Wordmark)", "أيقونة رمزية + نص", "حروف أولى (Monogram)", "مجرّد/رمزي", "مو متأكد — أبغى توصيتكم"] },

  { id: "era", section: "الاتجاه البصري", type: "scale", min: 1, max: 5,
    title: "وين تميل الهوية؟",
    leftLabel: "تراثي / كلاسيكي", rightLabel: "عصري / مستقبلي" },

  { id: "likes", section: "الاتجاه البصري", type: "upload", optional: true, allowImage: true,
    title: "هويات أو علامات تعجبك؟",
    subtitle: "ارفع صور واكتب ليش أعجبتك — اختياري.",
    notePlaceholder: "أعجبني فيها..." },

  { id: "dislikes", section: "الاتجاه البصري", type: "upload", optional: true, allowImage: true,
    title: "هويات ما تعجبك؟ (نتجنّبها)",
    subtitle: "اختياري — يساعدنا نعرف حدودك.",
    notePlaceholder: "ما أحب..." },

  /* ── القسم الخامس: التطبيقات ── */
  { type: "statement", kicker: "القسم الخامس", title: "أين ستعيش الهوية", subtitle: "نطاق الاستخدام والملفات الحالية." },

  { id: "applications", section: "التطبيقات", type: "multi",
    title: "وين بتستخدم الهوية؟",
    options: ["سوشال ميديا", "موقع إلكتروني", "تطبيق", "تغليف ومنتجات", "لافتات ومحل", "مطبوعات (كروت/بروشور)", "إعلانات", "يونيفورم", "كل ما سبق"] },

  { id: "has_brand", section: "التطبيقات", type: "single",
    title: "عندك هوية أو شعار حالي؟",
    options: ["لا، نبدأ من الصفر", "نعم، وأبغى تطوير عليها", "نعم، بس أبغى تغيير كامل"] },

  { id: "current_files", section: "التطبيقات", type: "upload", optional: true, allowImage: true,
    title: "لو عندك شعار/هوية حالية أو ملفات مرجعية، ارفعها",
    subtitle: "اختياري — صور أو ملفات.",
    notePlaceholder: "ملاحظة عن الملفات" },

  /* ── القسم السادس: اللوجستيات ── */
  { type: "statement", kicker: "القسم الأخير", title: "تفاصيل أخيرة", subtitle: "الميزانية والوقت — كلها اختيارية." },

  { id: "budget", section: "اللوجستيات", type: "single", optional: true,
    title: "الميزانية التقريبية للمشروع؟",
    subtitle: "تساعدنا نقترح الأنسب لك — اختياري.",
    options: ["أقل من ٥٬٠٠٠ ﷼", "٥٬٠٠٠ – ١٥٬٠٠٠ ﷼", "١٥٬٠٠٠ – ٣٠٬٠٠٠ ﷼", "أكثر من ٣٠٬٠٠٠ ﷼", "أفضّل نناقشها"] },

  { id: "deadline", section: "اللوجستيات", type: "date", optional: true,
    title: "متى تتمنى تستلم الهوية؟",
    subtitle: "اختياري." },

  { id: "notes", section: "اللوجستيات", type: "long", optional: true,
    title: "أي شي ثاني تبغى نعرفه؟",
    subtitle: "ملاحظات، أحلام للبراند، أو أي تفصيل مهم — اختياري.",
    placeholder: "..." },

  {
    type: "end",
    title: "تم! استلمنا بريفك ✦",
    subtitle: "وصلت إجاباتك لفريق دولاب، وبنرتّب لك كل قطعة في دولابك الإبداعي.\nبنتواصل معك قريباً.",
    button: "إرسال نسخة أخرى"
  }
];
