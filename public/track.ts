import { data } from 'jquery'
import { InputBox } from './suggester.js'

interface Entry {
    name: string,
    time: Date
}

function exampleEntries(): Entry[] {
    const events = ['breakfast', 'party', 'lunch', 'party', 'dinner', 'sleep', 'breakfast']
    const result: Entry[] = []
    for (let i = 0; i < events.length; i++) {
        result.push({time: hoursAgo(events.length - i), name: events[i]})
    }
    return result
}

export function load(): void {
    const entries:Entry[] = loadEntries()
    console.log(entries)
    if (entries.length == 0) for (const entry of exampleEntries()) entries.push(entry) 
    const x = new InputBox(getNames(entries), $('#trackerdiv'))
    function render() {
        const elem = $('#inputs')
        const options = $('#options')
        elem.html('')
        options.html('')
        for (let i = entries.length - 1; i >=0; i--) {
            const entry = entries[i]
            elem.append(`<div>[${renderTime(entry.time)}] ${entry.name}</div>`)
        }
    }
    function addEntry(s:string) {
        entries.push({name: s, time: now()})
        saveEntries(entries)
        x.setUniverse(getNames(entries))
        render()
    }
    render()
    x.bind(addEntry)
}

export function loadChart() {
    console.log(loadEntries())
    renderChart(loadEntries())
}

function renderChart(entries:Entry[]){
    const timings:Map<string, number> = getTotalTime(entries)
    const datapoints:{y: number, label: string, color:Color}[] = []
    for (const [k, v] of timings) {
        datapoints.push({label: k, y: v / 3600, color: nameToColor(k)})
    }
    console.log(datapoints)
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
    return secondsBetween(span.start, span.end)
}

function renderBars(entries:Entry[], buckets:Bucket[]) {
    const seconds:Map<string, number>[] = []
    for (const bucket of buckets) {
        const spans = spansInRange(bucket.start, bucket.end, entries)
        seconds.push(sumByName(spans.map(span => [span.entry.name, length(span)])))
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

function getTotalTime(entries:Entry[]): Map<string, number> {
    const result:Map<string, number> = new Map()
    let last:Entry|null = null
    for (const entry of entries) {
        if (last != null) {
            const seconds = (entry.time.getTime() - last.time.getTime()) / 1000
            incrementMap(result, entry.name, seconds)
        }
        last = entry
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
    return uniques(entries.map(entry => entry.name)) 
}

function uniques<T>(xs:T[]): T[] {
    return [...new Set(xs)]
}

function now(): Date {
    return new Date()
}

function renderTime(d:Date): string {
    return d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
}

function saveEntries(entries:Entry[]) {
    localStorage.setItem('entries', serializeEntries(entries))
}

function serializeEntries(entries:Entry[]): string {
    return JSON.stringify(entries.map(x => ({time: x.time.getTime(), name: x.name})))
}

function deserializeEntries(s:string): Entry[] {
    const json:{time:number, name:string}[] = (JSON.parse(s) as {time:number, name:string}[])
    return json.map(x => ({time: new Date(x.time), name: x.name}))
}

function loadEntries(): Entry[] {
    const s:string|null = localStorage.getItem('entries')
    if (s == '' || s == null) return []
    return deserializeEntries(s)
}

function renderDay(d:Date): string {
    const options = {day: 'numeric', weekday: 'short', month: 'short'}
    return d.toLocaleDateString("en-US", options)
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
    start: Date,
    end: Date,
    entry: Entry,
}

function first(a:Date, b:Date): Date {
    return (a < b) ? a : b
}

function last(a:Date, b:Date): Date {
    return (a > b) ? a : b
}

function spans(entries:Entry[]): Span[] {
    let current:Entry|null = null
    const result:Span[] = []
    for (const entry of entries) {
        if (current != null) result.push({start: current.time, end: entry.time, entry: entry})
        current = entry
    }
    return result
}

// assumes that entries are sorted
function spansInRange(start:Date, end:Date, entries:Entry[]) {
    function clip(span:Span): Span|null {
        if (span.start < start && span.end < start) {
            return null
        } else if (span.start > end && span.end > end) {
            return null
        } else {
            return {...span, start: last(span.start, start), end: first(span.end, end)}
        }
    }
    const result:Span[] = []
    for (const span of spans(entries).map(clip)) {
        if (span != null) result.push(span)
    }
    return result
}


export function loadCalendar(): void {
    const entries = loadEntries()
    sortEntries(entries)
    for (let i = 0; i < 7; i++) {
        const d = daysAgo(6-i)
        console.log(renderDay(d))
        $(`#headerrow th:nth-child(${i+2})`).text(renderDay(d))
        const start = startOfDay(d)
        const end = endOfDay(d)
        for (const span of spansInRange(start, end, entries)) {
            getDay(i).append(calendarSpanHTML(span, start, end))
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

function calendarSpanHTML(span:Span, start:Date, end:Date): string {
    function frac(d:Date): number {
        return (d.getTime() - start.getTime()) / (end.getTime() - start.getTime())
    }
    const dates = [span.start, start, span.end, end]
    console.log('dates', dates)
    console.log('getTime()', dates.map(x => x.getTime()))
    const lengthPercent = 100 * (frac(span.end) - frac(span.start))
    const topPercent = 100 * frac(span.start)
    const color = nameToColor(span.entry.name)
    const style = `top:${topPercent}%; height:${lengthPercent}%; background:${color};`
    return `<div class='event' style='${style}'><div class='spantext'>${span.entry.name}</div></div>`
}

function getDay(n:number): any {
    return $(`td:nth-child(${n+2})`)
}
