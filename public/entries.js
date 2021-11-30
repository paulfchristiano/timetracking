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
export function newUID() {
    return Math.random().toString(36).substring(2, 10);
}
export function makeNewEntry(time, before, after) {
    return { time: time, id: newUID(), lastModified: now(), before: before, after: after, deleted: false };
}
export function serializeEntries(entries) {
    return JSON.stringify(entries.map(function (x) { return ({
        time: x.time.getTime(),
        before: x.before,
        after: x.after,
        lastModified: x.lastModified.getTime(),
        deleted: x.deleted,
        id: x.id,
    }); }));
}
export function serializeEntry(x) {
    return JSON.stringify({
        time: x.time.getTime(),
        before: x.before,
        after: x.after,
        lastModified: x.lastModified.getTime(),
        deleted: x.deleted,
        id: x.id,
    });
}
export function deserializeEntry(s) {
    var x = JSON.parse(s);
    var time = (typeof x.time == 'number') ? new Date(x.time) : undefined;
    if (time === undefined)
        return null;
    var lastModified = (typeof x.lastModified == 'number')
        ? new Date(x.lastModified)
        : now();
    var before = (typeof x.before == 'string') ? x.before : undefined;
    var after = (typeof x.after == 'string') ? x.after : undefined;
    var deleted = (typeof x.deleted == 'boolean') ? x.deleted : false;
    var id = (typeof x.id == 'string') ? x.id : newUID();
    return { time: time, lastModified: lastModified, before: before, after: after, deleted: deleted, id: id };
}
/* DEPRECATED */
export function deserializeEntries(s) {
    var e_1, _a;
    var result = [];
    try {
        var json = JSON.parse(s);
        if (Array.isArray(json)) {
            try {
                for (var json_1 = __values(json), json_1_1 = json_1.next(); !json_1_1.done; json_1_1 = json_1.next()) {
                    var x = json_1_1.value;
                    var time = (typeof x.time == 'number') ? new Date(x.time) : undefined;
                    if (time === undefined)
                        continue;
                    var lastModified = (typeof x.lastModified == 'number')
                        ? new Date(x.lastModified)
                        : now();
                    var before = (typeof x.before == 'string') ? x.before : undefined;
                    var after = (typeof x.after == 'string') ? x.after : undefined;
                    var deleted = (typeof x.deleted == 'boolean') ? x.deleted : false;
                    var id = (typeof x.id == 'string') ? x.id : newUID();
                    result.push({ time: time, lastModified: lastModified, before: before, after: after, deleted: deleted, id: id });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (json_1_1 && !json_1_1.done && (_a = json_1.return)) _a.call(json_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    }
    finally {
        return result;
    }
}
function now() {
    return new Date();
}
//# sourceMappingURL=entries.js.map