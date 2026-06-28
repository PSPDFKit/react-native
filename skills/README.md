# Agent Skills for this SDK

This folder contains [Agent Skills](https://cursor.com/docs/context/skills) (`SKILL.md`) for AI agents working in this repository.

These skills are designed so that customers who clone or fork this repository can let their AI tools reliably extend or customize the React Native SDK.

- **react-native-bridge-recipe**
  - Use when bridging native iOS/Android APIs to TypeScript/React Native.
  - Points to `BRIDGING.md` and summarizes the mandatory recipe for native → TypeScript bridges.

If your AI tooling supports skills loaded from the repo, point it at this directory so it can automatically apply the correct bridging pattern.

