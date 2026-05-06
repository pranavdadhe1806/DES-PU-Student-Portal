// TODO: Auth service — business logic for authentication
// - register(email, password): validate DES email, hash with Argon2, create user in Prisma
// - login(email, password): verify password, issue JWT, store session in Redis
// - logout(userId): invalidate session in Redis
// - me(userId): return user with role and profile

export {};
