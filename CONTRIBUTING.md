# Contributing

Gymaxxing is MIT licensed. Issues and pull requests are welcome.

- Read `DESIGN.md` before changing UI. Use theme tokens and `GlassSurface`.
- Keep `packages/engine` free of React and cover exported functions with Vitest.
- A schema change updates `packages/schemas`, `infra/supabase`, and `infra/powersync` together.
- Run `pnpm test` and `pnpm typecheck` before opening a pull request.
- Do not commit secrets, keystores, or generated `ios/` and `android/` projects.
- Exercise text and icons must be original or permissively licensed. Do not paste another app's copy or artwork.
