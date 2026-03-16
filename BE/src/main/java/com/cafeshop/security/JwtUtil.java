package com.cafeshop.security;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * Simple JWT token utility using HMAC-SHA256.
 * No external JWT library needed.
 */
public class JwtUtil {

    private static final String SECRET = System.getenv("JWT_SECRET") != null
            ? System.getenv("JWT_SECRET")
            : "cafeshop-admin-secret-key-2024-very-long-and-secure";

    private static final long EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

    /**
     * Generate a simple token: base64(header).base64(payload).base64(signature)
     */
    public static String generateToken(String username, String role) {
        String header = base64Encode("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");
        long now = System.currentTimeMillis();
        long exp = now + EXPIRATION_MS;
        String payloadJson = String.format(
                "{\"sub\":\"%s\",\"role\":\"%s\",\"iat\":%d,\"exp\":%d}",
                username, role, now / 1000, exp / 1000);
        String payload = base64Encode(payloadJson);
        String signature = base64Encode(hmacSha256(header + "." + payload));
        return header + "." + payload + "." + signature;
    }

    /**
     * Validate token and return username if valid, null otherwise.
     */
    public static String validateToken(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3)
                return null;

            // Verify signature
            String expectedSig = base64Encode(hmacSha256(parts[0] + "." + parts[1]));
            if (!expectedSig.equals(parts[2]))
                return null;

            // Decode payload and check expiration
            String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);

            // Simple JSON parsing for exp field
            int expIdx = payloadJson.indexOf("\"exp\":");
            if (expIdx == -1)
                return null;
            String expStr = payloadJson.substring(expIdx + 6);
            expStr = expStr.split("[,}]")[0].trim();
            long exp = Long.parseLong(expStr);

            if (System.currentTimeMillis() / 1000 > exp)
                return null; // Token expired

            // Extract username
            int subIdx = payloadJson.indexOf("\"sub\":\"");
            if (subIdx == -1)
                return null;
            String sub = payloadJson.substring(subIdx + 7);
            sub = sub.substring(0, sub.indexOf("\""));

            return sub;
        } catch (Exception e) {
            return null;
        }
    }

    private static String base64Encode(String data) {
        return Base64.getUrlEncoder().withoutPadding()
                .encodeToString(data.getBytes(StandardCharsets.UTF_8));
    }

    private static String base64Encode(byte[] data) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(data);
    }

    private static byte[] hmacSha256(String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec key = new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(key);
            return mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            throw new RuntimeException("HMAC-SHA256 error", e);
        }
    }
}
