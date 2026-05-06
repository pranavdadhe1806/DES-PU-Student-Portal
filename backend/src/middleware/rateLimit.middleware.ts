// TODO: Redis-based rate limiting middleware
// - Use express-rate-limit with Redis store (ioredis)
// - Auth endpoints: 5 req/min (strict)
// - Read endpoints: 200 req/min (loose)
// - Limits are shared across all server instances via Redis

export {};
