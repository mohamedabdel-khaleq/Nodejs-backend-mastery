# Lesson 08 — HTTP Module in Node.js
## بناء Web Server وREST API من الصفر بدون Express

> المحاضرة دي بتشرح HTTP في Node.js من الأساس، وبنطبق بإيدينا Web Server وRouting وHeaders وStatus Codes وQuery Parameters وRequest Body وCRUD API.

---

## 1) يعني إيه Web Server؟

الـ Client (زي المتصفح أو تطبيق موبايل) بيبعت Request للسيرفر، والسيرفر يعالج الطلب ويرجع Response.

```text
Client / Browser
      |
      | HTTP Request
      v
Node.js Web Server
      |
      | Processing
      v
HTTP Response
      |
      v
Client
```

- Client: البرنامج اللي بيطلب الخدمة.
- Server: البرنامج اللي بيستقبل الطلبات ويقدّم الخدمة.
- Request: الطلب القادم من العميل.
- Response: رد السيرفر.

## 2) HTTP

HTTP = HyperText Transfer Protocol. بروتوكول بيحدد قواعد التواصل بين العميل والسيرفر: شكل الطلب والرد، Methods، Headers، Status Codes، وغيرها.

### شكل Request مبسط

```http
GET /users HTTP/1.1
Host: example.com
Accept: application/json

```

Request بيتكوّن من:
- Request Line: Method + Path + HTTP Version
- Headers: معلومات إضافية عن الطلب
- Body: بيانات اختيارية، غالبًا مع POST/PATCH/PUT

### أشهر HTTP Methods

| Method | الاستخدام الشائع |
|---|---|
| GET | جلب بيانات |
| POST | إنشاء بيانات أو تنفيذ عملية |
| PUT | استبدال مورد كامل غالبًا |
| PATCH | تحديث جزء من المورد |
| DELETE | حذف مورد |
| HEAD | Headers بدون Response Body |
| OPTIONS | معرفة الخيارات/العمليات المتاحة |

مثال: `GET /users` لجلب المستخدمين، و`POST /users` لإنشاء مستخدم.

## 3) HTTP Response

```http
HTTP/1.1 200 OK
Content-Type: application/json

{"message":"success"}
```

يتكون من Status Line وHeaders وBody.

### Status Codes

| Code | المعنى |
|---|---|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 301 | Moved Permanently |
| 302 | Redirect مؤقت |
| 400 | Bad Request |
| 401 | Unauthorized (لم تتم المصادقة) |
| 403 | Forbidden (ممنوع) |
| 404 | Not Found |
| 405 | Method Not Allowed |
| 409 | Conflict |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
| 502 | Bad Gateway |
| 503 | Service Unavailable |

المجموعات:
- 1xx معلومات
- 2xx نجاح
- 3xx تحويل
- 4xx خطأ متعلق بالطلب/العميل
- 5xx خطأ بالسيرفر أو خدمة upstream

> 401 و403 مش نفس المعنى: 401 تعني أن المصادقة غير متوفرة/غير صالحة؛ 403 تعني أن الوصول ممنوع رغم أن هوية العميل قد تكون معروفة.

## 4) Node.js `http` Core Module

Module مدمج؛ لا نحتاج `npm install http`.

```js
const http = require("http");
```

## 5) أول Web Server

`examples/01-basic-server.js`

```js
const http = require("http");

const server = http.createServer((req, res) => {
  res.end("Hello From Node.js Server!");
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
```

شرح:
- `http.createServer(callback)` ينشئ Server ويستدعي callback لكل Request.
- `req`: Request Object (معلومات الطلب والبيانات الواردة).
- `res`: Response Object (نستخدمه لإرسال الرد).
- `res.end()`: إنهاء الـ Response وإرسال آخر جزء اختياري.
- `server.listen(3000)`: يبدأ السيرفر يستمع على Port 3000.

تشغيل:
```bash
node examples/01-basic-server.js
```
ثم افتح `http://localhost:3000`.

## 6) `req` — Request Object

أهم الخصائص:
- `req.method`: الـ HTTP Method.
- `req.url`: الـ URL path والـ query string.
- `req.headers`: Headers الطلب (أسماء headers غالبًا lowercase).
- `req.socket`: معلومات الاتصال.
- `req` نفسه Readable Stream للـ Request Body.

مثال:
```js
console.log(req.method);
console.log(req.url);
console.log(req.headers);
```

## 7) Routing يدوي

Routing يعني تحديد ماذا يحدث حسب الـ Path والـ Method.

`examples/02-manual-routing.js`

```js
const http = require("http");

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.end("Home Page");
  } else if (req.method === "GET" && req.url === "/about") {
    res.end("About Page");
  } else if (req.method === "GET" && req.url === "/products") {
    res.end("Products Page");
  } else {
    res.statusCode = 404;
    res.end("Route Not Found");
  }
});

server.listen(3000, () => console.log("Listening on port 3000"));
```

نحدد Method + Path معًا لأن نفس المسار ممكن يستقبل Methods مختلفة.

## 8) Status Code وHeaders

```js
res.statusCode = 200;
res.setHeader("Content-Type", "text/plain");
res.end("Hello");
```

`Content-Type` يحدد نوع البيانات:

| Content-Type | النوع |
|---|---|
| `text/plain` | نص |
| `text/html` | HTML |
| `application/json` | JSON |
| `text/css` | CSS |
| `application/javascript` | JavaScript |
| `image/png` | PNG |

HTML:
```js
res.setHeader("Content-Type", "text/html; charset=utf-8");
res.end("<h1>Hello</h1>");
```

JSON:
```js
res.setHeader("Content-Type", "application/json");
res.end(JSON.stringify({ message: "Success" }));
```

## 9) `res.write()` و`res.end()`

- `res.write(chunk)`: يرسل جزءًا من الـ Response.
- `res.end([chunk])`: يرسل الجزء الأخير وينهي الـ Response.

```js
res.write("Hello ");
res.write("Mohamed ");
res.end("Abdelkhalek");
```

لا تحاول إرسال Response آخر بعد إنهائه.

## 10) Query Parameters

URL:
```text
http://localhost:3000/products?category=phones&price=5000
```

استخدم `URL` بدل تحليل النص يدويًا:

```js
const parsedURL = new URL(req.url, `http://${req.headers.host}`);

console.log(parsedURL.pathname); // /products
console.log(parsedURL.searchParams.get("category")); // phones
console.log(parsedURL.searchParams.get("price")); // 5000
```

- `pathname`: المسار فقط.
- `searchParams`: التعامل مع Query Parameters.
- `get(key)`: استخراج قيمة Parameter.

Query Parameters مفيدة للبحث والفلترة والترتيب والـ pagination.

## 11) Dynamic Route / ID

مثال `/users/12`:

```js
const id = Number(parsedURL.pathname.split("/")[2]);
```

`split("/")` على `/users/12` تنتج `["", "users", "12"]`. العنصر `[2]` هو ID، ونحوّله إلى Number.

في Express سنستخدم Route Parameters بشكل أسهل، لكن هنا نفهم الأساس.

## 12) استقبال Request Body (ربط HTTP بالـ Streams)

الـ Request Body قد يصل على أجزاء (Chunks)، لأن `req` Readable Stream.

```js
let body = "";

req.on("data", (chunk) => {
  body += chunk;
});

req.on("end", () => {
  console.log(body);
});
```

لا نفترض أن الـ Body كله سيصل في Chunk واحد.

## 13) تحويل JSON String إلى Object

العميل قد يرسل:
```json
{"name":"Mohamed","email":"m@example.com"}
```

بعد اكتمال الـ Body:
```js
const data = JSON.parse(body);
```

استخدم `try/catch` لأن JSON غير صالح قد يسبب Exception.

## 14) Promise helper لقراءة الـ Body

`examples/03-read-body.js`

```js
const http = require("http");

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/data") {
    try {
      const data = await readRequestBody(req);
      res.statusCode = 201;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ received: data }));
    } catch {
      res.statusCode = 400;
      res.end("Invalid JSON");
    }
    return;
  }

  res.end("Send POST /data with JSON");
});

server.listen(3000, () => console.log("Listening on 3000"));
```

## 15) CRUD API — Users

هنستخدم Array مؤقتة بدل Database. البيانات ستضيع عند إعادة تشغيل السيرفر.

`examples/04-users-crud.js` يحتوي API كاملة:
- GET `/users`
- GET `/users/:id`
- POST `/users`
- PATCH `/users/:id`
- DELETE `/users/:id`

تشغيل:
```bash
node examples/04-users-crud.js
```

### API Table

| Method | Route | الوظيفة |
|---|---|---|
| GET | `/users` | جلب جميع المستخدمين |
| GET | `/users/:id` | جلب مستخدم محدد |
| POST | `/users` | إنشاء مستخدم |
| PATCH | `/users/:id` | تحديث بيانات جزئية |
| DELETE | `/users/:id` | حذف مستخدم |

## 16) تجربة API

يمكنك استخدام Postman أو Thunder Client أو curl.

### GET All
```bash
curl http://localhost:3000/users
```

### GET One
```bash
curl http://localhost:3000/users/1
```

### POST
```bash
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d "{\"name\":\"Ali\",\"email\":\"ali@example.com\"}"
```

### PATCH
```bash
curl -X PATCH http://localhost:3000/users/1 -H "Content-Type: application/json" -d "{\"name\":\"Ahmed Updated\"}"
```

### DELETE
```bash
curl -X DELETE http://localhost:3000/users/1
```

## 17) نقاط مهمة وأخطاء شائعة

1. **إنهاء الـ Response:** كل مسار لازم يرسل Response وينهيه؛ وإلا العميل قد يظل منتظرًا.
2. **Return بعد الرد:** `return` يوقف بقية Handler؛ `res.end()` هو الذي ينهي الـ Response.
3. **Headers قبل Body:** عيّن Headers وStatus قبل إرسال الرد. بعد إرسال Headers لا يمكنك تغييرها.
4. **JSON:** استخدم `JSON.stringify()` عند إرسال Object/Array، و`JSON.parse()` عند قراءة JSON المرسل، مع معالجة الأخطاء.
5. **Methods:** لا تعتمد على URL فقط؛ افحص Method أيضًا.
6. **404:** فرّق بين User غير موجود وRoute غير موجود، حسب تصميم API.
7. **Body size:** المثال التعليمي يجمع Body في String من غير حد. في تطبيق حقيقي يجب وضع حد لحجم البيانات لتجنب استهلاك الذاكرة (Body-size limit) والتحقق من نوع المحتوى.
8. **Validation:** تحقق من البيانات القادمة؛ لا تثق في Client.
9. **Security:** لا تعرض تفاصيل الأخطاء الداخلية للعميل.
10. **In-memory Array:** ليست Database؛ البيانات غير دائمة، ولا تناسب عدة نسخ من السيرفر.

## 18) ليه بنستخدم Express بعد كده؟

الـ HTTP Module يخلينا نفهم الأساس، لكنه يفرض علينا كتابة Routing وParsing وError Handling وغيرها يدويًا. Express يوفر abstractions تسهّل هذه المهام، لكن فهم HTTP يجعل استخدامه منطقيًا وليس حفظًا.

```text
Raw Node HTTP
   |
   | تعلم Request/Response/Streams/Routing
   v
Express
   |
   | Middleware / Router / Utilities
   v
Organized Backend APIs
```

## 19) Interview Questions

1. ما هو HTTP، وما الفرق بين Request وResponse؟
2. ما الفرق بين GET وPOST؟
3. ما الفرق بين PUT وPATCH؟
4. ما وظيفة `http.createServer()`؟
5. ما الفرق بين `req` و`res`؟
6. ما الفرق بين `res.write()` و`res.end()`؟
7. لماذا نحدد `Content-Type`؟
8. ما الفرق بين Path Parameters وQuery Parameters؟
9. كيف نستقبل Request Body في Node HTTP؟
10. لماذا الـ Request يعتبر Stream؟
11. ما الفرق بين 401 و403؟
12. متى نستخدم 404 ومتى 500؟
13. لماذا نستخدم `JSON.stringify()` عند إرسال JSON؟
14. ماذا يحدث لو أرسلنا Response مرتين؟
15. لماذا لا نستخدم Array كـ Database في Production؟

## 20) Assignment

### Task 1 — Basic Server
أنشئ Server على Port 3000:
- `/` يرجع `Home`
- `/about` يرجع `About`
- أي Route غير موجود يرجع 404

### Task 2 — Inspect Request
اطبع Method وURL وHeaders لكل Request.

### Task 3 — Query Parameters
أنشئ `/search` ويقرأ `keyword` و`page` من Query Parameters. رجّعهم JSON.

مثال:
`/search?keyword=node&page=2`

### Task 4 — Users API
نفّذ CRUD كامل باستخدام Array:
- GET `/users`
- GET `/users/:id`
- POST `/users`
- PATCH `/users/:id`
- DELETE `/users/:id`

### Task 5 — Validation
في POST:
- name مطلوب.
- email مطلوب.
- لو البيانات ناقصة رجّع 400.
- لو JSON غير صالح رجّع 400.

### Challenge
أضف:
- GET `/users?name=Ahmed` للبحث بالاسم.
- GET `/users?page=1&limit=2` للـ pagination.
- Status Codes صحيحة.
- Helper لإرسال JSON.
- تعامل مع Route غير موجود وUser غير موجود كلٌ بشكل منفصل.

> حل الـ Assignment بإيدك، وابعتلي الكود أو الملفات؛ هنراجعها سطرًا سطرًا ونشوف هل فهمت HTTP وRouting والـ Request Body والـ CRUD.

---

## ملخص المحاضرة

اليوم تعلمنا:
- HTTP Request / Response
- HTTP Methods
- Status Codes
- Headers وContent-Type
- `http.createServer`
- `req` و`res`
- Routing
- Query Parameters
- Dynamic IDs
- Request Body
- Streams في HTTP
- `JSON.parse` / `JSON.stringify`
- CRUD API
- اختبار باستخدام curl

**الدرس التالي في الخطة:** Lesson 09 — NPM & Package Management.
