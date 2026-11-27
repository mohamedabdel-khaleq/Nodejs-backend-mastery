# Lesson 09 — NPM & Package Management
## إدارة المشاريع والمكتبات في Node.js

المحاضرة بتشرح NPM، Packages، package.json، package-lock.json، Dependencies، Scripts، Versions، npx، Local/Global، Registry، CommonJS وESM، والتطبيق العملي.

---

## 1. NPM

NPM (Node Package Manager) أداة لإدارة Packages في مشاريع Node.js، منها:
- تثبيت وحذف المكتبات
- إدارة Dependencies
- تشغيل Scripts
- تحديث المكتبات
- إدارة إصدارات Packages

تحقق من الإصدارات:
```bash
node -v
npm -v
```

## 2. Package

Package هي مجموعة كود قابلة لإعادة الاستخدام والتثبيت. أمثلة:
- Express: Web Server وAPIs
- bcrypt: Password Hashing
- jsonwebtoken: JWT
- dotenv: Environment Variables
- Prisma: Database ORM
- Zod: Validation
- multer: File Upload
- nodemon: Restart أثناء التطوير

## 3. إنشاء مشروع

```bash
mkdir my-project
cd my-project
npm init -y
```

`npm init` يسألك بيانات المشروع. `-y` يقبل الإعدادات الافتراضية.

## 4. package.json

ملف بيانات المشروع وإعداداته وDependencies وScripts.

مثال:
```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "Node learning project",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "author": "",
  "license": "ISC"
}
```

- `name`: اسم المشروع/package.
- `version`: الإصدار.
- `description`: وصف.
- `main`: نقطة الدخول التقليدية للـ Package، وقد تتأثر طريقة الدخول بـ `exports` أو إعدادات ESM.
- `scripts`: أوامر المشروع.
- `author`: صاحب المشروع.
- `license`: شروط الترخيص.

## 5. تثبيت Package

```bash
npm install lodash
```
أو:
```bash
npm i lodash
```

بيتم تنزيل المكتبة داخل `node_modules` وتسجيلها ضمن `dependencies`.

## 6. Dependencies وDevDependencies

### dependencies
مكتبات التطبيق التي يحتاجها في تشغيله، مثل Express.

```bash
npm install express
```

### devDependencies
أدوات التطوير والاختبار والـ linting، مثل Nodemon.

```bash
npm install -D nodemon
```

`-D` اختصار `--save-dev`.

## 7. node_modules

المجلد الذي يحتوي على Packages المثبتة وDependencies التابعة لها.

عادة لا نرفعه على GitHub لأنه كبير ويمكن إعادة بنائه من ملفات تعريف المشروع.

## 8. package-lock.json

يسجل تفاصيل شجرة التثبيت والنسخ التي تم حلها، ويساعد على تثبيت متوافق وقابل لإعادة الإنتاج.

ارفع `package-lock.json` إلى Git مع `package.json`.

## 9. تثبيت المشروع على جهاز آخر

بعد Clone:
```bash
npm install
```

أو تثبيت نظيف باستخدام Lockfile:
```bash
npm ci
```

`npm ci`:
- يحتاج Lockfile متوافق.
- يحذف node_modules الحالية ويعيد تثبيتها.
- لا يغيّر Lockfile.
- مناسب لـ CI/CD والتثبيت النظيف.

## 10. NPM Scripts

في `package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

تشغيل:
```bash
npm start
npm run dev
```

`start` و`test` لهما معاملة خاصة، أما Scripts مثل `dev` فتشغل باستخدام `npm run`.

## 11. Semantic Versioning

الإصدار عادة:
`MAJOR.MINOR.PATCH`

- Major: تغييرات قد تكسر التوافق.
- Minor: ميزات جديدة متوافقة.
- Patch: إصلاحات متوافقة.

مثال: `4.17.21`

### علامات نطاق الإصدار

- `^4.17.21`: يسمح عادة بتحديثات Minor وPatch ضمن Major نفسه.
- `~4.17.21`: يسمح عادة بتحديثات Patch ضمن Minor نفسه.
- `4.17.21`: إصدار محدد.

Lockfile يحدد النسخ الفعلية التي تم تثبيتها.

## 12. أوامر إدارة Packages

```bash
npm list
npm list --depth=0
npm view express version
npm view express
npm outdated
npm update
npm install express@latest
npm install express@4
npm install express@4.21.2
npm uninstall lodash
```

- `npm list`: عرض شجرة المكتبات.
- `--depth=0`: المكتبات المباشرة فقط.
- `npm view`: معلومات Package من Registry.
- `npm outdated`: المكتبات التي لها تحديثات.
- `npm update`: تحديث ضمن نطاقات package.json.
- `npm install package@version`: تثبيت إصدار محدد.
- `npm uninstall`: حذف Package وتحديث بيانات المشروع.

## 13. npx

أداة لتشغيل Packages وأدوات CLI، غالبًا دون الحاجة إلى تثبيت Global دائم.

مثال:
```bash
npx cowsay "Hello Mohamed"
```

`npm` لإدارة Packages وScripts، و`npx` لتنفيذ Package/CLI.

## 14. Local vs Global

Local:
```bash
npm install package
```
داخل المشروع. الخيار المعتاد لمكتبات المشروع.

Global:
```bash
npm install -g package
```
تثبيت أداة على مستوى بيئة المستخدم/Node، حسب إعداد الجهاز. غالبًا الأفضل أدوات المشروع تكون Local وتُشغل عبر Scripts أو npx.

## 15. NPM Registry

الـ Registry الافتراضي:
`https://registry.npmjs.org/`

بشكل مبسط:
```text
Project → npm client → Registry → Package files → node_modules
```
يمكن أن توجد Private Registries أيضًا.

## 16. استخدام Package في الكود

بعد تثبيت Lodash:
```js
const _ = require("lodash");

const numbers = [1, 2, 3, 4, 5, 6];

const evenNumbers = _.filter(numbers, (number) => number % 2 === 0);

console.log(evenNumbers); // [2, 4, 6]
```

يمكن عمل نفس المثال باستخدام JavaScript:
```js
const evenNumbers = numbers.filter((number) => number % 2 === 0);
```

لا تثبّت Package إذا كانت الوظيفة متوفرة بسهولة في JavaScript أو Node، إلا إذا كانت المكتبة تضيف قيمة واضحة.

## 17. CommonJS وES Modules

CommonJS:
```js
const http = require("http");
module.exports = someValue;
```

ES Modules:
```js
import http from "node:http";
export default someValue;
```

يمكن تفعيل ESM في ملفات `.js` عبر:
```json
{
  "type": "module"
}
```

- `.cjs`: CommonJS
- `.mjs`: ES Modules

## 18. .gitignore

```gitignore
node_modules/
.env
```

لا ترفع `node_modules` أو Secrets مثل `.env` إلى GitHub. ارفع `package.json` و`package-lock.json`.

## 19. تجهيز مشروع Backend

```bash
mkdir backend-project
cd backend-project
npm init -y
npm install express
npm install -D nodemon
```

هيكل:
```text
backend-project/
├── node_modules/
├── src/
│   └── server.js
├── package.json
├── package-lock.json
└── .gitignore
```

Scripts:
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

## 20. أخطاء شائعة

### npm is not recognized
تحقق من تثبيت Node.js وPATH، ثم افتح Terminal جديد.

### Cannot find module
تأكد من تثبيت Dependencies، واسم المكتبة، ومكان تشغيل المشروع. غالبًا:
```bash
npm install
```

### Dependency conflict
اقرأ رسالة الخطأ وافهم التعارض قبل اللجوء إلى `--force` أو `--legacy-peer-deps`.

### Clean install
PowerShell:
```powershell
Remove-Item node_modules -Recurse -Force
```
ثم:
```bash
npm ci
```
إذا كان Lockfile متوافقًا.

## 21. Workflow

```text
Create Project
     ↓
npm init -y
     ↓
package.json
     ↓
Install Packages
     ├── node_modules
     └── package-lock.json
     ↓
Code + Scripts
     ↓
npm run dev
     ↓
Git Push (بدون node_modules)
     ↓
Clone on another machine
     ↓
npm ci
```

## 22. Interview Questions

1. ما هو NPM؟
2. ما هي Package؟
3. ما الفرق بين dependencies وdevDependencies؟
4. ما وظيفة package.json؟
5. ما وظيفة package-lock.json؟
6. لماذا لا نرفع node_modules؟
7. ما الفرق بين npm install وnpm ci؟
8. ما معنى Semantic Versioning؟
9. ما معنى `^` و`~`؟
10. ما الفرق بين npm وnpx؟
11. ما الفرق بين Local وGlobal Installation؟
12. ما هو NPM Registry؟
13. ما وظيفة npm scripts؟
14. ما الفرق بين CommonJS وESM؟
15. لماذا نستخدم .gitignore؟

## 23. Assignment

### Task 1
أنشئ مشروع:
```bash
npm init -y
```
عدّل الاسم والوصف وتعرّف على كل خاصية.

### Task 2
ثبت:
```bash
npm install lodash
npm install -D nodemon
```
وتأكد من وجودهما في القسم الصحيح في `package.json`.

### Task 3 — Lodash
استخدم Array:
```js
const users = [
  { id: 1, name: "Ahmed", age: 20 },
  { id: 2, name: "Mohamed", age: 25 },
  { id: 3, name: "Ali", age: 17 },
  { id: 4, name: "Omar", age: 30 },
];
```
استخرج:
- المستخدمين الذين عمرهم 18 أو أكثر.
- رتب المستخدمين حسب العمر.
- استخرج الأسماء فقط.

### Task 4
اعمل Scripts:
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```
واكتب Server بسيط.

### Task 5
أنشئ `.gitignore`:
```gitignore
node_modules/
.env
```
وارفع المشروع إلى GitHub دون `node_modules`.

### Challenge
1. احذف `node_modules`.
2. تأكد أن `package-lock.json` موجود.
3. نفّذ `npm ci`.
4. شغّل المشروع.
5. اشرح كيف أعاد npm تثبيت Dependencies.

**الدرس التالي: Lesson 10 — Process & Environment Variables.**
