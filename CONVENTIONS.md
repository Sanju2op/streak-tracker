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
