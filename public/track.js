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
    console.log(datapoints);
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
    return secondsBetween(span.start, span.end);
}
function renderBars(entries, buckets) {
    var e_3, _a, e_4, _b, e_5, _c, e_6, _d;
    var seconds = [];
    try {
        for (var buckets_1 = __values(buckets), buckets_1_1 = buckets_1.next(); !buckets_1_1.done; buckets_1_1 = buckets_1.next()) {
            var bucket = buckets_1_1.value;
            var spans_1 = spansInRange(bucket.start, bucket.end, entries);
            seconds.push(sumByName(spans_1.map(function (span) { return [span.entry.name, length(span)]; })));
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
function getTotalTime(entries) {
    var e_7, _a;
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
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
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
    var e_9, _a;
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
    catch (e_9_1) { e_9 = { error: e_9_1 }; }
    finally {
        try {
            if (entries_2_1 && !entries_2_1.done && (_a = entries_2.return)) _a.call(entries_2);
        }
        finally { if (e_9) throw e_9.error; }
    }
    return result;
}
// assumes that entries are sorted
function spansInRange(start, end, entries) {
    var e_10, _a;
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
    catch (e_10_1) { e_10 = { error: e_10_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_10) throw e_10.error; }
    }
    return result;
}
export function loadCalendar() {
    var e_11, _a;
    var entries = loadEntries();
    sortEntries(entries);
    for (var i = 0; i < 7; i++) {
        var d = daysAgo(6 - i);
        console.log(renderDay(d));
        $("#headerrow th:nth-child(" + (i + 2) + ")").text(renderDay(d));
        var start = startOfDay(d);
        var end = endOfDay(d);
        try {
            for (var _b = (e_11 = void 0, __values(spansInRange(start, end, entries))), _c = _b.next(); !_c.done; _c = _b.next()) {
                var span = _c.value;
                getDay(i).append(calendarSpanHTML(span, start, end));
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_11) throw e_11.error; }
        }
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
function calendarSpanHTML(span, start, end) {
    function frac(d) {
        return (d.getTime() - start.getTime()) / (end.getTime() - start.getTime());
    }
    var dates = [span.start, start, span.end, end];
    console.log('dates', dates);
    console.log('getTime()', dates.map(function (x) { return x.getTime(); }));
    var lengthPercent = 100 * (frac(span.end) - frac(span.start));
    var topPercent = 100 * frac(span.start);
    var color = nameToColor(span.entry.name);
    var style = "top:" + topPercent + "%; height:" + lengthPercent + "%; background:" + color + ";";
    return "<div class='event' style='" + style + "'><div class='spantext'>" + span.entry.name + "</div></div>";
}
function getDay(n) {
    return $("td:nth-child(" + (n + 2) + ")");
}
//# sourceMappingURL=track.js.map