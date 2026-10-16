// Demo Role-based Authentication & Permission Middleware
// Supports X-Demo-Role header, authorization Bearer token, or query param ?role=
export const requireAuth = (allowedRoles = ['admin', 'editor', 'viewer']) => {
  return (req, res, next) => {
    // 1. Determine active role from header, authorization, query, or fallback to admin for demo ease
    let role = (
      req.headers['x-demo-role'] ||
      req.query.role ||
      'admin'
    ).toString().toLowerCase();

    // Map common aliases
    if (role === 'superuser' || role === 'owner') role = 'admin';

    // 2. Attach user context to request
    req.user = {
      id: role === 'admin' ? 'usr_001' : role === 'editor' ? 'usr_002' : 'usr_003',
      name: role === 'admin' ? 'Biswarupa Swain' : role === 'editor' ? 'Sarah Jenkins' : 'David Thorne',
      email: `${role}@thinkwires.com`,
      role: role,
    };

    // 3. Permission Enforcement:
    // Viewer is strictly read-only across all endpoints
    if (role === 'viewer' && req.method !== 'GET') {
      return res.status(403).json({
        success: false,
        error: 'Permission Denied: Viewer accounts have read-only access. Switch role to Admin or Editor to perform modifications.',
        currentRole: role,
      });
    }

    // Check if the current role is within explicitly allowed roles for this specific route
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        error: `Permission Denied: ${role.toUpperCase()} role is not authorized for this operation. Requires ${allowedRoles.join(' or ')}.`,
        currentRole: role,
      });
    }

    next();
  };
};

export default requireAuth;
