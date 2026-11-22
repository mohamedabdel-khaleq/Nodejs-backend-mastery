# Lesson 06 — Buffers (Part 2): Buffer Operations
## Node.js Backend Mastery 🚀

في الجزء ده هنكمل التعامل مع الـ `Buffer` ونتعلم شوية Methods مهمة بنستخدمها عشان ندمج الـ Buffers، نتحقق من نوع البيانات، ونحسب الحجم الحقيقي بالـ Bytes.

---

## 1) `Buffer.concat()`

### الفكرة
لو عندنا أكتر من Buffer وكل واحدة فيها جزء من البيانات، `Buffer.concat()` بتجمعهم في Buffer جديدة.

```js
const buffer1 = Buffer.from("Hello ");
const buffer2 = Buffer.from("Node ");
const buffer3 = Buffer.from("JS");

const result = Buffer.concat([buffer1, buffer2, buffer3]);

console.log(result.toString()); // Hello Node JS
console.log(result.length);    // 13
```

### شكل العملية

```text
Buffer 1: "Hello "
Buffer 2: "Node "
Buffer 3: "JS"
       |
       v
 Buffer.concat([...])
       |
       v
New Buffer: "Hello Node JS"
```

> `Buffer.concat()` لا تغيّر الـ Buffers الأصلية؛ بترجع Buffer جديدة فيها البيانات المجمعة.

### تحديد طول النتيجة

ممكن نحدد طول الـ Buffer الناتجة بالـ `totalLength` (اختياري):

```js
const b1 = Buffer.from("ABC");
const b2 = Buffer.from("DEF");
const b3 = Buffer.from("GHI");

const result = Buffer.concat([b1, b2, b3], 5);

console.log(result.toString()); // ABCDE
console.log(result.length);    // 5
```

لو الـ `totalLength` أصغر من إجمالي البيانات، النتيجة بتتقص عند الطول المحدد. ولو أكبر، المساحة الزائدة بتكون Bytes قيمتها `0`.

### Syntax

```js
Buffer.concat(list, totalLength)
```

- `list`: Array من الـ Buffers.
- `totalLength`: طول النتيجة بالـ Bytes، اختياري.

---

## 2) `Buffer.isBuffer()`

### الفكرة
بتتحقق هل القيمة Buffer فعلًا ولا لأ، وبترجع `true` أو `false`.

```js
const data = Buffer.from("Hello Node.js");

console.log(Buffer.isBuffer(data)); // true
console.log(Buffer.isBuffer("Hello Node.js")); // false
console.log(Buffer.isBuffer(100)); // false
console.log(Buffer.isBuffer([1, 2, 3])); // false
```

### مثال Type Check

```js
function processData(data) {
  if (Buffer.isBuffer(data)) {
    console.log("This is a Buffer");
    console.log(data.toString());
  } else {
    console.log("This is not a Buffer");
  }
}

processData(Buffer.from("Node.js"));
processData("React.js");
```

### تمييز Buffer و String

```js
const data1 = Buffer.from("Ahmed");
const data2 = data1.toString();
const data3 = Buffer.from(data2);

console.log(Buffer.isBuffer(data1)); // true
console.log(Buffer.isBuffer(data2)); // false
console.log(Buffer.isBuffer(data3)); // true
```

- `Buffer.from(string)` بإنشئ Buffer من النص.
- `buffer.toString()` بتحول الـ Buffer إلى String.
- `Buffer.isBuffer(value)` بتختبر نوع القيمة.

---

## 3) `Buffer.byteLength()`

### الفكرة
بتحسب عدد الـ Bytes اللي النص هيحتاجها عند Encoding معين (UTF-8 افتراضيًا).

مش لازم `string.length` يساوي حجم النص بالـ Bytes؛ لأن `length` بيحسب UTF-16 code units في JavaScript، بينما `Buffer.byteLength()` بيحسب حجم الـ encoded bytes.

### مثال إنجليزي

```js
const text = "Hello";

console.log(text.length);           // 5
console.log(Buffer.byteLength(text)); // 5
```

في النص الإنجليزي البسيط ده، كل حرف ASCII بياخد Byte واحد في UTF-8.

### مثال عربي

```js
const text = "محمد";

console.log(text.length);             // 4
console.log(Buffer.byteLength(text)); // 8
```

في UTF-8، الحروف العربية الموجودة هنا بتاخد 2 Bytes لكل حرف، فالحجم = 8 Bytes.

### مثال يجمع إنجليزي وعربي

```js
const text = "Hello محمد";

console.log(text.length);             // 9
console.log(Buffer.byteLength(text)); // 14
```

الحساب:
- `Hello` = 5 Bytes
- المسافة = 1 Byte
- `محمد` = 8 Bytes
- الإجمالي = 14 Bytes

**ملاحظة مهمة:** `String.length` في JavaScript بيحسب UTF-16 code units، مش دايمًا عدد الـ Unicode characters اللي المستخدم شايفها؛ بعض الرموز/Emoji ممكن يكون طولها 2 أو أكتر. و`Buffer.byteLength()` بتحسب Bytes حسب الـ Encoding.

### Syntax

```js
Buffer.byteLength(string, encoding)
```

- `string`: النص أو البيانات اللي عايز تحسب حجمها.
- `encoding`: اختياري، الافتراضي `utf8`.

---

## Quick Comparison

| Method | بتعمل إيه؟ | مثال |
|---|---|---|
| `Buffer.concat()` | بتجمع Buffers في Buffer جديدة | `Buffer.concat([b1, b2])` |
| `Buffer.isBuffer()` | بتختبر إذا القيمة Buffer | `Buffer.isBuffer(data)` |
| `Buffer.byteLength()` | بتحسب حجم البيانات بالـ Bytes | `Buffer.byteLength("Hello")` |

---

## Mini Challenge

توقع الـ Output قبل تشغيل الكود:

```js
const a = Buffer.from("Hi ");
const b = Buffer.from("Node");

const joined = Buffer.concat([a, b], 5);

const text = joined.toString();

console.log(text);
console.log(joined.length);
console.log(Buffer.isBuffer(text));
console.log(Buffer.byteLength(text));
```

### الإجابة
<details>
<summary>افتح بعد ما تحل</summary>

```text
Hi No
5
false
5
```

- الـ Buffer الناتجة طولها 5 Bytes، فالنص `Hi No`.
- `joined.length` = 5.
- `text` String مش Buffer.
- النص ASCII هنا، فعدد الـ Bytes = 5.
</details>

---

## Interview Questions

### 1. What is `Buffer.concat()` used for?
To combine multiple Buffer objects into one new Buffer.

### 2. Does `Buffer.concat()` modify the original Buffers?
No. It returns a new Buffer.

### 3. What does `Buffer.isBuffer()` return?
A Boolean indicating whether the value is a Buffer.

### 4. What's the difference between `string.length` and `Buffer.byteLength(string)`?
`string.length` counts UTF-16 code units, while `Buffer.byteLength()` counts the bytes required for a given encoding (UTF-8 by default).

### 5. Why can Arabic text use more bytes than English ASCII text?
UTF-8 uses a variable number of bytes per character; many Arabic letters use two bytes, while basic ASCII characters use one.

---

## Files in This Lesson

- `examples/01-buffer-concat.js`
- `examples/02-buffer-is-buffer.js`
- `examples/03-buffer-byte-length.js`
- `examples/04-mini-challenge.js`

## Run Examples

من Terminal داخل فولدر الدرس:

```bash
node examples/01-buffer-concat.js
```

بدّل اسم الملف لتشغيل باقي الأمثلة.

---

## Next Lesson
**Streams** — هنتعلم إزاي Node.js يتعامل مع البيانات الكبيرة على أجزاء بدل ما يحملها كلها في الذاكرة مرة واحدة، وهنربط ده بالـ Buffers والـ Files والـ HTTP.
