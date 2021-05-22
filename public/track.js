var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import { InputBox } from './suggester.js';
import { dateRule, parseString } from './parse.js';
import { serializeEntries, deserializeEntries, newUID, makeNewEntry } from './entries.js';
function enumfrom(xs, i, j) {
    var k;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                k = i;
                _a.label = 1;
            case 1:
                if (!(k < j)) return [3 /*break*/, 4];
                return [4 /*yield*/, [k, xs[k]]];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                k++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}
function calendarSpan(label, spanStart, spanEnd, start, end, profile) {
    function frac(d) {
        return (d.getTime() - start.getTime()) / (end.getTime() - start.getTime());
    }
    var lengthPercent = 100 * (frac(spanEnd) - frac(spanStart));
    var topPercent = 100 * frac(spanStart);
    var color = getColor(label, profile);
    var style = "top:" + topPercent + "%; height:" + lengthPercent + "%; background:" + renderColor(color) + ";";
    var result = $("<div class='event' style='" + style + "'><div class='spantext'>" + label + "</div></div>");
    return result;
}
function labelPopup(label, callback) {
    $('#popup').attr('active', 'true');
    $('#popuplabel').text(label);
    $('#newlabel').empty();
    $('#newlabel').append(inputAfterColon('Rename to', '', function (s) { return callback({ kind: 'bulkRename', from: label, to: s }); }));
    $('#movechildren').prop('checked', true);
}
function findEntry(id, entries) {
    for (var i = 0; i < entries.length; i++) {
        if (entries[i].id == id) {
            return [entries[i], i];
        }
    }
    return null;
}
//TODO: need to refactor this to do the sort + filter in the calendar construction, and to rerun when entries changes
//Then at this stage I want to get the indices from the startentry and endEntry?
//Might actually be indices by the time it gets here, computing them at the same time that I do filtering and sorting
function zoomedPopup(entries, //Sorted and filtered
startEntry, endEntry, profile, popup, callback) {
    var e_1, _a;
    var result = findEntry(startEntry, entries);
    if (result == null)
        return;
    var _b = __read(result, 2), start = _b[0], startIndex = _b[1];
    result = findEntry(endEntry, entries);
    if (result == null)
        return;
    var _c = __read(result, 2), end = _c[0], endIndex = _c[1];
    $('#popup').attr('active', 'true');
    $('#minical').empty();
    $('#priorcal').empty();
    $('#nextcal').empty();
    var _loop_1 = function (a, b) {
        if (a == null && startIndex > 0) {
            var label = labelFrom(entries[startIndex - 1], entries[startIndex]);
            var style = "background:" + renderGradient(getColor(label, profile), true) + "; height:100%";
            var e_2 = $("<div class='event' style='" + style + "'><div class='spantext'></div></div>");
            e_2.click(function () { return popup(entries[startIndex - 1].id, entries[startIndex].id); });
            $('#priorcal').append(e_2);
        }
        if (b == null && endIndex + 1 < entries.length) {
            var label = labelFrom(entries[endIndex], entries[endIndex + 1]);
            var style = "background:" + renderGradient(getColor(label, profile), false) + "; height:100%";
            var e_3 = $("<div class='event' style='" + style + "'><div class='spantext'></div></div>");
            e_3.click(function () { return popup(entries[endIndex].id, entries[endIndex + 1].id); });
            $('#nextcal').append(e_3);
        }
        if (a != null && b != null) {
            var _a = __read(a, 2), i = _a[0], first_1 = _a[1];
            var _b = __read(b, 2), j = _b[0], second_1 = _b[1];
            var elem = calendarSpan(labelFrom(first_1, second_1), first_1.time, second_1.time, start.time, end.time, profile);
            elem.click(function () { return popup(first_1.id, second_1.id); });
            $('#minical').append(elem);
        }
    };
    try {
        for (var _d = __values(listPairsAndEnds(enumfrom(entries, startIndex, endIndex + 1))), _e = _d.next(); !_e.done; _e = _d.next()) {
            var _f = __read(_e.value, 2), a = _f[0], b = _f[1];
            _loop_1(a, b);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var input = new InputBox(getDistinctLabels(entries), $('.inputwrapper'));
    input.bind(function (a, s) {
        switch (a.kind) {
            case 'raw':
                callback({ kind: 'relabel', label: s, before: entries[endIndex - 1], after: entries[endIndex] });
                break;
            case 'number':
                callback({
                    kind: 'split',
                    before: entries[endIndex - 1],
                    after: entries[endIndex],
                    time: minutesAfter(entries[endIndex - 1].time, a.number),
                    labelBefore: s
                });
                break;
            case 'last':
                callback({
                    kind: 'split',
                    before: entries[endIndex - 1],
                    after: entries[endIndex],
                    time: minutesAfter(entries[endIndex].time, -a.minutes),
                    labelAfter: s
                });
                break;
            case 'first':
                callback({
                    kind: 'spliceSplit',
                    before: entries[startIndex],
                    time: minutesAfter(entries[startIndex].time, a.minutes),
                    label: s
                });
                break;
            case 'until':
                callback({
                    kind: 'split',
                    before: entries[startIndex],
                    after: entries[startIndex + 1],
                    time: specToDate(a.time, entries[startIndex].time, 'next'),
                    labelBefore: s
                });
                break;
            case 'after':
                callback({
                    kind: 'split',
                    before: entries[startIndex],
                    after: entries[startIndex + 1],
                    time: specToDate(a.time, entries[startIndex].time, 'next'),
                    labelAfter: s
                });
                break;
            case 'now':
                break;
            default: assertNever(a);
        }
    });
    input.focus();
    $('#starttime').empty();
    $('#starttime').append(inputAfterColon('Start', renderTime(start.time), function (s) {
        var result = parseString(dateRule, s);
        if (result == 'fail' || result == 'prefix' || result[2].length > 0) {
            // TODO: handle error
        }
        else {
            callback({ kind: 'move', time: specToDate(result[0], start.time, 'closest'), entry: start });
        }
    }));
    $('#endtime').empty();
    $('#endtime').append(inputAfterColon('End', renderTime(end.time), function (s) {
        var result = parseString(dateRule, s);
        if (result == 'fail' || result == 'prefix' || result[2].length > 0) {
            // TODO: handle error
        }
        else {
            callback({ kind: 'move', time: specToDate(result[0], end.time, 'closest'), entry: end });
        }
    }));
}
function renderDuration(ms) {
    if (ms < 0) {
        return "-" + renderDuration(-ms);
    }
    if (ms < 1000) {
        return ms + "ms";
    }
    var s = Math.floor(ms / 1000);
    if (s < 60) {
        return s + "s";
    }
    var minutes = Math.round(s / 60);
    if (minutes < 60) {
        return minutes + "m";
    }
    var h = Math.floor(minutes / 60);
    var m = (minutes % 60);
    return h + "h:" + twoDigits(m) + "m";
}
function twoDigits(n) {
    var s = "" + n;
    if (s.length == 1) {
        return '0' + s;
    }
    else {
        return s;
    }
}
function specToDate(spec, anchor, rel) {
    var e_4, _a, e_5, _b;
    if (spec == 'now')
        return now();
    var candidate = new Date(anchor);
    candidate.setMinutes(spec.minutes);
    var best = new Date(anchor);
    var bestDiff = null;
    var month = (spec.month === undefined) ? anchor.getMonth() : spec.month;
    candidate.setMonth(month);
    var hours = (spec.hours == 12) ? 0 : spec.hours;
    var dateCandidates = (spec.day === undefined) ? [-1, 0, 1].map(function (x) { return anchor.getDate() + x; }) : [spec.day];
    var ampmCandidates = (spec.ampm === undefined) ? ['am', 'pm'] : [spec.ampm];
    var hourCandidates = ampmCandidates.map(function (x) { return (x == 'am') ? hours : (hours + 12) % 24; });
    try {
        for (var dateCandidates_1 = __values(dateCandidates), dateCandidates_1_1 = dateCandidates_1.next(); !dateCandidates_1_1.done; dateCandidates_1_1 = dateCandidates_1.next()) {
            var date = dateCandidates_1_1.value;
            try {
                for (var hourCandidates_1 = (e_5 = void 0, __values(hourCandidates)), hourCandidates_1_1 = hourCandidates_1.next(); !hourCandidates_1_1.done; hourCandidates_1_1 = hourCandidates_1.next()) {
                    var hours_1 = hourCandidates_1_1.value;
                    candidate.setDate(date);
                    candidate.setHours(hours_1);
                    var diff = candidate.getTime() - anchor.getTime();
                    var absDiff = Math.abs(diff);
                    var isValid = (rel == 'closest') || (rel == 'next' && diff > 0) || (rel == 'previous' && diff < 0);
                    if ((bestDiff == null || absDiff < bestDiff) && isValid) {
                        best = new Date(candidate);
                        bestDiff = absDiff;
                    }
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (hourCandidates_1_1 && !hourCandidates_1_1.done && (_b = hourCandidates_1.return)) _b.call(hourCandidates_1);
                }
                finally { if (e_5) throw e_5.error; }
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (dateCandidates_1_1 && !dateCandidates_1_1.done && (_a = dateCandidates_1.return)) _a.call(dateCandidates_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return best;
}
function parseTime(s, anchor, rel) {
    var m = parseString(dateRule, s);
    if (m == 'fail' || m == 'prefix' || m[2].length > 0)
        return 'error';
    return specToDate(m[0], anchor, rel);
}
function applyAndSave(entries, update, credentials) {
    var updates = [];
    applyUpdate(update, entries, updates);
    saveEntries(entries);
    sendUpdates(updates, credentials);
}
export function loadTracker() {
    return __awaiter(this, void 0, void 0, function () {
        function callback(update) {
            applyAndSave(entries, update, credentials);
            render();
        }
        function startInput(elem, start, end) {
            $('.inputwrapper').empty();
            var x = new InputBox(getDistinctLabels(entries), elem);
            x.focus();
            if (end == null) {
                x.bind(function (a, s) {
                    switch (a.kind) {
                        case 'raw':
                            callback({ kind: 'append', before: (s.length == 0) ? undefined : s, time: new Date() });
                            break;
                        //TODO: handle weird cases
                        case 'first':
                            callback({ kind: 'spliceSplit', label: s, before: start, time: minutesAfter(start.time, a.minutes) });
                            break;
                        case 'last':
                            callback({ kind: 'composite', updates: [
                                    { kind: 'append', time: minutesAfter(new Date(), -a.minutes), after: s },
                                    { kind: 'append', time: new Date(), before: s }
                                ] });
                            break;
                        case 'number':
                            callback({ kind: 'append', before: s, time: minutesAfter(start.time, a.number) });
                            break;
                        case 'now':
                            callback({ kind: 'relabel', label: s, before: start });
                            break;
                        case 'until':
                            callback({ kind: 'spliceSplit', label: s, before: start, time: specToDate(a.time, start.time, 'next') });
                            break;
                        case 'after':
                            callback({ kind: 'append', after: s, time: specToDate(a.time, new Date(), 'previous') });
                            break;
                        default: assertNever(a);
                    }
                });
            }
            else {
                x.bind(function (a, s) {
                    switch (a.kind) {
                        case 'raw':
                            callback({ kind: 'relabel', label: s, before: start, after: end });
                            break;
                        case 'first':
                            callback({ kind: 'spliceSplit', label: s, before: start, time: minutesAfter(start.time, a.minutes) });
                            break;
                        case 'now':
                            break;
                        case 'number':
                            callback({ kind: 'split', labelBefore: s, before: start, after: end, time: minutesAfter(start.time, a.number) });
                            break;
                        case 'last':
                            callback({ kind: 'split', labelAfter: s, before: start, after: end, time: minutesAfter(end.time, -a.minutes) });
                            break;
                        case 'until':
                            callback({ kind: 'spliceSplit', label: s, before: start, time: specToDate(a.time, start.time, 'next') });
                            break;
                        case 'after':
                            callback({ kind: 'split', labelAfter: s, before: start, after: end, time: specToDate(a.time, start.time, 'next') });
                            break;
                        default: assertNever(a);
                    }
                });
            }
        }
        function setTimer(start, elem) {
            var diff = new Date().getTime() - start.getTime();
            if (diff > 1000)
                elem.text(renderDuration(new Date().getTime() - start.getTime()));
        }
        function render() {
            var e_6, _a;
            heartbeats = [];
            var elem = $('#inputs');
            elem.html('');
            var sortedEntries = sortAndFilter(entries);
            var _loop_2 = function (end, start) {
                //end = entries[i]
                if (end == null) {
                    var row = $("<div class='trackertimerow'></div>");
                    row.append('<div class="nowdot"></div>');
                    row.append($("<div class='timelabel'></div>"));
                    elem.append(row);
                }
                else {
                    /*
                    const e = $(`<span class='clickable'>[${renderTime(end.time)}]</span>`)
                    const f = $('<div></div>')
                    f.append(e)
                    elem.append(f)
                    */
                    var row = $("<div class='trackertimerow'></div>");
                    row.append('<div class="dot"></div>');
                    var time_1 = $("<div class='timelabel' contenteditable='true'>" + renderTime(end.time) + "</div>");
                    time_1.blur(function () {
                        time_1.text(renderTime(end.time));
                    });
                    time_1.keydown(function (e) {
                        if (e.keyCode == 13) {
                            e.preventDefault();
                            var date = parseTime(time_1.text(), end.time, 'closest');
                            if (date != 'error') {
                                callback({ kind: 'move', entry: end, time: date });
                            }
                        }
                    });
                    row.append(time_1);
                    elem.append(row);
                }
                //TODO unify these two cases
                if (start != null && end != null) {
                    var label = labelFrom(start, end);
                    var style = "background: " + renderColor(getColor(label, profile)) + "; float: left";
                    var row = $("<div class='trackerrow'></div>");
                    var text = $("<div class='trackerlabel'></div>");
                    text.append($("<div>" + renderLabel(label) + "</div>"));
                    text.append($("<div>" + renderDuration(end.time.getTime() - start.time.getTime()) + "</div>"));
                    var e_7 = $("<div class=\"line\" style='" + style + "''></div>");
                    row.append(e_7);
                    row.append(text);
                    var inputBuffer = $("<div class='inputbuffer'></div>");
                    var inputWrapper_1 = $("<div class='inputwrapper'></div>");
                    inputBuffer.append(inputWrapper_1);
                    row.append(inputBuffer);
                    text.click(function () {
                        startInput(inputWrapper_1, start, end);
                        focused = end;
                    });
                    elem.append(row);
                    if (focused == end)
                        startInput(inputWrapper_1, start, end);
                }
                if (start != null && end == null) {
                    var label = start.after || 'TBD';
                    var style = "background: gray; float: left";
                    var row = $("<div class='trackerrow'></div>");
                    var text = $("<div class='trackerlabel'></div>");
                    text.append($("<div>" + renderLabel(label) + "</div>"));
                    var timer = $("<div id='runningtimer'></div>");
                    setTimer(start.time, timer);
                    text.append(timer);
                    heartbeats.push([start.time, timer]);
                    var e_8 = $("<div class=\"line\" style='" + style + "''></div>");
                    row.append(e_8);
                    row.append(text);
                    var inputBuffer = $("<div class='inputbuffer'></div>");
                    var inputWrapper_2 = $("<div class='inputwrapper'></div>");
                    inputBuffer.append(inputWrapper_2);
                    row.append(inputBuffer);
                    text.click(function () {
                        startInput(inputWrapper_2, start, end);
                        focused = end;
                    });
                    elem.append(row);
                    if (focused == null)
                        startInput(inputWrapper_2, start, end);
                }
            };
            try {
                for (var _b = __values(listPairsAndEnds(revit(sortedEntries))), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), end = _d[0], start = _d[1];
                    _loop_2(end, start);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
        var credentials, profile, entries, focused, heartbeats;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCredentials()];
                case 1:
                    credentials = _a.sent();
                    profile = loadProfile();
                    return [4 /*yield*/, loadEntries(credentials)];
                case 2:
                    entries = _a.sent();
                    if (entries.length == 0) {
                        entries.push(makeNewEntry(now(), undefined, undefined));
                        saveEntries(entries);
                    }
                    sortEntries(entries);
                    focused = null;
                    heartbeats = [];
                    setInterval(function () {
                        var e_9, _a;
                        try {
                            for (var heartbeats_1 = __values(heartbeats), heartbeats_1_1 = heartbeats_1.next(); !heartbeats_1_1.done; heartbeats_1_1 = heartbeats_1.next()) {
                                var _b = __read(heartbeats_1_1.value, 2), start = _b[0], elem = _b[1];
                                setTimer(start, elem);
                            }
                        }
                        catch (e_9_1) { e_9 = { error: e_9_1 }; }
                        finally {
                            try {
                                if (heartbeats_1_1 && !heartbeats_1_1.done && (_a = heartbeats_1.return)) _a.call(heartbeats_1);
                            }
                            finally { if (e_9) throw e_9.error; }
                        }
                    }, 1000);
                    render();
                    return [2 /*return*/];
            }
        });
    });
}
function emptyProfile() {
    return { colors: new Map() };
}
export function loadChart() {
    return __awaiter(this, void 0, void 0, function () {
        var credentials, entries;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCredentials()];
                case 1:
                    credentials = _a.sent();
                    return [4 /*yield*/, loadEntries(credentials)];
                case 2:
                    entries = _a.sent();
                    renderChart(entries, loadProfile());
                    return [2 /*return*/];
            }
        });
    });
}
function renderChart(entries, profile) {
    var e_10, _a;
    var timings = getTotalTime(entries, entries[0].time, entries[entries.length - 1].time);
    var datapoints = [];
    try {
        for (var timings_1 = __values(timings), timings_1_1 = timings_1.next(); !timings_1_1.done; timings_1_1 = timings_1.next()) {
            var _b = __read(timings_1_1.value, 2), k = _b[0], v = _b[1];
            datapoints.push({ label: k, y: v / 3600, color: renderColor(getColor(k, profile)) });
        }
    }
    catch (e_10_1) { e_10 = { error: e_10_1 }; }
    finally {
        try {
            if (timings_1_1 && !timings_1_1.done && (_a = timings_1.return)) _a.call(timings_1);
        }
        finally { if (e_10) throw e_10.error; }
    }
    /* tslint:disable-next-line */
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: false,
        title: {},
        data: [{
                type: "pie",
                startAngle: 240,
                yValueFormatString: "##0.0h",
                indexLabel: "{label} {y}",
                dataPoints: datapoints
            }]
    });
    chart.render();
}
function secondsBetween(a, b) {
    return (b.getTime() - a.getTime()) / 1000;
}
function length(span) {
    return secondsBetween(span.start.time, span.end.time);
}
function renderBars(entries, buckets, profile) {
    var e_11, _a, e_12, _b, e_13, _c, e_14, _d;
    var seconds = [];
    try {
        for (var buckets_1 = __values(buckets), buckets_1_1 = buckets_1.next(); !buckets_1_1.done; buckets_1_1 = buckets_1.next()) {
            var bucket = buckets_1_1.value;
            var spans = spansInRange(bucket.start, bucket.end, entries);
            seconds.push(sumByName(spans.map(function (span) { return [span.label, length(span)]; })));
        }
    }
    catch (e_11_1) { e_11 = { error: e_11_1 }; }
    finally {
        try {
            if (buckets_1_1 && !buckets_1_1.done && (_a = buckets_1.return)) _a.call(buckets_1);
        }
        finally { if (e_11) throw e_11.error; }
    }
    var keys = new Set();
    try {
        for (var seconds_1 = __values(seconds), seconds_1_1 = seconds_1.next(); !seconds_1_1.done; seconds_1_1 = seconds_1.next()) {
            var m = seconds_1_1.value;
            try {
                for (var m_1 = (e_13 = void 0, __values(m)), m_1_1 = m_1.next(); !m_1_1.done; m_1_1 = m_1.next()) {
                    var k = m_1_1.value;
                    keys.add(k[0]);
                }
            }
            catch (e_13_1) { e_13 = { error: e_13_1 }; }
            finally {
                try {
                    if (m_1_1 && !m_1_1.done && (_c = m_1.return)) _c.call(m_1);
                }
                finally { if (e_13) throw e_13.error; }
            }
        }
    }
    catch (e_12_1) { e_12 = { error: e_12_1 }; }
    finally {
        try {
            if (seconds_1_1 && !seconds_1_1.done && (_b = seconds_1.return)) _b.call(seconds_1);
        }
        finally { if (e_12) throw e_12.error; }
    }
    var data = [];
    var _loop_3 = function (k) {
        data.push({
            type: "stackedColumn",
            showInLegend: false,
            color: getColor(k, profile),
            name: k,
            dataPoints: seconds.map(function (m, i) { return ({
                y: (m.get(k) || 0) / 3600,
                x: i,
            }); })
        });
    };
    try {
        for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
            var k = keys_1_1.value;
            _loop_3(k);
        }
    }
    catch (e_14_1) { e_14 = { error: e_14_1 }; }
    finally {
        try {
            if (keys_1_1 && !keys_1_1.done && (_d = keys_1.return)) _d.call(keys_1);
        }
        finally { if (e_14) throw e_14.error; }
    }
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: false,
        title: {},
        toolTip: {
            shared: false,
            contentFormatter: function (e) {
                var _a;
                return e.entries[0].dataSeries.name + ": " + ((_a = e.entries[0].dataPoint.y) === null || _a === void 0 ? void 0 : _a.toFixed(2));
            },
            content: '{name}: {y} '
        },
        axisX: {
            interval: 1,
            labelFormatter: function (e) { return (e.value >= 0) ? buckets[e.value].name : '???'; }
        },
        axisY: {
            valueFormatString: "#0h",
        },
        data: data
    });
    /*
    var chart = new CanvasJS.Chart("chartContainer", {
     animationEnabled: true,
     title: {},
     axisX: {
         interval: 1,
     },
     axisY:{
         valueFormatString:"#0h",
     },
     data: [{
         type: "stackedColumn",
         showInLegend: true,
         color: "#696661",
         name: "Q1",
         dataPoints: [
             { y: 6.75, x: 0},
             { y: 8.57, x: 1 },
             { y: 10.64, x: 2 },
             { y: 13.97, x: 3 },
             { y: 15.42, x: 4 },
             { y: 17.26, x: 5 },
             { y: 20.26, x: 6 }
         ]
         },
         {
             type: "stackedColumn",
             showInLegend: true,
             name: "Q2",
             color: "#EDCA93",
             dataPoints: [
                 { y: 6.82, x: 0},
                 { y: 9.02, x: 1 },
                 { y: 11.80, x: 2 },
                 { y: 14.11, x: 3 },
                 { y: 15.96, x: 4 },
                 { y: 17.73, x: 5 },
                 { y: 21.5, x: 6 }
             ]
         },
         {
             type: "stackedColumn",
             showInLegend: true,
             name: "Q3",
             color: "#695A42",
             dataPoints: [
                 { y: 7.28, x: 0 },
                 { y: 9.72, x: 1 },
                 { y: 13.30, x: 2 },
                 { y: 14.9, x: 3 },
                 { y: 18.10, x: 4 },
                 { y: 18.68, x: 5 },
                 { y: 22.45, x: 6 }
             ]
         },
         {
             type: "stackedColumn",
             showInLegend: true,
             name: "Q4",
             color: "#B6B1A8",
             dataPoints: [
                 { y: 8.44, x: 0 },
                 { y: 10.58, x: 1 },
                 { y: 14.41, x: 2 },
                 { y: 16.86, x: 3 },
                 { y: 10.64, x: 4 },
                 { y: 21.32, x: 5 },
                 { y: 26.06, x: 6 }
             ]
     }]
     });
     */
    chart.render();
}
export function loadBars() {
    return __awaiter(this, void 0, void 0, function () {
        var credentials, entries, buckets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCredentials()];
                case 1:
                    credentials = _a.sent();
                    return [4 /*yield*/, loadEntries(credentials)];
                case 2:
                    entries = _a.sent();
                    buckets = weeklyBuckets();
                    renderBars(entries, buckets, loadProfile());
                    return [2 /*return*/];
            }
        });
    });
}
function weeklyBuckets() {
    var result = [];
    for (var i = 0; i < 7; i++) {
        var d = daysAgo(6 - i);
        var start = startOfDay(d);
        var end = endOfDay(d);
        result.push({ name: renderDay(d), start: start, end: end });
    }
    return result;
}
function incrementMap(map, x, dy) {
    var y = map.get(x);
    map.set(x, (y || 0) + dy);
}
function getTotalTime(entries, start, end) {
    var e_15, _a;
    var result = new Map();
    var spans = spansInRange(start, end, entries);
    try {
        for (var spans_1 = __values(spans), spans_1_1 = spans_1.next(); !spans_1_1.done; spans_1_1 = spans_1.next()) {
            var span = spans_1_1.value;
            var seconds = (span.start.time.getTime() - span.end.time.getTime()) / 1000;
            incrementMap(result, span.label, seconds);
        }
    }
    catch (e_15_1) { e_15 = { error: e_15_1 }; }
    finally {
        try {
            if (spans_1_1 && !spans_1_1.done && (_a = spans_1.return)) _a.call(spans_1);
        }
        finally { if (e_15) throw e_15.error; }
    }
    return result;
}
function sumByName(data) {
    var e_16, _a;
    var result = new Map();
    try {
        for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
            var datum = data_1_1.value;
            incrementMap(result, datum[0], datum[1]);
        }
    }
    catch (e_16_1) { e_16 = { error: e_16_1 }; }
    finally {
        try {
            if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
        }
        finally { if (e_16) throw e_16.error; }
    }
    return result;
}
function hoursAgo(n) {
    var result = now();
    result.setHours(result.getHours() - n);
    return result;
}
function daysAgo(n) {
    var result = now();
    result.setDate(result.getDate() - n);
    return result;
}
function renderLabel(label) {
    if (label.length > 0 && label[0] == '?') {
        return "<span class='errorlabel'>" + label + "</span>";
    }
    var parts = label.split('/');
    if (parts.length == 1)
        return label;
    var prefix = parts.slice(0, parts.length - 1).join('/');
    var suffix = parts[parts.length - 1];
    return suffix + " <span class='categorylabel'>(" + prefix + ")</span>";
}
function namesFrom(label) {
    var parts, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (label === undefined)
                    return [2 /*return*/];
                parts = label.split('/');
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < parts.length)) return [3 /*break*/, 4];
                return [4 /*yield*/, parts.slice(0, i + 1).join('/')];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}
function getDistinctLabels(entries) {
    var e_17, _a, e_18, _b, e_19, _c;
    var s = new Set();
    try {
        for (var entries_1 = __values(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
            var entry = entries_1_1.value;
            try {
                for (var _d = (e_18 = void 0, __values(namesFrom(entry.before))), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var name_1 = _e.value;
                    s.add(name_1);
                }
            }
            catch (e_18_1) { e_18 = { error: e_18_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                }
                finally { if (e_18) throw e_18.error; }
            }
            try {
                for (var _f = (e_19 = void 0, __values(namesFrom(entry.after))), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var name_2 = _g.value;
                    s.add(name_2);
                }
            }
            catch (e_19_1) { e_19 = { error: e_19_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_c = _f.return)) _c.call(_f);
                }
                finally { if (e_19) throw e_19.error; }
            }
        }
    }
    catch (e_17_1) { e_17 = { error: e_17_1 }; }
    finally {
        try {
            if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
        }
        finally { if (e_17) throw e_17.error; }
    }
    return Array.from(s.keys());
}
function uniques(xs) {
    return __spread(new Set(xs));
}
function now() {
    return new Date();
}
function convertDate(d) {
    return {
        year: d.getFullYear(),
        month: d.toLocaleString('default', { month: 'short' }),
        day: d.getDate(),
        hour: (d.getHours() + 11) % 12 + 1,
        ampm: d.getHours() < 12 ? 'am' : 'pm',
        minute: (d.getMinutes())
    };
}
/*
function roundDate(partial:Partial<MyDate>, d:Date, rel:'next'|'last'|'closest'='cloest'): Date {
    const years: number[] = (partial.year === undefined) ? neighbors(d.getFullYear()) : [partial.year]
    const months
}
*/
function renderTime(date) {
    var now = convertDate(new Date());
    var myDate = convertDate(date);
    function renderTime(d) {
        return d.hour + ":" + twoDigits(d.minute);
    }
    function renderAMPM(d) {
        return renderTime(d) + " " + ((d.ampm == 'am') ? 'AM' : 'PM');
    }
    function renderDay(d) {
        return renderAMPM(d) + ", " + d.month + " " + d.day;
    }
    function renderYear(d) {
        return renderDay(d) + ", " + d.year;
    }
    if (now.year != myDate.year)
        return renderYear(myDate);
    else if (now.month != myDate.month || now.day != myDate.day)
        return renderDay(myDate);
    else if (now.ampm != myDate.ampm || myDate.hour == 12)
        return renderAMPM(myDate);
    else
        return renderTime(myDate);
}
function saveEntries(entries) {
    localStorage.setItem('entries', serializeEntries(entries));
}
export function getLocalEntries() {
    var s = localStorage.getItem('entries');
    return (s == null) ? [] : deserializeEntries(s);
}
function loadEntries(credentials) {
    return __awaiter(this, void 0, void 0, function () {
        var localEntries, remoteEntries, merge;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    localEntries = getLocalEntries();
                    return [4 /*yield*/, getRemoteEntries(credentials)];
                case 1:
                    remoteEntries = _a.sent();
                    merge = mergeAndUpdate(localEntries, remoteEntries);
                    sendUpdates(merge.yUpdates, credentials);
                    if (merge.xUpdates.length > 0)
                        saveEntries(merge.merged);
                    return [2 /*return*/, merge.merged];
            }
        });
    });
}
function renderDay(d) {
    return d.toLocaleDateString("en-US", { day: 'numeric', weekday: 'short', month: 'short' });
}
function sortEntries(entries) {
    entries.sort(function (a, b) { return a.time.getTime() - b.time.getTime(); });
}
function startOfDay(d) {
    var result = new Date(d);
    result.setHours(0, 0, 0, 0);
    return result;
}
function endOfDay(d) {
    var result = new Date(d);
    result.setHours(23, 59, 59, 999);
    return result;
}
function first(a, b) {
    return (a < b) ? a : b;
}
function last(a, b) {
    return (a > b) ? a : b;
}
function mid(a, b) {
    return new Date((a.getTime() + b.getTime()) / 2);
}
function minutesAfter(a, n) {
    var result = new Date(a);
    result.setMinutes(result.getMinutes() + n);
    return result;
}
function applyToTriples(f, xs) {
    var e_20, _a;
    var a = undefined;
    var b = undefined;
    var c = undefined;
    var result = [];
    function addIf(a, b, c) {
        var y = f(a, b, c);
        if (y != null)
            result.push(y);
    }
    try {
        for (var xs_1 = __values(xs), xs_1_1 = xs_1.next(); !xs_1_1.done; xs_1_1 = xs_1.next()) {
            var x = xs_1_1.value;
            a = b;
            b = c;
            c = x;
            if (b != undefined) {
                addIf(a, b, c);
            }
        }
    }
    catch (e_20_1) { e_20 = { error: e_20_1 }; }
    finally {
        try {
            if (xs_1_1 && !xs_1_1.done && (_a = xs_1.return)) _a.call(xs_1);
        }
        finally { if (e_20) throw e_20.error; }
    }
    addIf(xs[xs.length - 2], xs[xs.length - 1], undefined);
    return result;
}
function labelFrom(a, b) {
    if (a.after === undefined && b.before === undefined)
        return '?unlabeled';
    if (a.after === undefined) {
        if (b.before === undefined)
            return '?unlabeled';
        return b.before;
    }
    else {
        if (b.before === undefined)
            return a.after;
        if (b.before !== a.after)
            return "?conflict-" + a.after + "-" + b.before;
        return a.after;
    }
}
// assumes that entries are sorted
function spansFromEntries(entries) {
    var result = applyToTriples(function (a, b, c) {
        if (a != undefined) {
            return {
                start: a,
                end: b,
                label: labelFrom(a, b),
                uid: newUID(),
            };
        }
        else {
            return null;
        }
    }, entries);
    return result;
}
// assumes that entries are sorted
function spansInRange(start, end, entries) {
    var e_21, _a;
    function clip(span) {
        if (span.start.time < start && span.end.time < start) {
            return null;
        }
        else if (span.start.time > end && span.end.time > end) {
            return null;
        }
        else {
            return __assign(__assign({}, span), { start: span.start, end: span.end });
        }
    }
    var result = [];
    try {
        for (var _b = __values(spansFromEntries(entries).map(clip)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var span = _c.value;
            if (span != null)
                result.push(span);
        }
    }
    catch (e_21_1) { e_21 = { error: e_21_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_21) throw e_21.error; }
    }
    return result;
}
function partInDay(start, stop, day) {
    if (stop < day.start)
        return null;
    else if (start > day.end)
        return null;
    return {
        start: last(day.start, start),
        end: first(day.end, stop)
    };
}
function hideCalPopup() {
    $('#minical').empty();
    $('#nextcal').empty();
    $('#priorcal').empty();
    $('#popup').attr('active', 'false');
}
function hideLabelPopup() {
    $('#popup').attr('active', 'false');
}
function saveProfile(profile) {
    localStorage.setItem('profile', serializeProfile(profile));
}
function loadProfile() {
    var s = localStorage.getItem('profile');
    if (s == '' || s == null)
        return emptyProfile();
    return deserializeProfile(s);
}
export function loadLabels() {
    return __awaiter(this, void 0, void 0, function () {
        var credentials, entries;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCredentials()];
                case 1:
                    credentials = _a.sent();
                    return [4 /*yield*/, loadEntries(credentials)];
                case 2:
                    entries = _a.sent();
                    showLabels(entries, credentials);
                    $('#labels').click(hideLabelPopup);
                    return [2 /*return*/];
            }
        });
    });
}
function showLabels(entries, credentials) {
    var e_22, _a;
    var labels = getDistinctLabels(entries);
    var profile = loadProfile();
    labels.sort();
    function callback(update) {
        applyAndSave(entries, update, credentials);
        showLabels(entries, credentials);
    }
    function makeLabelDiv(label) {
        var colorHex = colorToHex(getColor(label, profile));
        var l = $("<span>" + label + "</span>");
        var result = $("<div class='label'></div>");
        result.append(l);
        l.click(function (e) {
            e.stopPropagation();
            labelPopup(label, callback);
        });
        var picker = $("<input type='color' id='" + label + "-color' class='colorpicker' value='" + colorHex + "'></input>");
        result.append(picker);
        picker.change(function () {
            profile.colors.set(label, colorFromHex(picker.val()));
            saveProfile(profile);
        });
        return result;
    }
    var main = $('#labels');
    main.empty();
    try {
        for (var labels_1 = __values(labels), labels_1_1 = labels_1.next(); !labels_1_1.done; labels_1_1 = labels_1.next()) {
            var label = labels_1_1.value;
            main.append(makeLabelDiv(label));
        }
    }
    catch (e_22_1) { e_22 = { error: e_22_1 }; }
    finally {
        try {
            if (labels_1_1 && !labels_1_1.done && (_a = labels_1.return)) _a.call(labels_1);
        }
        finally { if (e_22) throw e_22.error; }
    }
}
export function loadCalendar() {
    return __awaiter(this, void 0, void 0, function () {
        function callback(update) {
            applyAndSave(entries, update, credentials);
        }
        var credentials, entries;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    $('#calendardiv').click(function (e) {
                        hideCalPopup();
                    });
                    return [4 /*yield*/, getCredentials()];
                case 1:
                    credentials = _a.sent();
                    return [4 /*yield*/, loadEntries(credentials)];
                case 2:
                    entries = _a.sent();
                    showCalendar(entries, null, loadProfile(), callback);
                    return [2 /*return*/];
            }
        });
    });
}
function sortAndFilter(entries) {
    var result = entries.filter(function (entry) { return !entry.deleted; });
    result.sort(function (x, y) { return x.time.getTime() - y.time.getTime(); });
    return result;
}
//TODO less sort and filter...
function showCalendar(entries, initialPopup, profile, callback) {
    var e_23, _a, e_24, _b;
    var days = [];
    for (var i = 0; i < 7; i++) {
        var d = daysAgo(6 - i);
        $("#headerrow th:nth-child(" + (i + 2) + ")").text(renderDay(d));
        days.push({ start: startOfDay(d), end: endOfDay(d), index: i });
    }
    //Called from within a popup when an edit occurs
    //(So needs to redraw the popup)
    function popupCallback(bounds) {
        function f(t) {
            callback(t);
            showCalendar(sortAndFilter(entries), bounds, profile, callback);
        }
        return f;
    }
    function popup(startEntry, endEntry) {
        zoomedPopup(sortAndFilter(entries), startEntry, endEntry, profile, popup, popupCallback([startEntry, endEntry]));
    }
    try {
        for (var days_1 = __values(days), days_1_1 = days_1.next(); !days_1_1.done; days_1_1 = days_1.next()) {
            var day = days_1_1.value;
            getCalendarColumn(day.index).empty();
        }
    }
    catch (e_23_1) { e_23 = { error: e_23_1 }; }
    finally {
        try {
            if (days_1_1 && !days_1_1.done && (_a = days_1.return)) _a.call(days_1);
        }
        finally { if (e_23) throw e_23.error; }
    }
    var _loop_4 = function (start, end) {
        var e_25, _a;
        try {
            for (var days_2 = (e_25 = void 0, __values(days)), days_2_1 = days_2.next(); !days_2_1.done; days_2_1 = days_2.next()) {
                var day = days_2_1.value;
                var range = partInDay(start.time, end.time, day);
                if (range !== null) {
                    var e_26 = calendarSpan(labelFrom(start, end), range.start, range.end, day.start, day.end, profile);
                    e_26.click(function (e) {
                        popup(start.id, end.id);
                        e.stopPropagation();
                    });
                    getCalendarColumn(day.index).append(e_26);
                }
            }
        }
        catch (e_25_1) { e_25 = { error: e_25_1 }; }
        finally {
            try {
                if (days_2_1 && !days_2_1.done && (_a = days_2.return)) _a.call(days_2);
            }
            finally { if (e_25) throw e_25.error; }
        }
    };
    try {
        for (var _c = __values(listPairs(it(sortAndFilter(entries)))), _d = _c.next(); !_d.done; _d = _c.next()) {
            var _e = __read(_d.value, 2), start = _e[0], end = _e[1];
            _loop_4(start, end);
        }
    }
    catch (e_24_1) { e_24 = { error: e_24_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
        }
        finally { if (e_24) throw e_24.error; }
    }
    if (initialPopup != null)
        popup(initialPopup[0], initialPopup[1]);
}
function split(name) {
    var n = name.indexOf('/');
    if (n == 0)
        return [name, null];
    else
        return [name.slice(0, n), name.slice(n + 1, 0)];
}
function group(name, view) {
    var _a = __read(split(name), 2), start = _a[0], rest = _a[1];
    var v = view.get(start);
    if (v == undefined)
        return null;
    if (v.expand == undefined || rest == null)
        return start;
    return start + "/" + group(rest, v.expand);
}
function serializeProfile(profile) {
    var e_27, _a;
    var parts = [];
    try {
        for (var _b = __values(profile.colors.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), label = _d[0], color = _d[1];
            parts.push(label + "," + colorToHex(color));
        }
    }
    catch (e_27_1) { e_27 = { error: e_27_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_27) throw e_27.error; }
    }
    return parts.join(';');
}
function deserializeProfile(s) {
    var e_28, _a;
    var result = emptyProfile();
    try {
        for (var _b = __values(s.split(';')), _c = _b.next(); !_c.done; _c = _b.next()) {
            var pair = _c.value;
            var parts = pair.split(',');
            if (parts.length != 2) {
                console.log('Bad part');
            }
            result.colors.set(parts[0], colorFromHex(parts[1]));
        }
    }
    catch (e_28_1) { e_28 = { error: e_28_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_28) throw e_28.error; }
    }
    return result;
}
//Random integetr between 1 and n-1
function randInt(n) {
    return Math.floor(n * Math.random());
}
export function loadColors() {
    var e = $("<input type='color' id='colorpicker'></input>");
    var button = $("<div>Done!</div>");
    $('#main').append(e);
    $('#main').append(button);
    button.click(function () {
        console.log(e.val());
    });
}
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    function round(x) {
        var result = Math.floor(x * 256);
        return (result == 256) ? 255 : result;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    function color(r, g, b) {
        return {
            r: round(r), g: round(g), b: round(b)
        };
    }
    switch (i % 6) {
        case 0: return color(v, t, p);
        case 1: return color(q, v, p);
        case 2: return color(p, v, t);
        case 3: return color(p, q, v);
        case 4: return color(t, p, v);
        case 5: return color(v, p, q);
        default: return assertNever(i % 6);
    }
}
var colors = ['#fc6472', '#f4b2a6', '#eccdb3', '#bcefd0', '#a1e8e4', '#23c8b2', '#c3ecee'];
function randomColor() {
    return HSVtoRGB(Math.random(), 0.5 + 0.3 * Math.random(), 1);
    //return colorFromHex(colors[randInt(colors.length)])
    /*
    return {
        r: randInt(256),
        g: randInt(256),
        b: randInt(256),
    }
    */
}
export function colorToHex(c) {
    return "#" + c.r.toString(16).padStart(2, "0") + c.g.toString(16).padStart(2, "0") + c.b.toString(16).padStart(2, "0");
}
export function colorFromHex(hex) {
    if (hex[0] == '#') {
        hex = hex.slice(1);
    }
    return { r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16) };
}
function getColor(label, profile) {
    var result = profile.colors.get(label);
    if (result == undefined) {
        result = randomColor();
        profile.colors.set(label, result);
        return result;
    }
    return result;
}
function renderColor(color, alpha) {
    if (alpha === void 0) { alpha = 1; }
    return "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + alpha + ")";
}
function renderGradient(color, transparentTop) {
    var angle = (transparentTop) ? '180deg' : '0deg';
    return "linear-gradient(" + angle + ", " + renderColor(color, 0) + " 0%, " + renderColor(color, 1) + " 100%)";
}
/*
//TODO: callback applies the update and then gives the new list of spans
function calendarSpan(
    label:string,
    spanStart:Date,
    spanEnd:Date,
    start:Date,
    end:Date,
    entries:Entry[],
    firstIndex:number,
    callback:(t:TimeUpdate, o:Entry[][]) => Entry[][]
): JQE {
    function frac(d:Date): number {
        return (d.getTime() - start.getTime()) / (end.getTime() - start.getTime())
    }
    const lengthPercent = 100 * (frac(spanEnd) - frac(spanStart))
    const topPercent = 100 * frac(spanStart)
    const color = nameToColor(label)
    const style = `top:${topPercent}%; height:${lengthPercent}%; background:${color};`
    const result = $(`<div class='event' style='${style}'><div class='spantext'>${label}</div></div>`)
    const initialEntries:Entry[] = []
    if (firstIndex > 0) initialEntries.push(entries[firstIndex-1])
    initialEntries.push(entries[firstIndex])
    initialEntries.push(entries[firstIndex+1])
    if (firstIndex+2 < entries.length) initialEntries.push(entries[firstIndex+2])
    result.click(() => { evolvingPopup(initialEntries, callback) })
    return result
}

function evolvingPopup(initialEntries:Entry[], callback:(t:TimeUpdate, o:Entry[][]) => Entry[][]): void {
    function popup(entriesToShow:Entry[]) {
        function popupCallback(t:TimeUpdate): void {
            const newEntries:Entry[][] = callback(t, [entriesToShow])
            popup(newEntries[0])
        }
        multiPopup(entriesToShow, popupCallback)
    }
    popup(initialEntries)
}
*/
function makeInput(initial, callback) {
    var elem = $("<input></input>");
    elem.val(initial);
    elem.keyup(function (e) {
        if (e.keyCode == 13) {
            callback(elem.val());
            elem.blur();
            e.preventDefault();
        }
    });
    return elem;
}
function inputAfterColon(head, initial, callback) {
    var elem = $("<div>" + head + ":</div>");
    elem.append(makeInput(initial, callback));
    return elem;
}
function assertNever(value) {
    throw new Error("Shouldn't reach this case!");
}
function insertAt(toInsert, xs, index) {
    return xs.slice(0, index).concat([toInsert]).concat(xs.slice(index));
}
function neighbors(entries, entry) {
    var e_29, _a;
    var before = null;
    var after = null;
    try {
        for (var entries_2 = __values(entries), entries_2_1 = entries_2.next(); !entries_2_1.done; entries_2_1 = entries_2.next()) {
            var x = entries_2_1.value;
            if (x.time < entry.time) {
                if (before == null || before.time < x.time) {
                    before = x;
                }
            }
            else if (x.time > entry.time) {
                if (after == null || after.time > x.time) {
                    after = x;
                }
            }
        }
    }
    catch (e_29_1) { e_29 = { error: e_29_1 }; }
    finally {
        try {
            if (entries_2_1 && !entries_2_1.done && (_a = entries_2.return)) _a.call(entries_2);
        }
        finally { if (e_29) throw e_29.error; }
    }
    return [before, after];
}
//TODO: want to have a different data structure for tracking entries
function upsertInPlace(entry, entries) {
    for (var i = 0; i < entries.length; i++) {
        if (entries[i].id == entry.id) {
            entries[i] = entry;
            return;
        }
    }
    entries.push(entry);
}
//Mutates entries in place
//Also updates in place
function applyUpdate(update, entries, updates) {
    var e_30, _a, e_31, _b;
    function upsert(entry) {
        var newEntry = __assign(__assign({}, entry), { lastModified: now() });
        upsertInPlace(newEntry, entries);
        upsertInPlace(newEntry, updates);
    }
    switch (update.kind) {
        case 'composite':
            try {
                for (var _c = __values(update.updates), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var u = _d.value;
                    applyUpdate(u, entries, updates);
                }
            }
            catch (e_30_1) { e_30 = { error: e_30_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_30) throw e_30.error; }
            }
            break;
        case 'relabel':
            if (update.before !== undefined)
                upsert(__assign(__assign({}, update.before), { after: update.label }));
            if (update.after !== undefined)
                upsert(__assign(__assign({}, update.after), { before: update.label }));
            break;
        case 'split':
            var newEntry = makeNewEntry(update.time, update.labelBefore || update.before.after || update.after.before, update.labelAfter || update.after.before || update.before.after);
            upsert(newEntry);
            if (update.labelBefore !== undefined) {
                upsert(__assign(__assign({}, update.before), { after: update.labelBefore }));
            }
            if (update.labelAfter !== undefined) {
                upsert(__assign(__assign({}, update.after), { before: update.labelAfter }));
            }
            break;
        case 'merge': {
            var _e = __read(neighbors(entries, update.entry), 2), a = _e[0], b = _e[1];
            if (a != null)
                upsert(__assign(__assign({}, a), { after: update.label }));
            if (b != null)
                upsert(__assign(__assign({}, b), { before: update.label }));
            upsert(__assign(__assign({}, update.entry), { deleted: true }));
            break;
        }
        case 'move':
            upsert(__assign(__assign({}, update.entry), { time: update.time }));
            break;
        case 'append': {
            var newEntry_1 = makeNewEntry(update.time, update.before, update.after);
            upsert(newEntry_1);
            break;
        }
        case 'spliceSplit': {
            var newEntry_2 = makeNewEntry(update.time, update.label, update.before.after);
            upsert(newEntry_2);
            upsert(__assign(__assign({}, update.before), { after: update.label }));
            break;
        }
        case 'bulkRename':
            try {
                for (var entries_3 = __values(entries), entries_3_1 = entries_3.next(); !entries_3_1.done; entries_3_1 = entries_3.next()) {
                    var entry = entries_3_1.value;
                    if (matchesLabelRemap(entry.before, update.from)) {
                        upsert(__assign(__assign({}, entry), { before: remapLabel(entry.before, update.from, update.to) }));
                    }
                    if (matchesLabelRemap(entry.after, update.from)) {
                        upsert(__assign(__assign({}, entry), { after: remapLabel(entry.after, update.from, update.to) }));
                    }
                }
            }
            catch (e_31_1) { e_31 = { error: e_31_1 }; }
            finally {
                try {
                    if (entries_3_1 && !entries_3_1.done && (_b = entries_3.return)) _b.call(entries_3);
                }
                finally { if (e_31) throw e_31.error; }
            }
            break;
        default: assertNever(update);
    }
}
function matchesLabelRemap(label, from) {
    return (label != undefined && label.slice(0, from.length) == from);
}
function remapLabel(label, from, to) {
    if (label === undefined)
        return undefined;
    if (label.slice(0, from.length) === from) {
        return to + label.slice(from.length);
    }
    return label;
}
/*
function applyUpdate(
    update:TimeUpdate,
    entriesList:Entry[][],
): Entry[][] {
    switch (update.kind) {
        case 'relabel':
            return entriesList.map(entries => {
                entries = applyTo(
                    entry => ({...entry, after: update.label}),
                    entries,
                    update.before
                )
                entries = applyTo(
                    entry => ({...entry, before: update.label}),
                    entries,
                    update.after
                )
                return entries
            })
        case 'split':
            const newEntry:Entry = {
                time: update.time,
                before: update.before.after || update.after.before,
                after: update.after.before || update.before.after,
                id: newUID()
            }
            return entriesList.map(entries =>
                insertBetween(newEntry, entries, update.before, update.after)
            )
        case 'merge':
            return entriesList.map(entries => {
                const [a, b] = neighbors(update.entry, entries)
                if (a != null) a.after = update.label
                if (b != null) b.before = update.label
                return remove(update.entry, entries)
            })
        case 'move':
            return entriesList.map(entries => applyTo(
                entry => ({...entry, time: update.time}),
                entries,
                update.entry
            ))
        default: assertNever(update)
    }
}
*/
function listPairsAndEnds(xs) {
    var a, b, xs_2, xs_2_1, x, e_32_1;
    var e_32, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                a = null;
                b = null;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, 7, 8]);
                xs_2 = __values(xs), xs_2_1 = xs_2.next();
                _b.label = 2;
            case 2:
                if (!!xs_2_1.done) return [3 /*break*/, 5];
                x = xs_2_1.value;
                a = b;
                b = x;
                return [4 /*yield*/, [a, b]];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                xs_2_1 = xs_2.next();
                return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 8];
            case 6:
                e_32_1 = _b.sent();
                e_32 = { error: e_32_1 };
                return [3 /*break*/, 8];
            case 7:
                try {
                    if (xs_2_1 && !xs_2_1.done && (_a = xs_2.return)) _a.call(xs_2);
                }
                finally { if (e_32) throw e_32.error; }
                return [7 /*endfinally*/];
            case 8:
                if (!(b != null)) return [3 /*break*/, 10];
                return [4 /*yield*/, [b, null]];
            case 9:
                _b.sent();
                _b.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}
function listPairs(xs) {
    var _a, _b, _c, x, y, e_33_1;
    var e_33, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 5, 6, 7]);
                _a = __values(listPairsAndEnds(xs)), _b = _a.next();
                _e.label = 1;
            case 1:
                if (!!_b.done) return [3 /*break*/, 4];
                _c = __read(_b.value, 2), x = _c[0], y = _c[1];
                if (!(x != null && y != null)) return [3 /*break*/, 3];
                return [4 /*yield*/, [x, y]];
            case 2:
                _e.sent();
                _e.label = 3;
            case 3:
                _b = _a.next();
                return [3 /*break*/, 1];
            case 4: return [3 /*break*/, 7];
            case 5:
                e_33_1 = _e.sent();
                e_33 = { error: e_33_1 };
                return [3 /*break*/, 7];
            case 6:
                try {
                    if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                }
                finally { if (e_33) throw e_33.error; }
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}
function enumerate(xs) {
    var i, xs_3, xs_3_1, x, e_34_1;
    var e_34, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                i = 0;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, 7, 8]);
                xs_3 = __values(xs), xs_3_1 = xs_3.next();
                _b.label = 2;
            case 2:
                if (!!xs_3_1.done) return [3 /*break*/, 5];
                x = xs_3_1.value;
                return [4 /*yield*/, [i, x]];
            case 3:
                _b.sent();
                i += 1;
                _b.label = 4;
            case 4:
                xs_3_1 = xs_3.next();
                return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 8];
            case 6:
                e_34_1 = _b.sent();
                e_34 = { error: e_34_1 };
                return [3 /*break*/, 8];
            case 7:
                try {
                    if (xs_3_1 && !xs_3_1.done && (_a = xs_3.return)) _a.call(xs_3);
                }
                finally { if (e_34) throw e_34.error; }
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}
function it(xs) {
    var i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < xs.length)) return [3 /*break*/, 4];
                return [4 /*yield*/, xs[i]];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}
function revit(xs) {
    var i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = xs.length - 1;
                _a.label = 1;
            case 1:
                if (!(i >= 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, xs[i]];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                i--;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}
//Returns the same set of elements, but with booleans flagging first and last
function markTails(xs) {
    var first, next, start, xs_4, xs_4_1, x, e_35_1;
    var e_35, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                first = true;
                start = xs.next();
                if (start.done) {
                    return [2 /*return*/];
                }
                else {
                    next = start.value;
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, 7, 8]);
                xs_4 = __values(xs), xs_4_1 = xs_4.next();
                _b.label = 2;
            case 2:
                if (!!xs_4_1.done) return [3 /*break*/, 5];
                x = xs_4_1.value;
                return [4 /*yield*/, [first, false, next]];
            case 3:
                _b.sent();
                next = x;
                first = false;
                _b.label = 4;
            case 4:
                xs_4_1 = xs_4.next();
                return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 8];
            case 6:
                e_35_1 = _b.sent();
                e_35 = { error: e_35_1 };
                return [3 /*break*/, 8];
            case 7:
                try {
                    if (xs_4_1 && !xs_4_1.done && (_a = xs_4.return)) _a.call(xs_4);
                }
                finally { if (e_35) throw e_35.error; }
                return [7 /*endfinally*/];
            case 8: return [4 /*yield*/, [first, true, next]];
            case 9:
                _b.sent();
                return [2 /*return*/];
        }
    });
}
function getCalendarColumn(n) {
    return $("td:nth-child(" + (n + 2) + ")");
}
function makeCredentials(username, password) {
    return { username: username, hashedPassword: hashPassword(username, password) };
}
function loginLocal(credentials) {
    localStorage.setItem('username', credentials.username);
    localStorage.setItem('hashedPassword', credentials.hashedPassword);
}
export function getLocalCredentials() {
    var username = localStorage.username;
    var hashedPassword = localStorage.hashedPassword;
    if (username !== undefined && hashedPassword !== undefined) {
        return {
            username: username,
            hashedPassword: hashedPassword
        };
    }
    else {
        return null;
    }
}
function loginRemote(credentials) {
    return new Promise(function (resolve) {
        $.post("login?" + credentialParams(credentials), function (data) {
            if (data != 'ok') {
                resolve(false);
            }
            else {
                resolve(true);
            }
        });
    });
}
function signupRemote(credentials) {
    return new Promise(function (resolve) {
        if (credentials.username == '') {
            alert('Enter a username and password and click signup');
        }
        else {
            $.post("signup?" + credentialParams(credentials), function (data) {
                if (data != 'ok') {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });
        }
    });
}
function getCredentials() {
    return __awaiter(this, void 0, void 0, function () {
        var cred;
        return __generator(this, function (_a) {
            cred = getLocalCredentials();
            if (cred !== null)
                return [2 /*return*/, cred];
            return [2 /*return*/, displayLogin()];
        });
    });
}
function displayLogin() {
    return __awaiter(this, void 0, void 0, function () {
        //TODO: alert when credentials are no good
        function credentialsFromForm() {
            return makeCredentials($('#name').val(), $('#password').val());
        }
        function exit() {
            $('#loginDialog').html('');
            $('#loginDialog').attr('active', 'false');
        }
        function login(resolve) {
            return __awaiter(this, void 0, void 0, function () {
                var credentials, success;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            credentials = credentialsFromForm();
                            if (!(credentials !== null)) return [3 /*break*/, 2];
                            return [4 /*yield*/, loginRemote(credentials)];
                        case 1:
                            success = _a.sent();
                            if (success) {
                                loginLocal(credentials);
                                exit();
                                resolve(credentials);
                            }
                            else {
                                alert('No existing user found with that name+password');
                            }
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        }
        function signup(resolve) {
            return __awaiter(this, void 0, void 0, function () {
                var credentials, success;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            credentials = credentialsFromForm();
                            if (!(credentials !== null)) return [3 /*break*/, 2];
                            return [4 /*yield*/, signupRemote(credentials)
                                //TODO actually do things the right way with errors etc.
                            ];
                        case 1:
                            success = _a.sent();
                            //TODO actually do things the right way with errors etc.
                            if (success) {
                                loginLocal(credentials);
                                exit();
                                resolve(credentials);
                            }
                            else {
                                alert('Error signing up (probably someone else has that username)');
                            }
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        }
        return __generator(this, function (_a) {
            $('#loginDialog').html("<label for=\"name\">Name:</label>" +
                "<input type='text' id=\"name\"></textarea>" +
                "<div>" +
                "<label for=\"password\">Password:</label>" +
                "<input type='password' id=\"password\"></textarea>" +
                "</div>" +
                "<div>" +
                "<span class=\"option\" choosable id=\"signup\">Sign up</span>" +
                "<span class=\"option\" choosable id=\"login\">Log in</span>" +
                "</div>");
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    $('#loginDialog').attr('active', 'true');
                    $('.option[id="login"]').click(function () { return login(resolve); });
                    $('.option[id="signup"]').click(function () { return signup(resolve); });
                })];
        });
    });
}
function credentialParams(credentials) {
    return "username=" + credentials.username + "&hashedPassword=" + credentials.hashedPassword;
}
export function hashPassword(username, password) {
    return hash(password).toString(16);
}
// Source: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
// (definitely not a PRF)
function hash(s) {
    var hash = 0;
    for (var i = 0; i < s.length; i++) {
        hash = ((hash << 5) - hash) + s.charCodeAt(i);
    }
    return hash;
}
//Gives the merged list of updates, as well as updates that you'd have to apply to either side
//to bring it up to merged
export function mergeAndUpdate(xs, ys) {
    var e_36, _a, e_37, _b;
    function makeMap(entries) {
        var e_38, _a;
        var result = new Map();
        try {
            for (var entries_4 = __values(entries), entries_4_1 = entries_4.next(); !entries_4_1.done; entries_4_1 = entries_4.next()) {
                var entry = entries_4_1.value;
                result.set(entry.id, entry);
            }
        }
        catch (e_38_1) { e_38 = { error: e_38_1 }; }
        finally {
            try {
                if (entries_4_1 && !entries_4_1.done && (_a = entries_4.return)) _a.call(entries_4);
            }
            finally { if (e_38) throw e_38.error; }
        }
        return result;
    }
    var xMap = makeMap(xs);
    var yMap = makeMap(ys);
    var merged = [];
    var xUpdates = [];
    var yUpdates = [];
    try {
        for (var xs_5 = __values(xs), xs_5_1 = xs_5.next(); !xs_5_1.done; xs_5_1 = xs_5.next()) {
            var entry = xs_5_1.value;
            var other = yMap.get(entry.id);
            if (other == undefined || other.lastModified.getTime() < entry.lastModified.getTime()) {
                yUpdates.push(entry);
                merged.push(entry);
            }
            if (other !== undefined && other.lastModified.getTime() == entry.lastModified.getTime()) {
                merged.push(entry);
            }
        }
    }
    catch (e_36_1) { e_36 = { error: e_36_1 }; }
    finally {
        try {
            if (xs_5_1 && !xs_5_1.done && (_a = xs_5.return)) _a.call(xs_5);
        }
        finally { if (e_36) throw e_36.error; }
    }
    try {
        for (var ys_1 = __values(ys), ys_1_1 = ys_1.next(); !ys_1_1.done; ys_1_1 = ys_1.next()) {
            var entry = ys_1_1.value;
            var other = xMap.get(entry.id);
            if (other == undefined || other.lastModified.getTime() < entry.lastModified.getTime()) {
                xUpdates.push(entry);
                merged.push(entry);
            }
        }
    }
    catch (e_37_1) { e_37 = { error: e_37_1 }; }
    finally {
        try {
            if (ys_1_1 && !ys_1_1.done && (_b = ys_1.return)) _b.call(ys_1);
        }
        finally { if (e_37) throw e_37.error; }
    }
    return { merged: merged, xUpdates: xUpdates, yUpdates: yUpdates };
}
function sendUpdates(updates, credentials) {
    var s = serializeEntries(updates);
    $.post("update?" + credentialParams(credentials), "entries=" + s);
}
function getRemoteEntries(credentials) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    $.get("entries?" + credentialParams(credentials), function (s) { return resolve(deserializeEntries(s)); });
                })];
        });
    });
}
//Splits on the first slash
//Second part is empty if no slash
//If first symbol is '?', whole thing is prefix
function prefixAndRemainder(s) {
    var n = s.indexOf('/');
    if (n < 0 || s[0] == '?')
        return [s, ''];
    return [s.slice(0, n), s.slice(n + 1)];
}
function addToReport(label, t, r) {
    if (label.length == 0)
        return;
    var _a = __read(prefixAndRemainder(label), 2), a = _a[0], b = _a[1];
    var sub = r[a];
    if (sub == undefined) {
        var newSub = {};
        addToReport(b, t, newSub);
        r[a] = [t, newSub];
    }
    else {
        sub[0] += t;
        addToReport(b, t, sub[1]);
    }
}
function matchLabel(category, label) {
    var n = category.length;
    if (n == 0)
        return label;
    else if (label == category)
        return 'uncategorized';
    else if (label.slice(0, n + 1) == category + '/')
        return label.slice(n + 1);
    else
        return null;
}
function makeReport(entries, start, end, topLabel) {
    var e_39, _a;
    entries = sortAndFilter(entries);
    var result = {};
    try {
        for (var _b = __values(listPairs(it(entries))), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), e0 = _d[0], e1 = _d[1];
            if (e1.time > start && e0.time < end) {
                var t0 = last(e0.time, start);
                var t1 = first(e1.time, end);
                var label = labelFrom(e0, e1);
                var subLabel = matchLabel(topLabel, label);
                if (t0 != t1 && subLabel != null)
                    addToReport(subLabel, t1.getTime() - t0.getTime(), result);
            }
        }
    }
    catch (e_39_1) { e_39 = { error: e_39_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_39) throw e_39.error; }
    }
    return result;
}
function reportToString(report) {
    var e_40, _a;
    var parts = [];
    try {
        for (var _b = __values(Object.entries(report)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), label = _d[0], _e = __read(_d[1], 2), time = _e[0], sub = _e[1];
            parts.push(label + ":" + time + ":" + reportToString(sub));
        }
    }
    catch (e_40_1) { e_40 = { error: e_40_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_40) throw e_40.error; }
    }
    return "{" + parts.join(',') + "}";
}
/*
function renderReport(report:Report, prefix:string = '', indentation:number=0): JQE {
    const result = $('<ul></ul>')
    for (const [label, [time, sub]] of Object.entries(report)) {
        const e = $(`<li>[${renderDuration(time)}] ${label}</li>`)
        e.append(renderReport(sub, `${prefix}${label}/`, indentation+1))
        result.append(e)
    }
    return result
}
*/
function len(x) {
    return Object.keys(x).length;
}
// Compress paths (with no branches) into single steps
export function flattenReport(report) {
    var e_41, _a;
    var entries = Object.entries(report);
    var result = {};
    try {
        for (var entries_5 = __values(entries), entries_5_1 = entries_5.next(); !entries_5_1.done; entries_5_1 = entries_5.next()) {
            var _b = __read(entries_5_1.value, 2), label = _b[0], _c = __read(_b[1], 2), time = _c[0], sub = _c[1];
            var flatSub = flattenReport(sub);
            var subEntries = Object.entries(flatSub);
            if (subEntries.length == 1) {
                result[label + "/" + subEntries[0][0]] = subEntries[0][1];
            }
            else {
                result[label] = [time, flatSub];
            }
        }
    }
    catch (e_41_1) { e_41 = { error: e_41_1 }; }
    finally {
        try {
            if (entries_5_1 && !entries_5_1.done && (_a = entries_5.return)) _a.call(entries_5);
        }
        finally { if (e_41) throw e_41.error; }
    }
    return result;
}
function totalReportTime(report) {
    var e_42, _a;
    var result = 0;
    try {
        for (var _b = __values(Object.entries(report)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), label = _d[0], _e = __read(_d[1], 2), time = _e[0], sub = _e[1];
            result += time;
        }
    }
    catch (e_42_1) { e_42 = { error: e_42_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_42) throw e_42.error; }
    }
    return result;
}
function renderPercentage(x) {
    return Math.round(x * 100) + "%";
}
function renderReportLine(label, time, fraction, hasChildren) {
    var childString = (hasChildren) ? ' (+)' : '';
    var childClass = (hasChildren) ? ' clickable' : '';
    return $("<div class='ReportLine" + childClass + "'>[" + renderDuration(time) + "] " + label + childString + "</div>");
    //return $(`<div class="reportLine"><span>${label}</span><span>${renderDuration(time)}</span><span>${renderPercentage(fraction)}</span></div>`)
}
function renderReport(report, prefix, indentation, total) {
    var e_43, _a, e_44, _b;
    if (prefix === void 0) { prefix = ''; }
    if (indentation === void 0) { indentation = 0; }
    if (total === void 0) { total = null; }
    var totalNotNull = (total === null) ? totalReportTime(report) : total;
    var result = $('<div class="indent"></div>');
    function renderLineAndChildren(label, time, sub) {
        var hasChildren = Object.keys(sub).length > 0;
        var head = renderReportLine(label, time, time / totalNotNull, hasChildren);
        var result = [head];
        if (hasChildren) {
            var child_1 = renderReport(sub, "" + prefix + label + "/", indentation + 1);
            var visible_1 = false;
            head.click(function () {
                console.log(visible_1);
                if (visible_1) {
                    visible_1 = false;
                    child_1.hide();
                }
                else {
                    visible_1 = true;
                    child_1.show();
                }
            });
            child_1.hide();
            result.push(child_1);
        }
        return result;
    }
    var entries = Object.entries(report);
    entries.sort(function (x, y) { return y[1][0] - x[1][0]; });
    try {
        for (var entries_6 = __values(entries), entries_6_1 = entries_6.next(); !entries_6_1.done; entries_6_1 = entries_6.next()) {
            var _c = __read(entries_6_1.value, 2), label = _c[0], _d = __read(_c[1], 2), time = _d[0], sub = _d[1];
            try {
                for (var _e = (e_44 = void 0, __values(renderLineAndChildren(label, time, sub))), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var e_45 = _f.value;
                    result.append(e_45);
                }
            }
            catch (e_44_1) { e_44 = { error: e_44_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_44) throw e_44.error; }
            }
        }
    }
    catch (e_43_1) { e_43 = { error: e_43_1 }; }
    finally {
        try {
            if (entries_6_1 && !entries_6_1.done && (_a = entries_6.return)) _a.call(entries_6);
        }
        finally { if (e_43) throw e_43.error; }
    }
    return result;
}
export function loadReport() {
    return __awaiter(this, void 0, void 0, function () {
        function paramsFromInput() {
            return {
                start: $('#startDate').val(),
                end: $('#endDate').val(),
                label: $('#topLabel').val(),
            };
        }
        function paramsFromURL(url) {
            var params = new URLSearchParams(url.split('?')[1]);
            return {
                start: params.get('start') || undefined,
                end: params.get('end') || undefined,
                label: params.get('label') || undefined,
            };
        }
        function renderParams(params) {
            var parts = [];
            if (params.start !== undefined)
                parts.push("start=" + params.start);
            if (params.end !== undefined)
                parts.push("end=" + params.end);
            if (params.label !== undefined)
                parts.push("label=" + params.label);
            return parts.join('&');
        }
        function kd(e) {
            if (e.keyCode == 13) {
                e.preventDefault();
                render(paramsFromInput());
            }
        }
        function render(params) {
            var startParse = parseString(dateRule, params.start || 'start today');
            var endParse = parseString(dateRule, params.end || 'now');
            var label = params.label || '';
            if (startParse == 'fail' || startParse == 'prefix')
                return;
            if (endParse == 'fail' || endParse == 'prefix')
                return;
            var startDate = startParse[0];
            var endDate = endParse[0];
            window.history.pushState(null, "", "report.html?" + renderParams(params));
            $('#startDate').val(params.start || '');
            $('#endDate').val(params.end || '');
            $('#topLabel').val(params.label || '');
            var report = makeReport(entries, specToDate(startDate, now(), 'closest'), specToDate(endDate, now(), 'closest'), label);
            $('#reportContainer').empty();
            //debugger;
            $('#reportContainer').append(renderReport(flattenReport(report)));
        }
        var credentials, entries, profile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCredentials()];
                case 1:
                    credentials = _a.sent();
                    return [4 /*yield*/, loadEntries(credentials)];
                case 2:
                    entries = _a.sent();
                    profile = loadProfile();
                    $('.reportParamInput').keydown(kd);
                    window.addEventListener('popstate', function (event) {
                        render(paramsFromURL(window.location.href));
                    });
                    $('#generate').click(function () { return render(paramsFromInput()); });
                    $('#startDate').val('start today');
                    $('#endDate').val('now');
                    render(paramsFromURL(window.location.href));
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=track.js.map