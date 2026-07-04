# NT² Community micro-apps catalog

Open **App Store–style catalog** for [NT² Vault](https://nt2.me) micro-apps: browse and search signed `.nt2app` listings, consume **`catalog.json`** from the Vault Host, and open PRs to add or update entries.

| Artifact | URL (after deploy) |
|----------|-------------------|
| Website | `https://nt2-community.github.io/micro-apps-catalog/` |
| Machine catalog | `https://nt2-community.github.io/micro-apps-catalog/catalog.json` |

## Local layout

This repo is a **separate git root** — sibling of the private NT² product monorepo:

```text
~/dev/
├── nt2/                              # private @nt2/* monorepo
└── nt2-community/
    └── micro-apps-catalog/           # this repository
```

## Quick start

```bash
cd ~/dev/nt2-community/micro-apps-catalog
npm install
npm run seed:bootstrap    # build fixture .nt2app + signed catalog entries (first time)
CATALOG_SKIP_INTEGRITY=1 npm run catalog:verify   # before GitHub Release exists
npm run dev               # site on http://localhost:5179
```

After publishing a GitHub Release with `release-assets/*.nt2app`, run full verify:

```bash
npm run catalog:verify
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run bundles:build` | Zip `fixtures/bundles/*` → `release-assets/*.nt2app` |
| `npm run seed:bootstrap` | Build bundles + write signed `catalog/entries/*.json` |
| `npm run catalog:merge` | `catalog/entries/` → `dist/catalog.json` |
| `npm run catalog:verify` | Parse, signature, and optional bundle integrity |
| `npm run build` | Catalog + static site |

## Community chat

Questions about listing or reviewing apps? Join [NT² Community on Discord](https://discord.com/channels/1510213303576563712/1510213304159834175).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Author contract: [NT² Micro-app Author Guide](https://github.com/nt2/nt2/blob/main/docs/MICRO_APP_AUTHOR_GUIDE.md) (private monorepo; essential §6 summarized in CONTRIBUTING).

## Trust model

- **Catalog rows** are signed by the publisher Vault Key DID (`catalogSignature`).
- **Bundles** live on **public GitHub Releases** (`bundleUrl`); integrity via `bundleIntegrity` (SHA-384).
- The **Vault Host** re-verifies everything at install time — this site is discovery only.

## Maintainers

NT² Community org — see [CODEOWNERS](./CODEOWNERS).

## License

MIT — see [LICENSE](./LICENSE). Micro-app **bundles** remain under their authors' licenses in separate repositories.
