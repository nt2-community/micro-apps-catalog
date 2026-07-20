# Contributing to the NT² micro-apps catalog

Thank you for listing a Vault-compatible micro-app. This repository is **open governance** for discovery; installs happen **inside the Vault** after user consent.

Questions before you open a PR? Join [NT² Community on Discord](https://discord.gg/MRRmbBe48).

## Before you open a PR

1. Read the [NT² Micro-app Author Guide](https://github.com/nt2/nt2/blob/main/docs/MICRO_APP_AUTHOR_GUIDE.md) (bundle build, signing, permissions).
2. Build and sign your `{id}-{version}.nt2app` zip.
3. Attach it to a **public** [GitHub Release](https://docs.github.com/en/repositories/releasing-projects-on-github) on your app repository.
4. Copy the **browser download URL** (`https://github.com/{owner}/{repo}/releases/download/...`) — not `api.github.com`.

## Add a catalog entry

1. Fork `nt2-community/micro-apps-catalog`.
2. Add **`catalog/entries/{appId}.json`** — one file per app (`appId` = manifest `id`, slug `[a-z0-9-]+`).
3. Required fields match `MicroAppCatalogEntry` ([NT² vault-sdk-protocol](https://github.com/nt2/nt2/tree/main/pkgs/vault-sdk-protocol)):
   - `id`, `name`, `description`, `publisherKeyDid`, `signPubJwk`, `catalogSignature`
   - `latestVersion`, `permissions`, `bundleIntegrity`, `bundleUrl`
4. Optional presentation fields: `categories`, `tags`, `screenshotUrls`, `homepageUrl`, `repositoryUrl`, `maturity` (`incubating` | `graduated`).
5. Sign the row with your **Vault Key DID** (canonical JSON excludes `catalogSignature`). Maintainer helper:

```bash
CATALOG_SIGNING_SEED_HEX=<64-char-hex> node scripts/sign-entry.mjs catalog/entries/your-app.json
```

6. Open a PR. CI runs `npm run catalog:verify` (signature + parse; bundle integrity on merge to `main`).

## Reviewer checklist (126e / Author Guide Appendix A)

- [ ] Permissions are minimal and explained in `description`
- [ ] `catalogSignature` verifies with `publisherKeyDid` + `signPubJwk`
- [ ] `bundleUrl` is a public GitHub Release browser URL
- [ ] `bundleIntegrity` matches the `.nt2app` bytes at `bundleUrl`
- [ ] No remote scripts, analytics, or parent-frame escape in the bundle
- [ ] `maturity: incubating` for new community authors unless graduated by maintainers

## CI policy

| Event | Integrity fetch |
|-------|-----------------|
| PR from fork | Signature + parse only (`CATALOG_SKIP_INTEGRITY=1`) |
| Push / merge to `main` | Full verify including `bundleIntegrity` |

Release maintainers attach `release-assets/*.nt2app` when seed fixtures change.

## Code of conduct

Be respectful. NT² maintainers may reject listings that are misleading, malicious, or violate the author security guide.
