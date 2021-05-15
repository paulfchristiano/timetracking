import e from 'express'
import { Callbacks, data } from 'jquery'
import { InputBox } from './suggester.js'
import { DateSpec, Action } from './parse.js'

interface Entry {
    before?: string,
    after?: string,
    time: Date,
    id: uid,
}

function exampleEntries(): Entry[] {
    const events = ['breakfast', 'party', 'lunch', 'party', 'dinner', 'sleep', 'breakfast']
    const result: Entry[] = []
    for (let i = 0; i < events.length; i++) {
        result.push({time: hoursAgo(events.length - i), before: events[i], id: newUID()})
    }
    return result
}

type Label = string

function* enumfrom<T>(xs:T[], i:number, j:number): Generator<[number, T]> {
    for (let k = i; k < j; k++) yield [k, xs[k]]
}

function calendarSpan(
    label:Label,
    spanStart:Date,
    spanEnd:Date,
    start:Date,
    end:Date,
    profile:Profile,
): JQE {
    function frac(d:Date): number {
        return (d.getTime() - start.getTime()) / (end.getTime() - start.getTime())
    }
    const lengthPercent = 100 * (frac(spanEnd) - frac(spanStart))
    const topPercent = 100 * frac(spanStart)
    const color = getColor(label, profile)
    const style = `top:${topPercent}%; height:${lengthPercent}%; background:${renderColor(color)};`
    const result = $(`<div class='event' style='${style}'><div class='spantext'>${label}</div></div>`)
    return result
}


function labelPopup(label:Label, callback:(update:TimeUpdate) => void): void {
    $('#popup').attr('active', 'true')
    $('#popuplabel').text(label)
    $('#newlabel').empty()
    $('#newlabel').append(inputAfterColon('Rename to', '', s => callback({kind: 'bulkRename', from: label, to: s})))
    $('#movechildren').prop('checked', true)
}

function zoomedPopup(
    entries:Entry[],
    startIndex:number,
    endIndex:number,
    profile:Profile,
    popup: (start:number, end:number) => void,
    callback:(t:TimeUpdate) => void
): void {
    const start:Entry = entries[startIndex]
    const end:Entry = entries[endIndex]
    $('#popup').attr('active', 'true')
    $('#minical').empty()
    $('#priorcal').empty()
    $('#nextcal').empty()
    for (const [a, b] of listPairsAndEnds(enumfrom(entries, startIndex, endIndex+1))) {
        if (a == null && startIndex > 0) {
            const label = labelFrom(entries[startIndex-1], entries[startIndex])
            const style = `background:${renderGradient(getColor(label, profile), true)}; height:100%`
            const e = $(`<div class='event' style='${style}'><div class='spantext'></div></div>`)
            e.click(() => popup(startIndex-1, startIndex))
            $('#priorcal').append(e)
        }
        if (b == null && endIndex + 1 < entries.length) {
            const label = labelFrom(entries[endIndex], entries[endIndex+1])
            const style = `background:${renderGradient(getColor(label, profile), false)}; height:100%`
            const e = $(`<div class='event' style='${style}'><div class='spantext'></div></div>`)
            e.click(() => popup(endIndex, endIndex+1))
            $('#nextcal').append(e)
        }
        if (a!= null && b!=null) {
            const [i, first] = a
            const [j, second] = b
            const elem = calendarSpan(
                labelFrom(first, second),
                first.time, second.time,
                start.time, end.time,
                profile
            )
            elem.click(() => popup(i, j))
            $('#minical').append(elem)
        }
    }
    const input = new InputBox(getDistinctLabels(entries), $('.inputwrapper'))
    input.bind((a, s) => {
        switch (a.kind) {
            case 'raw':
                callback({kind: 'relabel', label: s, before: entries[endIndex-1], after: entries[endIndex]})
                break
            case 'number':
                callback({
                    kind: 'split',
                    before: entries[endIndex-1],
                    after: entries[endIndex],
                    time: minutesAfter(entries[endIndex-1].time, a.number),
                    labelBefore: s
                })
                break
            case 'last':
                callback({
                    kind: 'split',
                    before: entries[endIndex-1],
                    after: entries[endIndex],
                    time: minutesAfter(entries[endIndex].time, -a.minutes),
                    labelAfter: s
                })
                break
            case 'first':
                callback({
                    kind: 'spliceSplit',
                    before: entries[startIndex],
                    time: minutesAfter(entries[startIndex].time, a.minutes),
                    label: s
                })
                break
            case 'until':
                callback({
                    kind: 'split',
                    before: entries[startIndex],
                    after: entries[startIndex+1],
                    time: parseTime(a.time, entries[startIndex].time, 'next'),
                    labelBefore: s
                })
                break
            case 'untilMinutes':
                callback({
                    kind: 'split',
                    before: entries[endIndex-1],
                    after: entries[endIndex],
                    time: minutesAfter(entries[endIndex].time, -a.minutes),
                    labelBefore: s
                })
                break
            case 'after':
                callback({
                    kind: 'split',
                    before: entries[startIndex],
                    after: entries[startIndex+1],
                    time: parseTime(a.time, entries[startIndex].time, 'next'),
                    labelAfter: s
                })
                break
            case 'now':
                break
            default: assertNever(a)
        }
    })
    input.focus()
    $('#starttime').empty()
    $('#starttime').append(inputAfterColon(
        'Start',
        renderTime(start.time),
        s => callback({kind: 'move', time: parseTime(s, start.time), entry: start})
    ))
    $('#endtime').empty()
    $('#endtime').append(inputAfterColon(
        'End',
        renderTime(end.time),
        s => callback({kind: 'move', time: parseTime(s, end.time), entry: end})
    ))
}

function renderDuration(ms:number): string {
    if (ms < 1000) {
        return `${ms}ms`
    }
    const s = Math.floor(ms / 1000)
    if (s < 60) {
        return `${s}s`
    }
    const minutes = Math.round(s / 60)
    if (minutes < 60) {
        return `${minutes}m`
    }
    const h = Math.floor(minutes/60)
    const m = (minutes % 60)
    return `${h}h:${twoDigits(m)}m`
}

function twoDigits(n:number): string {
    const s = `${n}`
    if (s.length == 1) {
        return '0' + s
    } else {
        return s
    }
}

function specToDate(spec:DateSpec, anchor:Date, rel:'next'|'previous'|'closest'): Date {
    const candidate = new Date(anchor)
    candidate.setMinutes(spec.minutes)
    let best:Date = new Date(anchor);
    let bestDiff:number|null = null;
    const month = (spec.month === undefined) ? anchor.getMonth() : spec.month
    candidate.setMonth(month)
    const dateCandidates:number[] = (spec.day === undefined) ? [-1, 0, 1].map(x => anchor.getDate() + x) : [spec.day]
    const ampmCandidates:('am'|'pm')[] = (spec.ampm === undefined) ? ['am', 'pm'] : [spec.ampm]
    const hourCandidates:number[] = ampmCandidates.map(x => (x == 'am') ? spec.hours : (spec.hours+12)%24)
    for (const date of dateCandidates) {
        for (const hours of hourCandidates) {
            candidate.setDate(date)
            candidate.setHours(hours)
            const diff = candidate.getTime() - anchor.getTime()
            const absDiff = Math.abs(diff)
            const isValid = (rel=='closest') || (rel == 'next' && diff > 0) || (rel == 'previous' && diff < 0)
            if ((bestDiff == null || absDiff < bestDiff) && isValid) {
                best = new Date(candidate)
                bestDiff = absDiff
            }
        }
    }
    return best
}

export function loadTracker(): void {
    const profile:Profile = emptyProfile()
    let entries:Entry[] = loadEntries()
    sortEntries(entries)
    let focused:Entry|null = null;
    function callback(update:TimeUpdate) {
        [entries, []] = applyUpdate(update, entries, [])
        saveEntries(entries)
        render()
    }
    function startInput(elem:JQE, start:Entry, end:Entry|null): void {
        $('.inputwrapper').empty()
        const x = new InputBox(getDistinctLabels(entries), elem)
        x.focus()
        if (end == null) {
            x.bind((a, s) => {
                switch (a.kind) {
                    case 'raw':
                        callback({kind: 'append', before: (s.length == 0) ? undefined : s, time: new Date()})
                        break
                    //TODO: handle weird cases
                    case 'first':
                        callback({kind: 'spliceSplit', label: s, before: start, time: minutesAfter(start.time, a.minutes)})
                        break
                    case 'last':
                        callback({kind: 'composite', updates: [
                            {kind: 'append', time: minutesAfter(new Date(), -a.minutes), after:s},
                            {kind: 'append', time:new Date(), before:s}
                        ]})
                        break
                    case 'number':
                        callback({kind: 'append', before: s, time: minutesAfter(start.time, a.number)})
                        break
                    case 'now':
                        callback({kind: 'relabel', label: s, before:start})
                        break
                    case 'until':
                        callback({kind: 'spliceSplit', label: s, before: start, time: parseTime(a.time, start.time, 'next')})
                        break
                    case 'untilMinutes':
                        callback({kind: 'spliceSplit', label: s, before: start, time: minutesAfter(new Date(), -a.minutes)})
                        break    
                    case 'after':
                        callback({kind: 'append', after: s, time: parseTime(a.time, new Date(), 'last')})
                        break
                    default: assertNever(a)
                }
            })
        } else {
            x.bind((a, s) => {
                switch (a.kind) {
                    case 'raw':
                        callback({kind: 'relabel', label: s, before: start, after: end})
                        break
                    case 'first':
                        callback({kind: 'spliceSplit', label: s, before: start, time: minutesAfter(start.time, a.minutes)})
                        break
                    case 'now':
                        break
                    case 'number':
                        callback({kind: 'split', labelBefore: s, before: start, after: end, time: minutesAfter(start.time, a.number)})
                        break
                    case 'last':
                        callback({kind: 'split', labelAfter: s, before: start, after: end, time: minutesAfter(end.time, -a.minutes)})
                        break
                    case 'until':
                        callback({kind: 'spliceSplit', label: s, before: start, time: parseTime(a.time, start.time, 'next')})
                        break
                    case 'untilMinutes':
                        callback({kind: 'spliceSplit', label: s, before: start, time: minutesAfter(end.time, -a.minutes)})
                        break
                    case 'after':
                        callback({kind: 'split', labelAfter: s, before: start, after: end, time: parseTime(a.time, start.time, 'next')})
                        break
                    default: assertNever(a)
                }
            })
        }
    }
    let heartbeats:[Date, JQE][] = []
    function setTimer(start:Date, elem:JQE): void {
        const diff = new Date().getTime() - start.getTime()
        if (diff > 1000)
            elem.text(renderDuration(new Date().getTime() - start.getTime()))
    }
    setInterval(function() {
        for (const [start, elem] of heartbeats) {
            setTimer(start, elem)
        }
    }, 1000)
    function render() {
        heartbeats = []
        const elem = $('#inputs')
        elem.html('')
        for (const [end, start] of listPairsAndEnds(revit(entries))) {
            //end = entries[i]
            if (end == null) {
                const row = $(`<div class='trackertimerow'></div>`)
                row.append('<div class="nowdot"></div>')
                row.append($(`<div class='timelabel'></div>`))
                elem.append(row)
            } else {
                /*
                const e = $(`<span class='clickable'>[${renderTime(end.time)}]</span>`)
                const f = $('<div></div>')
                f.append(e)
                elem.append(f)
                */
                const row = $(`<div class='trackertimerow'></div>`)
                row.append('<div class="dot"></div>')
                const time = $(`<div class='timelabel' contenteditable='true'>${renderTime(end.time)}</div>`)
                time.blur(function() {
                    time.text(renderTime(end.time))
                })
                time.keydown(function(e) {
                    if (e.keyCode == 13) {
                        e.preventDefault()
                        callback({kind: 'move', entry: end, time: parseTime(time.text(), end.time)})
                    }
                })
                row.append(time)
                elem.append(row)
            }
            //TODO unify these two cases
            if (start != null && end != null) {
                const label = labelFrom(start, end)
                const style = `background: ${renderColor(getColor(label, profile))}; float: left`
                const row = $(`<div class='trackerrow'></div>`)
                const text = $(`<div class='trackerlabel'></div>`)
                text.append($(`<div>${renderLabel(label)}</div>`))
                text.append($(`<div>${renderDuration(end.time.getTime() - start.time.getTime())}</div>`))
                const e = $(`<div class="line" style='${style}''></div>`)
                row.append(e)
                row.append(text)
                const inputBuffer = $(`<div class='inputbuffer'></div>`)
                const inputWrapper = $(`<div class='inputwrapper'></div>`)
                inputBuffer.append(inputWrapper)
                row.append(inputBuffer)
                text.click(() => {
                    startInput(inputWrapper, start, end)
                    focused = end;
                })
                elem.append(row)
                if (focused == end) startInput(inputWrapper, start, end)
            }
            if (start != null && end == null) {
                const label = start.after || 'TBD'
                const style = `background: gray; float: left`
                const row = $(`<div class='trackerrow'></div>`)
                const text = $(`<div class='trackerlabel'></div>`)
                text.append($(`<div>${renderLabel(label)}</div>`))
                const timer = $(`<div id='runningtimer'></div>`)
                setTimer(start.time, timer)
                text.append(timer)
                heartbeats.push([start.time, timer])
                const e = $(`<div class="line" style='${style}''></div>`)
                row.append(e)
                row.append(text)
                const inputBuffer = $(`<div class='inputbuffer'></div>`)
                const inputWrapper = $(`<div class='inputwrapper'></div>`)
                inputBuffer.append(inputWrapper)
                row.append(inputBuffer)
                text.click(() => {
                    startInput(inputWrapper, start, end)
                    focused = end;
                })
                elem.append(row)
                if (focused == null) startInput(inputWrapper, start, end)
            }
        }
    }
    function addEntry(s:string) {
        entries.push({before: s, time: now(), id: newUID()})
        saveEntries(entries)
        render()
    }
    render()
}

function emptyProfile(): Profile {
    return {colors: new Map()}
}

export function loadChart() {
    renderChart(loadEntries(), emptyProfile())
}

function renderChart(entries:Entry[], profile:Profile){
    const timings:Map<string, number> = getTotalTime(entries, entries[0].time, entries[entries.length - 1].time)
    const datapoints:{y: number, label: string, color:string}[] = []
    for (const [k, v] of timings) {
        datapoints.push({label: k, y: v / 3600, color: renderColor(getColor(k, profile))})
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

interface Bucket {
    name: string,
    start: Date,
    end: Date,
}

function secondsBetween(a:Date, b:Date): number {
    return (b.getTime() - a.getTime()) / 1000
}

function length(span:Span): number {
    return secondsBetween(span.start.time, span.end.time)
}

function renderBars(entries:Entry[], buckets:Bucket[], profile:Profile) {
    const seconds:Map<string, number>[] = []
    for (const bucket of buckets) {
        const spans = spansInRange(bucket.start, bucket.end, entries)
        seconds.push(sumByName(spans.map(span => [span.label, length(span)])))
    }
    const keys:Set<string> = new Set()
    for (const m of seconds) {
        for (const k of m) {
            keys.add(k[0])
        }
    }
    const data:any[] = []
    for (const k of keys) {
        data.push({
            type: "stackedColumn",
            showInLegend: false,
            color: getColor(k, profile),
            name: k,
            dataPoints: seconds.map((m, i) => ({
                y: (m.get(k) || 0) / 3600,
                x: i,
            }))
        })
    }
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: false,
        title: {},
        toolTip: {
            shared: false,
            contentFormatter: e => {
                return `${e.entries[0].dataSeries.name}: ${e.entries[0].dataPoint.y?.toFixed(2)}`
            },
            content: '{name}: {y} '
        },
        axisX: {
            interval: 1,
            labelFormatter: e => (e.value >= 0) ? buckets[e.value].name : '???'
        },
        axisY: {
            valueFormatString: "#0h",
        },
        data: data
    })
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
    chart.render()
}

export function loadBars() {
    const entries = loadEntries()
    const buckets = weeklyBuckets()
    renderBars(entries, buckets, emptyProfile())
}

function weeklyBuckets(): Bucket[] {
    const result:Bucket[] = []
    for (let i = 0; i < 7; i++) {
        const d = daysAgo(6-i)
        const start = startOfDay(d)
        const end = endOfDay(d)
        result.push({name: renderDay(d), start: start, end: end})
    }
    return result
}

function incrementMap<T>(map:Map<T, number>, x:T, dy:number): void {
    const y = map.get(x)
    map.set(x, (y||0)+dy)
}

function getTotalTime(entries:Entry[], start:Date, end:Date): Map<string, number> {
    const result:Map<string, number> = new Map()
    const spans:Span[] = spansInRange(start, end, entries)
    for (const span of spans) {
        const seconds = (span.start.time.getTime() - span.end.time.getTime()) / 1000
        incrementMap(result, span.label, seconds)
    }
    return result
}

function sumByName(data:[string, number][]): Map<string, number> {
    const result:Map<string, number> = new Map()
    for (const datum of data) {
        incrementMap(result, datum[0], datum[1])
    }
    return result
}

function hoursAgo(n:number): Date {
    const result = now()
    result.setHours(result.getHours() - n)
    return result
}

function daysAgo(n:number): Date {
    const result = now()
    result.setDate(result.getDate() - n)
    return result
}

function renderLabel(label:Label): string {
    if (label.length > 0 && label[0] == '?') {
        return `<span class='errorlabel'>${label}</span>`
    }
    const parts = label.split('/')
    if (parts.length == 1) return label
    const prefix = parts.slice(0, parts.length-1).join('/')
    const suffix = parts[parts.length-1]
    return `${suffix} <span class='categorylabel'>(${prefix})</span>` 
}

function* namesFrom(label:Label|undefined): Generator<Label> {
    if (label === undefined) return
    const parts = label.split('/')
    for (let i = 0; i < parts.length; i++) {
        yield parts.slice(0,i+1).join('/')
    }
}

function getDistinctLabels(entries:Entry[]): Label[] {
    const s:Set<string> = new Set()
    for (const entry of entries) {
        for (const name of namesFrom(entry.before)) {
            s.add(name)
        }
        for (const name of namesFrom(entry.after)) {
            s.add(name)
        }
    }
    return Array.from(s.keys())
}

function uniques<T>(xs:T[]): T[] {
    return [...new Set(xs)]
}

function now(): Date {
    return new Date()
}

interface MyDate {
    year: number,
    month: string,
    day: number,
    ampm: 'am' | 'pm',
    hour: number,
    minute: number
}

function convertDate(d:Date): MyDate {
    return {
        year: d.getFullYear(),
        month: d.toLocaleString('default', {month: 'short'}),
        day: d.getDate(),
        hour: (d.getHours() + 11) % 12 + 1,
        ampm: d.getHours() < 12 ? 'am' : 'pm',
        minute: (d.getMinutes())
    }
}

/*
function roundDate(partial:Partial<MyDate>, d:Date, rel:'next'|'last'|'closest'='cloest'): Date {
    const years: number[] = (partial.year === undefined) ? neighbors(d.getFullYear()) : [partial.year]
    const months
}
*/

function renderTime(date:Date): string {
    const now = convertDate(new Date())
    const myDate = convertDate(date)
    function renderTime(d:MyDate) {
        return `${d.hour}:${twoDigits(d.minute)}`
    }
    function renderAMPM(d:MyDate) {
        return `${renderTime(d)} ${(d.ampm == 'am') ? 'AM' : 'PM'}`
    }
    function renderDay(d:MyDate) {
        return `${renderAMPM(d)}, ${d.month} ${d.day}`
    }
    function renderYear(d:MyDate) {
        return `${renderDay(d)}, ${d.year}`
    }
    if (now.year != myDate.year) return renderYear(myDate)
    else if (now.month != myDate.month || now.day != myDate.day) return renderDay(myDate)
    else if (now.ampm != myDate.ampm || myDate.hour == 12) return renderAMPM(myDate)
    else return renderTime(myDate)
}

function saveEntries(entries:Entry[]) {
    localStorage.setItem('entries', serializeEntries(entries))
}

function serializeEntries(entries:Entry[]): string {
    return JSON.stringify(entries.map(x => ({time: x.time.getTime(), before: x.before, after: x.after})))
}

function deserializeEntries(s:string): Entry[] {
    const json = (JSON.parse(s) as {time:number, before:string|undefined, after:string|undefined, id:uid}[])
    return json.map(x => ({time: new Date(x.time), before:x.before, after:x.after, id: x.id || newUID()}))
}

function loadEntries(): Entry[] {
    const s:string|null = localStorage.getItem('entries')
    if (s == '' || s == null) return []
    return deserializeEntries(s)
}

function renderDay(d:Date): string {
    return d.toLocaleDateString("en-US", {day: 'numeric', weekday: 'short', month: 'short'})
}

function sortEntries(entries:Entry[]): void {
    entries.sort((a, b) => a.time.getTime() - b.time.getTime())
}

function startOfDay(d:Date): Date {
    const result = new Date(d)
    result.setHours(0, 0, 0, 0)
    return result
}

function endOfDay(d:Date): Date {
    const result = new Date(d)
    result.setHours(23, 59, 59, 999)
    return result
}

interface Span {
    start: Entry,
    label: string,
    end: Entry,
}

function first(a:Date, b:Date): Date {
    return (a < b) ? a : b
}

function last(a:Date, b:Date): Date {
    return (a > b) ? a : b
}

function mid(a:Date, b:Date): Date {
    return new Date((a.getTime() + b.getTime())/2)
}

function minutesAfter(a:Date, n:number): Date {
    const result = new Date(a)
    result.setMinutes(result.getMinutes() + n)
    return result
}

function applyToTriples<X, Y>(f:(a:X|undefined, b:X, c:X|undefined) => Y|null, xs:X[]): Y[] {
    let a:X|undefined = undefined
    let b:X|undefined = undefined
    let c:X|undefined = undefined
    const result:Y[] = [];
    function addIf(a:X|undefined, b:X, c:X|undefined) {
        const y = f(a, b, c)
        if (y != null) result.push(y)
    }
    for (const x of xs) {
        a = b
        b = c
        c = x
        if (b != undefined) { addIf(a, b, c) }
    }
    addIf(xs[xs.length-2], xs[xs.length-1], undefined)
    return result
}

function labelFrom(a:Entry, b:Entry): string {
    if (a.after === undefined && b.before === undefined) return '?unlabeled'
    if (a.after === undefined) {
        if (b.before === undefined) return '?unlabeled'
        return b.before
    } else {
        if (b.before === undefined) return a.after
        if (b.before !== a.after) return `?conflict-${a.after}-${b.before}`
        return a.after 
    }
}

// assumes that entries are sorted
function spansFromEntries(entries:Entry[]): Span[] {
    const result = applyToTriples((a:Entry|undefined, b:Entry, c:Entry|undefined) => {
        if (a != undefined) {
            return {
                start: a,
                end: b,
                label: labelFrom(a, b),
                uid: newUID(),
            }
        } else {
            return null
        }
    }, entries)
    return result
}

// assumes that entries are sorted
function spansInRange(start:Date, end:Date, entries:Entry[]): Span[] {
    function clip(span:Span): Span|null {
        if (span.start.time < start && span.end.time < start) {
            return null
        } else if (span.start.time > end && span.end.time > end) {
            return null
        } else {
            return {...span, start: span.start, end: span.end}
        }
    }
    const result:Span[] = []
    for (const span of spansFromEntries(entries).map(clip)) {
        if (span != null) result.push(span)
    }
    return result
}

interface CalendarDay {
    start: Date,
    end: Date,
    index: number,
}

function partInDay(start:Date, stop:Date, day:CalendarDay): null|{start:Date, end:Date} {
    if (stop < day.start) return null
    else if (start > day.end) return null
    return {
        start: last(day.start, start),
        end: first(day.end, stop)
    } 
}

type Indices = Array<number|null>

function hideCalPopup(): void {
    $('#minical').empty()
    $('#nextcal').empty()
    $('#priorcal').empty()
    $('#popup').attr('active', 'false')
}

function hideLabelPopup(): void {
    $('#popup').attr('active', 'false')
}

function saveProfile(profile:Profile): void {
    localStorage.setItem('profile', serializeProfile(profile))
}

function loadProfile(): Profile {
    const s:string|null = localStorage.getItem('profile')
    if (s == '' || s == null) return emptyProfile()
    return deserializeProfile(s)
}

export function loadLabels() {
    const entries = loadEntries()
    showLabels(entries)
    $('#labels').click(hideLabelPopup)
}

function showLabels(entries:Entry[]) {
    const labels:Label[] = getDistinctLabels(entries)
    const profile = loadProfile()
    labels.sort()
    function callback(update:TimeUpdate) {
        entries = applyUpdate(update, entries, [])[0]
        showLabels(entries)
        saveEntries(entries)
    }
    function makeLabelDiv(label:Label): JQE {
        const colorHex = colorToHex(getColor(label, profile))
        const l = $(`<span>${label}</span>`)
        const result = $(`<div class='label'></div>`)
        result.append(l)
        l.click(function(e) {
            e.stopPropagation()
            labelPopup(label, callback)
        })
        const picker = $(`<input type='color' id='${label}-color' class='colorpicker' value='${colorHex}'></input>`)
        result.append(picker)
        picker.change(function() {
            profile.colors.set(label, colorFromHex((picker.val() as string)))
            saveProfile(profile)
        })
        return result
    }
    const main = $('#labels')
    main.empty()
    for (const label of labels) {
        main.append(makeLabelDiv(label))
    }
}

export function loadCalendar() {
    $('#calendardiv').click((e) => {
        hideCalPopup()
    })
    let entries = loadEntries()
    sortEntries(entries)
    function callback(t:TimeUpdate, indices:Indices): [Entry[], Indices] {
        [entries, indices] = applyUpdate(t, entries, indices)
        saveEntries(entries)
        return [entries, indices]
    }
    showCalendar(entries, null, emptyProfile(), callback)
}

function showCalendar(
    entries:Entry[],
    initialPopup: [number, number]|null,
    profile:Profile,
    callback: (t:TimeUpdate, indices:Indices) => [Entry[], Indices]
): void {
    const days:CalendarDay[] = []
    for (let i = 0; i < 7; i++) {
        const d = daysAgo(6-i)
        $(`#headerrow th:nth-child(${i+2})`).text(renderDay(d))
        days.push({start: startOfDay(d), end: endOfDay(d), index: i})
    }
    //Called from within a popup when an edit occurs
    //(So needs to redraw the popup)
    function popupCallback(startIndex:number|null, endIndex:number|null) {
        function f(t:TimeUpdate) {
            [entries, [startIndex, endIndex]] = callback(t, [startIndex, endIndex])
            const initialPopup:null|[number, number] = 
                (startIndex == null || endIndex == null) ? null
                : [startIndex, endIndex]
            showCalendar(entries, initialPopup, profile, callback)
        }
        return f
    }
    function popup(startIndex:number, endIndex:number) {
        zoomedPopup(
            entries, startIndex, endIndex,
            profile,
            popup,
            popupCallback(startIndex, endIndex)
        )
    }
    for (const day of days) {
        getCalendarColumn(day.index).empty()
    }
    for (const [[i, start], [j, end]] of listPairs(enumerate(it(entries)))) {
        for (const day of days) {
            const range = partInDay(start.time, end.time, day)
            if (range !== null) {
                const e = calendarSpan(labelFrom(start, end),
                    range.start, range.end,
                    day.start, day.end,
                    profile
                )
                e.click((e) => {
                    popup(i, j)
                    e.stopPropagation()
                })
                getCalendarColumn(day.index).append(e)
            }
        }
    }
    if (initialPopup != null) popup(initialPopup[0], initialPopup[1])
}


type View = Map<string, {color?: Color, expand?: View}>

function split(name:string): [string, string|null] {
    const n = name.indexOf('/')
    if (n == 0) return [name, null]
    else return [name.slice(0, n), name.slice(n+1, 0)]
}

function group(name: string, view:View): string|null {
    const [start, rest] = split(name)
    const v = view.get(start)
    if (v == undefined) return null
    if (v.expand == undefined || rest == null) return start 
    return `${start}/${group(rest, v.expand)}`
}

interface Profile {
    colors: Map<Label, Color>
}

function serializeProfile(profile:Profile): string {
    const parts = []
    for (const [label, color] of profile.colors.entries()) {
        parts.push(`${label},${colorToHex(color)}`)
    }
    return parts.join(';')
}

function deserializeProfile(s:string): Profile {
    const result = emptyProfile()
    for (const pair of s.split(';')) {
        const parts = pair.split(',')
        if (parts.length != 2) {
            console.log('Bad part')
        }
        result.colors.set(parts[0], colorFromHex(parts[1]))
    }
    return result
}

//Random integetr between 1 and n-1
function randInt(n:number): number {
    return Math.floor(n * Math.random())
}

export function loadColors() {
    const e = $(`<input type='color' id='colorpicker'></input>`)
    const button = $(`<div>Done!</div>`)
    $('#main').append(e)
    $('#main').append(button)
    button.click(function() {
        console.log(e.val())
    })
}

const colors = ['#fc6472', '#f4b2a6', '#eccdb3', '#bcefd0', '#a1e8e4', '#23c8b2', '#c3ecee']

function randomColor() {
    return colorFromHex(colors[randInt(colors.length)])
    /*
    return {
        r: randInt(256),
        g: randInt(256),
        b: randInt(256),
    }
    */
}

export function colorToHex(c:Color) {
    return `#${c.r.toString(16).padStart(2, "0")}${c.g.toString(16).padStart(2, "0")}${c.b.toString(16).padStart(2, "0")}`
}

export function colorFromHex(hex:string){
    if (hex[0] == '#') {
        hex = hex.slice(1)
    }
    return {r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4,6), 16)}
}

interface Color {
    r: number,
    g: number,
    b: number,
}



function getColor(label:Label, profile:Profile): Color {
    let result = profile.colors.get(label)
    if (result == undefined) {
        result = randomColor()
        profile.colors.set(label, result)
        return result
    }
    return result
}

function renderColor(color:Color, alpha=1): string {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`
}

function renderGradient(color:Color, transparentTop:boolean): string {
    const angle = (transparentTop) ? '180deg' : '0deg'
    return `linear-gradient(${angle}, ${renderColor(color, 0)} 0%, ${renderColor(color, 1)} 100%)`
}

/*
function nameToColor(str:string): Color {
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
*/


type JQE = JQuery<HTMLElement>

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

function makeInput(initial:string, callback:(s:string) => void): JQE {
    const elem:JQE = $(`<input></input>`)
    elem.val(initial)
    elem.keyup(e => {
        if (e.keyCode == 13) {
            callback(elem.val() as string)
            elem.blur()
            e.preventDefault()
        }
    })
    return elem
}

function inputAfterColon(head: string, initial: string, callback: (s:string) => void): JQE {
    const elem:JQE = $(`<div>${head}:</div>`)
    elem.append(makeInput(initial, callback))
    return elem
}

type uid = string

function newUID(): uid {
    return Math.random().toString(36).substring(2, 10)
}

type IDed = {
    id: uid,
}

function assertNever(value: never): never {
    throw new Error("Shouldn't reach this case!")
}

type TimeUpdate = {kind: 'relabel', before?: Entry, after?: Entry, label: Label}
    | {kind: 'split', before: Entry, after: Entry, time: Date, labelBefore?: Label, labelAfter?:Label}
    | {kind: 'merge', entry: Entry, label: string}
    | {kind: 'move', entry: Entry, time: Date}
    | {kind: 'composite', updates: TimeUpdate[]}
    | {kind: 'append', before?: Label, after?:Label, time: Date}
    //add new_entry after update.before; new_entry.after = update.before.after; new_entry.before = label; update.before.after = update.label;
    | {kind: 'spliceSplit', before: Entry, label: Label, time: Date} 
    | {kind: 'bulkRename', from: Label, to:Label}


function insertAt<T>(toInsert:T, xs:T[], index:number): T[] {
    return xs.slice(0, index).concat([toInsert]).concat(xs.slice(index))
}

function applyTo<T extends IDed>(f:(x:T) => T, xs:T[], x:T): T[] {
    return xs.map(y => (x.id == y.id) ? f(y) : y)
}

function remove<T extends IDed>(x:T, xs:T[]): T[] {
    return xs.filter(y => y.id != x.id)
}

function insertBetween<T extends IDed>(x:T, xs:T[], a:T, b:T):T[] {
    for (let i = 0; i < xs.length-1; i++) {
        if (xs[i].id == a.id && xs[i+1].id == b.id) {
            return insertAt(x, xs, i+1)
        }
    }
    return xs
}

function removeIndex<T>(xs:T[], n:number): T[] {
    return xs.slice(0, n).concat(xs.slice(n+1))
}

function neighbors<T extends IDed>(xs:T[], x:T): [T|null, T|null] {
    for (let i = 0; i < xs.length; i++) {
        if (xs[i].id == x.id) {
            return [
                (i == 0) ? null : xs[i-1],
                (i == xs.length-1) ? null : xs[i+1]
            ]
        }
    }
    return [null, null]
}

function find<T extends IDed>(xs:T[], x:T) {
    for (let i = 0; i < xs.length; i++) {
        if (xs[i].id == x.id) return i
    }
    return null
}


//TODO: I think I want this to be the only place that mutates a span or entry?
//TODO: I want to somehow block the user from moving time past another entry
//(But at any rate I'll need to figure out how to resolve such conflicts in the DB...)
function applyUpdate(
    update:TimeUpdate,
    entries:Entry[],
    indices:Indices,
): [Entry[], Indices] {
    switch (update.kind) {
        case 'composite':
            for (const u of update.updates) {
                [entries, indices] = applyUpdate(u, entries, indices)
            }
            break
        case 'relabel':
            if (update.before !== undefined) {
                entries = applyTo(
                    entry => ({...entry, after: update.label}),
                    entries,
                    update.before
                )
            }
            if (update.after !== undefined) {
                entries = applyTo(
                    entry => ({...entry, before: update.label}),
                    entries,
                    update.after
                )
            }
            break
        case 'split': 
            const newEntry:Entry = {
                time: update.time,
                before: update.labelBefore || update.before.after || update.after.before,
                after: update.labelAfter || update.after.before || update.before.after,
                id: newUID()
            }
            const index = find(entries, update.before)
            if (index != null) {
                entries = insertAt(newEntry, entries, index+1)
                indices = indices.map(x => (x == null) ? null : (x > index) ? x+1 : x)
            }
            if (update.labelBefore !== undefined) {
                entries = applyTo(entry => ({...entry, after: update.labelBefore}), entries, update.before)
            } if (update.labelAfter !== undefined) {
                entries = applyTo(entry => ({...entry, before: update.labelAfter}), entries, update.after)
            }
            break
        case 'merge': {
            const [a, b] = neighbors(entries, update.entry)
            if (a != null) a.after = update.label
            if (b != null) b.before = update.label
            const index = find(entries, update.entry)
            if (index != null) {
                entries = removeIndex(entries, index)
                indices = indices.map(x => (x == null || x == index) ? null : (x > index) ? x - 1 : x)
            }
            break
        }
        case 'move':
            entries = applyTo(
                entry => ({...entry, time: update.time}),
                entries,
                update.entry
            )
            break
        case 'append': {
            const newEntry:Entry = {
                time: update.time,
                before: update.before,
                after: update.after,
                id: newUID()
            }
            entries = entries.concat([newEntry])
            break
        }
        case 'spliceSplit': {
            const newEntry:Entry = {
                time: update.time,
                after: update.before.after,
                before: update.label,
                id: newUID()
            }
            entries = applyTo(
                entry => ({...entry, after: update.label}),
                entries,
                update.before
            )
            const index = find(entries, update.before)
            if (index != null) {
                entries = insertAt(newEntry, entries, index+1)
                indices = indices.map(x => (x == null) ? null : (x > index) ? x+1 : x)
            }
            break
        }
        case 'bulkRename':
            entries = entries.map(entry => ({...entry,
                before: remapLabel(entry.before, update.from, update.to),
                after: remapLabel(entry.after, update.from, update.to)
            }))
            break
        default: assertNever(update)
    }
    return [entries, indices]
}

function remapLabel(label:Label|undefined, from:Label, to:Label): Label|undefined {
    if (label === undefined) return undefined
    if (label.slice(0, from.length) === from) {
        return to + label.slice(from.length)
    }
    return label
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

function* listPairsAndEnds<T>(xs:Generator<T>): Generator<[T|null, T|null]> {
    let a:T|null = null;
    let b:T|null = null;
    for (const x of xs) {
        a = b
        b = x
        yield [a, b]
    }
    if (b != null) yield [b, null]
}

function* listPairs<T>(xs:Generator<T>): Generator<[T, T]> {
    for (const [x, y] of listPairsAndEnds(xs)) {
        if (x != null && y != null) yield [x, y]
    }
}

function* enumerate<T>(xs:Generator<T>): Generator<[number, T]> {
    let i = 0;
    for (const x of xs) {
        yield [i, x]
        i += 1
    }
}

function* it<T>(xs:T[]): Generator<T> {
    for (let i = 0; i<xs.length; i++) {
        yield xs[i]
    }
}
function* revit<T>(xs:T[]): Generator<T> {
    for (let i = xs.length-1; i>=0; i--) {
        yield xs[i]
    }
}

//Returns the same set of elements, but with booleans flagging first and last
function* markTails<T>(xs:Generator<T>): Generator<[boolean, boolean, T]> {
    let first = true;
    let next:T;
    const start = xs.next()
    if (start.done) {
        return
    } else {
        next = start.value
    }
    for (const x of xs) {
        yield [first, false, next]
        next = x
        first = false
    }
    yield [first, true, next]
}

function getCalendarColumn(n:number): any {
    return $(`td:nth-child(${n+2})`)
}
