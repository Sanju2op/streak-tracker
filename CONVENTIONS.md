# Project Conventions

## Agent Skills
- **Skills Directory**: All agent skills are located in `~/.agents/skills/` (absolute path: `/home/sanjay/.agents/skills/`).
- **UI Design**: Use the `/frontend-design` skill for all UI/UX design tasks.
- **App Development**: Use the `/vercel-react-native-skills` skill for developing the application.

## Development Workflow
- **Browser Testing**: When testing the app on the web browser, ALWAYS remember to explicitly refresh the page to avoid viewing stale errors from previous hot-reload states or missing bundler assets.

## Target Platforms
- **Primary Target (Mobile/Android)**: The app is initially built for and optimized for Android and Mobile devices as the primary target. This is critical for mobile-specific features like widgets and haptics.
- **Secondary Target (Web)**: The app must run and be fully compatible with the Web, acting as a secondary testing platform and alternative usage platform. Ensure cross-platform compatibility when writing new UI components.

## Versioning
- **Bump Version**: After any changes (bug fixes, features, etc.), bump the application version in both `package.json` and `app.json` according to the size of the change:
  - **Patch**: For bug fixes and small tweaks (e.g., `1.0.x` -> `1.0.x+1`).
  - **Minor**: For new features (e.g., `1.x.0` -> `1.x+1.0`).
  - **Major**: For breaking changes or major releases (e.g., `x.0.0` -> `x+1.0.0`).
- **Synchronize Versions**: Ensure the version in `package.json` and `app.json` always match.

## Git Hygiene
- **Check `.gitignore`**: Before creating any large files or downloading tools (like `.apk`, `.aab`, `.jar`), ensure they are covered by `.gitignore`.
- **Verify `git status`**: ALWAYS check `git status` before committing to ensure no sensitive or unnecessary binaries are being staged for the repository.
