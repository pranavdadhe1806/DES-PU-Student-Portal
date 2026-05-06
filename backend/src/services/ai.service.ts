// TODO: AI service — Anthropic Claude API interactions
// - summarizeThread(posts): generate TL;DR for long forum threads
// - suggestTags(postContent): auto-tag posts
// - recommendSkillMatch(userId, projects): match users to projects
// NOTE: All Claude calls go through BullMQ queues — never block a request handler

export {};
