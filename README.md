# factory-vuln-web

> **Intentionally vulnerable. Never deploy.**

This app exists only to prove that the [Security Software Factory](https://github.com/AakashDadhich/security-factory) catches known flaws. It runs in GitHub Actions and nowhere else. Do not host it, expose it to a network or reuse any of its code.

## Planted flaws

| Id | Flaw | Where |
|---|---|---|
| sqli | SQL injection (string concatenation from `req.query.id`) | `GET /api/user` |
| xss | Reflected XSS | `GET /search` |
| cmdi | Command injection | `GET /api/ping` |
| eval | `eval` of request data | `GET /api/calc` |
| hardcoded-key | Fake API key in source (made up, not a real provider format) | `src/app.ts` |
| env-file | Committed `.env` with made-up values | `.env` |
| lodash | Pinned `lodash@4.17.15` (known high-severity advisories) | `package.json` |
| headers | No security headers, session cookie without `HttpOnly` or `Secure` | every response, `GET /login` |
| proto-pollution | `_.merge` of a request body into a new object | `POST /api/settings` |

`expected-findings.yml` lists which factory stage must catch each one. The factory repo's `acceptance.yml` workflow dispatches this repo's pipeline, then checks the gate failed and every expectation matched.
