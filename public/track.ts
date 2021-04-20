import e from 'express'
import { data } from 'jquery'
import { InputBox } from './suggester.js'

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

export function load(): void {
    let entries:Entry[] = loadEntries()
    sortEntries(entries)
    const x = new InputBox(getNames(entries), $('#trackerdiv'))
    function callback(t:TimeUpdate, entriesList:Entry[][]): Entry[][] {
        entriesList = applyUpdate(t, [entries].concat(entriesList))
        entries = entriesList[0]
        saveEntries(entries)
        render()
        return entriesList.slice(1)
    }
    function render() {
        const elem = $('#inputs')
        const options = $('#options')
        elem.html('')
        options.html('')
        for (const [j, [end, start]] of enumerate(listPairsAndEnds(revit(entries)))) {
            const i = entries.length - j - 1
            //end = entries[i]
            if (end != null) {
                const e = $(`<span class='clickable'>[${renderTime(end.time)}]</span>`)
                e.click(() => {
                    evolvingPopup(entries.slice(i-2, i), callback)
                })
                const f = $('<div></div>')
                f.append(e)
                elem.append(f)
            }
            if (start != null && end != null) {
                const e = $(`<span class='clickable'>${labelFrom(start, end)}</span>`)
                e.click(() => {
                    evolvingPopup(entries.slice(i-2, i+1), callback)
                })
                const f = $('<div></div>')
                f.append(e)
                elem.append(f)
            }
        }
    }
    function addEntry(s:string) {
        entries.push({before: s, time: now(), id: newUID()})
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

function partInDay(start:Date, stop:Date, day:CalendarDay): null|{start:Date, stop:Date} {
    if (stop < day.start) return null
    else if (start > day.end) return null
    return {
        start: last(day.start, start),
        stop: first(day.end, stop)
    } 
}

export function loadCalendar() {
    let entries = loadEntries()
    sortEntries(entries)
    function callback(t:TimeUpdate, entriesList:Entry[][]): Entry[][] {
        entriesList = applyUpdate(t, [entries].concat(entriesList))
        entries = entriesList[0]
        showCalendar(entries, callback)
        saveEntries(entries)
        return entriesList.slice(1)
    }
    showCalendar(entries, callback)
}

function showCalendar(entries:Entry[], callback: (t:TimeUpdate, o:Entry[][]) => Entry[][]): void {
    const days:CalendarDay[] = []
    for (let i = 0; i < 7; i++) {
        const d = daysAgo(6-i)
        $(`#headerrow th:nth-child(${i+2})`).text(renderDay(d))
        days.push({start: startOfDay(d), end: endOfDay(d), index: i})
    }
    for (const [[i, start], [j, end]] of listPairs(enumerate(it(entries)))) {
        for (const day of days) {
            const range = partInDay(start.time, end.time, day)
            if (range !== null) {
                getCalendarColumn(day.index).append(
                    calendarSpan(
                        labelFrom(start, end),
                        range.start, range.stop, day.start, day.end,
                        entries, i, callback
                    )
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
                return xs.map(x => (x.id == update.uid) ? update.update(x) : x)
            case 'split':
            case 'delete':
                const n = xs.findIndex(x => x.id == update.uid)
                if (n < 0) throw new Error("Can't find that UID")
                const insert = (update.kind == 'split') ? update.insert : []
                return xs.slice(0, n).concat(insert).concat(xs.slice(n+1, undefined))
            default:
                return assertNever(update)
        }
    }
}

type TimeUpdate = {kind: 'relabel', before: Entry, after: Entry, label: string}
    | {kind: 'split', before: Entry, after: Entry, time: Date}
    | {kind: 'merge', entry: Entry, label: string}
    | {kind: 'move', entry: Entry, time: Date}


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

function neighbors<T extends IDed>(x:T, xs:T[]): [T|null, T|null] {
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

//TODO: I think I want this to be the only place that mutates a span or entry?
//TODO: I want to somehow block the user from moving time past another entry
//(But at any rate I'll need to figure out how to resolve such conflicts in the DB...)
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
    for (const x of xs) yield x
}
function* revit<T>(xs:T[]): Generator<T> {
    for (let i = xs.length-1; i--; i>=0) yield xs[i]
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

//TODO: make all this logic work with entries instead of spans
function multiPopup(entries:Entry[], callback: (u:TimeUpdate) => void): void {
    $('#popup').attr('active', 'true')
    $('#popup').html('')
    function renderEntry(entry:Entry) {
        const timeElem = inputAfterColon('Time', renderTime(entry.time),
            (s:string) => callback({kind: 'move', entry: entry, time: parseTime(s, entry.time)})
        )
        timeElem.css('position', 'relative')
        $('#popup').append(timeElem)
    }
    function renderSpan(start:Entry, stop:Entry) {
        const label = labelFrom(start, stop)
        const labelElem = inputAfterColon('Activity', label,
            (s:string) => callback({kind: 'relabel', before:start, after:stop, label: s}) 
        )
        labelElem.css('position', 'relative')
        const splitButton = $("<div class='splitbutton button'>+</div>")
        splitButton.click(() => {
            callback({kind: 'split', before: start, after: stop, time: mid(start.time, stop.time)})
        })
        labelElem.append(splitButton)
        const upButton = $("<div class='upbutton button'>↑</div>")
        upButton.click(() => {
            callback({kind: 'merge', entry: start, label:label})
        })
        labelElem.append(upButton)
        const downButton = $("<div class='downbutton button'>↓</div>")
        downButton.click(() => {
            callback({kind: 'merge', entry: stop, label:label})
        })
        labelElem.append(downButton)
        $('#popup').append(labelElem)
    }
    for (const [start, stop] of listPairsAndEnds(it(entries))) {
        if (start != null) {
            renderEntry(start)
        }
        if (start != null && stop != null) {
            renderSpan(start, stop)
        }
    }
}

function zip<X, Y>(xs:X[], ys:Y[]): [X, Y][] {
    return xs.map((x, i) => [x, ys[i]])
}

function getCalendarColumn(n:number): any {
    return $(`td:nth-child(${n+2})`)
}
