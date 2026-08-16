# Production Environment ও Security Guide

এই document-এ কোনো real secret value নেই। Vercel, Firebase বা password manager থেকে value copy করতে হবে; repository, issue, screenshot, chat বা log-এ secret paste করা যাবে না।

## বর্তমান variable-গুলোর শ্রেণিবিভাগ

| Variable | Secret? | Production value/নিয়ম | গুরুত্বপূর্ণ কথা |
| --- | --- | --- | --- |
| `FRONTEND_URL` | না | production site-এর exact `https://...` origin; শেষে `/` নয় | Backend CORS allowlist হিসেবে ব্যবহৃত হয়। |
| `APP_URL` | না | production site-এর exact `https://...` origin; শেষে `/` নয় | App-এর canonical server URL। |
| `JWT_SECRET` | হ্যাঁ—critical | password manager/cryptographic generator দিয়ে অন্তত 48 random bytes | Production ও Preview-তে আলাদা value রাখুন। বদলালে সব পুরনো session invalid হবে। |
| `ENVIRONMENT` | না | Production এবং internet-facing Preview-তে `production` | Secure cookie ও weak-secret startup guard চালু রাখে। |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | public-by-design | Firebase Web App config-এর value | Browser JavaScript-এ প্রকাশিত হবেই; Firebase-only API restriction দিন। |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | public-by-design | Firebase Web App config | Firebase Authentication → Authorized domains-এ production domain যোগ করুন। |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | public-by-design | Firebase project ID | Server-এর `FIREBASE_PROJECT_ID`-এর সঙ্গে একই project হতে হবে। |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | public-by-design | Firebase Web App config | Storage ব্যবহার করলে Security Rules বাধ্যতামূলক। |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | public-by-design | Firebase Web App config | Secret নয়। |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | public-by-design | Firebase Web App config | Secret নয়। |
| `FIREBASE_API_KEY` | public Firebase key, server-side name | একই restricted Firebase Web API key | Firebase REST token-verification fallback ব্যবহার করে; Admin credential নয়। |

Vercel-এ `NEXT_PUBLIC_*` variable-গুলো Sensitive হিসেবে রাখা ক্ষতিকর নয়, কিন্তু এতে সেগুলো browser থেকে গোপন হয় না—Next.js build-এর সময় public bundle-এ ঢুকে যায়। Firebase access control API key লুকিয়ে নয়, Firebase Security Rules, IAM এবং App Check দিয়ে করতে হয়।

## এখনো নিশ্চিত করতে হবে এমন server variables

নিচের variable-গুলো Vercel-এর দুই project (`lopo0p` ও `sschscquiz`)—দুটির Production environment-এ আছে কি না যাচাই করুন:

| Variable | প্রয়োজন | Vercel setting |
| --- | --- | --- |
| `FIREBASE_PROJECT_ID` | Firestore REST path ও server config | non-sensitive; Firebase project ID |
| `FIREBASE_SERVICE_ACCOUNT` | profile, quiz attempt, live test, leaderboard ও Firestore write/read | **Sensitive**, Production; সম্পূর্ণ service-account JSON এক লাইনে |
| `ADMIN_PASSWORD` | legacy admin login endpoint | **Sensitive**, অন্তত 16 random characters; password manager-generated |
| `ADMIN_EMAIL` | signed session-এ admin role নির্ধারণ | private config; exact admin Firebase email |
| `NEXT_PUBLIC_USE_API_PROXY` | same-origin API/cookie flow | `true` |
| `NEXT_PUBLIC_API_URL` | Vercel rewrite ব্যবহার | empty/unset; কোনো localhost URL নয় |
| `NEXT_PUBLIC_SITE_URL` | sitemap/robots canonical URL | বর্তমান production `https://...` URL; domain কেনার পর নতুন primary domain |

`FIREBASE_SERVICE_ACCOUNT` না থাকলেও Firebase login token REST fallback দিয়ে verify হতে পারে, কিন্তু Firestore-backed profile, attempt, Live Test, Smart Analysis এবং leaderboard সম্পূর্ণ কাজ করবে না। এটি `NEXT_PUBLIC_*` নামে কখনো সেট করবেন না।

## Production ও Preview scope

1. Production secret এবং Preview secret আলাদা রাখুন। বিশেষ করে `JWT_SECRET`, `ADMIN_PASSWORD` ও `FIREBASE_SERVICE_ACCOUNT` একই value দিয়ে দুই environment চালানো এড়িয়ে চলুন।
2. Preview-তে production user data দরকার না হলে আলাদা Firebase staging project ব্যবহার করুন।
3. Vercel variable পরিবর্তনের পর নতুন deployment প্রয়োজন; পুরনো deployment নতুন value পায় না।
4. Preview deployment protection চালু রাখুন। Production URL public থাকতে পারে।
5. একই configuration দুই Vercel project-এ প্রয়োজন হলে secret copy করার সময় dashboard/CLI prompt ব্যবহার করুন; value কোনো file-এ রাখবেন না।

## Firebase hardening checklist

- Authentication → Settings → Authorized domains-এ শুধু ব্যবহৃত production/preview domains রাখুন; অচেনা domain সরান।
- Google Cloud → APIs & Services → Credentials-এ Firebase web key-কে শুধু প্রয়োজনীয় Firebase APIs-এ restrict করুন। একই key-তে Generative Language/Gemini বা অন্য paid API যোগ করবেন না।
- Firestore client access প্রয়োজন না হলে rules default-deny রাখুন। Server credentials Firestore rules bypass করে, তাই service account-এ least-privilege IAM দিন।
- Firebase App Check প্রথমে monitoring mode-এ চালু করুন; legitimate traffic যাচাইয়ের পর enforcement দিন।
- Service-account JSON শুধু Vercel Sensitive variable-এ রাখুন; downloadable JSON file repository বা local project folder-এ রাখবেন না।

## Session ও application security

- Production session cookie `HttpOnly`, `Secure`, `SameSite=Lax`; JavaScript cookie পড়তে পারে না।
- Admin API signed session-এর server-side `is_admin` claim যাচাই করে। Client-set cookie বা UI state authorization নয়।
- Production CORS শুধু `FRONTEND_URL` origin গ্রহণ করে; localhost কেবল development-এ অনুমোদিত।
- Answer keys public question JSON-এ রাখা যাবে না; private backend answer store থেকে server-side scoring হবে।
- `/api/health` secret বা environment value ফেরাবে না। Health response শুধু service status যাচাইয়ের জন্য।

## Secret তৈরি, rotation ও incident response

একটি JWT secret local terminal-এ তৈরি করা যায়:

```text
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Output শুধু password manager ও Vercel Sensitive field-এ দিন। Command output screenshot বা shell log share করবেন না।

কোনো secret leak সন্দেহ হলে:

1. সংশ্লিষ্ট credential সঙ্গে সঙ্গে revoke/rotate করুন।
2. Vercel Production ও Preview-তে নতুন value বসান এবং redeploy করুন।
3. `JWT_SECRET` বদলালে সব user-কে পুনরায় login করতে হবে—এটি প্রত্যাশিত।
4. Service-account key-এর নতুন key কাজ করছে যাচাই করে পুরনো key delete করুন।
5. Git history-তে secret গেলে শুধু file delete যথেষ্ট নয়; credential rotate করা বাধ্যতামূলক এবং history scrub করতে হবে।
6. Firebase Auth, Google Cloud audit logs ও Vercel function logs-এ অস্বাভাবিক access পরীক্ষা করুন।

## Release verification

- GitHub checks: data audit, answer-sync audit, filename audit, lint, typecheck, tests এবং production build—সব green।
- `GET /api/health` → HTTP 200 এবং `ok: true`।
- Email/Google login → secure session cookie → refresh-এর পরও logged in।
- Logout-এর পর protected profile/dashboard endpoint → 401।
- Normal user admin endpoint access → 401/403; admin account access → success।
- Quiz submit একবার save হয়; answer key network response-এ আসে না।
- Live Test start/end window এবং one-user-one-attempt server-side enforce হয়।
- Production UI বা error message-এ `localhost`, port `8000`, secret name/value বা developer command দেখা যায় না।

## Official references

- Firebase API keys: https://firebase.google.com/docs/projects/api-keys
- Firestore server IAM and rules: https://firebase.google.com/docs/firestore/security/iam
- Firebase App Check for web: https://firebase.google.com/docs/app-check/web/recaptcha-provider
- Vercel environment scopes: https://vercel.com/docs/environment-variables
- Vercel sensitive variables: https://vercel.com/docs/environment-variables/sensitive-environment-variables

