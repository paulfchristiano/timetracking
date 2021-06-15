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
import { dateRule, parseString, actionRule, emptyRule } from './parse.js';
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
function labelPopup(label, callback, entries) {
    function dismiss() {
        $('#renamePopup').attr('active', 'false');
    }
    $('#renamePopup').attr('active', 'true');
    $('#popuplabel').text(label);
    $('#newlabel').empty();
    $('#newlabel').html('Rename to: ');
    var e = div('inputwrapper');
    $('#newlabel').append(e);
    var input = new InputBox(emptyRule, null, getDistinctLabels(entries), $(e));
    input.inputElement.setAttribute('class', 'wide');
    input.bind(function (a, s) {
        callback({ kind: 'bulkRename', from: label, to: s, moveChildren: $('#movechildren').prop('checked') });
        dismiss();
    });
    input.focus();
    $('#doneButton').unbind('click');
    $('#doneButton').bind('click', dismiss);
    $('#renamePopup').unbind('keydown');
    $('#renamePopup').keydown(function (e) {
        if (e.keyCode == 27)
            dismiss();
    });
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
    var input = new InputBox(actionRule, { kind: 'raw' }, getDistinctLabels(entries), $('.inputwrapper'));
    input.bind(function (a, s) {
        switch (a.kind) {
            case 'raw':
                callback({ kind: 'relabel', label: s, before: entries[endIndex - 1], after: entries[endIndex] });
                break;
            case 'default':
                callback({
                    kind: 'split',
                    before: entries[endIndex - 1],
                    after: entries[endIndex],
                    time: minutesAfter(entries[endIndex - 1].time, a.minutes),
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
            case 'except':
                callback({
                    kind: 'split',
                    before: entries[startIndex],
                    after: entries[startIndex + 1],
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
                    time: specToDate(a.time, entries[startIndex + 1].time, 'previous'),
                    labelAfter: s
                });
                break;
            case 'now':
                break;
            case 'continue':
                callback({ kind: 'delete', entry: entries[startIndex], shiftForward: entries[startIndex + 1] });
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
    var copiedAnchor = new Date(anchor);
    copiedAnchor.setMinutes(spec.minutes);
    var best = new Date(anchor);
    var bestDiff = null;
    var month = (spec.month === undefined) ? anchor.getMonth() : spec.month;
    copiedAnchor.setMonth(month);
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
                    var candidate = new Date(copiedAnchor);
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
function div(cls) {
    var result = document.createElement('div');
    result.setAttribute('class', cls);
    return result;
}
export function loadTracker() {
    return __awaiter(this, void 0, void 0, function () {
        function callback(update) {
            applyAndSave(entries, update, credentials);
            render();
        }
        function startInput(elem, startIndex, entries) {
            $('.inputwrapper').empty();
            var x = new InputBox(actionRule, { kind: 'raw' }, getDistinctLabels(entries), $(elem));
            var start = entries[startIndex];
            var end = (startIndex < entries.length - 1) ? entries[startIndex + 1] : null;
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
                        case 'except':
                            callback({ kind: 'append', before: (s.length == 0) ? undefined : s, time: minutesAfter(new Date(), -a.minutes) });
                            break;
                        case 'default':
                            callback({ kind: 'append', before: s, time: minutesAfter(start.time, a.minutes) });
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
                        case 'continue':
                            callback({ kind: 'delete', entry: start, reflectBack: (startIndex > 0) ? entries[startIndex - 1] : undefined });
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
                        case 'default':
                            callback({ kind: 'split', labelBefore: s, before: start, after: end, time: minutesAfter(start.time, a.minutes) });
                            break;
                        case 'last':
                            callback({ kind: 'split', labelAfter: s, before: start, after: end, time: minutesAfter(end.time, -a.minutes) });
                            break;
                        case 'except':
                            callback({ kind: 'split', labelBefore: s, before: start, after: end, time: minutesAfter(end.time, -a.minutes) });
                            break;
                        case 'until':
                            callback({ kind: 'spliceSplit', label: s, before: start, time: specToDate(a.time, start.time, 'next') });
                            break;
                        case 'after':
                            callback({ kind: 'split', labelAfter: s, before: start, after: end, time: specToDate(a.time, end.time, 'previous') });
                            break;
                        case 'continue':
                            callback({ kind: 'delete', entry: start, shiftForward: end });
                            break;
                        default: assertNever(a);
                    }
                });
            }
            return x;
        }
        function setTimer(start, elem) {
            var diff = new Date().getTime() - start.getTime();
            if (diff > 1000)
                elem.textContent = renderDuration(new Date().getTime() - start.getTime());
        }
        function render() {
            var e_6, _a;
            heartbeats = [];
            var toStart = [];
            var elem = document.getElementById('inputs');
            var elements = [];
            if (elem != null)
                elem.innerHTML = '';
            var sortedEntries = sortAndFilter(entries);
            var _loop_2 = function (i) {
                var end = (i == sortedEntries.length - 1) ? null : sortedEntries[i + 1];
                var start = sortedEntries[i];
                if (end == null) {
                    var row = div('trackertimerow');
                    row.appendChild(div('nowdot'));
                    row.appendChild(div('timelabel'));
                    elements.push(row);
                }
                else {
                    var row = div('trackertimerow');
                    row.appendChild(div('dot'));
                    var time_1 = div('timelabel');
                    time_1.textContent = renderTime(end.time);
                    time_1.setAttribute('contenteditable', 'true');
                    time_1.addEventListener('blur', function () {
                        time_1.textContent = renderTime(end.time);
                    });
                    time_1.addEventListener('keydown', function (e) {
                        if (e.keyCode == 13) {
                            e.preventDefault();
                            var date = parseTime(time_1.textContent || '', end.time, 'closest');
                            if (date != 'error') {
                                callback({ kind: 'move', entry: end, time: date });
                            }
                        }
                    });
                    row.appendChild(time_1);
                    elements.push(row);
                }
                if (start != null) {
                    var label = (end == null) ? start.after || 'TBD' : labelFrom(start, end);
                    var color = (end == null) ? 'gray' : renderColor(getColor(label, profile));
                    var row = div('trackerrow');
                    var text = div('trackerlabel');
                    var labelDiv = div('labeldiv');
                    labelDiv.append.apply(labelDiv, __spread(renderLabel(label)));
                    var durationDiv = div('durationdiv');
                    if (end == null) {
                        setTimer(start.time, durationDiv);
                        heartbeats.push([start.time, durationDiv]);
                    }
                    else {
                        durationDiv.textContent = renderDuration(end.time.getTime() - start.time.getTime());
                    }
                    text.append(labelDiv, durationDiv);
                    var line = div('line');
                    line.style.backgroundColor = color;
                    line.style.float = 'left';
                    row.append(line, text);
                    var inputBuffer = div('inputbuffer');
                    var inputWrapper_1 = div('inputwrapper');
                    inputBuffer.appendChild(inputWrapper_1);
                    row.append(inputBuffer);
                    text.addEventListener('click', function () {
                        startInput(inputWrapper_1, i, sortedEntries).focus();
                        focused = end;
                    });
                    elements.push(row);
                    if (focused == end) {
                        var inputBox_1 = startInput(inputWrapper_1, i, sortedEntries);
                        toStart.push(function () { return inputBox_1.focus(); });
                    }
                }
            };
            for (var i = sortedEntries.length - 1; i >= 0 && i >= sortedEntries.length - entriesToShow; i--) {
                _loop_2(i);
            }
            if (elem != null)
                elem.append.apply(elem, __spread(elements));
            try {
                for (var toStart_1 = __values(toStart), toStart_1_1 = toStart_1.next(); !toStart_1_1.done; toStart_1_1 = toStart_1.next()) {
                    var f = toStart_1_1.value;
                    f();
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (toStart_1_1 && !toStart_1_1.done && (_a = toStart_1.return)) _a.call(toStart_1);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
        var credentials, profile, entries, focused, entriesToShow, heartbeats;
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
                    focused = null;
                    entriesToShow = maxEntriesToShow();
                    heartbeats = [];
                    setInterval(function () {
                        var e_7, _a;
                        try {
                            for (var heartbeats_1 = __values(heartbeats), heartbeats_1_1 = heartbeats_1.next(); !heartbeats_1_1.done; heartbeats_1_1 = heartbeats_1.next()) {
                                var _b = __read(heartbeats_1_1.value, 2), start = _b[0], elem = _b[1];
                                setTimer(start, elem);
                            }
                        }
                        catch (e_7_1) { e_7 = { error: e_7_1 }; }
                        finally {
                            try {
                                if (heartbeats_1_1 && !heartbeats_1_1.done && (_a = heartbeats_1.return)) _a.call(heartbeats_1);
                            }
                            finally { if (e_7) throw e_7.error; }
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
    var e_8, _a;
    var timings = getTotalTime(entries, entries[0].time, entries[entries.length - 1].time);
    var datapoints = [];
    try {
        for (var timings_1 = __values(timings), timings_1_1 = timings_1.next(); !timings_1_1.done; timings_1_1 = timings_1.next()) {
            var _b = __read(timings_1_1.value, 2), k = _b[0], v = _b[1];
            datapoints.push({ label: k, y: v / 3600, color: renderColor(getColor(k, profile)) });
        }
    }
    catch (e_8_1) { e_8 = { error: e_8_1 }; }
    finally {
        try {
            if (timings_1_1 && !timings_1_1.done && (_a = timings_1.return)) _a.call(timings_1);
        }
        finally { if (e_8) throw e_8.error; }
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
    var e_9, _a, e_10, _b, e_11, _c, e_12, _d;
    var seconds = [];
    try {
        for (var buckets_1 = __values(buckets), buckets_1_1 = buckets_1.next(); !buckets_1_1.done; buckets_1_1 = buckets_1.next()) {
            var bucket = buckets_1_1.value;
            var spans = spansInRange(bucket.start, bucket.end, entries);
            seconds.push(sumByName(spans.map(function (span) { return [span.label, length(span)]; })));
        }
    }
    catch (e_9_1) { e_9 = { error: e_9_1 }; }
    finally {
        try {
            if (buckets_1_1 && !buckets_1_1.done && (_a = buckets_1.return)) _a.call(buckets_1);
        }
        finally { if (e_9) throw e_9.error; }
    }
    var keys = new Set();
    try {
        for (var seconds_1 = __values(seconds), seconds_1_1 = seconds_1.next(); !seconds_1_1.done; seconds_1_1 = seconds_1.next()) {
            var m = seconds_1_1.value;
            try {
                for (var m_1 = (e_11 = void 0, __values(m)), m_1_1 = m_1.next(); !m_1_1.done; m_1_1 = m_1.next()) {
                    var k = m_1_1.value;
                    keys.add(k[0]);
                }
            }
            catch (e_11_1) { e_11 = { error: e_11_1 }; }
            finally {
                try {
                    if (m_1_1 && !m_1_1.done && (_c = m_1.return)) _c.call(m_1);
                }
                finally { if (e_11) throw e_11.error; }
            }
        }
    }
    catch (e_10_1) { e_10 = { error: e_10_1 }; }
    finally {
        try {
            if (seconds_1_1 && !seconds_1_1.done && (_b = seconds_1.return)) _b.call(seconds_1);
        }
        finally { if (e_10) throw e_10.error; }
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
    catch (e_12_1) { e_12 = { error: e_12_1 }; }
    finally {
        try {
            if (keys_1_1 && !keys_1_1.done && (_d = keys_1.return)) _d.call(keys_1);
        }
        finally { if (e_12) throw e_12.error; }
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
    var e_13, _a;
    var result = new Map();
    var spans = spansInRange(start, end, entries);
    try {
        for (var spans_1 = __values(spans), spans_1_1 = spans_1.next(); !spans_1_1.done; spans_1_1 = spans_1.next()) {
            var span = spans_1_1.value;
            var seconds = (span.start.time.getTime() - span.end.time.getTime()) / 1000;
            incrementMap(result, span.label, seconds);
        }
    }
    catch (e_13_1) { e_13 = { error: e_13_1 }; }
    finally {
        try {
            if (spans_1_1 && !spans_1_1.done && (_a = spans_1.return)) _a.call(spans_1);
        }
        finally { if (e_13) throw e_13.error; }
    }
    return result;
}
function sumByName(data) {
    var e_14, _a;
    var result = new Map();
    try {
        for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
            var datum = data_1_1.value;
            incrementMap(result, datum[0], datum[1]);
        }
    }
    catch (e_14_1) { e_14 = { error: e_14_1 }; }
    finally {
        try {
            if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
        }
        finally { if (e_14) throw e_14.error; }
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
function spanText(cls, text) {
    var result = document.createElement('span');
    result.setAttribute('class', cls);
    result.textContent = text;
    return result;
}
function renderLabel(label) {
    if (label.length > 0 && label[0] == '?') {
        return [spanText('errorlabel', label)];
    }
    var parts = label.split('/');
    if (parts.length == 1)
        return [label];
    var prefix = parts.slice(0, parts.length - 1).join('/');
    var suffix = parts[parts.length - 1];
    return [suffix + " ", spanText('categorylabel', "(" + prefix + ")")];
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
//returns labels starting from the most recent
function getDistinctLabels(entries) {
    var e_15, _a, e_16, _b, e_17, _c;
    var seen = new Set();
    var result = [];
    function add(s) {
        if (!seen.has(s)) {
            result.push(s);
            seen.add(s);
        }
    }
    try {
        for (var _d = __values(revit(entries)), _e = _d.next(); !_e.done; _e = _d.next()) {
            var entry = _e.value;
            try {
                for (var _f = (e_16 = void 0, __values(namesFrom(entry.before))), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var name_1 = _g.value;
                    add(name_1);
                }
            }
            catch (e_16_1) { e_16 = { error: e_16_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                }
                finally { if (e_16) throw e_16.error; }
            }
            try {
                for (var _h = (e_17 = void 0, __values(namesFrom(entry.after))), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var name_2 = _j.value;
                    add(name_2);
                }
            }
            catch (e_17_1) { e_17 = { error: e_17_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
                }
                finally { if (e_17) throw e_17.error; }
            }
        }
    }
    catch (e_15_1) { e_15 = { error: e_15_1 }; }
    finally {
        try {
            if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
        }
        finally { if (e_15) throw e_15.error; }
    }
    return result;
}
function uniques(xs) {
    return __spread(new Set(xs));
}
function now() {
    return new Date();
}
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function renderMonth(d) {
    return months[d.getMonth()];
}
function convertDate(d) {
    return {
        year: d.getFullYear(),
        //month: d.toLocaleString('default', {month: 'short'}),
        month: renderMonth(d),
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
    var e_18, _a;
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
    catch (e_18_1) { e_18 = { error: e_18_1 }; }
    finally {
        try {
            if (xs_1_1 && !xs_1_1.done && (_a = xs_1.return)) _a.call(xs_1);
        }
        finally { if (e_18) throw e_18.error; }
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
    var e_19, _a;
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
    catch (e_19_1) { e_19 = { error: e_19_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_19) throw e_19.error; }
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
    var e_20, _a;
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
            labelPopup(label, callback, entries);
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
    catch (e_20_1) { e_20 = { error: e_20_1 }; }
    finally {
        try {
            if (labels_1_1 && !labels_1_1.done && (_a = labels_1.return)) _a.call(labels_1);
        }
        finally { if (e_20) throw e_20.error; }
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
    var e_21, _a, e_22, _b;
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
    catch (e_21_1) { e_21 = { error: e_21_1 }; }
    finally {
        try {
            if (days_1_1 && !days_1_1.done && (_a = days_1.return)) _a.call(days_1);
        }
        finally { if (e_21) throw e_21.error; }
    }
    var _loop_4 = function (start, end) {
        var e_23, _a;
        try {
            for (var days_2 = (e_23 = void 0, __values(days)), days_2_1 = days_2.next(); !days_2_1.done; days_2_1 = days_2.next()) {
                var day = days_2_1.value;
                var range = partInDay(start.time, end.time, day);
                if (range !== null) {
                    var e_24 = calendarSpan(labelFrom(start, end), range.start, range.end, day.start, day.end, profile);
                    e_24.click(function (e) {
                        popup(start.id, end.id);
                        e.stopPropagation();
                    });
                    getCalendarColumn(day.index).append(e_24);
                }
            }
        }
        catch (e_23_1) { e_23 = { error: e_23_1 }; }
        finally {
            try {
                if (days_2_1 && !days_2_1.done && (_a = days_2.return)) _a.call(days_2);
            }
            finally { if (e_23) throw e_23.error; }
        }
    };
    try {
        for (var _c = __values(listPairs(it(sortAndFilter(entries)))), _d = _c.next(); !_d.done; _d = _c.next()) {
            var _e = __read(_d.value, 2), start = _e[0], end = _e[1];
            _loop_4(start, end);
        }
    }
    catch (e_22_1) { e_22 = { error: e_22_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
        }
        finally { if (e_22) throw e_22.error; }
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
    var e_25, _a;
    var parts = [];
    try {
        for (var _b = __values(profile.colors.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), label = _d[0], color = _d[1];
            parts.push(label + "," + colorToHex(color));
        }
    }
    catch (e_25_1) { e_25 = { error: e_25_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_25) throw e_25.error; }
    }
    return parts.join(';');
}
function deserializeProfile(s) {
    var e_26, _a;
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
    catch (e_26_1) { e_26 = { error: e_26_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_26) throw e_26.error; }
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
    var e_27, _a;
    var before = null;
    var after = null;
    try {
        for (var entries_1 = __values(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
            var x = entries_1_1.value;
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
    catch (e_27_1) { e_27 = { error: e_27_1 }; }
    finally {
        try {
            if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
        }
        finally { if (e_27) throw e_27.error; }
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
var DEFAULT_LIMIT = 500;
function maxEntriesToShow() {
    var params = new URLSearchParams(window.location.search);
    var limit = params.get('limit');
    if (limit == undefined)
        return DEFAULT_LIMIT;
    var n = parseInt(limit);
    if (isNaN(n))
        return DEFAULT_LIMIT;
    return n;
}
function bulkUpsertInPlace(upserts, entries) {
    var e_28, _a, e_29, _b;
    var byId = new Map();
    try {
        for (var upserts_1 = __values(upserts), upserts_1_1 = upserts_1.next(); !upserts_1_1.done; upserts_1_1 = upserts_1.next()) {
            var upsert = upserts_1_1.value;
            byId.set(upsert.id, upsert);
        }
    }
    catch (e_28_1) { e_28 = { error: e_28_1 }; }
    finally {
        try {
            if (upserts_1_1 && !upserts_1_1.done && (_a = upserts_1.return)) _a.call(upserts_1);
        }
        finally { if (e_28) throw e_28.error; }
    }
    for (var i = 0; i < entries.length; i++) {
        var upsert = byId.get(entries[i].id);
        if (upsert != undefined) {
            byId.delete(upsert.id);
            entries[i] = upsert;
        }
    }
    try {
        for (var _c = __values(byId.values()), _d = _c.next(); !_d.done; _d = _c.next()) {
            var upsert = _d.value;
            entries.push(upsert);
        }
    }
    catch (e_29_1) { e_29 = { error: e_29_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
        }
        finally { if (e_29) throw e_29.error; }
    }
}
//Mutates entries
//Also mutates updates
function applyUpdate(update, entries, updates) {
    var e_30, _a, e_31, _b;
    function upsert(entry) {
        var newEntry = __assign(__assign({}, entry), { lastModified: now() });
        upsertInPlace(newEntry, entries);
        upsertInPlace(newEntry, updates);
    }
    function bulkUpsert(upserts) {
        var newEntries = upserts.map(function (entry) { return (__assign(__assign({}, entry), { lastModified: now() })); });
        bulkUpsertInPlace(newEntries, entries);
        bulkUpsertInPlace(newEntries, updates);
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
            //TODO: make a bulkUpsert method
            var upserts = [];
            try {
                for (var entries_2 = __values(entries), entries_2_1 = entries_2.next(); !entries_2_1.done; entries_2_1 = entries_2.next()) {
                    var entry = entries_2_1.value;
                    var newEntry_3 = entry;
                    var changed = false;
                    if (matchesLabelRemap(newEntry_3.before, update.from, update.moveChildren)) {
                        newEntry_3 = __assign(__assign({}, newEntry_3), { before: remapLabel(newEntry_3.before, update.from, update.to, update.moveChildren) });
                        changed = true;
                    }
                    if (matchesLabelRemap(newEntry_3.after, update.from, update.moveChildren)) {
                        newEntry_3 = __assign(__assign({}, newEntry_3), { after: remapLabel(newEntry_3.after, update.from, update.to, update.moveChildren) });
                        changed = true;
                    }
                    if (changed)
                        upserts.push(newEntry_3);
                }
            }
            catch (e_31_1) { e_31 = { error: e_31_1 }; }
            finally {
                try {
                    if (entries_2_1 && !entries_2_1.done && (_b = entries_2.return)) _b.call(entries_2);
                }
                finally { if (e_31) throw e_31.error; }
            }
            bulkUpsert(upserts);
            break;
        case 'delete':
            upsert(__assign(__assign({}, update.entry), { deleted: true }));
            if (update.entry.before !== undefined) {
                if (update.shiftForward !== undefined) {
                    upsert(__assign(__assign({}, update.shiftForward), { before: update.entry.before }));
                }
                if (update.reflectBack !== undefined) {
                    upsert(__assign(__assign({}, update.reflectBack), { after: update.entry.before }));
                }
            }
            if (update.entry.after !== undefined) {
                if (update.shiftBack !== undefined) {
                    upsert(__assign(__assign({}, update.shiftBack), { after: update.entry.after }));
                }
                if (update.reflectForward !== undefined) {
                    upsert(__assign(__assign({}, update.reflectForward), { before: update.entry.after }));
                }
            }
            break;
        default: assertNever(update);
    }
}
function matchesLabelRemap(label, from, moveChildren) {
    if (moveChildren)
        return (label != undefined && label.slice(0, from.length) == from);
    else
        return label == from;
}
function remapLabel(label, from, to, moveChildren) {
    if (moveChildren) {
        if (label === undefined)
            return undefined;
        if (label.slice(0, from.length) === from) {
            return to + label.slice(from.length);
        }
        return label;
    }
    else {
        if (label == from)
            return to;
        else
            return label;
    }
}
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
function revit(xs, limit) {
    var bottom, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                bottom = (limit == undefined) ? 0 : xs.length - limit;
                i = xs.length - 1;
                _a.label = 1;
            case 1:
                if (!(i >= bottom)) return [3 /*break*/, 4];
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
            for (var entries_3 = __values(entries), entries_3_1 = entries_3.next(); !entries_3_1.done; entries_3_1 = entries_3.next()) {
                var entry = entries_3_1.value;
                result.set(entry.id, entry);
            }
        }
        catch (e_38_1) { e_38 = { error: e_38_1 }; }
        finally {
            try {
                if (entries_3_1 && !entries_3_1.done && (_a = entries_3.return)) _a.call(entries_3);
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
function makeReport(entries, start, end, topLabels) {
    var e_39, _a, e_40, _b;
    console.log(entries[800], entries.length);
    entries = sortAndFilter(entries);
    var result = {};
    try {
        for (var _c = __values(listPairs(it(entries))), _d = _c.next(); !_d.done; _d = _c.next()) {
            var _e = __read(_d.value, 2), e0 = _e[0], e1 = _e[1];
            if (e1.time > start && e0.time < end) {
                var t0 = last(e0.time, start);
                var t1 = first(e1.time, end);
                var label = labelFrom(e0, e1);
                try {
                    for (var topLabels_1 = (e_40 = void 0, __values(topLabels)), topLabels_1_1 = topLabels_1.next(); !topLabels_1_1.done; topLabels_1_1 = topLabels_1.next()) {
                        var topLabel = topLabels_1_1.value;
                        var subLabel = matchLabel(topLabel, label);
                        if (t0 != t1 && subLabel != null)
                            addToReport(label, t1.getTime() - t0.getTime(), result);
                    }
                }
                catch (e_40_1) { e_40 = { error: e_40_1 }; }
                finally {
                    try {
                        if (topLabels_1_1 && !topLabels_1_1.done && (_b = topLabels_1.return)) _b.call(topLabels_1);
                    }
                    finally { if (e_40) throw e_40.error; }
                }
            }
        }
    }
    catch (e_39_1) { e_39 = { error: e_39_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_39) throw e_39.error; }
    }
    return result;
}
function reportToString(report) {
    var e_41, _a;
    var parts = [];
    try {
        for (var _b = __values(Object.entries(report)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), label = _d[0], _e = __read(_d[1], 2), time = _e[0], sub = _e[1];
            parts.push(label + ":" + time + ":" + reportToString(sub));
        }
    }
    catch (e_41_1) { e_41 = { error: e_41_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_41) throw e_41.error; }
    }
    return "{" + parts.join(',') + "}";
}
function serializeReport(report) {
    return JSON.stringify(report);
}
function purifyReport(impure) {
    var e_42, _a;
    var result = {};
    try {
        for (var _b = __values(Object.entries(impure)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), a = _d[0], b = _d[1];
            if (Array.isArray(b) && b.length == 2) {
                var _e = __read(b, 2), x = _e[0], y = _e[1];
                if (typeof (x) == 'number') {
                    result[a] = [x, purifyReport(y)];
                }
                else {
                    console.error("Failed to parse report because " + x + " is not a number.");
                }
            }
            else {
                console.error("Failed to parse report because " + b + " is not an array of length 2.");
            }
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
export function deserializeReport(s) {
    var result = JSON.parse(s);
    return purifyReport(result);
}
function len(x) {
    return Object.keys(x).length;
}
function total(x) {
    var e_43, _a;
    var result = 0;
    try {
        for (var _b = __values(Object.values(x)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), t = _d[0], r = _d[1];
            result += t;
        }
    }
    catch (e_43_1) { e_43 = { error: e_43_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_43) throw e_43.error; }
    }
    return result;
}
// Compress paths (with no branches) into single steps
export function flattenReport(report) {
    var e_44, _a;
    var entries = Object.entries(report);
    var result = {};
    try {
        for (var entries_4 = __values(entries), entries_4_1 = entries_4.next(); !entries_4_1.done; entries_4_1 = entries_4.next()) {
            var _b = __read(entries_4_1.value, 2), label = _b[0], _c = __read(_b[1], 2), time = _c[0], sub = _c[1];
            var flatSub = flattenReport(sub);
            var subEntries = Object.entries(flatSub);
            if (subEntries.length == 1 && subEntries[0][1][0] == time) {
                result[label + "/" + subEntries[0][0]] = subEntries[0][1];
            }
            else {
                result[label] = [time, flatSub];
            }
        }
    }
    catch (e_44_1) { e_44 = { error: e_44_1 }; }
    finally {
        try {
            if (entries_4_1 && !entries_4_1.done && (_a = entries_4.return)) _a.call(entries_4);
        }
        finally { if (e_44) throw e_44.error; }
    }
    return result;
}
var TOTAL = 'total';
// If there are multiple top level parts in the report, put a "Total" category on top
// This seems like the wrong report semantics, but whatever
function capReport(report) {
    if (len(report) == 1)
        return report;
    var result = {};
    result[TOTAL] = [total(report), report];
    return result;
}
function totalReportTime(report) {
    var e_45, _a;
    var result = 0;
    try {
        for (var _b = __values(Object.entries(report)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), label = _d[0], _e = __read(_d[1], 2), time = _e[0], sub = _e[1];
            result += time;
        }
    }
    catch (e_45_1) { e_45 = { error: e_45_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_45) throw e_45.error; }
    }
    return result;
}
function renderPercentage(x) {
    return Math.round(x * 100) + "%";
}
function renderColorPicker(label, profile) {
    var picker = document.createElement('input');
    picker.setAttribute('type', 'color');
    picker.setAttribute('class', 'colorpicker');
    var colorHex = colorToHex(getColor(label, profile));
    picker.setAttribute('value', colorHex);
    picker.addEventListener('change', function () {
        console.log(picker.value);
        profile.colors.set(label, colorFromHex(picker.value));
        saveProfile(profile);
    });
    return picker;
}
function renderReportLine(label, time, onClick, onDoubleClick, hasChildren, fullLabel, editParams) {
    if (editParams === void 0) { editParams = null; }
    var childString = (hasChildren) ? ' (+)' : '';
    var childClass = (hasChildren) ? ' clickable' : '';
    var result = div('ReportLine');
    var lineText = spanText("reportLineText" + (hasChildren ? ' clickable' : ''), "[" + renderDuration(time) + "] " + label + childString);
    lineText.addEventListener('click', onClick);
    lineText.addEventListener('dblclick', onDoubleClick);
    result.append(lineText);
    if (editParams != null) {
        var renameLink = spanText('renameButton clickable', '[rename]');
        renameLink.addEventListener('click', function () {
            labelPopup(fullLabel, editParams.callback, editParams.entries);
        });
        var picker = renderColorPicker(fullLabel, editParams.profile);
        result.append(picker, renameLink);
    }
    return result;
    //return $(`<div class="reportLine"><span>${label}</span><span>${renderDuration(time)}</span><span>${renderPercentage(fraction)}</span></div>`)
}
function makeEditParams(entries, credentials) {
    function callback(update) {
        applyAndSave(entries, update, credentials);
    }
    return { profile: loadProfile(), callback: callback, entries: entries };
}
function addCallbackAfter(editParams, callback) {
    return __assign(__assign({}, editParams), { callback: function (t) {
            editParams.callback(t);
            callback(t);
        } });
}
function joinPrefix(prefix, label) {
    if (prefix == TOTAL || prefix.length == 0)
        return label;
    return prefix + "/" + label;
}
function renderReport(report, editParams, indentation, total, expanded, prefix, profile) {
    var e_46, _a, e_47, _b;
    if (editParams === void 0) { editParams = null; }
    if (indentation === void 0) { indentation = 0; }
    if (total === void 0) { total = null; }
    if (expanded === void 0) { expanded = true; }
    if (prefix === void 0) { prefix = ''; }
    if (profile === void 0) { profile = loadProfile(); }
    var totalNotNull = (total === null) ? totalReportTime(report) : total;
    var result = div('indent');
    var childExpanders = [];
    function renderLineAndChildren(label, time, sub) {
        var hasChildren = Object.keys(sub).length > 0;
        var result = [];
        var fullLabel = joinPrefix(prefix, label);
        var toggleChildren = function () { };
        var expandAllChildren = function () { };
        if (hasChildren) {
            var _a = __read(renderReport(sub, editParams, indentation + 1, total, false, fullLabel, profile), 2), child_1 = _a[0], expander_1 = _a[1];
            var visible_1 = true;
            if (!expanded) {
                child_1.hidden = true;
                visible_1 = false;
            }
            toggleChildren = function () {
                console.log("toggle " + label + "!");
                if (visible_1) {
                    visible_1 = false;
                    child_1.hidden = true;
                }
                else {
                    visible_1 = true;
                    child_1.hidden = false;
                }
            };
            expandAllChildren = function () {
                console.log("expand " + label + "!");
                visible_1 = true;
                child_1.hidden = false;
                expander_1();
            };
            result.push(child_1);
        }
        var head = renderReportLine(label, time, toggleChildren, expandAllChildren, hasChildren, fullLabel, editParams);
        result.unshift(head);
        return [result, expandAllChildren];
    }
    var entries = Object.entries(report);
    entries.sort(function (x, y) { return y[1][0] - x[1][0]; });
    try {
        for (var entries_5 = __values(entries), entries_5_1 = entries_5.next(); !entries_5_1.done; entries_5_1 = entries_5.next()) {
            var _c = __read(entries_5_1.value, 2), label = _c[0], _d = __read(_c[1], 2), time = _d[0], sub = _d[1];
            var _e = __read(renderLineAndChildren(label, time, sub), 2), elements = _e[0], expandChildren = _e[1];
            try {
                for (var elements_1 = (e_47 = void 0, __values(elements)), elements_1_1 = elements_1.next(); !elements_1_1.done; elements_1_1 = elements_1.next()) {
                    var e_48 = elements_1_1.value;
                    result.append(e_48);
                }
            }
            catch (e_47_1) { e_47 = { error: e_47_1 }; }
            finally {
                try {
                    if (elements_1_1 && !elements_1_1.done && (_b = elements_1.return)) _b.call(elements_1);
                }
                finally { if (e_47) throw e_47.error; }
            }
            childExpanders.push(expandChildren);
        }
    }
    catch (e_46_1) { e_46 = { error: e_46_1 }; }
    finally {
        try {
            if (entries_5_1 && !entries_5_1.done && (_a = entries_5.return)) _a.call(entries_5);
        }
        finally { if (e_46) throw e_46.error; }
    }
    return [result, function () {
            var e_49, _a;
            try {
                for (var childExpanders_1 = __values(childExpanders), childExpanders_1_1 = childExpanders_1.next(); !childExpanders_1_1.done; childExpanders_1_1 = childExpanders_1.next()) {
                    var f = childExpanders_1_1.value;
                    f();
                }
            }
            catch (e_49_1) { e_49 = { error: e_49_1 }; }
            finally {
                try {
                    if (childExpanders_1_1 && !childExpanders_1_1.done && (_a = childExpanders_1.return)) _a.call(childExpanders_1);
                }
                finally { if (e_49) throw e_49.error; }
            }
        }];
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
function reportFromParams(entries, params) {
    var startParse = parseString(dateRule, params.start || 'start today');
    var endParse = parseString(dateRule, params.end || 'now');
    var labels = (params.label == undefined) ? [''] : params.label.split(',').map(function (x) { return x.trim(); });
    if (startParse == 'fail' || startParse == 'prefix')
        return null;
    if (endParse == 'fail' || endParse == 'prefix')
        return null;
    var startDate = startParse[0];
    var endDate = endParse[0];
    window.history.pushState(null, "", "report.html?" + renderParams(params));
    $('#startDate').val(params.start || '');
    $('#endDate').val(params.end || '');
    $('#topLabel').val(params.label || '');
    var report = makeReport(entries, specToDate(startDate, now(), 'closest'), specToDate(endDate, now(), 'closest'), labels);
    return capReport(flattenReport(report));
}
export function loadReport() {
    var _a;
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
        function kd(e) {
            if (e.keyCode == 13) {
                e.preventDefault();
                render(paramsFromInput());
            }
        }
        function render(params) {
            console.log(entries.length, entries[800]);
            var report = reportFromParams(entries, params);
            if (report != null)
                displayReport(report, addCallbackAfter(editParams, function () { return render(params); }));
        }
        var credentials, entries, editParams;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getCredentials()];
                case 1:
                    credentials = _b.sent();
                    return [4 /*yield*/, loadEntries(credentials)];
                case 2:
                    entries = _b.sent();
                    editParams = makeEditParams(entries, credentials);
                    $('.reportParamInput').keydown(kd);
                    window.addEventListener('popstate', function (event) {
                        render(paramsFromURL(window.location.href));
                    });
                    $('#generate').click(function () { return render(paramsFromInput()); });
                    (_a = document.getElementById('editableReport')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () { return render(paramsFromInput()); });
                    $('#export').click(function () {
                        var params = paramsFromInput();
                        var report = reportFromParams(entries, params);
                        if (report != null) {
                            displayReport(report, addCallbackAfter(editParams, function () { return render(params); }));
                            exportReport(report);
                        }
                    });
                    $('#startDate').val('start today');
                    $('#endDate').val('now');
                    render(paramsFromURL(window.location.href));
                    return [2 /*return*/];
            }
        });
    });
}
function baseURL() {
    var url = window.location;
    return url.protocol + '//' + url.host;
}
function exportReport(report) {
    $('#exportPopup').attr('active', 'true');
    $('#exportPopup').html("<label for=\"link\">Link:</label>" +
        "<textarea id=\"link\"></textarea>" +
        "<div>" +
        "<span class=\"option\" choosable id=\"copyLink\">Copy (\u23CE)</span>" +
        "<span class=\"option\" choosable id=\"cancel\">Cancel (esc)</span>" +
        "</div>");
    var id = randomLinkID();
    //TOOD: include base URL
    $('#link').val(baseURL() + "/r/" + id);
    $('#link').select();
    var serialized = serializeReport(report);
    console.log(serialized);
    $.get("export?id=" + id + "&serialized=" + encodeURIComponent(serialized)).done(function (x) {
        if (x != 'ok') {
            alert(x);
        }
    });
    function exit() {
        $('#link').blur();
        $('#exportPopup').attr('active', 'false');
    }
    function submit() {
        $('#link').select();
        document.execCommand('copy');
        exit();
    }
    $('#cancel').click(exit);
    $('#copyLink').click(submit);
    $('#link').keydown(function (e) {
        if (e.keyCode == 27) {
            exit();
            e.preventDefault();
        }
        else if (e.keyCode == 13) {
            submit();
            e.preventDefault();
        }
    });
}
// Used in viewReport.ejs as well as from loadReport()
export function displayReport(report, editParams) {
    $('#reportContainer').empty();
    var editable = document.getElementById('editableReport');
    console.log(report);
    $('#reportContainer').append(renderReport(capReport(flattenReport(report)), editable.checked ? editParams : null)[0]);
}
function randomLinkID() {
    return Math.random().toString(36).substring(2, 8);
}
//# sourceMappingURL=track.js.map