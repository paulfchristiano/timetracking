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
        result.push({ time: hoursAgo(events.length - i), name: events[i] });
    }
    return result;
}
export function load() {
    var e_1, _a;
    var entries = loadEntries();
    console.log(entries);
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
            elem.append("<div>[" + renderTime(entry.time) + "] " + entry.name + "</div>");
        }
    }
    function addEntry(s) {
        entries.push({ name: s, time: now() });
        saveEntries(entries);
        x.setUniverse(getNames(entries));
        render();
    }
    render();
    x.bind(addEntry);
}
export function loadChart() {
    console.log(loadEntries());
    renderChart(loadEntries());
}
function renderChart(entries) {
    var e_2, _a;
    var timings = getTotalTime(entries);
    var datapoints = [];
    try {
        for (var timings_1 = __values(timings), timings_1_1 = timings_1.next(); !timings_1_1.done; timings_1_1 = timings_1.next()) {
            var _b = __read(timings_1_1.value, 2), k = _b[0], v = _b[1];
            datapoints.push({ label: k, y: v / 3600 });
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (timings_1_1 && !timings_1_1.done && (_a = timings_1.return)) _a.call(timings_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    console.log(datapoints);
    /* tslint:disable-next-line */
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: false,
        title: {
            text: "Time Use"
        },
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
function incrementMap(map, x, dy) {
    var y = map.get(x);
    map.set(x, (y || 0) + dy);
}
function getTotalTime(entries) {
    var e_3, _a;
    var result = new Map();
    var last = null;
    try {
        for (var entries_1 = __values(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
            var entry = entries_1_1.value;
            if (last != null) {
                var seconds = (entry.time.getTime() - last.time.getTime()) / 1000;
                incrementMap(result, entry.name, seconds);
            }
            last = entry;
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
        }
        finally { if (e_3) throw e_3.error; }
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
    return uniques(entries.map(function (entry) { return entry.name; }));
}
function uniques(xs) {
    return __spread(new Set(xs));
}
function now() {
    return new Date();
}
function renderTime(d) {
    return d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}
function saveEntries(entries) {
    localStorage.setItem('entries', serializeEntries(entries));
}
function serializeEntries(entries) {
    return JSON.stringify(entries.map(function (x) { return ({ time: x.time.getTime(), name: x.name }); }));
}
function deserializeEntries(s) {
    var json = JSON.parse(s);
    return json.map(function (x) { return ({ time: new Date(x.time), name: x.name }); });
}
function loadEntries() {
    var s = localStorage.getItem('entries');
    if (s == '' || s == null)
        return [];
    return deserializeEntries(s);
}
function renderDay(d) {
    var options = { day: 'numeric', weekday: 'short', month: 'short' };
    return d.toLocaleDateString("en-US", options);
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
function spans(entries) {
    var e_4, _a;
    var current = null;
    var result = [];
    try {
        for (var entries_2 = __values(entries), entries_2_1 = entries_2.next(); !entries_2_1.done; entries_2_1 = entries_2.next()) {
            var entry = entries_2_1.value;
            if (current != null)
                result.push({ start: current.time, end: entry.time, entry: entry });
            current = entry;
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (entries_2_1 && !entries_2_1.done && (_a = entries_2.return)) _a.call(entries_2);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return result;
}
// assumes that entries are sorted
function spansInRange(start, end, entries) {
    var e_5, _a;
    function clip(span) {
        if (span.start < start && span.end < start) {
            return null;
        }
        else if (span.start > end && span.end > end) {
            return null;
        }
        else {
            return __assign(__assign({}, span), { start: last(span.start, start), end: first(span.end, end) });
        }
    }
    var result = [];
    try {
        for (var _b = __values(spans(entries).map(clip)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var span = _c.value;
            if (span != null)
                result.push(span);
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_5) throw e_5.error; }
    }
    console.log(result);
    return result;
}
export function loadCalendar() {
    var e_6, _a;
    var entries = loadEntries();
    sortEntries(entries);
    for (var i = 0; i < 7; i++) {
        var d = daysAgo(6 - i);
        console.log(renderDay(d));
        $("#headerrow th:nth-child(" + (i + 2) + ")").text(renderDay(d));
        var start = startOfDay(d);
        var end = endOfDay(d);
        try {
            for (var _b = (e_6 = void 0, __values(spansInRange(start, end, entries))), _c = _b.next(); !_c.done; _c = _b.next()) {
                var span = _c.value;
                getDay(i).append(calendarSpanHTML(span, start, end));
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
}
var msPerDay = 86400000;
function calendarSpanHTML(span, start, end) {
    function frac(d) {
        return (d.getTime() - start.getTime()) / (end.getTime() - start.getTime());
    }
    var dates = [span.start, start, span.end, end];
    console.log('dates', dates);
    console.log('getTime()', dates.map(function (x) { return x.getTime(); }));
    var lengthPercent = 100 * (frac(span.end) - frac(span.start));
    var topPercent = 100 * frac(span.start);
    var color = '#00B4FC';
    var style = "top:" + topPercent + "%; height:" + lengthPercent + "%; background:" + color + ";";
    return "<div class='event' style='" + style + "'><div class='spantext'>" + span.entry.name + "</div></div>";
}
function getDay(n) {
    return $("td:nth-child(" + (n + 2) + ")");
}
//# sourceMappingURL=track.js.map