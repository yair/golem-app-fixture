# golem-app-fixture

The smallest app that runs on golem's app hosting (golem plan 0072), and the
worked example in the `golem-apps` skill (`~/w/skills/golem-apps`).

- `server.js`: listens on `$PORT`, answers `/healthz`, keeps a visit counter
  in `/data`, and reports whether a `GREETING` secret is set.
- `Dockerfile`: runs as any non-root uid with a read-only root filesystem.
- `.github/workflows/golem-image.yml`: build, smoke-test as golem runs it,
  publish to `ghcr.io/yair/golem-app-fixture` tagged by commit SHA.

`FIXTURE_FAIL_HEALTH_VERSION=<sha>` makes exactly that release fail its
health check, which is how the rollback path is tested.

Second release, for golem's rollback test.
