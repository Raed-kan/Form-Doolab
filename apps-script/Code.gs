/* ============================================================
   دولاب — Google Apps Script لاستقبال البريفات وحفظها في Google Sheet
   ------------------------------------------------------------
   • كل استبيان يروح لتبويب (Sheet) مستقل: الهوية / تسويق / تقنية
   • الصور والملفات تُحفظ في مجلد على Google Drive وتُوضع روابطها
   • راجع SETUP.md لخطوات النشر
   ============================================================ */

// اسم مجلد Google Drive الذي ستُحفظ فيه ملفات العملاء (يُنشأ تلقائياً)
var DRIVE_FOLDER = "Doolab Briefs - مرفقات";

// خريطة أنواع الاستبيانات → اسم التبويب في الشيت
var FORM_SHEETS = {
  identity:  "الهوية",
  marketing: "تسويق",
  tech:      "تقنية"
};

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var sheetName = FORM_SHEETS[payload.form] || payload.formTitle || "بريف";
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);

    var ordered = payload.ordered || [];
    var labels  = ordered.map(function (c) { return c.label; });

    // رفع الملفات (إن وجدت) وتجميع الروابط حسب الحقل
    var fileLinksByField = {};
    (payload.files || []).forEach(function (f) {
      var url = saveFile_(f, payload);
      if (!fileLinksByField[f.label]) fileLinksByField[f.label] = [];
      fileLinksByField[f.label].push(url);
    });
    var allFileLinks = [];
    Object.keys(fileLinksByField).forEach(function (k) {
      allFileLinks.push(k + ": " + fileLinksByField[k].join(" , "));
    });

    // ترويسة الأعمدة (أول مرة فقط)
    var header = ["وقت الإرسال"].concat(labels).concat(["المرفقات"]);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(header);
      formatHeader_(sheet, header.length);
    }

    // الصف الجديد
    var when = Utilities.formatDate(new Date(payload.submittedAt || new Date()), "Asia/Riyadh", "yyyy-MM-dd HH:mm");
    var row = [when].concat(ordered.map(function (c) { return c.value; })).concat([allFileLinks.join("\n")]);
    sheet.appendRow(row);

    return json_({ status: "ok" });
  } catch (err) {
    return json_({ status: "error", message: String(err) });
  }
}

function saveFile_(f, payload) {
  var folder = getFolder_();
  var parts = (f.dataUrl || "").split(",");
  var meta = parts[0] || "";
  var b64 = parts[1] || "";
  var contentType = (meta.match(/data:(.*?);base64/) || [])[1] || f.type || "application/octet-stream";
  var bytes = Utilities.base64Decode(b64);
  var prefix = (payload.form || "brief") + "_" + Utilities.formatDate(new Date(), "Asia/Riyadh", "yyyyMMdd-HHmmss") + "_";
  var blob = Utilities.newBlob(bytes, contentType, prefix + (f.name || "file"));
  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

function getFolder_() {
  var it = DriveApp.getFoldersByName(DRIVE_FOLDER);
  return it.hasNext() ? it.next() : DriveApp.createFolder(DRIVE_FOLDER);
}

function formatHeader_(sheet, cols) {
  var r = sheet.getRange(1, 1, 1, cols);
  r.setBackground("#24205d").setFontColor("#fcf5e5").setFontWeight("bold")
   .setVerticalAlignment("middle").setWrap(true);
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 44);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// اختبار سريع من المتصفّح للتأكد أن الرابط شغّال
function doGet() {
  return ContentService.createTextOutput("Doolab Briefs endpoint is live ✦")
    .setMimeType(ContentService.MimeType.TEXT);
}
