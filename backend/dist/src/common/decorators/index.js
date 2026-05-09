"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantId = exports.IS_PUBLIC_KEY = exports.Public = exports.PERMISSIONS_KEY = exports.Permissions = exports.ROLES_KEY = exports.Roles = exports.CurrentUser = void 0;
var current_user_decorator_1 = require("./current-user.decorator");
Object.defineProperty(exports, "CurrentUser", { enumerable: true, get: function () { return current_user_decorator_1.CurrentUser; } });
var roles_decorator_1 = require("./roles.decorator");
Object.defineProperty(exports, "Roles", { enumerable: true, get: function () { return roles_decorator_1.Roles; } });
Object.defineProperty(exports, "ROLES_KEY", { enumerable: true, get: function () { return roles_decorator_1.ROLES_KEY; } });
var permissions_decorator_1 = require("./permissions.decorator");
Object.defineProperty(exports, "Permissions", { enumerable: true, get: function () { return permissions_decorator_1.Permissions; } });
Object.defineProperty(exports, "PERMISSIONS_KEY", { enumerable: true, get: function () { return permissions_decorator_1.PERMISSIONS_KEY; } });
var public_decorator_1 = require("./public.decorator");
Object.defineProperty(exports, "Public", { enumerable: true, get: function () { return public_decorator_1.Public; } });
Object.defineProperty(exports, "IS_PUBLIC_KEY", { enumerable: true, get: function () { return public_decorator_1.IS_PUBLIC_KEY; } });
var tenant_id_decorator_1 = require("./tenant-id.decorator");
Object.defineProperty(exports, "TenantId", { enumerable: true, get: function () { return tenant_id_decorator_1.TenantId; } });
//# sourceMappingURL=index.js.map