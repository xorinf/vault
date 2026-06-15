import jwt from 'jsonwebtoken';

/**
 * Middleware factory to verify JWT token and check allowed roles.
 * Extracts token from cookie OR Authorization header.
 * Attaches decoded token to req.user for downstream handlers.
 */
export const verifyToken = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            //extract token from cookie OR Authorization header (for cross-domain deployments)
            const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
            if (!token) { return res.status(401).json({ message: "Unauthorized Request. Token missing!" }); }

            //verify token using secret
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            //check if user role is within allowed roles for the route
            if (allowedRoles.length && !allowedRoles.includes(decodedToken.role)) {
                return res.status(403).json({ message: "You are not authorized!" });
            }

            //attach decoded token object to request
            req.user = decodedToken;
            next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid or Expired Token!" });
        }
    }
}
