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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import { InputBox } from './suggester.js';
function exampleEntries() {
    var events = ['breakfast', 'party', 'lunch', 'party', 'dinner', 'sleep', 'breakfast'];
    var result = [];
    for (var i = 0; i < events.length; i++) {
        result.push({ time: hoursAgo(events.length - i), before: events[i], uid: newUID() });
    }
    return result;
}
export function load() {
    var e_1, _a;
    var entries = loadEntries();
    if (entries.length == 0)
        try {
            for (var _b = __values(exampleEntries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var entry = _c.value;
                entries.push(entry);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    var x = new InputBox(getNames(entries), $('#trackerdiv'));
    function render() {
        var elem = $('#inputs');
        var options = $('#options');
        elem.html('');
        options.html('');
        for (var i = entries.length - 1; i >= 0; i--) {
            var entry = entries[i];
            elem.append("<div>[" + renderTime(entry.time) + "]</div><div>" + entry.before + "</div>");
        }
    }
    function addEntry(s) {
        entries.push({ before: s, time: now(), uid: newUID() });
        saveEntries(entries);
        x.setUniverse(getNames(entries));
        render();
    }
    render();
    x.bind(addEntry);
}
export function loadChart() {
    renderChart(loadEntries());
}
function renderChart(entries) {
    var e_2, _a;
    var timings = getTotalTime(entries, entries[0].time, entries[entries.length - 1].time);
    var datapoints = [];
    try {
        for (var timings_1 = __values(timings), timings_1_1 = timings_1.next(); !timings_1_1.done; timings_1_1 = timings_1.next()) {
            var _b = __read(timings_1_1.value, 2), k = _b[0], v = _b[1];
            datapoints.push({ label: k, y: v / 3600, color: nameToColor(k) });
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (timings_1_1 && !timings_1_1.done && (_a = timings_1.return)) _a.call(timings_1);
        }
        finally { if (e_2) throw e_2.error; }
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
function renderBars(entries, buckets) {
    var e_3, _a, e_4, _b, e_5, _c, e_6, _d;
    var seconds = [];
    try {
        for (var buckets_1 = __values(buckets), buckets_1_1 = buckets_1.next(); !buckets_1_1.done; buckets_1_1 = buckets_1.next()) {
            var bucket = buckets_1_1.value;
            var spans = spansInRange(bucket.start, bucket.end, entries);
            seconds.push(sumByName(spans.map(function (span) { return [span.label, length(span)]; })));
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (buckets_1_1 && !buckets_1_1.done && (_a = buckets_1.return)) _a.call(buckets_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    var keys = new Set();
    try {
        for (var seconds_1 = __values(seconds), seconds_1_1 = seconds_1.next(); !seconds_1_1.done; seconds_1_1 = seconds_1.next()) {
            var m = seconds_1_1.value;
            try {
                for (var m_1 = (e_5 = void 0, __values(m)), m_1_1 = m_1.next(); !m_1_1.done; m_1_1 = m_1.next()) {
                    var k = m_1_1.value;
                    keys.add(k[0]);
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (m_1_1 && !m_1_1.done && (_c = m_1.return)) _c.call(m_1);
                }
                finally { if (e_5) throw e_5.error; }
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (seconds_1_1 && !seconds_1_1.done && (_b = seconds_1.return)) _b.call(seconds_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    var data = [];
    var _loop_1 = function (k) {
        data.push({
            type: "stackedColumn",
            showInLegend: false,
            color: nameToColor(k),
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
            _loop_1(k);
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (keys_1_1 && !keys_1_1.done && (_d = keys_1.return)) _d.call(keys_1);
        }
        finally { if (e_6) throw e_6.error; }
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
    renderBars(entries, buckets);
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
    var e_7, _a;
    var result = new Map();
    var spans = spansInRange(start, end, entries);
    try {
        for (var spans_1 = __values(spans), spans_1_1 = spans_1.next(); !spans_1_1.done; spans_1_1 = spans_1.next()) {
            var span = spans_1_1.value;
            var seconds = (span.start.time.getTime() - span.end.time.getTime()) / 1000;
            incrementMap(result, span.label, seconds);
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (spans_1_1 && !spans_1_1.done && (_a = spans_1.return)) _a.call(spans_1);
        }
        finally { if (e_7) throw e_7.error; }
    }
    return result;
}
function sumByName(data) {
    var e_8, _a;
    var result = new Map();
    try {
        for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
            var datum = data_1_1.value;
            incrementMap(result, datum[0], datum[1]);
        }
    }
    catch (e_8_1) { e_8 = { error: e_8_1 }; }
    finally {
        try {
            if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
        }
        finally { if (e_8) throw e_8.error; }
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
function getNames(entries) {
    var e_9, _a;
    var s = new Set();
    try {
        for (var entries_1 = __values(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
            var entry = entries_1_1.value;
            if (entry.before !== undefined)
                s.add(entry.before);
            if (entry.after !== undefined)
                s.add(entry.after);
        }
    }
    catch (e_9_1) { e_9 = { error: e_9_1 }; }
    finally {
        try {
            if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
        }
        finally { if (e_9) throw e_9.error; }
    }
    return Array.from(s.keys());
}
function uniques(xs) {
    return __spread(new Set(xs));
}
function now() {
    return new Date();
}
function renderTime(d) {
    return d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
}
//TODO: takes as input a date and a string
//parses the string as the nearest reasonable date
function parseTime(s, d) {
    var result = new Date(d);
    var parts = s.split(':').map(function (s) { return parseInt(s.trim()); });
    if (parts.length == 2 && parts.filter(function (x) { return x == parseInt('!'); })) {
        result.setHours(parts[0]);
        result.setMinutes(parts[1]);
    }
    return result;
}
function saveEntries(entries) {
    localStorage.setItem('entries', serializeEntries(entries));
}
function serializeEntries(entries) {
    return JSON.stringify(entries.map(function (x) { return ({ time: x.time.getTime(), before: x.before, after: x.after }); }));
}
function deserializeEntries(s) {
    var json = JSON.parse(s);
    return json.map(function (x) { return ({ time: new Date(x.time), before: x.before, after: x.after, uid: x.uid || newUID() }); });
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
function applyToTriples(f, xs) {
    var e_10, _a;
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
    catch (e_10_1) { e_10 = { error: e_10_1 }; }
    finally {
        try {
            if (xs_1_1 && !xs_1_1.done && (_a = xs_1.return)) _a.call(xs_1);
        }
        finally { if (e_10) throw e_10.error; }
    }
    addIf(xs[xs.length - 2], xs[xs.length - 1], undefined);
    return result;
}
function linkSpans(spans) {
    applyToTriples(function (a, b, c) {
        b.prior = a;
        b.next = c;
        return null;
    }, spans);
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
    var e_11, _a;
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
    catch (e_11_1) { e_11 = { error: e_11_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_11) throw e_11.error; }
    }
    linkSpans(result);
    return result;
}
function spanInDay(span, day) {
    if (span.end.time < day.start)
        return null;
    else if (span.start.time > day.end)
        return null;
    return {
        start: last(day.start, span.start.time),
        stop: first(day.end, span.end.time)
    };
}
export function loadCalendar() {
    var entries = loadEntries();
    sortEntries(entries);
    var spans = spansFromEntries(entries);
    linkSpans(spans);
    function callback(t, otherSpans) {
        var _a;
        _a = __read(applyUpdate(t, entries, spans, otherSpans), 3), entries = _a[0], spans = _a[1], otherSpans = _a[2];
        showCalendar(spans, callback);
        saveEntries(entries);
        return otherSpans;
    }
    showCalendar(spans, callback);
}
function showCalendar(spans, callback) {
    var e_12, _a, e_13, _b;
    var days = [];
    for (var i = 0; i < 7; i++) {
        var d = daysAgo(6 - i);
        $("#headerrow th:nth-child(" + (i + 2) + ")").text(renderDay(d));
        days.push({ start: startOfDay(d), end: endOfDay(d), index: i });
    }
    try {
        for (var spans_2 = __values(spans), spans_2_1 = spans_2.next(); !spans_2_1.done; spans_2_1 = spans_2.next()) {
            var span = spans_2_1.value;
            try {
                for (var days_1 = (e_13 = void 0, __values(days)), days_1_1 = days_1.next(); !days_1_1.done; days_1_1 = days_1.next()) {
                    var day = days_1_1.value;
                    var range = spanInDay(span, day);
                    if (range !== null) {
                        getCalendarColumn(day.index).append(calendarSpan(span, range.start, range.stop, day.start, day.end, callback));
                    }
                }
            }
            catch (e_13_1) { e_13 = { error: e_13_1 }; }
            finally {
                try {
                    if (days_1_1 && !days_1_1.done && (_b = days_1.return)) _b.call(days_1);
                }
                finally { if (e_13) throw e_13.error; }
            }
        }
    }
    catch (e_12_1) { e_12 = { error: e_12_1 }; }
    finally {
        try {
            if (spans_2_1 && !spans_2_1.done && (_a = spans_2.return)) _a.call(spans_2);
        }
        finally { if (e_12) throw e_12.error; }
    }
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
function nameToColor(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}
//TODO: callback applies the update and then gives the new list of spans
function calendarSpan(span, spanStart, spanEnd, start, end, callback) {
    function frac(d) {
        return (d.getTime() - start.getTime()) / (end.getTime() - start.getTime());
    }
    var lengthPercent = 100 * (frac(spanEnd) - frac(spanStart));
    var topPercent = 100 * frac(spanStart);
    var color = nameToColor(span.label);
    var style = "top:" + topPercent + "%; height:" + lengthPercent + "%; background:" + color + ";";
    var result = $("<div class='event' style='" + style + "'><div class='spantext'>" + span.label + "</div></div>");
    function popup(spans) {
        function popupCallback(t) {
            var newSpans = callback(t, [spans]);
            popup(newSpans[0]);
        }
        multiPopup(spans, popupCallback);
    }
    result.click(function () {
        var spans = [];
        if (span.prior !== undefined)
            spans.push(span.prior);
        spans.push(span);
        if (span.next !== undefined)
            spans.push(span.next);
        popup(spans);
    });
    return result;
}
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
function noop() {
    return { kind: 'sequence', updates: [] };
}
function apply(update) {
    return function (x) {
        var y = (__assign({}, x));
        for (var k in update) {
            var f = update[k];
            if (f !== undefined)
                y[k] = f(x[k]);
        }
        return y;
    };
}
function assertNever(value) {
    throw new Error("Shouldn't reach this case!");
}
function applyList(update) {
    return function (xs) {
        var e_14, _a;
        switch (update.kind) {
            case 'sequence':
                var result = xs;
                try {
                    for (var _b = __values(update.updates), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var u = _c.value;
                        result = applyList(u)(result);
                    }
                }
                catch (e_14_1) { e_14 = { error: e_14_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_14) throw e_14.error; }
                }
                return result;
            case 'apply':
                return xs.map(function (x) { return (x.uid == update.uid) ? update.update(x) : x; });
            case 'split':
            case 'delete':
                var n = xs.findIndex(function (x) { return x.uid == update.uid; });
                if (n < 0)
                    throw new Error("Can't find that UID");
                var insert = (update.kind == 'split') ? update.insert : [];
                return xs.slice(0, n).concat(insert).concat(xs.slice(n + 1, undefined));
            default:
                return assertNever(update);
        }
    };
}
function applyToUID(f, xs, id) {
    return xs.map(function (x) { return (x.uid == id) ? f(x) : x; });
}
//TODO: improve semantics when things are out of order or there are a subset or whatever
//Right now it puts in all the news if any of the olds are found, at the same spot they were
function replaceMulti(xs, olds, news) {
    var i = xs.findIndex(function (x) { return olds.findIndex(function (old) { return old.uid == x.uid; }) >= 0; });
    if (i < 0)
        return xs;
    var j = olds.findIndex(function (old) { return old.uid == xs[i].uid; });
    var replaced = 0;
    for (var k = 0; k < olds.length - j; k++) {
        if (i + k < xs.length && xs[i + k].uid == olds[j + k].uid)
            replaced += 1;
    }
    return xs.slice(0, i).concat(news).concat(xs.slice(i + replaced));
}
function spanBetween(a, b) {
    return {
        start: a,
        end: b,
        label: labelFrom(a, b),
        uid: newUID()
    };
}
//TODO: I think I want this to be the only place that mutates a span or entry?
function applyUpdate(update, entries, spans, otherSpans) {
    if (otherSpans === void 0) { otherSpans = []; }
    switch (update.kind) {
        case 'relabel':
            var toRelabel = spans.find(function (s) { return s.uid == update.span; });
            if (toRelabel != undefined) {
                toRelabel.label = update.label;
                toRelabel.start.after = update.label;
                toRelabel.end.before = update.label;
            }
            break;
        case 'split':
            var span_1 = spans.find(function (s) { return s.uid == update.span; });
            if (span_1 !== undefined) {
                var newEntry = { time: update.time, before: span_1.start.after, after: span_1.end.before, uid: newUID() };
                var span1_1 = spanBetween(span_1.start, newEntry);
                var span2_1 = spanBetween(newEntry, span_1.end);
                span1_1.prior = span_1.prior;
                span1_1.next = span2_1;
                span2_1.prior = span1_1;
                span2_1.next = span_1.next;
                spans = replaceMulti(spans, [span_1], [span1_1, span2_1]);
                otherSpans = otherSpans.map(function (s) { return replaceMulti(s, [span_1], [span1_1, span2_1]); });
                entries = replaceMulti(entries, [span_1.start, span_1.end], [span_1.start, newEntry, span_1.end]);
            }
            break;
        case 'merge':
            var entry = entries.find(function (e) { return e.uid == update.entry; });
            if (entry != undefined) {
                var toReplace_1 = spans.filter(function (span) { return span.end.uid == update.entry || span.start.uid == update.entry; });
                if (toReplace_1.length != 2)
                    throw new Error("Failed to merge");
                entries = replaceMulti(entries, [entry], []);
                var start = toReplace_1[0].start;
                var end = toReplace_1[1].end;
                start.after = update.label;
                end.before = update.label;
                spans = replaceMulti(spans, toReplace_1, [spanBetween(start, end)]);
                var newSpan_1 = spanBetween(start, end);
                newSpan_1.prior = toReplace_1[0].prior;
                newSpan_1.next = toReplace_1[0].next;
                otherSpans = otherSpans.map(function (s) { return replaceMulti(s, toReplace_1, [newSpan_1]); });
            }
            break;
        case 'move':
            var toModify = entries.find(function (e) { return e.uid == update.entry; });
            if (toModify != undefined) {
                toModify.time = update.time;
            }
            break;
        default: return assertNever(update);
    }
    return [entries, spans, otherSpans];
}
function multiPopup(spans, callback) {
    var e_15, _a;
    $('#popup').attr('active', 'true');
    $('#popup').html('');
    var _loop_2 = function (span, first_1, last_1) {
        var labelElem = inputAfterColon('Activity', span.label, function (s) { return callback({ kind: 'relabel', span: span.uid, label: s }); });
        labelElem.css('position', 'relative');
        var splitButton = $("<div class='splitbutton'>+</div>");
        labelElem.append(splitButton);
        if (!first_1) {
            var upButton = $("<div class='upbutton'>↑</div>");
            upButton.click(function () {
                callback({ kind: 'merge', entry: span.start.uid, label: span.label });
            });
            labelElem.append(upButton);
        }
        if (!last_1) {
            var downButton = $("<div class='downbutton'>↓</div>");
            downButton.click(function () {
                callback({ kind: 'merge', entry: span.end.uid, label: span.label });
            });
            labelElem.append(downButton);
        }
        $('#popup').append(labelElem);
        if (!last_1) {
            var timeElem = inputAfterColon('Time', renderTime(span.end.time), function (s) { return callback({ kind: 'move', entry: span.end.uid, time: parseTime(s, span.end.time) }); });
            timeElem.css('position', 'relative');
            $('#popup').append(timeElem);
        }
    };
    try {
        for (var _b = __values(firstLast(spans)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), span = _d[0], _e = __read(_d[1], 2), first_1 = _e[0], last_1 = _e[1];
            _loop_2(span, first_1, last_1);
        }
    }
    catch (e_15_1) { e_15 = { error: e_15_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_15) throw e_15.error; }
    }
}
function zip(xs, ys) {
    return xs.map(function (x, i) { return [x, ys[i]]; });
}
function firstLast(xs) {
    return zip(xs, zip(xs.map(function (x, i) { return i == 0; }), xs.map(function (x, i) { return i == xs.length - 1; })));
}
function popup(span) {
    $('#popup').attr('active', 'true');
    $('#popup').html('');
    if (span.prior != undefined) {
        $('#popup').append(inputAfterColon('Before', span.label, console.log));
        // $('#popup').append(`<div>Before: ${span.prior.entry.name}</div>`)
    }
    $('#popup').append("<div>Start: " + renderTime(span.start.time) + "</div>");
    $('#popup').append("<div>Name: " + span.label + "</div>");
    $('#popup').append("<div>End: " + renderTime(span.end.time) + "</div>");
    if (span.next != undefined) {
        $('#popup').append("<div>After: " + span.label + "</div>");
    }
    var doneButton = $("<div>Done</div>");
    $('#popup').append(doneButton);
    doneButton.click(function () { return $('#popup').attr('active', 'false'); });
}
function getCalendarColumn(n) {
    return $("td:nth-child(" + (n + 2) + ")");
}
//# sourceMappingURL=track.js.map