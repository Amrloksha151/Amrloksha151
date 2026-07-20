export const cloudflareRateLimit = async (req, res, next) => {
  try {
    // 1. Extract the Cloudflare env from the request context
    const env = req.env; 
    
    if (!env || !env.RATE_LIMITER) {
      console.warn("Cloudflare Rate Limiter binding not found. Skipping check.");
      return next();
    }

    // 2. Identify the user by IP (Cloudflare provides this header)
    const clientIp = req.headers["cf-connecting-ip"] || "global-fallback";

    // 3. Call Cloudflare's edge-native rate limiter
    const { success } = await env.RATE_LIMITER.limit({ key: clientIp });

    if (!success) {
      return res.status(429).send("Too Many Requests try again after 1 minute.");
    }

    next();
  } catch (error) {
    console.error("Rate limit check failed:", error);
    next(); // Fail-open to avoid breaking the app if CF APIs transiently fail
  }
};