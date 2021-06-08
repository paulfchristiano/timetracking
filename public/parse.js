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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
export var emptyRule = { kind: 'sequence', parts: [], map: function () { return null; } };
// return value is [result, parsed, unparsed]
export function parseString(rule, s) {
    var tokens = tokenize(s);
    var result = parse(rule, tokens);
    if (result == 'fail' || result == 'prefix')
        return result;
    return [result[0], tokens.slice(0, result[1]).join(''), tokens.slice(result[1]).join('')];
}
// start parsing from token start
//fail means no match
//prefix means it may be possible to extend into a match
//The first part of the return value is the result
//The second is the index of the next unparsed token 
function parse(rule, tokens, start) {
    var e_1, _a, e_2, _b;
    if (start === void 0) { start = 0; }
    if (tokens.length == 0)
        return 'prefix';
    switch (rule.kind) {
        case 'token':
            for (var i = start; i < tokens.length; i++) {
                if (rule.applies(tokens[i])) {
                    return [rule.bind(tokens[i]), i + 1];
                }
                else if (tokens[i] != ' ') {
                    return 'fail';
                }
            }
            return 'prefix';
        case 'sequence':
            var vals = [];
            var index = start;
            try {
                for (var _c = __values(rule.parts), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var part = _d.value;
                    var result = parse(part, tokens, index);
                    if (result == 'fail' || result == 'prefix')
                        return result;
                    vals.push(result[0]);
                    index = result[1];
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return [rule.map(vals), index];
        case 'either':
            var prefix = false;
            try {
                for (var _e = __values(rule.options), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var _g = __read(_f.value, 2), option = _g[0], f = _g[1];
                    var result = parse(option, tokens, start);
                    if (result == 'prefix') {
                        prefix = true;
                    }
                    else if (result == 'fail') {
                        continue;
                    }
                    else {
                        return [f(result[0]), result[1]];
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return prefix ? 'prefix' : 'fail';
        default:
            return assertNever(rule);
    }
}
var splitters = " .:,;\"'";
function isNum(c) {
    return (c == '0' || c == '1' || c == '2' || c == '3' || c == '4' || c == '5' || c == '6' || c == '7' || c == '8' || c == '9');
}
//splits into a sequence of blocks
//splitters become their own single-character blocks
//spaces also divide blocks
//also splits numbers from other stuff
export function tokenize(s) {
    var e_3, _a;
    var nextPart = [];
    var parts = [];
    function addPart() {
        if (nextPart.length > 0) {
            parts.push(nextPart.join(''));
            nextPart = [];
        }
    }
    try {
        for (var s_1 = __values(s), s_1_1 = s_1.next(); !s_1_1.done; s_1_1 = s_1.next()) {
            var c = s_1_1.value;
            if (splitters.indexOf(c) >= 0) {
                addPart();
                parts.push(c);
            }
            else {
                if (nextPart.length > 0 && isNum(c) != isNum(nextPart[0])) {
                    addPart();
                }
                nextPart.push(c);
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (s_1_1 && !s_1_1.done && (_a = s_1.return)) _a.call(s_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    addPart();
    return parts;
}
export function raw(s, ignoreCaps) {
    if (ignoreCaps === void 0) { ignoreCaps = true; }
    if (ignoreCaps)
        s = s.toLowerCase();
    return { kind: 'token', applies: function (x) { return (ignoreCaps) ? x.toLowerCase() == s : x == s; }, bind: function () { return s; } };
}
export function anyToken(tokens) {
    return { kind: 'token', applies: function (x) { return tokens.indexOf(x.toLowerCase()) >= 0; }, bind: function (x) { return tokens.indexOf(x.toLowerCase()); } };
}
export var month = any([
    anyToken(['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'nov', 'dec']),
    anyToken(['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'november', 'december'])
]);
export var dayName = any([
    anyToken(['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']),
    anyToken(['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']),
]);
export var number = { kind: 'token', applies: function (x) { return !isNaN(parseInt(x)); }, bind: function (x) { return parseInt(x); } };
export function seq(rules, f) {
    return { kind: 'sequence', parts: rules, map: f };
}
export function any(rules) {
    return { kind: 'either', options: rules.map(function (r) { return [r, function (x) { return x; }]; }) };
}
var colonTime = seq([number, raw(':'), number], function (xs) { return [xs[0], xs[2]]; });
var hToken = any([raw('h'), raw('hours'), raw('hour')]);
var mToken = any([raw('m'), raw('minute'), raw('minutes')]);
function map(from, f) {
    return seq([from], function (xs) { return f(xs[0]); });
}
export var duration = any([
    map(colonTime, function (xs) { return 60 * xs[0] + xs[1]; }),
    seq([number, hToken, number, mToken], function (xs) { return 60 * xs[0] + xs[2]; }),
    seq([number, hToken], function (xs) { return 60 * xs[0]; }),
    seq([number, mToken], function (xs) { return xs[0]; }),
    number,
]);
var ampm = { kind: 'either', options: [[raw('am'), function () { return 'am'; }], [raw('pm'), function () { return 'pm'; }]] };
function today() {
    var d = new Date();
    return { month: d.getMonth(), day: d.getDate(), year: d.getFullYear() };
}
function yesterday() {
    var d = new Date();
    d.setDate(d.getDate() - 1);
    return { month: d.getMonth(), day: d.getDate(), year: d.getFullYear() };
}
function lastDayOfWeek(n, weeksAgo) {
    if (weeksAgo === void 0) { weeksAgo = 0; }
    var d = new Date();
    while (d.getDay() != n)
        d.setDate(d.getDate() - 1);
    d.setDate(d.getDate() - 7 * weeksAgo);
    return { month: d.getMonth(), day: d.getDate(), year: d.getFullYear() };
}
export var dayRule = any([
    seq([month, number], function (x) { return ({ month: x[0], day: x[1] }); }),
    seq([number, raw('/'), number], function (x) { return ({ month: x[0] - 1, day: x[2] }); }),
    map(raw('yesterday'), function () { return yesterday(); }),
    map(raw('today'), function () { return today(); }),
    map(dayName, function (x) { return lastDayOfWeek(x); }),
    seq([raw('last'), dayName], function (x) { return lastDayOfWeek(x[1], 1); })
]);
var ampmTimeRule = any([
    seq([colonTime, ampm], function (xs) { return ({ hours: xs[0][0], minutes: xs[0][1], ampm: xs[1] }); }),
    seq([number, ampm], function (xs) { return ({ hours: xs[0], minutes: 0, ampm: xs[1] }); }),
    map(raw('midnight'), function () { return ({ hours: 12, minutes: 0, ampm: 'am' }); }),
    map(raw('noon'), function () { return ({ hours: 12, minutes: 0, ampm: 'pm' }); })
]);
var startOrEnd = any([raw('start'), raw('end')]);
export var dateRule = any([
    seq([ampmTimeRule, raw(','), dayRule], function (x) { return ({
        hours: x[0].hours,
        minutes: x[0].minutes,
        ampm: x[0].ampm,
        month: x[2].month,
        day: x[2].day,
    }); }),
    seq([ampmTimeRule, dayRule], function (x) { return ({
        hours: x[0].hours,
        minutes: x[0].minutes,
        ampm: x[0].ampm,
        month: x[1].month,
        day: x[2].day,
    }); }),
    ampmTimeRule,
    seq([colonTime], function (x) { return ({
        hours: x[0][0],
        minutes: x[0][1],
    }); }),
    map(number, function (x) { return ({ hours: x, minutes: 0 }); }),
    map(raw('now'), function () { return 'now'; }),
    seq([startOrEnd, dayRule], function (x) { return ({
        hours: (x[0] == 'start') ? 12 : 11,
        minutes: (x[0] == 'start') ? 0 : 59,
        ampm: (x[0] == 'start') ? 'am' : 'pm',
        month: x[1].month,
        day: x[1].day
    }); }),
    seq([startOrEnd, month], function (x) { return ({
        hours: 12,
        minutes: 0,
        ampm: 'am',
        month: (x[0] == 'start') ? x[1] : ((x[1] + 1) % 12),
        day: 1
    }); }),
    seq([startOrEnd, number], function (x) { return ({
        hours: 12,
        minutes: 0,
        ampm: 'am',
        month: 1,
        day: 1,
        year: (x[0] == 'start') ? x[1] : x[1] + 1
    }); })
]);
function assertNever(value) {
    throw new Error("Shouldn't reach this case!");
}
export var rawAction = { kind: 'raw' };
export var actionRule = any([
    map(duration, function (x) { return ({ kind: 'default', minutes: x }); }),
    map(raw('now'), function () { return ({ kind: 'now' }); }),
    map(raw('continue'), function () { return ({ kind: 'continue' }); }),
    seq([any([raw('first'), raw('last'), raw('except')]), duration], function (xs) { return ({ kind: xs[0], minutes: xs[1] }); }),
    seq([any([raw('until'), raw('after'), map(raw('since'), function () { return 'after'; })]), dateRule], function (xs) { return ({ kind: xs[0], time: xs[1] }); })
]);
//# sourceMappingURL=parse.js.map