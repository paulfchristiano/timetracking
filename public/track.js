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
function exampleEntries() {
    var events = ['breakfast', 'party', 'lunch', 'party', 'dinner', 'sleep', 'breakfast'];
    var result = [];
    for (var i = 0; i < events.length; i++) {
        result.push({ time: hoursAgo(events.length - i), before: events[i], id: newUID() });
    }
    return result;
}
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
function zoomedPopup(entries, startIndex, endIndex, profile, popup, callback) {
    var e_1, _a;
    var start = entries[startIndex];
    var end = entries[endIndex];
    $('#popup').attr('active', 'true');
    $('#minical').empty();
    $('#priorcal').empty();
    $('#nextcal').empty();
    var _loop_1 = function (a, b) {
        if (a == null && startIndex > 0) {
            var label = labelFrom(entries[startIndex - 1], entries[startIndex]);
            var style = "background:" + renderGradient(getColor(label, profile), true) + "; height:100%";
            var e_2 = $("<div class='event' style='" + style + "'><div class='spantext'></div></div>");
            e_2.click(function () { return popup(startIndex - 1, startIndex); });
            $('#priorcal').append(e_2);
        }
        if (b == null && endIndex + 1 < entries.length) {
            var label = labelFrom(entries[endIndex], entries[endIndex + 1]);
            var style = "background:" + renderGradient(getColor(label, profile), false) + "; height:100%";
            var e_3 = $("<div class='event' style='" + style + "'><div class='spantext'></div></div>");
            e_3.click(function () { return popup(endIndex, endIndex + 1); });
            $('#nextcal').append(e_3);
        }
        if (a != null && b != null) {
            var _a = __read(a, 2), i_1 = _a[0], first_1 = _a[1];
            var _b = __read(b, 2), j_1 = _b[0], second = _b[1];
            var elem = calendarSpan(labelFrom(first_1, second), first_1.time, second.time, start.time, end.time, profile);
            elem.click(function () { return popup(i_1, j_1); });
            $('#minical').append(elem);
        }
    };
    try {
        for (var _b = __values(listPairsAndEnds(enumfrom(entries, startIndex, endIndex + 1))), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), a = _d[0], b = _d[1];
            _loop_1(a, b);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
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
                    kind: 'split',
                    before: entries[startIndex],
                    after: entries[startIndex + 1],
                    time: minutesAfter(entries[startIndex].time, a.minutes),
                    labelBefore: s
                });
                break;
            case 'until':
                callback({
                    kind: 'split',
                    before: entries[startIndex],
                    after: entries[startIndex + 1],
                    time: parseTime(a.time, entries[startIndex].time, 'next'),
                    labelBefore: s
                });
                break;
            case 'untilMinutes':
                callback({
                    kind: 'split',
                    before: entries[endIndex - 1],
                    after: entries[endIndex],
                    time: minutesAfter(entries[endIndex].time, -a.minutes),
                    labelBefore: s
                });
                break;
            case 'after':
                callback({
                    kind: 'split',
                    before: entries[startIndex],
                    after: entries[startIndex + 1],
                    time: parseTime(a.time, entries[startIndex].time, 'next'),
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
    $('#starttime').append(inputAfterColon('Start', renderTime(start.time), function (s) { return callback({ kind: 'move', time: parseTime(s, start.time), entry: start }); }));
    $('#endtime').empty();
    $('#endtime').append(inputAfterColon('End', renderTime(end.time), function (s) { return callback({ kind: 'move', time: parseTime(s, end.time), entry: end }); }));
}
function renderDuration(ms) {
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
export function loadTracker() {
    var profile = emptyProfile();
    var entries = loadEntries();
    sortEntries(entries);
    var focused = null;
    function callback(update) {
        var _a, _b;
        _a = __read(applyUpdate(update, entries, []), 2), entries = _a[0], _b = __read(_a[1], 0);
        saveEntries(entries);
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
                        callback({ kind: 'append', before: s, time: minutesAfter(start.time, a.minutes) });
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
                        callback({ kind: 'append', before: s, time: parseTime(a.time, new Date(), 'last') });
                        break;
                    case 'untilMinutes':
                        callback({ kind: 'append', before: s, time: minutesAfter(new Date(), -a.minutes) });
                        break;
                    case 'after':
                        callback({ kind: 'append', after: s, time: parseTime(a.time, new Date(), 'last') });
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
                        callback({ kind: 'split', labelBefore: s, before: start, after: end, time: minutesAfter(start.time, a.minutes) });
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
                        callback({ kind: 'split', labelBefore: s, before: start, after: end, time: parseTime(a.time, start.time, 'next') });
                        break;
                    case 'untilMinutes':
                        callback({ kind: 'split', labelBefore: s, before: start, after: end, time: minutesAfter(end.time, -a.minutes) });
                        break;
                    case 'after':
                        callback({ kind: 'split', labelAfter: s, before: start, after: end, time: parseTime(a.time, start.time, 'next') });
                        break;
                    default: assertNever(a);
                }
            });
        }
    }
    var heartbeats = [];
    function setTimer(start, elem) {
        var diff = new Date().getTime() - start.getTime();
        if (diff > 1000)
            elem.text(renderDuration(new Date().getTime() - start.getTime()));
    }
    setInterval(function () {
        var e_4, _a;
        try {
            for (var heartbeats_1 = __values(heartbeats), heartbeats_1_1 = heartbeats_1.next(); !heartbeats_1_1.done; heartbeats_1_1 = heartbeats_1.next()) {
                var _b = __read(heartbeats_1_1.value, 2), start = _b[0], elem = _b[1];
                setTimer(start, elem);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (heartbeats_1_1 && !heartbeats_1_1.done && (_a = heartbeats_1.return)) _a.call(heartbeats_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
    }, 1000);
    function render() {
        var e_5, _a;
        heartbeats = [];
        var elem = $('#inputs');
        elem.html('');
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
                var time = $("<div class='timelabel' contenteditable='true'>" + renderTime(end.time) + "</div>");
                row.append(time);
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
                var e_6 = $("<div class=\"line\" style='" + style + "''></div>");
                row.append(e_6);
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
                var e_7 = $("<div class=\"line\" style='" + style + "''></div>");
                row.append(e_7);
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
            for (var _b = __values(listPairsAndEnds(revit(entries))), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), end = _d[0], start = _d[1];
                _loop_2(end, start);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
    }
    function addEntry(s) {
        entries.push({ before: s, time: now(), id: newUID() });
        saveEntries(entries);
        render();
    }
    render();
}
function emptyProfile() {
    return { colors: new Map() };
}
export function loadChart() {
    renderChart(loadEntries(), emptyProfile());
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
    var entries = loadEntries();
    var buckets = weeklyBuckets();
    renderBars(entries, buckets, emptyProfile());
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
    var e_15, _a, e_16, _b, e_17, _c;
    var s = new Set();
    try {
        for (var entries_1 = __values(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
            var entry = entries_1_1.value;
            try {
                for (var _d = (e_16 = void 0, __values(namesFrom(entry.before))), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var name_1 = _e.value;
                    s.add(name_1);
                }
            }
            catch (e_16_1) { e_16 = { error: e_16_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                }
                finally { if (e_16) throw e_16.error; }
            }
            try {
                for (var _f = (e_17 = void 0, __values(namesFrom(entry.after))), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var name_2 = _g.value;
                    s.add(name_2);
                }
            }
            catch (e_17_1) { e_17 = { error: e_17_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_c = _f.return)) _c.call(_f);
                }
                finally { if (e_17) throw e_17.error; }
            }
        }
    }
    catch (e_15_1) { e_15 = { error: e_15_1 }; }
    finally {
        try {
            if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
        }
        finally { if (e_15) throw e_15.error; }
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
//TODO: takes as input a date and a string
//fills in the date and AM/PM to get the closest thing in time
function parseTime(s, d, rel) {
    var e_18, _a, e_19, _b;
    if (rel === void 0) { rel = 'closest'; }
    var parts = s.split(':').map(function (s) { return parseInt(s.trim()); });
    if (parts.length == 2 && !parts.some(isNaN)) {
        var candidate = new Date(d);
        candidate.setMinutes(parts[1]);
        var best = d; //never used
        var bestDiff = null;
        try {
            for (var _c = __values([-1, 0, 1]), _d = _c.next(); !_d.done; _d = _c.next()) {
                var dayDelta = _d.value;
                try {
                    for (var _e = (e_19 = void 0, __values([parts[0], (parts[0] + 12) % 24])), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var hours = _f.value;
                        candidate.setDate(d.getDate() + dayDelta);
                        candidate.setHours(hours);
                        var diff = candidate.getTime() - d.getTime();
                        var absDiff = Math.abs(diff);
                        var isValid = (rel == 'closest') || (rel == 'next' && diff > 0) || (rel == 'last' && diff < 0);
                        if ((bestDiff == null || absDiff < bestDiff) && isValid) {
                            best = new Date(candidate);
                            bestDiff = absDiff;
                        }
                    }
                }
                catch (e_19_1) { e_19 = { error: e_19_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_19) throw e_19.error; }
                }
            }
        }
        catch (e_18_1) { e_18 = { error: e_18_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_18) throw e_18.error; }
        }
        return best;
    }
    return new Date(d);
}
function saveEntries(entries) {
    localStorage.setItem('entries', serializeEntries(entries));
}
function serializeEntries(entries) {
    return JSON.stringify(entries.map(function (x) { return ({ time: x.time.getTime(), before: x.before, after: x.after }); }));
}
function deserializeEntries(s) {
    var json = JSON.parse(s);
    return json.map(function (x) { return ({ time: new Date(x.time), before: x.before, after: x.after, id: x.id || newUID() }); });
}
function loadEntries() {
    var s = localStorage.getItem('entries');
    if (s == '' || s == null)
        return [];
    return deserializeEntries(s);
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
function hidePopup() {
    $('#minical').empty();
    $('#nextcal').empty();
    $('#priorcal').empty();
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
    var e_22, _a;
    var entries = loadEntries();
    var labels = getDistinctLabels(entries);
    var profile = loadProfile();
    labels.sort();
    function makeLabelDiv(label) {
        var colorHex = colorToHex(getColor(label, profile));
        var result = $("<div class='label'>" + label + "</div>");
        var picker = $("<input type='color' id='" + label + "-color' class='colorpicker' value='" + colorHex + "'></input>");
        result.append(picker);
        picker.change(function () {
            profile.colors.set(label, colorFromHex(picker.val()));
            saveProfile(profile);
        });
        return result;
    }
    var main = $('#labels');
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
    $('#calendardiv').click(function (e) {
        hidePopup();
    });
    var entries = loadEntries();
    sortEntries(entries);
    function callback(t, indices) {
        var _a;
        _a = __read(applyUpdate(t, entries, indices), 2), entries = _a[0], indices = _a[1];
        saveEntries(entries);
        return [entries, indices];
    }
    showCalendar(entries, null, emptyProfile(), callback);
}
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
    function popupCallback(startIndex, endIndex) {
        function f(t) {
            var _a, _b;
            _a = __read(callback(t, [startIndex, endIndex]), 2), entries = _a[0], _b = __read(_a[1], 2), startIndex = _b[0], endIndex = _b[1];
            var initialPopup = (startIndex == null || endIndex == null) ? null
                : [startIndex, endIndex];
            showCalendar(entries, initialPopup, profile, callback);
        }
        return f;
    }
    function popup(startIndex, endIndex) {
        zoomedPopup(entries, startIndex, endIndex, profile, popup, popupCallback(startIndex, endIndex));
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
    var _loop_4 = function (i, start, j, end) {
        var e_25, _a;
        try {
            for (var days_2 = (e_25 = void 0, __values(days)), days_2_1 = days_2.next(); !days_2_1.done; days_2_1 = days_2.next()) {
                var day = days_2_1.value;
                var range = partInDay(start.time, end.time, day);
                if (range !== null) {
                    var e_26 = calendarSpan(labelFrom(start, end), range.start, range.end, day.start, day.end, profile);
                    e_26.click(function (e) {
                        popup(i, j);
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
        for (var _c = __values(listPairs(enumerate(it(entries)))), _d = _c.next(); !_d.done; _d = _c.next()) {
            var _e = __read(_d.value, 2), _f = __read(_e[0], 2), i = _f[0], start = _f[1], _g = __read(_e[1], 2), j = _g[0], end = _g[1];
            _loop_4(i, start, j, end);
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
var colors = ['#fc6472', '#f4b2a6', '#eccdb3', '#bcefd0', '#a1e8e4', '#23c8b2', '#c3ecee'];
function randomColor() {
    return colorFromHex(colors[randInt(colors.length)]);
    /*
    return {
        r: randInt(256),
        g: randInt(256),
        b: randInt(256),
    }
    */
}
function colorToHex(c) {
    return "#" + c.r.toString(16) + c.g.toString(16) + c.b.toString(16);
}
function colorFromHex(hex) {
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
function newUID() {
    return Math.random().toString(36).substring(2, 10);
}
function assertNever(value) {
    throw new Error("Shouldn't reach this case!");
}
function insertAt(toInsert, xs, index) {
    return xs.slice(0, index).concat([toInsert]).concat(xs.slice(index));
}
function applyTo(f, xs, x) {
    return xs.map(function (y) { return (x.id == y.id) ? f(y) : y; });
}
function remove(x, xs) {
    return xs.filter(function (y) { return y.id != x.id; });
}
function insertBetween(x, xs, a, b) {
    for (var i = 0; i < xs.length - 1; i++) {
        if (xs[i].id == a.id && xs[i + 1].id == b.id) {
            return insertAt(x, xs, i + 1);
        }
    }
    return xs;
}
function removeIndex(xs, n) {
    return xs.slice(0, n).concat(xs.slice(n + 1));
}
function neighbors(xs, x) {
    for (var i = 0; i < xs.length; i++) {
        if (xs[i].id == x.id) {
            return [
                (i == 0) ? null : xs[i - 1],
                (i == xs.length - 1) ? null : xs[i + 1]
            ];
        }
    }
    return [null, null];
}
function find(xs, x) {
    for (var i = 0; i < xs.length; i++) {
        if (xs[i].id == x.id)
            return i;
    }
    return null;
}
//TODO: I think I want this to be the only place that mutates a span or entry?
//TODO: I want to somehow block the user from moving time past another entry
//(But at any rate I'll need to figure out how to resolve such conflicts in the DB...)
function applyUpdate(update, entries, indices) {
    var e_29, _a, _b;
    switch (update.kind) {
        case 'composite':
            try {
                for (var _c = __values(update.updates), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var u = _d.value;
                    _b = __read(applyUpdate(u, entries, indices), 2), entries = _b[0], indices = _b[1];
                }
            }
            catch (e_29_1) { e_29 = { error: e_29_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_29) throw e_29.error; }
            }
            break;
        case 'relabel':
            if (update.before !== undefined) {
                entries = applyTo(function (entry) { return (__assign(__assign({}, entry), { after: update.label })); }, entries, update.before);
            }
            if (update.after !== undefined) {
                entries = applyTo(function (entry) { return (__assign(__assign({}, entry), { before: update.label })); }, entries, update.after);
            }
            break;
        case 'split':
            var newEntry = {
                time: update.time,
                before: update.labelBefore || update.before.after || update.after.before,
                after: update.labelAfter || update.after.before || update.before.after,
                id: newUID()
            };
            var index_1 = find(entries, update.before);
            if (index_1 != null) {
                entries = insertAt(newEntry, entries, index_1 + 1);
                indices = indices.map(function (x) { return (x == null) ? null : (x > index_1) ? x + 1 : x; });
            }
            if (update.labelBefore !== undefined) {
                entries = applyTo(function (entry) { return (__assign(__assign({}, entry), { after: update.labelBefore })); }, entries, update.before);
            }
            if (update.labelAfter !== undefined) {
                entries = applyTo(function (entry) { return (__assign(__assign({}, entry), { before: update.labelAfter })); }, entries, update.after);
            }
            break;
        case 'merge': {
            var _e = __read(neighbors(entries, update.entry), 2), a = _e[0], b = _e[1];
            if (a != null)
                a.after = update.label;
            if (b != null)
                b.before = update.label;
            var index_2 = find(entries, update.entry);
            if (index_2 != null) {
                entries = removeIndex(entries, index_2);
                indices = indices.map(function (x) { return (x == null || x == index_2) ? null : (x > index_2) ? x - 1 : x; });
            }
            break;
        }
        case 'move':
            entries = applyTo(function (entry) { return (__assign(__assign({}, entry), { time: update.time })); }, entries, update.entry);
            break;
        case 'append': {
            var newEntry_1 = {
                time: update.time,
                before: update.before,
                after: update.after,
                id: newUID()
            };
            entries = entries.concat([newEntry_1]);
            break;
        }
        default: assertNever(update);
    }
    return [entries, indices];
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
    var a, b, xs_2, xs_2_1, x, e_30_1;
    var e_30, _a;
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
                e_30_1 = _b.sent();
                e_30 = { error: e_30_1 };
                return [3 /*break*/, 8];
            case 7:
                try {
                    if (xs_2_1 && !xs_2_1.done && (_a = xs_2.return)) _a.call(xs_2);
                }
                finally { if (e_30) throw e_30.error; }
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
    var _a, _b, _c, x, y, e_31_1;
    var e_31, _d;
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
                e_31_1 = _e.sent();
                e_31 = { error: e_31_1 };
                return [3 /*break*/, 7];
            case 6:
                try {
                    if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                }
                finally { if (e_31) throw e_31.error; }
                return [7 /*endfinally*/];
            case 7: return [2 /*return*/];
        }
    });
}
function enumerate(xs) {
    var i, xs_3, xs_3_1, x, e_32_1;
    var e_32, _a;
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
                e_32_1 = _b.sent();
                e_32 = { error: e_32_1 };
                return [3 /*break*/, 8];
            case 7:
                try {
                    if (xs_3_1 && !xs_3_1.done && (_a = xs_3.return)) _a.call(xs_3);
                }
                finally { if (e_32) throw e_32.error; }
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
    var first, next, start, xs_4, xs_4_1, x, e_33_1;
    var e_33, _a;
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
                e_33_1 = _b.sent();
                e_33 = { error: e_33_1 };
                return [3 /*break*/, 8];
            case 7:
                try {
                    if (xs_4_1 && !xs_4_1.done && (_a = xs_4.return)) _a.call(xs_4);
                }
                finally { if (e_33) throw e_33.error; }
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
//# sourceMappingURL=track.js.map