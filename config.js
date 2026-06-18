/* ============================================================
   إعدادات الربط
   ------------------------------------------------------------
   بعد ما تنشر Google Apps Script (راجع apps-script/SETUP.md)
   الصق رابط الـ Web App هنا بين علامتي التنصيص.
   مثال:
   const ENDPOINT_URL = "https://script.google.com/macros/s/AKfy.../exec";
   ============================================================ */
const ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbw5NO7SS4OnWtHMTQbaDR-4Hfo36pOf8_l4Bf5A0ayG3MbpNZJOuF4zmC126-YaA_Py/exec";

/* لا تعدّل تحت هذا السطر إلا إذا تبغى تغيّر السلوك */
const CONFIG = {
  endpoint: ENDPOINT_URL,
  maxFileMB: 8,        // أقصى حجم للملف الواحد
  maxFiles: 6,         // أقصى عدد ملفات للسؤال الواحد
  autosaveKey: "doolab_brief_identity"
};
