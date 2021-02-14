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
    const datapoints:{y: number, label: string}[] = []
    for (const [k, v] of timings) {
        datapoints.push({label: k, y: v / 3600})
    }
    console.log(datapoints)
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
    console.log(result)
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

const msPerDay:number = 86400000

function calendarSpanHTML(span:Span, start:Date, end:Date): string {
    function frac(d:Date): number {
        return (d.getTime() - start.getTime()) / (end.getTime() - start.getTime())
    }
    const dates = [span.start, start, span.end, end]
    console.log('dates', dates)
    console.log('getTime()', dates.map(x => x.getTime()))
    const lengthPercent = 100 * (frac(span.end) - frac(span.start))
    const topPercent = 100 * frac(span.start)
    const color = '#00B4FC'
    const style = `top:${topPercent}%; height:${lengthPercent}%; background:${color};`
    return `<div class='event' style='${style}'><div class='spantext'>${span.entry.name}</div></div>`
}

function getDay(n:number): any {
    return $(`td:nth-child(${n+2})`)
}
