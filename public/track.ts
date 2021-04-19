import e from 'express'
import { data } from 'jquery'
import { InputBox } from './suggester.js'

interface Entry {
    before?: string,
    after?: string,
    time: Date,
    uid: uid,
}

function exampleEntries(): Entry[] {
    const events = ['breakfast', 'party', 'lunch', 'party', 'dinner', 'sleep', 'breakfast']
    const result: Entry[] = []
    for (let i = 0; i < events.length; i++) {
        result.push({time: hoursAgo(events.length - i), before: events[i], uid: newUID()})
    }
    return result
}

export function load(): void {
    const entries:Entry[] = loadEntries()
    if (entries.length == 0) for (const entry of exampleEntries()) entries.push(entry) 
    const x = new InputBox(getNames(entries), $('#trackerdiv'))
    function render() {
        const elem = $('#inputs')
        const options = $('#options')
        elem.html('')
        options.html('')
        for (let i = entries.length - 1; i >=0; i--) {
            const entry = entries[i]
            elem.append(`<div>[${renderTime(entry.time)}]</div><div>${entry.before}</div>`)
        }
    }
    function addEntry(s:string) {
        entries.push({before: s, time: now(), uid: newUID()})
        saveEntries(entries)
        x.setUniverse(getNames(entries))
        render()
    }
    render()
    x.bind(addEntry)
}

export function loadChart() {
    renderChart(loadEntries())
}

function renderChart(entries:Entry[]){
    const timings:Map<string, number> = getTotalTime(entries, entries[0].time, entries[entries.length - 1].time)
    const datapoints:{y: number, label: string, color:Color}[] = []
    for (const [k, v] of timings) {
        datapoints.push({label: k, y: v / 3600, color: nameToColor(k)})
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

function renderBars(entries:Entry[], buckets:Bucket[]) {
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
            color: nameToColor(k),
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
    renderBars(entries, buckets)
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

function getNames(entries:Entry[]): string[] {
    const s:Set<string> = new Set()
    for (const entry of entries) {
        if (entry.before !== undefined) s.add(entry.before)
        if (entry.after !== undefined) s.add(entry.after)
    }
    return Array.from(s.keys())
}

function uniques<T>(xs:T[]): T[] {
    return [...new Set(xs)]
}

function now(): Date {
    return new Date()
}

function renderTime(d:Date): string {
    return d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false })
}
//TODO: takes as input a date and a string
//parses the string as the nearest reasonable date
function parseTime(s:string, d:Date): Date {
    const result = new Date(d)
    const parts = s.split(':').map(s => parseInt(s.trim()))
    if (parts.length == 2 && parts.filter(x => x == parseInt('!'))) {
        result.setHours(parts[0])
        result.setMinutes(parts[1])
    }
    return result
}

function saveEntries(entries:Entry[]) {
    localStorage.setItem('entries', serializeEntries(entries))
}

function serializeEntries(entries:Entry[]): string {
    return JSON.stringify(entries.map(x => ({time: x.time.getTime(), before: x.before, after: x.after})))
}

function deserializeEntries(s:string): Entry[] {
    const json = (JSON.parse(s) as {time:number, before:string|undefined, after:string|undefined, uid:uid}[])
    return json.map(x => ({time: new Date(x.time), before:x.before, after:x.after, uid: x.uid || newUID()}))
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
    uid: uid,
    prior?: Span,
    next?: Span,
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

function linkSpans(spans:Span[]): void {
    applyToTriples(
        (a, b, c) => {
            b.prior = a
            b.next = c
            return null
        }, spans
    )
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
    linkSpans(result)
    return result
}

interface CalendarDay {
    start: Date,
    end: Date,
    index: number,
}

function spanInDay(span:Span, day:CalendarDay): null|{start:Date, stop:Date} {
    if (span.end.time < day.start) return null
    else if (span.start.time > day.end) return null
    return {
        start: last(day.start, span.start.time),
        stop: first(day.end, span.end.time)
    } 
}

export function loadCalendar() {
    let entries = loadEntries()
    sortEntries(entries)
    let spans = spansFromEntries(entries)
    linkSpans(spans)
    function callback(t:TimeUpdate, otherSpans:Span[][]): Span[][] {
        [entries, spans, otherSpans] = applyUpdate(t, entries, spans, otherSpans)
        showCalendar(spans, callback)
        saveEntries(entries)
        return otherSpans
    }
    showCalendar(spans, callback)
}

function showCalendar(spans:Span[], callback: (t:TimeUpdate, o:Span[][]) => Span[][]): void {
    const days:CalendarDay[] = []
    for (let i = 0; i < 7; i++) {
        const d = daysAgo(6-i)
        $(`#headerrow th:nth-child(${i+2})`).text(renderDay(d))
        days.push({start: startOfDay(d), end: endOfDay(d), index: i})
    }
    for (const span of spans) {
        for (const day of days) {
            const range = spanInDay(span, day)
            if (range !== null) {
                getCalendarColumn(day.index).append(
                    calendarSpan(span, range.start, range.stop, day.start, day.end, callback)
                )
            }
        }
    }
}


type Color = string

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


type JQE = JQuery<HTMLElement>

//TODO: callback applies the update and then gives the new list of spans
function calendarSpan(
    span:Span,
    spanStart:Date,
    spanEnd:Date,
    start:Date,
    end:Date,
    callback:(t:TimeUpdate, o:Span[][]) => Span[][]
): JQE {
    function frac(d:Date): number {
        return (d.getTime() - start.getTime()) / (end.getTime() - start.getTime())
    }
    const lengthPercent = 100 * (frac(spanEnd) - frac(spanStart))
    const topPercent = 100 * frac(spanStart)
    const color = nameToColor(span.label)
    const style = `top:${topPercent}%; height:${lengthPercent}%; background:${color};`
    const result = $(`<div class='event' style='${style}'><div class='spantext'>${span.label}</div></div>`)
    function popup(spans:Span[]) {
        function popupCallback(t:TimeUpdate): void {
            const newSpans:Span[][] = callback(t, [spans])
            popup(newSpans[0])
        }
        multiPopup(spans, popupCallback)
    }
    result.click(() => {
        const spans:Span[] = []
        if (span.prior !== undefined) spans.push(span.prior)
        spans.push(span)
        if (span.next !== undefined) spans.push(span.next)
        popup(spans)
    })
    return result
}

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
    uid: uid,
}

type Update<T> = {
    [P in keyof T]?: ((x:T[P]) => T[P])
}

type ListUpdate<T extends IDed> = {kind: 'apply', uid:uid, update: (x:T) => T}
    | {kind: 'split', uid:uid, insert: T[]}
    | {kind: 'delete', uid:uid}
    | {kind: 'sequence', updates: ListUpdate<T>[]}

function noop<T extends IDed>(): ListUpdate<T> {
    return {kind: 'sequence', updates: []}
}

function apply<T>(update:Update<T>): (x:T) => T {
    return function(x:T) {
        const y = ({...x})
        for (const k in update) {
            const f = update[k]
            if (f !== undefined) y[k] = f(x[k])
        }
        return y
    }
}

function assertNever(value: never): never {
    throw new Error("Shouldn't reach this case!")
}

function applyList<T extends IDed>(update:ListUpdate<T>): (xs:T[]) => T[] {
    return function(xs:T[]): T[] {
        switch (update.kind) {
            case 'sequence':
                let result:T[] = xs
                for (const u of update.updates) {
                    result = applyList(u)(result)
                }
                return result
            case 'apply':
                return xs.map(x => (x.uid == update.uid) ? update.update(x) : x)
            case 'split':
            case 'delete':
                const n = xs.findIndex(x => x.uid == update.uid)
                if (n < 0) throw new Error("Can't find that UID")
                const insert = (update.kind == 'split') ? update.insert : []
                return xs.slice(0, n).concat(insert).concat(xs.slice(n+1, undefined))
            default:
                return assertNever(update)
        }
    }
}

type TimeUpdate = {kind: 'relabel', span: uid, label: string}
    | {kind: 'split', span: uid, time: Date}
    | {kind: 'merge', entry: uid, label: string}
    | {kind: 'move', entry: uid, time: Date}

function applyToUID<T extends IDed>(f:(t:T) => T, xs:T[], id:uid): T[] {
    return xs.map(
        x => (x.uid == id) ? f(x) : x
    )
}

//TODO: improve semantics when things are out of order or there are a subset or whatever
//Right now it puts in all the news if any of the olds are found, at the same spot they were
function replaceMulti<T extends IDed>(xs:T[], olds:T[], news:T[]): T[] {
    const i = xs.findIndex(x => olds.findIndex(old => old.uid == x.uid) >= 0)
    if (i < 0) return xs
    const j = olds.findIndex(old => old.uid == xs[i].uid)
    let replaced:number = 0
    for (let k = 0; k < olds.length - j; k++) {
        if (i+k < xs.length && xs[i+k].uid == olds[j+k].uid) replaced += 1
    }
    return xs.slice(0, i).concat(news).concat(xs.slice(i+replaced))
}

function spanBetween(a:Entry, b:Entry): Span {
    return {
        start: a,
        end: b,
        label: labelFrom(a, b),
        uid: newUID()
    }
}

//TODO: I think I want this to be the only place that mutates a span or entry?
function applyUpdate(
    update:TimeUpdate,
    entries:Entry[],
    spans:Span[],
    otherSpans:Span[][] = [],
): [Entry[], Span[], Span[][]] {
    switch (update.kind) {
        case 'relabel':
            const toRelabel = spans.find(s => s.uid == update.span)
            if (toRelabel != undefined) {
                toRelabel.label = update.label
                toRelabel.start.after = update.label
                toRelabel.end.before = update.label
            }
            break
        case 'split':
            const span = spans.find(s => s.uid == update.span)
            if (span !== undefined) {
                const newEntry:Entry = {time: update.time, before: span.start.after, after: span.end.before, uid: newUID()}
                const span1:Span = spanBetween(span.start, newEntry)
                const span2:Span = spanBetween(newEntry, span.end)
                span1.prior = span.prior
                span1.next = span2
                span2.prior = span1
                span2.next = span.next
                spans = replaceMulti(spans, [span], [span1, span2])
                otherSpans = otherSpans.map(s => replaceMulti(s, [span], [span1, span2]))
                entries = replaceMulti(entries, [span.start, span.end], [span.start, newEntry, span.end])
            }
            break
        case 'merge':
            const entry = entries.find(e => e.uid == update.entry)
            if (entry != undefined) {
                const toReplace = spans.filter(span => span.end.uid == update.entry || span.start.uid == update.entry)
                if (toReplace.length != 2) throw new Error("Failed to merge")
                entries = replaceMulti(entries, [entry], [])
                const start = toReplace[0].start
                const end = toReplace[1].end
                start.after = update.label
                end.before = update.label
                spans = replaceMulti(spans, toReplace, [spanBetween(start, end)])
                const newSpan = spanBetween(start, end)
                newSpan.prior = toReplace[0].prior
                newSpan.next = toReplace[0].next
                otherSpans = otherSpans.map(s => replaceMulti(s, toReplace, [newSpan]))
            }
            break
        case 'move':
            const toModify = entries.find(e => e.uid == update.entry)
            if (toModify != undefined) {
                toModify.time = update.time
            }
            break
        default: return assertNever(update)
    }
    return [entries, spans, otherSpans]
}

function multiPopup(spans:Span[], callback: (u:TimeUpdate) => void): void {
    $('#popup').attr('active', 'true')
    $('#popup').html('')
    for (const [span, [first, last]] of firstLast(spans)) {
        const labelElem = inputAfterColon('Activity', span.label,
            (s:string) => callback({kind: 'relabel', span: span.uid, label: s}) 
        )
        labelElem.css('position', 'relative')
        const splitButton = $("<div class='splitbutton'>+</div>")
        labelElem.append(splitButton)
        if (!first) {
            const upButton = $("<div class='upbutton'>↑</div>")
            upButton.click(() => {
                callback({kind: 'merge', entry: span.start.uid, label:span.label})
            })
            labelElem.append(upButton)
        }
        if (!last) {
            const downButton = $("<div class='downbutton'>↓</div>")
            downButton.click(() => {
                callback({kind: 'merge', entry: span.end.uid, label:span.label})
            })
            labelElem.append(downButton)
        } 
        $('#popup').append(labelElem)
        if (!last) {
            const timeElem = inputAfterColon('Time', renderTime(span.end.time),
                (s:string) => callback({kind: 'move', entry: span.end.uid, time: parseTime(s, span.end.time)})
            )
            timeElem.css('position', 'relative')
            $('#popup').append(timeElem)
        }
    }
}

function zip<X, Y>(xs:X[], ys:Y[]): [X, Y][] {
    return xs.map((x, i) => [x, ys[i]])
}

function firstLast<X>(xs:X[]): [X, [boolean, boolean]][] {
    return zip(xs, zip(xs.map((x, i) => i == 0), xs.map((x, i) => i == xs.length - 1)))
}

function popup(span:Span): void {
    $('#popup').attr('active', 'true')
    $('#popup').html('')
    if (span.prior != undefined) {
        $('#popup').append(inputAfterColon('Before', span.label, console.log))
        // $('#popup').append(`<div>Before: ${span.prior.entry.name}</div>`)
    }
    $('#popup').append(`<div>Start: ${renderTime(span.start.time)}</div>`)
    $('#popup').append(`<div>Name: ${span.label}</div>`)
    $('#popup').append(`<div>End: ${renderTime(span.end.time)}</div>`)
    if (span.next != undefined) {
        $('#popup').append(`<div>After: ${span.label}</div>`)
    }
    const doneButton = $(`<div>Done</div>`)
    $('#popup').append(doneButton)
    doneButton.click(() => $('#popup').attr('active', 'false'))
}

function getCalendarColumn(n:number): any {
    return $(`td:nth-child(${n+2})`)
}
