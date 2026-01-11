import { createRemoteJWKSet, type JWTPayload, jwtVerify } from "jose";

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

const getJWKS = () => {
    if (!jwks) {
        const jwksUrl = process.env.JWKS_URL;
        if (!jwksUrl) {
            throw new Error("JWKS_URL environment variable is not set");
        }
        jwks = createRemoteJWKSet(new URL(jwksUrl));
    }
    return jwks;
};

export const verifyToken = async (token: string): Promise<JWTPayload> => {
    const { payload } = await jwtVerify(token, getJWKS(), {
        audience: "authenticated",
    });
    return payload;
};
