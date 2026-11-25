# Lesson 07 — Streams in Node.js 🌊
## Node.js Backend Mastery

> شرح مبسّط بالعربي + أمثلة عملية + أسئلة Interview + Assignment.

---

## 🎯 أهداف المحاضرة

بعد الدرس هتكون فاهم:
- يعني إيه Streams وليه بنستخدمها.
- الفرق بين `fs.readFile()` و `fs.createReadStream()`.
- مفهوم الـ Chunk.
- أنواع الـ Streams الأربعة.
- Readable و Writable و Duplex و Transform.
- Flowing Mode و Paused Mode.
- `highWaterMark`.
- `pipe()` و `pipeline()`.
- Backpressure و `drain`.
- Events المهمة.
- تطبيق نسخ الملفات وتحويل النص إلى Uppercase.

---

# 1. What are Streams?

الـ **Stream** طريقة للتعامل مع البيانات على أجزاء متتابعة بدل ما نحمل البيانات كلها في الذاكرة مرة واحدة.

تخيل ملف حجمه 5 GB:

- `fs.readFile()` بتقرأ الملف بالكامل وتجمع البيانات في الذاكرة قبل ما الـ callback تستقبلها.
- `fs.createReadStream()` بتتيح قراءة البيانات على أجزاء (Chunks)، ونقدر نعالج كل جزء أثناء وصوله.

Streams بتساعد على تقليل استخدام الذاكرة في كثير من الحالات، وتخلينا نبدأ المعالجة قبل اكتمال قراءة الملف.

> Streams مش معناها إن استهلاك الذاكرة صفر؛ هي بتساعد في التحكم في استهلاكها.

## مقارنة

```text
readFile:
File → تحميل كامل → Buffer كبيرة → معالجة

Streams:
File → Chunk 1 → معالجة
     → Chunk 2 → معالجة
     → Chunk 3 → معالجة
     → ...
```

---

# 2. What is a Chunk?

الـ **Chunk** هو جزء من البيانات بيمر من خلال الـ Stream.

في قراءة الملفات، الـ Chunk غالبًا بيكون `Buffer`.

```js
const fs = require("fs");

const readable = fs.createReadStream("data.txt");

readable.on("data", (chunk) => {
  console.log(chunk);           // Buffer
  console.log(chunk.toString()); // String
});
```

كل ما الـ Stream توفر جزء جديد في Flowing Mode، Event `data` ممكن يشتغل ويستقبل الجزء في `chunk`.

عدد وحجم الـ Chunks مش ثابتين بالضرورة؛ بيتأثروا بحجم الملف وإعدادات الـ Stream وطبيعة المصدر.

---

# 3. Types of Streams

Node.js عنده أربعة أنواع أساسية:

| النوع | الوظيفة | مثال |
|---|---|---|
| Readable | قراءة البيانات | `fs.createReadStream()` |
| Writable | كتابة البيانات | `fs.createWriteStream()` |
| Duplex | قراءة وكتابة | TCP Socket |
| Transform | قراءة ومعالجة وإخراج | تحويل النص أو ضغط البيانات |

## Readable

مصدر بنقرأ منه البيانات.

```js
const fs = require("fs");
const readable = fs.createReadStream("data.txt");
```

## Writable

وجهة بنكتب فيها البيانات.

```js
const fs = require("fs");
const writable = fs.createWriteStream("output.txt");
```

## Duplex

بتدعم القراءة والكتابة في الاتجاهين، مثل بعض الـ Network Sockets.

```text
إرسال بيانات ↔ Duplex Stream ↔ استقبال بيانات
```

## Transform

نوع من Duplex، لكن البيانات اللي داخلة ممكن تتعدل قبل خروجها، مثل Uppercase أو Compression.

```text
Input → Transform → Output
```

---

# 4. Readable Streams

## مثال أساسي

أنشئ ملف `data.txt`:

```text
Hello Node.js
Welcome to Backend Development
Streams are useful
```

ثم شغّل:

```js
const fs = require("fs");

const readable = fs.createReadStream("data.txt");

readable.on("data", (chunk) => {
  console.log("New Chunk:");
  console.log(chunk.toString());
});

readable.on("end", () => {
  console.log("Reading Completed");
});

readable.on("error", (err) => {
  console.error("Error:", err.message);
});
```

### Events

- `data`: استقبال Chunk في Flowing Mode.
- `end`: القراءة انتهت بشكل طبيعي.
- `error`: حصل خطأ أثناء القراءة.

---

# 5. Flowing Mode & Paused Mode

## Flowing Mode

البيانات بتتدفق تلقائيًا من خلال `data` event.

```js
readable.on("data", (chunk) => {
  console.log(chunk.toString());
});
```

## Paused Mode

تقدر تقرأ البيانات بنفسك باستخدام `read()`.

```js
const fs = require("fs");

const readable = fs.createReadStream("data.txt");

readable.on("readable", () => {
  let chunk;

  while ((chunk = readable.read()) !== null) {
    console.log(chunk.toString());
  }
});

readable.on("end", () => {
  console.log("Finished");
});
```

في Paused Mode، Event `readable` بيشير إن فيه بيانات متاحة للقراءة؛ وإنت بتستدعي `read()` للحصول عليها.

---

# 6. Writable Streams

بنستخدم `createWriteStream()` لكتابة البيانات على أجزاء.

```js
const fs = require("fs");

const writable = fs.createWriteStream("output.txt");

writable.write("Hello Node.js\n");
writable.write("Learning Streams\n");
writable.write("Backend Development\n");

writable.end();

writable.on("finish", () => {
  console.log("Writing Completed");
});

writable.on("error", (err) => {
  console.error("Error:", err.message);
});
```

## أهم methods/events

### `write(chunk)`

تكتب بيانات في Writable Stream. بترجع `true` أو `false` حسب حالة الـ buffering والـ backpressure.

### `end()`

بتعلن إنك خلصت إرسال البيانات للـ Writable. ممكن تمرر آخر Chunk:

```js
writable.end("Final data");
```

### `finish`

بيحدث بعد ما كل البيانات المرسلة للـ Writable يتم التعامل معها بنجاح.

---

# 7. highWaterMark

`highWaterMark` هو حدّ للـ buffering الداخلي للـ Stream. في Streams اللي بتتعامل مع Buffers، بيكون عادةً محسوب بالـ Bytes.

في `fs.createReadStream()`، القيمة الافتراضية غالبًا 64 KiB.

مثال تحديده إلى 10 Bytes:

```js
const fs = require("fs");

const readable = fs.createReadStream("data.txt", {
  highWaterMark: 10
});

readable.on("data", (chunk) => {
  console.log("Chunk Size:", chunk.length);
  console.log(chunk.toString());
});
```

القيمة 10 معناها إن الـ Stream بتحاول تقرأ أجزاء بحجم يصل إلى 10 Bytes في الظروف المعتادة؛ والجزء الأخير ممكن يكون أصغر. مش ضمان إن كل Chunk هتبقى نفس الحجم دائمًا.

---

# 8. pipe()

`pipe()` بتوصل Readable Stream بـ Writable Stream، وتساعد في نقل البيانات والتعامل مع backpressure.

## النسخ اليدوي

```js
const fs = require("fs");

const readable = fs.createReadStream("source.txt");
const writable = fs.createWriteStream("destination.txt");

readable.on("data", (chunk) => {
  writable.write(chunk);
});

readable.on("end", () => {
  writable.end();
});
```

## باستخدام pipe

```js
const fs = require("fs");

const readable = fs.createReadStream("source.txt");
const writable = fs.createWriteStream("destination.txt");

readable.pipe(writable);
```

`pipe()` بتوصل المصدر بالوجهة وبتنظم التدفق. افتراضيًا، Writable بتتنهى عند انتهاء Readable، إلا لو استخدمت إعدادات تمنع ده.

---

# 9. Backpressure

الـ **Backpressure** بتحصل لما مصدر البيانات أسرع من الوجهة اللي بتستقبلها.

مثال:
- Readable بتنتج بيانات بسرعة كبيرة.
- Writable بتكتب ببطء.
- البيانات ممكن تتراكم في Buffer داخلي.

```text
Readable (سريعة)
       ↓
Buffer / Queue (تراكم محتمل)
       ↓
Writable (أبطأ)
```

Streams بتدعم آليات تنظيم التدفق عشان تحد من التراكم غير المحدود.

## التعامل اليدوي

```js
const fs = require("fs");

const readable = fs.createReadStream("source.txt");
const writable = fs.createWriteStream("destination.txt");

readable.on("data", (chunk) => {
  const canContinue = writable.write(chunk);

  if (!canContinue) {
    readable.pause();
  }
});

writable.on("drain", () => {
  readable.resume();
});

readable.on("end", () => {
  writable.end();
});
```

- لو `write()` رجعت `false`، نوقف المصدر مؤقتًا.
- Event `drain` بيشير إن الـ Writable تقدر تستقبل المزيد بعد ما الـ buffer الداخلي يتعامل مع البيانات.
- بعدها نعمل `resume()`.

ده مثال تعليمي؛ في التطبيقات، `pipe()` أو `pipeline()` غالبًا أسهل وأأمن لإدارة التدفق.

---

# 10. pipeline()

`pipeline()` بتوصل Streams على مراحل، وبتساعد على إدارة الأخطاء وإنهاء/تنظيف سلسلة التدفق.

```js
const fs = require("fs");
const { pipeline } = require("stream");

pipeline(
  fs.createReadStream("source.txt"),
  fs.createWriteStream("destination.txt"),
  (err) => {
    if (err) {
      console.error("Pipeline Failed:", err.message);
      return;
    }

    console.log("File Copied Successfully");
  }
);
```

## مع async/await

```js
const fs = require("fs");
const { pipeline } = require("stream/promises");

async function copyFile() {
  try {
    await pipeline(
      fs.createReadStream("source.txt"),
      fs.createWriteStream("destination.txt")
    );

    console.log("Copy Completed");
  } catch (err) {
    console.error("Error:", err.message);
  }
}

copyFile();
```

## الفرق باختصار

- `pipe()` بتوصل Stream بغيرها وتدعم تدفق البيانات/backpressure.
- `pipeline()` بتوصل سلسلة Streams وبتوفر إدارة أفضل للأخطاء وإنهاء السلسلة.

---

# 11. Transform Streams

Transform Stream بتستقبل البيانات، تعدلها، وتطلع نتيجة.

مثال تحويل النص إلى Uppercase.

```js
const { Transform } = require("stream");

const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    const result = chunk.toString().toUpperCase();
    callback(null, result);
  }
});
```

## شرح transform()

```js
transform(chunk, encoding, callback)
```

- `chunk`: الجزء اللي وصل.
- `encoding`: Encoding الخاص بالجزء لو كان String؛ أما الـ Buffer فبيتم تمريره كـ Buffer.
- `callback`: لازم نستدعيه لإكمال معالجة الجزء الحالي.

```js
callback(null, result);
```

- أول argument: Error أو `null`.
- ثاني argument: البيانات الناتجة.

لو فيه خطأ:

```js
callback(error);
```

---

# 12. تطبيق Transform كامل

نقرأ ملف، نحول النص إلى Uppercase، ونكتب الناتج في ملف آخر.

```js
const fs = require("fs");
const { Transform, pipeline } = require("stream");

const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  }
});

pipeline(
  fs.createReadStream("source.txt"),
  upperCaseTransform,
  fs.createWriteStream("uppercase.txt"),
  (err) => {
    if (err) {
      console.error("Error:", err.message);
      return;
    }

    console.log("Transformation Completed");
  }
);
```

لو `source.txt`:

```text
Hello Node.js
Streams are powerful
```

ملف `uppercase.txt`:

```text
HELLO NODE.JS
STREAMS ARE POWERFUL
```

---

# 13. Copy Project

Structure:

```text
streams-lesson/
├── source.txt
├── copy.js
└── output.txt
```

`copy.js`:

```js
const fs = require("fs");
const { pipeline } = require("stream");

pipeline(
  fs.createReadStream("source.txt"),
  fs.createWriteStream("output.txt"),
  (err) => {
    if (err) {
      console.error("Copy Failed:", err.message);
      return;
    }

    console.log("Copy Completed Successfully");
  }
);
```

شغّل:

```bash
node copy.js
```

---

# 14. Streams في Backend

Streams بتظهر في حاجات كتير:

- File Uploads: نقل ملفات كبيرة على أجزاء.
- File Downloads: إرسال ملفات للمستخدم.
- HTTP Request/Response: تدفق بيانات الطلب والرد.
- Video/Audio: نقل ومعالجة الوسائط.
- Compression: ضغط البيانات.
- Encryption: تشفير تدفق البيانات.
- Processing: قراءة البيانات ومعالجتها أثناء وصولها.

---

# 15. أهم Events

| Event | معناه |
|---|---|
| `data` | استقبال Chunk في Flowing Mode |
| `end` | انتهاء قراءة Readable |
| `error` | حدوث خطأ |
| `finish` | انتهاء الكتابة في Writable |
| `close` | إغلاق Stream أو المورد المرتبط |
| `drain` | Writable أصبحت جاهزة لاستقبال المزيد بعد backpressure |
| `readable` | فيه بيانات جاهزة للقراءة |

مهم: مش كل Stream هتطلق كل Event، و`end` و`finish` و`close` مش مترادفين.

---

# 🧠 Interview Questions

### 1. What are Streams in Node.js?
طريقة للتعامل مع البيانات على أجزاء متتابعة بدل تحميلها بالكامل في الذاكرة مرة واحدة.

### 2. What is a Chunk?
جزء من البيانات بيمر عبر Stream، وغالبًا بيكون Buffer في قراءة الملفات.

### 3. What is the difference between readFile and createReadStream?
`readFile` بتجمع محتوى الملف بالكامل قبل إرجاعه للـ callback، بينما `createReadStream` بتسمح بالتعامل مع البيانات على أجزاء.

### 4. What are the four types of Streams?
Readable, Writable, Duplex, Transform.

### 5. What is Backpressure?
حالة المصدر فيها أسرع من الوجهة، فتحتاج Streams تنظيم تدفق البيانات لتجنب تراكم غير محدود.

### 6. What is highWaterMark?
حدّ للـ buffering الداخلي؛ وحدته Bytes في Streams اللي بتتعامل مع Buffers، وعدد عناصر في Object Mode.

### 7. What is the difference between pipe and pipeline?
`pipe` بتوصل Streams وتدعم تنظيم التدفق. `pipeline` بتوصل سلسلة وبتوفر إدارة أفضل للأخطاء وإنهاء السلسلة.

### 8. What does drain mean?
إن Writable Stream أصبحت جاهزة لاستقبال بيانات إضافية بعد ما الـ buffer الداخلي اتعامل مع البيانات.

### 9. What is a Transform Stream?
Stream بتقرأ البيانات وتعدلها قبل إخراجها، زي Uppercase أو Compression.

### 10. What is the difference between end and finish?
`end` لإنهاء القراءة في Readable، و`finish` لإنهاء الكتابة في Writable.

---

# 📝 Assignment — حل بنفسك

**ممنوع تبص على الحلول؛ مفيش حلول مرفقة في الملف.** اكتب كودك، وبعدها ابعته للمراجعة.

## Task 1 — Readable Stream

أنشئ `data.txt` فيه 5 سطور، واستخدم `createReadStream` عشان:
1. تطبع كل Chunk.
2. تحول كل Chunk إلى String.
3. تطبع `Reading Completed` عند انتهاء القراءة.
4. تتعامل مع Error.

## Task 2 — Chunk Size

اقرأ ملف باستخدام:

```js
highWaterMark: 10
```

مع كل Chunk:
- اطبع حجمها.
- اطبع محتواها.

## Task 3 — File Copy

استخدم:
- `createReadStream`
- `createWriteStream`
- `pipeline()`

لنسخ `source.txt` إلى `copy.txt`، وتعامل مع Errors.

## Task 4 — Transform

اقرأ `data.txt`، وحول كل محتواه إلى Uppercase باستخدام Transform Stream، واحفظه في `uppercase.txt`.

**ممنوع `readFile`؛ المطلوب Streams.**

## Task 5 — Challenge

اعمل برنامج:
1. يقرأ ملف.
2. يحول محتواه إلى Uppercase.
3. يكتب في ملف جديد.
4. يحسب عدد الـ Chunks التي مرّت.
5. عند النجاح يطبع:

```text
Total Chunks: [number]
Transformation Completed Successfully
```

استخدم:
- `createReadStream`
- `Transform`
- `createWriteStream`
- `pipeline`
- Error Handling

---

## 📁 Suggested GitHub Structure

```text
Node.js-Backend-Mastery/
│
├── 01-introduction/
├── 02-nodejs-architecture/
├── 03-core-modules/
├── 04-file-system/
├── 05-events-eventemitter/
├── 06-buffers/
│
└── 07-streams/
    ├── README.md
    └── examples/
        ├── 01-readable-stream.js
        ├── 02-writable-stream.js
        ├── 03-pipe-copy.js
        ├── 04-pipeline-copy.js
        └── 05-transform-uppercase.js
```

## Git Commands

```bash
git add .
git commit -m "Add Node.js Streams lesson"
git push
```

---

**End of Lesson 07 — Streams 🌊**

راجع المفاهيم، حل الـ Assignment بنفسك، وبعد التصحيح ننتقل للدرس التالي.
