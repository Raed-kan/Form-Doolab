# دولاب · بريف الهوية البصرية

استبيان بريف بأسلوب Typeform بهوية وكالة **دولاب** الإبداعية — عربي، RTL، بألوان وخط دولاب، مع ربط مباشر بـ Google Sheet.

## المحتويات
```
doolab-brief/
├── index.html          ← الصفحة
├── styles.css          ← تصميم دولاب
├── questions.js        ← أسئلة استبيان الهوية (عدّلها بسهولة)
├── app.js              ← المحرّك (نمط Typeform)
├── config.js           ← ضع هنا رابط Google Sheet
├── assets/
│   ├── logo-mark.png    ← شعار دولاب
│   ├── favicon.png
│   └── fonts/           ← ضع ملفات خط Adapter Arabic هنا
└── apps-script/
    ├── Code.gs          ← سكربت Google Sheet
    └── SETUP.md         ← خطوات الربط
```

## التشغيل السريع
1. **اربط الشيت:** اتبع [`apps-script/SETUP.md`](apps-script/SETUP.md) وحط الرابط في [`config.js`](config.js).
2. **جرّب محلياً:** افتح `index.html` في المتصفّح مباشرة.

## الخط
الخط **Montserrat Arabic** مضمّن داخل المشروع (٦ أوزان في `assets/fonts/*.woff2`) — لا يحتاج أي إعداد إضافي ولا اتصال إنترنت خارجي.

## النشر على GitHub Pages
1. أنشئ Repository جديد على GitHub (مثلاً `doolab-brief`).
2. ارفع **كل محتويات مجلد `doolab-brief/`** إلى الـ Repo (الملفات تكون في الجذر).
3. في الـ Repo: **Settings ← Pages ← Source: Deploy from a branch ← Branch: `main` / `root` ← Save**.
4. بعد دقيقة يطلع رابط مثل: `https://<username>.github.io/doolab-brief/`.

> طريقة بدون أوامر: في صفحة الـ Repo اضغط **Add file ← Upload files** واسحب الملفات.

## تعديل الأسئلة
كل الأسئلة في [`questions.js`](questions.js). كل سؤال كائن فيه `type` و`title`. الأنواع:
`short` نص قصير · `long` نص طويل · `email` · `tel` · `single` خيار واحد · `multi` متعدّد (مع `maxChoices`) · `scale` مقياس · `date` تاريخ · `upload` رفع ملفات · `statement` شاشة فاصلة · `welcome` / `end`.
أضف `required: true` للإلزامي، أو `optional: true` للقابل للتخطّي.

## إضافة استبيان تسويق/تقنية لاحقاً
انسخ المجلد، غيّر `FORM_ID` و`FORM_TITLE` في `questions.js` إلى `marketing` أو `tech`، وبدّل الأسئلة. السكربت يوجّهها تلقائياً لتبويب مستقل في نفس الشيت.
