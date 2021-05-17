var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import express from 'express';
var PORT = process.env.PORT || 5000;
import { serializeEntries, deserializeEntries } from './public/entries.js';
import postgres from 'postgres';
var sql = (process.env.DATABASE_URL == undefined) ? null : postgres(process.env.DATABASE_URL);
function signup(credentials) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["INSERT INTO users (name, password_hash)\n                VALUES (\n                ", ",\n                ", "\n                )"], ["INSERT INTO users (name, password_hash)\n                VALUES (\n                ", ",\n                ", "\n                )"])), credentials.username, credentials.hashedPassword)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function userExists(credentials) {
    return __awaiter(this, void 0, void 0, function () {
        var results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["SELECT * FROM users\n        WHERE name=", "\n        AND password_hash=", ""], ["SELECT * FROM users\n        WHERE name=", "\n        AND password_hash=", ""])), credentials.username, credentials.hashedPassword)];
                case 1:
                    results = _a.sent();
                    return [2 /*return*/, (results.length > 0)];
            }
        });
    });
}
function updateEntry(credentials, entry) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["INSERT INTO entries (username, time, before, after, lastModified, id, deleted\n        VALUES (\n            ", ",\n            ", ",\n            ", ",\n            ", ",\n            ", ",\n            ", "\n        )\n        ON CONFLICT(uniqueness) DO UPDATE SET\n            before = EXCLUDED.before,\n            after = EXCLUDED.after,\n            time = EXCLUDED.time,\n            lastModified = EXCLUDED.lastModified,\n            deleted = EXCLUDED.deleted\n        WHERE\n            lastModified < EXCLUDED.lastModified\n    "], ["INSERT INTO entries (username, time, before, after, lastModified, id, deleted\n        VALUES (\n            ", ",\n            ", ",\n            ", ",\n            ", ",\n            ", ",\n            ", "\n        )\n        ON CONFLICT(uniqueness) DO UPDATE SET\n            before = EXCLUDED.before,\n            after = EXCLUDED.after,\n            time = EXCLUDED.time,\n            lastModified = EXCLUDED.lastModified,\n            deleted = EXCLUDED.deleted\n        WHERE\n            lastModified < EXCLUDED.lastModified\n    "])), credentials.username, entry.time, entry.before || null, entry.after || null, entry.lastModified.getTime(), entry.deleted)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getEntries(credentials) {
    return __awaiter(this, void 0, void 0, function () {
        var rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["SELECT (time, before, after, lastModified, deleted) from entries WHERE username = ", ""], ["SELECT (time, before, after, lastModified, deleted) from entries WHERE username = ", ""])), credentials.username)];
                case 1:
                    rows = _a.sent();
                    return [2 /*return*/, rows.map(function (row) { return ({
                            time: new Date(row.time),
                            before: (row.before || undefined),
                            after: (row.after || undefined),
                            lastModified: new Date(row.lastModified),
                            deleted: row.deleted,
                        }); })];
            }
        });
    });
}
express()
    .get('/test', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.send('Hello, world!');
        return [2 /*return*/];
    });
}); })
    .use(express.static('./public'))
    .post('/signup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var credentials, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                credentials = {
                    username: req.query.username,
                    hashedPassword: req.query.hashedPassword
                };
                if (!(credentials.username.length < 1)) return [3 /*break*/, 1];
                res.send('Non-empty username required');
                return [3 /*break*/, 5];
            case 1:
                if (!(credentials.hashedPassword.length < 1)) return [3 /*break*/, 2];
                res.send("Non-empty password hash required (shouldn't be possible)");
                return [3 /*break*/, 5];
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, signup(credentials)];
            case 3:
                _a.sent();
                res.send('ok');
                return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                console.log(e_1);
                res.send(e_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); })
    .post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var credentials, success, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                credentials = {
                    username: req.query.username,
                    hashedPassword: req.query.hashedPassword
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, userExists(credentials)];
            case 2:
                success = _a.sent();
                if (success) {
                    res.send('ok');
                }
                else {
                    res.send('username+password not found');
                }
                return [3 /*break*/, 4];
            case 3:
                e_2 = _a.sent();
                res.send(e_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); })
    .post('/update', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var credentials, success, entries, entries_1, entries_1_1, entry, e_3;
    var e_4, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                credentials = {
                    username: req.query.username,
                    hashedPassword: req.query.hashedPassword
                };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, userExists(credentials)];
            case 2:
                success = _b.sent();
                if (success) {
                    entries = deserializeEntries(req.query.entries);
                    try {
                        for (entries_1 = __values(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
                            entry = entries_1_1.value;
                            updateEntry(credentials, entry);
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                }
                else {
                    res.send('username+password not found');
                }
                return [3 /*break*/, 4];
            case 3:
                e_3 = _b.sent();
                res.send(e_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); })
    .get('/entries', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var credentials, success, entries, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                credentials = {
                    username: req.query.username,
                    hashedPassword: req.query.hashedPassword
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, userExists(credentials)];
            case 2:
                success = _a.sent();
                if (!success) return [3 /*break*/, 4];
                return [4 /*yield*/, getEntries(credentials)];
            case 3:
                entries = _a.sent();
                res.send(serializeEntries(entries));
                return [3 /*break*/, 5];
            case 4:
                res.send('username+password not found');
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                e_5 = _a.sent();
                res.send(e_5);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); })
    .listen(PORT, function () { return console.log("Listening on " + PORT); });
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=index.js.map