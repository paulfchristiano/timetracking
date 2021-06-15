import e from 'express'
import { Callbacks, data, map, readyException } from 'jquery'
import { InputBox } from './suggester.js'
import { DateSpec, Action, dateRule, parseString, actionRule, emptyRule } from './parse.js'
import { Entry, Label, serializeEntries, deserializeEntries, uid, newUID, makeNewEntry } from './entries.js'


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


function labelPopup(label:Label, callback:(update:TimeUpdate) => void, entries:Entry[]): void {
    function dismiss() {
        $('#renamePopup').attr('active', 'false')
    }
    $('#renamePopup').attr('active', 'true')
    $('#popuplabel').text(label)
    $('#newlabel').empty()
    $('#newlabel').html('Rename to: ')
    const e = div('inputwrapper')
    $('#newlabel').append(e)
    const input = new InputBox(emptyRule, null, getDistinctLabels(entries), $(e))
    input.inputElement.setAttribute('class', 'wide')
    input.bind(function (a, s) {
        callback({kind: 'bulkRename', from: label, to: s, moveChildren: $('#movechildren').prop('checked')})
        dismiss()
    })
    input.focus()
    $('#doneButton').unbind('click')
    $('#doneButton').bind('click', dismiss)
    $('#renamePopup').unbind('keydown')
    $('#renamePopup').keydown(function(e) {
        if (e.keyCode == 27) dismiss()
    })
    $('#movechildren').prop('checked', true)
}

function findEntry(id:uid, entries:Entry[]): [Entry, number]|null {
    for (let i = 0; i < entries.length; i++) {
        if (entries[i].id == id) {
            return [entries[i], i]
        }
    }
    return null
}

//TODO: need to refactor this to do the sort + filter in the calendar construction, and to rerun when entries changes
//Then at this stage I want to get the indices from the startentry and endEntry?
//Might actually be indices by the time it gets here, computing them at the same time that I do filtering and sorting
function zoomedPopup(
    entries:Entry[], //Sorted and filtered
    startEntry:uid,
    endEntry:uid,
    profile:Profile,
    popup: (start:uid, end:uid) => void,
    callback:(t:TimeUpdate) => void
): void {
    let result = findEntry(startEntry, entries)
    if (result == null) return
    const [start, startIndex] = result
    result = findEntry(endEntry, entries)
    if (result == null) return
    const [end, endIndex] = result
    $('#popup').attr('active', 'true')
    $('#minical').empty()
    $('#priorcal').empty()
    $('#nextcal').empty()
    for (const [a, b] of listPairsAndEnds(enumfrom(entries, startIndex, endIndex+1))) {
        if (a == null && startIndex > 0) {
            const label = labelFrom(entries[startIndex-1], entries[startIndex])
            const style = `background:${renderGradient(getColor(label, profile), true)}; height:100%`
            const e = $(`<div class='event' style='${style}'><div class='spantext'></div></div>`)
            e.click(() => popup(entries[startIndex-1].id, entries[startIndex].id))
            $('#priorcal').append(e)
        }
        if (b == null && endIndex + 1 < entries.length) {
            const label = labelFrom(entries[endIndex], entries[endIndex+1])
            const style = `background:${renderGradient(getColor(label, profile), false)}; height:100%`
            const e = $(`<div class='event' style='${style}'><div class='spantext'></div></div>`)
            e.click(() => popup(entries[endIndex].id, entries[endIndex+1].id))
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
            elem.click(() => popup(first.id, second.id))
            $('#minical').append(elem)
        }
    }
    const input = new InputBox(actionRule, {kind: 'raw'}, getDistinctLabels(entries), $('.inputwrapper'))
    input.bind((a, s) => {
        switch (a.kind) {
            case 'raw':
                callback({kind: 'relabel', label: s, before: entries[endIndex-1], after: entries[endIndex]})
                break
            case 'default':
                callback({
                    kind: 'split',
                    before: entries[endIndex-1],
                    after: entries[endIndex],
                    time: minutesAfter(entries[endIndex-1].time, a.minutes),
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
            case 'except':
                callback({
                    kind: 'split',
                    before: entries[startIndex],
                    after: entries[startIndex+1],
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
                    time: specToDate(a.time, entries[startIndex].time, 'next'),
                    labelBefore: s
                })
                break
            case 'after':
                callback({
                    kind: 'split',
                    before: entries[startIndex],
                    after: entries[startIndex+1],
                    time: specToDate(a.time, entries[startIndex+1].time, 'previous'),
                    labelAfter: s
                })
                break
            case 'now':
                break
            case 'continue':
                callback({kind: 'delete', entry: entries[startIndex], shiftForward: entries[startIndex+1]})
                break
            default: assertNever(a)
        }
    })
    input.focus()
    $('#starttime').empty()
    $('#starttime').append(inputAfterColon(
        'Start',
        renderTime(start.time),
        function(s) {
            const result = parseString(dateRule, s)
            if (result == 'fail' || result == 'prefix' || result[2].length > 0) {
                // TODO: handle error
            } else {
                callback({kind: 'move', time: specToDate(result[0], start.time, 'closest'), entry: start})
            }
        }
    ))
    $('#endtime').empty()
    $('#endtime').append(inputAfterColon(
        'End',
        renderTime(end.time),
        function(s) {
            const result = parseString(dateRule, s)
            if (result == 'fail' || result == 'prefix' || result[2].length > 0) {
                // TODO: handle error
            } else {
                callback({kind: 'move', time: specToDate(result[0], end.time, 'closest'), entry: end})
            } 
        }
    ))
}

function renderDuration(ms:number): string {
    if (ms < 0) {
        return `-${renderDuration(-ms)}`
    }
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
    if (spec == 'now') return now()
    const copiedAnchor = new Date(anchor)
    copiedAnchor.setMinutes(spec.minutes)
    let best:Date = new Date(anchor);
    let bestDiff:number|null = null;
    const month = (spec.month === undefined) ? anchor.getMonth() : spec.month
    copiedAnchor.setMonth(month)
    const hours:number = (spec.hours == 12) ? 0 : spec.hours
    const dateCandidates:number[] = (spec.day === undefined) ? [-1, 0, 1].map(x => anchor.getDate() + x) : [spec.day]
    const ampmCandidates:('am'|'pm')[] = (spec.ampm === undefined) ? ['am', 'pm'] : [spec.ampm]
    const hourCandidates:number[] = ampmCandidates.map(x => (x == 'am') ? hours : (hours+12)%24)
    for (const date of dateCandidates) {
        for (const hours of hourCandidates) {
            const candidate = new Date(copiedAnchor)
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

function parseTime(s:string, anchor:Date, rel:'next'|'previous'|'closest'): Date | 'error' {
    const m = parseString(dateRule, s)
    if (m == 'fail' || m == 'prefix' || m[2].length > 0) return 'error'
    return specToDate(m[0], anchor, rel)
}

function applyAndSave(entries:Entry[], update:TimeUpdate, credentials:Credentials) {
    const updates:Entry[] = [];
    applyUpdate(update, entries, updates)
    saveEntries(entries)
    sendUpdates(updates, credentials)
}

function div(cls:string): HTMLDivElement {
    const result = document.createElement('div')
    result.setAttribute('class', cls)
    return result
}

export async function loadTracker(): Promise<void> {
    const credentials:Credentials = await getCredentials()
    const profile:Profile = loadProfile()
    let entries:Entry[] = await loadEntries(credentials)
    if (entries.length == 0) {
        entries.push(makeNewEntry(now(), undefined, undefined))
        saveEntries(entries)
    }
    let focused:Entry|null = null;
    const entriesToShow = maxEntriesToShow()
    function callback(update:TimeUpdate) {
        applyAndSave(entries, update, credentials)
        render()
    }
    function startInput(elem:HTMLDivElement, startIndex:number, entries:Entry[]): InputBox<Action> {
        $('.inputwrapper').empty()
        const x = new InputBox(actionRule, {kind: 'raw'}, getDistinctLabels(entries), $(elem))
        const start:Entry = entries[startIndex]
        const end:Entry|null = (startIndex < entries.length - 1) ? entries[startIndex+1] : null
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
                    case 'except':
                        callback({kind: 'append', before: (s.length == 0) ? undefined : s, time: minutesAfter(new Date(), -a.minutes)})
                        break
                    case 'default':
                        callback({kind: 'append', before: s, time: minutesAfter(start.time, a.minutes)})
                        break
                    case 'now':
                        callback({kind: 'relabel', label: s, before:start})
                        break
                    case 'until':
                        callback({kind: 'spliceSplit', label: s, before: start, time: specToDate(a.time, start.time, 'next')})
                        break  
                    case 'after':
                        callback({kind: 'append', after: s, time: specToDate(a.time, new Date(), 'previous')})
                        break
                    case 'continue':
                        callback({kind: 'delete', entry: start, reflectBack: (startIndex > 0) ? entries[startIndex-1] : undefined})
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
                    case 'default':
                        callback({kind: 'split', labelBefore: s, before: start, after: end, time: minutesAfter(start.time, a.minutes)})
                        break
                    case 'last':
                        callback({kind: 'split', labelAfter: s, before: start, after: end, time: minutesAfter(end.time, -a.minutes)})
                        break
                    case 'except':
                        callback({kind: 'split', labelBefore: s, before: start, after: end, time: minutesAfter(end.time, -a.minutes)})
                        break
                    case 'until':
                        callback({kind: 'spliceSplit', label: s, before: start, time: specToDate(a.time, start.time, 'next')})
                        break
                    case 'after':
                        callback({kind: 'split', labelAfter: s, before: start, after: end, time: specToDate(a.time, end.time, 'previous')})
                        break
                    case 'continue':
                        callback({kind: 'delete', entry: start, shiftForward: end})
                        break
                    default: assertNever(a)
                }
            })
        }
        return x
    }
    let heartbeats:[Date, HTMLDivElement][] = []
    function setTimer(start:Date, elem:HTMLDivElement): void {
        const diff = new Date().getTime() - start.getTime()
        if (diff > 1000)
            elem.textContent = renderDuration(new Date().getTime() - start.getTime())
    }
    setInterval(function() {
        for (const [start, elem] of heartbeats) {
            setTimer(start, elem)
        }
    }, 1000)
    function render() {
        heartbeats = []
        const toStart:Array<() => void> = [];
        const elem = document.getElementById('inputs')
        const elements:HTMLDivElement[] = []
        if (elem != null) elem.innerHTML = ''
        const sortedEntries = sortAndFilter(entries)
        for (let i = sortedEntries.length-1; i >= 0 && i >= sortedEntries.length - entriesToShow; i--) {
            const end:Entry|null = (i == sortedEntries.length - 1) ? null : sortedEntries[i+1]
            const start:Entry|null = sortedEntries[i]
            if (end == null) {
                const row = div('trackertimerow')
                row.appendChild(div('nowdot'))
                row.appendChild(div('timelabel'))
                elements.push(row)
            } else {
                const row = div('trackertimerow')
                row.appendChild(div('dot'))
                const time = div('timelabel')
                time.textContent = renderTime(end.time)
                time.setAttribute('contenteditable', 'true')
                time.addEventListener('blur', function() {
                    time.textContent = renderTime(end.time)
                })
                time.addEventListener('keydown', function(e) {
                    if (e.keyCode == 13) {
                        e.preventDefault()
                        const date = parseTime(time.textContent || '', end.time, 'closest')
                        if (date != 'error') {
                            callback({kind: 'move', entry: end, time: date})
                        }
                    }
                })
                row.appendChild(time)
                elements.push(row)
            }
            if (start != null) {
                const label = (end == null) ? start.after || 'TBD' : labelFrom(start, end)
                const color:string = (end == null) ? 'gray' : renderColor(getColor(label, profile))
                const row = div('trackerrow')
                const text = div('trackerlabel')
                const labelDiv = div('labeldiv')
                labelDiv.append(...renderLabel(label))
                const durationDiv = div('durationdiv')
                if (end == null) {
                    setTimer(start.time, durationDiv)
                    heartbeats.push([start.time, durationDiv])
                } else {
                    durationDiv.textContent = renderDuration(end.time.getTime() - start.time.getTime()) 
                }
                text.append(labelDiv, durationDiv)
                const line = div('line')
                line.style.backgroundColor = color
                line.style.float = 'left'
                row.append(line, text)
                const inputBuffer = div('inputbuffer')
                const inputWrapper = div('inputwrapper')
                inputBuffer.appendChild(inputWrapper)
                row.append(inputBuffer)
                text.addEventListener('click', () => {
                    startInput(inputWrapper, i, sortedEntries).focus()
                    focused = end;
                })
                elements.push(row)
                if (focused == end) {
                    const inputBox = startInput(inputWrapper, i, sortedEntries)
                    toStart.push(() => inputBox.focus())
                }
            }
        }
        if (elem != null) elem.append(...elements)
        for (const f of toStart) f()
    }
    render()
}

function emptyProfile(): Profile {
    return {colors: new Map()}
}

export async function loadChart() {
    const credentials = await getCredentials()
    const entries = await loadEntries(credentials)
    renderChart(entries, loadProfile())
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
    chart.render()
}

export async function loadBars() {
    const credentials = await getCredentials()
    const entries = await loadEntries(credentials)
    const buckets = weeklyBuckets()
    renderBars(entries, buckets, loadProfile())
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

function spanText(cls:string, text:string): HTMLSpanElement {
    const result = document.createElement('span')
    result.setAttribute('class', cls)
    result.textContent = text
    return result
}

function renderLabel(label:Label): (Node|string)[] {
    if (label.length > 0 && label[0] == '?') {
        return [spanText('errorlabel', label)]
    }
    const parts = label.split('/')
    if (parts.length == 1) return [label]
    const prefix = parts.slice(0, parts.length-1).join('/')
    const suffix = parts[parts.length-1]
    return [`${suffix} `, spanText('categorylabel', `(${prefix})`)] 
}

function* namesFrom(label:Label|undefined): Generator<Label> {
    if (label === undefined) return
    const parts = label.split('/')
    for (let i = 0; i < parts.length; i++) {
        yield parts.slice(0,i+1).join('/')
    }
}

//returns labels starting from the most recent
function getDistinctLabels(entries:Entry[]): Label[] {
    const seen:Set<string> = new Set()
    const result:string[] = []
    function add(s:string) {
        if (!seen.has(s)) {
            result.push(s)
            seen.add(s)
        }
    }
    for (const entry of revit(entries)) {
        for (const name of namesFrom(entry.before)) add(name)
        for (const name of namesFrom(entry.after)) add(name)
    }
    return result
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

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function renderMonth(d:Date): string {
    return months[d.getMonth()]
}

function convertDate(d:Date): MyDate {
    return {
        year: d.getFullYear(),
        //month: d.toLocaleString('default', {month: 'short'}),
        month: renderMonth(d),
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

export function getLocalEntries(): Entry[] {
    const s:string|null = localStorage.getItem('entries')
    return (s == null) ? [] : deserializeEntries(s)
}

async function loadEntries(credentials:Credentials): Promise<Entry[]> {   
    const localEntries = getLocalEntries()
    const remoteEntries = await getRemoteEntries(credentials)
    const merge = mergeAndUpdate(localEntries, remoteEntries)
    sendUpdates(merge.yUpdates, credentials)
    if (merge.xUpdates.length > 0) saveEntries(merge.merged)
    return merge.merged
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

export async function loadLabels() {
    const credentials = await getCredentials()
    const entries = await loadEntries(credentials)
    showLabels(entries, credentials)
    $('#labels').click(hideLabelPopup)
}

function showLabels(entries:Entry[], credentials:Credentials) {
    const labels:Label[] = getDistinctLabels(entries)
    const profile = loadProfile()
    labels.sort()
    function callback(update:TimeUpdate) {
        applyAndSave(entries, update, credentials)
        showLabels(entries, credentials)
    }
    function makeLabelDiv(label:Label): JQE {
        const colorHex = colorToHex(getColor(label, profile))
        const l = $(`<span>${label}</span>`)
        const result = $(`<div class='label'></div>`)
        result.append(l)
        l.click(function(e) {
            e.stopPropagation()
            labelPopup(label, callback, entries)
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

export async function loadCalendar() {
    $('#calendardiv').click((e) => {
        hideCalPopup()
    })
    const credentials = await getCredentials()
    let entries = await loadEntries(credentials)
    function callback(update:TimeUpdate) {
        applyAndSave(entries, update, credentials)
    }
    showCalendar(entries, null, loadProfile(), callback)
}

function sortAndFilter(entries:Entry[]): Entry[] {
    const result:Entry[] = entries.filter(entry => !entry.deleted)
    result.sort((x, y) => x.time.getTime() - y.time.getTime())
    return result
}

//TODO less sort and filter...
function showCalendar(
    entries:Entry[],
    initialPopup: [uid, uid]|null,
    profile:Profile,
    callback: (t:TimeUpdate) => void,
): void {
    const days:CalendarDay[] = []
    for (let i = 0; i < 7; i++) {
        const d = daysAgo(6-i)
        $(`#headerrow th:nth-child(${i+2})`).text(renderDay(d))
        days.push({start: startOfDay(d), end: endOfDay(d), index: i})
    }
    //Called from within a popup when an edit occurs
    //(So needs to redraw the popup)
    function popupCallback(bounds:[uid,uid]|null) {
        function f(t:TimeUpdate) {
            callback(t)
            showCalendar(sortAndFilter(entries), bounds, profile, callback)
        }
        return f
    }
    function popup(startEntry:uid, endEntry:uid) {
        zoomedPopup(
            sortAndFilter(entries), startEntry, endEntry,
            profile,
            popup,
            popupCallback([startEntry, endEntry])
        )
    }
    for (const day of days) {
        getCalendarColumn(day.index).empty()
    }
    for (const [start, end] of listPairs(it(sortAndFilter(entries)))) {
        for (const day of days) {
            const range = partInDay(start.time, end.time, day)
            if (range !== null) {
                const e = calendarSpan(labelFrom(start, end),
                    range.start, range.end,
                    day.start, day.end,
                    profile
                )
                e.click((e) => {
                    popup(start.id, end.id)
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

function HSVtoRGB(h:number, s:number, v:number): Color {
    var r, g, b, i, f, p, q, t;
    function round(x: number): number {
        const result = Math.floor(x * 256)
        return (result == 256) ? 255 : result
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    function color(r:number, g:number, b:number): Color { return {
        r: round(r), g: round(g), b: round(b)
    }}
    switch (i % 6) {
        case 0: return color(v, t, p)
        case 1: return color(q, v, p)
        case 2: return color(p, v, t)
        case 3: return color(p, q, v)
        case 4: return color(t, p, v)
        case 5: return color(v, p, q)
        default: return assertNever(i%6 as never)
    }
}

const colors = ['#fc6472', '#f4b2a6', '#eccdb3', '#bcefd0', '#a1e8e4', '#23c8b2', '#c3ecee']

function randomColor() {
    return HSVtoRGB(Math.random(), 0.5 + 0.3 * Math.random(), 1)
    //return colorFromHex(colors[randInt(colors.length)])
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
    | {kind: 'bulkRename', from: Label, to:Label, moveChildren: boolean}
    // Deletes update.entry
    // If shiftForward is an entry and entry.before is not undefined, then it entry.shiftForward.before = entry.before
    // Similarly for shiftBack and entry.after
    // If reflectBack is an entry and entry.before is not undefined, then entry.reflectBack.after = entry.before
    // Similarly for reflectForward and entry.after
    | {kind: 'delete', entry: Entry, shiftForward?: Entry, reflectBack?: Entry, shiftBack?:Entry, reflectForward?:Entry}

function insertAt<T>(toInsert:T, xs:T[], index:number): T[] {
    return xs.slice(0, index).concat([toInsert]).concat(xs.slice(index))
}

function neighbors(entries:Entry[], entry:Entry): [Entry|null, Entry|null] {
    let before:Entry|null = null
    let after:Entry|null = null
    for (const x of entries) {
        if (x.time < entry.time) {
            if (before == null || before.time < x.time) {
                before = x
            }
        } else if (x.time > entry.time) {
            if (after == null || after.time > x.time) {
                after = x
            }
        }
    }
    return [before, after]
}

//TODO: want to have a different data structure for tracking entries
function upsertInPlace(entry:Entry, entries:Entry[]): void {
    for (let i = 0; i < entries.length; i++) {
        if (entries[i].id == entry.id) {
            entries[i] = entry
            return
        }
    }
    entries.push(entry)
}

const DEFAULT_LIMIT:number = 500
function maxEntriesToShow(): number {
    const params = new URLSearchParams(window.location.search)
    const limit = params.get('limit')
    if (limit == undefined) return DEFAULT_LIMIT
    const n = parseInt(limit)
    if (isNaN(n)) return DEFAULT_LIMIT
    return n
}

function bulkUpsertInPlace(upserts:Entry[], entries:Entry[]): void {
    const byId:Map<uid, Entry> = new Map()
    for (const upsert of upserts) {
        byId.set(upsert.id, upsert)
    }
    for (let i = 0; i < entries.length; i++) {
        const upsert = byId.get(entries[i].id)
        if (upsert != undefined) {
            byId.delete(upsert.id)
            entries[i] = upsert
        }
    }
    for (const upsert of byId.values()) {
        entries.push(upsert)
    }
}

//Mutates entries
//Also mutates updates
function applyUpdate(
    update:TimeUpdate,
    entries:Entry[],
    updates:Entry[],
) {
    function upsert(entry:Entry) {
        const newEntry = {...entry, lastModified:now()}
        upsertInPlace(newEntry, entries)
        upsertInPlace(newEntry, updates)
    }
    function bulkUpsert(upserts:Entry[]) {
        const newEntries = upserts.map(entry => ({...entry, lastModified:now()}))
        bulkUpsertInPlace(newEntries, entries)
        bulkUpsertInPlace(newEntries, updates)
    }
    switch (update.kind) {
        case 'composite':
            for (const u of update.updates) {
                applyUpdate(u, entries, updates)
            }
            break
        case 'relabel':
            if (update.before !== undefined) upsert({...update.before, after: update.label})
            if (update.after !== undefined) upsert({...update.after, before: update.label})
            break
        case 'split': 
            const newEntry:Entry = makeNewEntry(
                update.time,
                update.labelBefore || update.before.after || update.after.before,
                update.labelAfter || update.after.before || update.before.after,
            )
            upsert(newEntry)
            if (update.labelBefore !== undefined) {
                upsert({...update.before, after: update.labelBefore})
            } if (update.labelAfter !== undefined) {
                upsert({...update.after, before: update.labelAfter})
            }
            break
        case 'merge': {
            const [a, b] = neighbors(entries, update.entry)
            if (a != null) upsert({...a, after: update.label})
            if (b != null) upsert({...b, before: update.label})
            upsert({...update.entry, deleted: true})
            break
        }
        case 'move':
            upsert({...update.entry, time: update.time})
            break
        case 'append': {
            const newEntry:Entry = makeNewEntry(update.time, update.before, update.after)
            upsert(newEntry)
            break
        }
        case 'spliceSplit': {
            const newEntry:Entry = makeNewEntry(update.time, update.label, update.before.after)
            upsert(newEntry)
            upsert({...update.before, after: update.label})
            break
        }
        case 'bulkRename':
            //TODO: make a bulkUpsert method
            const upserts:Entry[] = []
            for (const entry of entries) {
                let newEntry = entry
                let changed = false;
                if (matchesLabelRemap(newEntry.before, update.from, update.moveChildren)) {
                    newEntry = {...newEntry, before: remapLabel(newEntry.before, update.from, update.to, update.moveChildren)}
                    changed = true;
                }
                if (matchesLabelRemap(newEntry.after, update.from, update.moveChildren)) {
                    newEntry = {...newEntry, after: remapLabel(newEntry.after, update.from, update.to, update.moveChildren)}
                    changed = true;
                }
                if (changed) upserts.push(newEntry)
            }
            bulkUpsert(upserts)
            break
        case 'delete':
            upsert({...update.entry, deleted:true})
            if (update.entry.before !== undefined) {
                if (update.shiftForward !== undefined) {
                    upsert({...update.shiftForward, before: update.entry.before})
                }
                if (update.reflectBack !== undefined) {
                    upsert({...update.reflectBack, after: update.entry.before})
                }
            }
            if (update.entry.after !== undefined) {
                if (update.shiftBack !== undefined) {
                    upsert({...update.shiftBack, after: update.entry.after})
                }
                if (update.reflectForward !== undefined) {
                    upsert({...update.reflectForward, before: update.entry.after})
                }
            }
            break
        default: assertNever(update)
    }
}

function matchesLabelRemap(label:Label|undefined, from:Label, moveChildren:boolean) {
    if (moveChildren) return (label != undefined && label.slice(0, from.length) == from)
    else return label == from
}

function remapLabel(label:Label|undefined, from:Label, to:Label, moveChildren:boolean): Label|undefined {
    if (moveChildren) {
        if (label === undefined) return undefined
        if (label.slice(0, from.length) === from) {
            return to + label.slice(from.length)
        }
        return label
    } else {
        if (label == from) return to
        else return label
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
    for (let i = 0; i<xs.length; i++) {
        yield xs[i]
    }
}
function* revit<T>(xs:T[], limit?:number): Generator<T> {
    const bottom = (limit == undefined) ? 0 : xs.length - limit
    for (let i = xs.length-1; i>=bottom; i--) {
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

export type Credentials = {username: string, hashedPassword: string}

function makeCredentials(username:string, password:string): Credentials {
	return {username: username, hashedPassword: hashPassword(username, password)}
}

function loginLocal(credentials:Credentials): void {
	localStorage.setItem('username', credentials.username)
	localStorage.setItem('hashedPassword', credentials.hashedPassword)
}

export function getLocalCredentials(): Credentials|null {
	const username = localStorage.username
	const hashedPassword = localStorage.hashedPassword
	if (username !== undefined && hashedPassword !== undefined) {
		return {
			username:username,
			hashedPassword:hashedPassword
		}
	} else {
		return null
	}
}

function loginRemote(credentials:Credentials): Promise<boolean> {
	return new Promise(resolve => {
		$.post(`login?${credentialParams(credentials)}`, function(data) {
			if (data != 'ok') {
				resolve(false)
			} else {
				resolve(true)
			}
		})
	})
}

function signupRemote(credentials:Credentials): Promise<boolean> {
	return new Promise(resolve => {
		if (credentials.username == '') {
			alert('Enter a username and password and click signup')
		} else {
			$.post(`signup?${credentialParams(credentials)}`, function(data) {
				if (data != 'ok') { 
					resolve(false)
				} else {
					resolve(true)
				}
			})
		}
	})
}

async function getCredentials(): Promise<Credentials> {
    const cred = getLocalCredentials()
    if (cred !== null) return cred
    return displayLogin()
}

async function displayLogin(): Promise<Credentials> {
    $('#loginDialog').html(
        `<label for="name">Name:</label>` +
        `<input type='text' id="name"></textarea>` +
        `<div>` +
        `<label for="password">Password:</label>` +
        `<input type='password' id="password"></textarea>` +
        `</div>` +
        `<div>` +
        `<span class="option" choosable id="signup">Sign up</span>` +
        `<span class="option" choosable id="login">Log in</span>` +
        `</div>`
    )
    //TODO: alert when credentials are no good
    function credentialsFromForm(): Credentials|null {
    	return makeCredentials(
    		$('#name').val() as string, 
    		$('#password').val() as string
		)
    }
    function exit() {
    	$('#loginDialog').html('')
    	$('#loginDialog').attr('active', 'false')
    }
    async function login(resolve: (c:Credentials) => void) {
    	const credentials = credentialsFromForm();
    	if (credentials !== null) {
	    	const success = await loginRemote(credentials)
	    	if (success) {
	    		loginLocal(credentials)
	    		exit();
	    		resolve(credentials);
	    	} else {
	    		alert('No existing user found with that name+password')
	    	}
    	}
    }
    async function signup(resolve: (c:Credentials) => void) {
    	const credentials = credentialsFromForm();
    	if (credentials !== null) {
	    	const success = await signupRemote(credentials)
    		//TODO actually do things the right way with errors etc.
	    	if (success) {
	    		loginLocal(credentials)
	    		exit();
	    		resolve(credentials);
	    	} else {
	    		alert('Error signing up (probably someone else has that username)')
	    	}
    	}
    }
    return new Promise((resolve, reject) => {
        $('#loginDialog').attr('active', 'true')
        $('.option[id="login"]').click(() => login(resolve))
        $('.option[id="signup"]').click(() => signup(resolve))
    })
}

function credentialParams(credentials:Credentials): string {
	return `username=${credentials.username}&hashedPassword=${credentials.hashedPassword}`
}

export function hashPassword(username:string, password:string ):string {
	return hash(password).toString(16)
}

// Source: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
// (definitely not a PRF)
function hash(s:string):number{
    var hash:number = 0;
    for (var i = 0; i < s.length; i++) {
        hash = ((hash<<5)-hash)+s.charCodeAt(i)
    }
    return hash
}

//Gives the merged list of updates, as well as updates that you'd have to apply to either side
//to bring it up to merged
export function mergeAndUpdate(xs:Entry[], ys:Entry[]): {merged: Entry[], xUpdates: Entry[], yUpdates:Entry[]} {
    function makeMap(entries:Entry[]): Map<uid,Entry> {
        const result = new Map()
        for (const entry of entries) {
            result.set(entry.id, entry)
        }
        return result
    }
    const xMap:Map<uid,Entry> = makeMap(xs)
    const yMap:Map<uid,Entry> = makeMap(ys)
    const merged:Entry[] = [];
    const xUpdates:Entry[] = [];
    const yUpdates:Entry[] = [];
    for (const entry of xs) {
        const other = yMap.get(entry.id)
        if (other == undefined || other.lastModified.getTime() < entry.lastModified.getTime()) {
            yUpdates.push(entry)
            merged.push(entry)
        }
        if (other !== undefined && other.lastModified.getTime() == entry.lastModified.getTime()) {
            merged.push(entry)
        }
    }
    for (const entry of ys) {
        const other = xMap.get(entry.id)
        if (other == undefined || other.lastModified.getTime() < entry.lastModified.getTime()) {
            xUpdates.push(entry)
            merged.push(entry)
        }
    }
    return {merged:merged, xUpdates:xUpdates, yUpdates:yUpdates}
}

function sendUpdates(updates:Entry[], credentials:Credentials) {
    const s = serializeEntries(updates)
    $.post(`update?${credentialParams(credentials)}`, `entries=${s}`)
}

async function getRemoteEntries(credentials:Credentials): Promise<Entry[]> {
    return new Promise(function(resolve, reject) {
        $.get(`entries?${credentialParams(credentials)}`, s => resolve(deserializeEntries(s)))
    }) 
}

// Records the total hours in different categories, and then 
type Report = {
    [label: string]: [number, Report]
}

//Splits on the first slash
//Second part is empty if no slash
//If first symbol is '?', whole thing is prefix
function prefixAndRemainder(s:string): [string, string] {
    const n = s.indexOf('/')
    if (n < 0 || s[0] == '?') return [s, '']
    return [s.slice(0, n), s.slice(n+1)]
}

function addToReport(label:Label, t:number, r:Report): void {
    if (label.length == 0) return
    const [a, b] = prefixAndRemainder(label)
    let sub = r[a]
    if (sub == undefined) {
        const newSub = {}
        addToReport(b, t, newSub)
        r[a] = [t, newSub]
    } else {
        sub[0] += t
        addToReport(b, t, sub[1])
    }
}

function matchLabel(category:Label, label:Label): string|null {
    const n = category.length
    if (n == 0) return label
    else if (label == category) return 'uncategorized'
    else if (label.slice(0, n+1) == category + '/') return label.slice(n+1)
    else return null
}

function makeReport(entries:Entry[], start:Date, end:Date, topLabels:Label[]): Report {
    console.log(entries[800], entries.length)
    entries = sortAndFilter(entries)
    const result:Report = {}
    for (const [e0, e1] of listPairs(it(entries))) {
        if (e1.time > start && e0.time < end) {
            const t0 = last(e0.time, start)
            const t1 = first(e1.time, end)
            const label = labelFrom(e0, e1)
            for (const topLabel of topLabels) {
                const subLabel:string|null = matchLabel(topLabel, label)
                if (t0 != t1 && subLabel != null) addToReport(label, t1.getTime() - t0.getTime(), result)
            }
        }
    }
    return result
}

function reportToString(report:Report): string {
    const parts = []
    for (const [label, [time, sub]] of Object.entries(report)) {
        parts.push(`${label}:${time}:${reportToString(sub)}`)
    }
    return `{${parts.join(',')}}`
}

function serializeReport(report:Report): string {
    return JSON.stringify(report)
}

function purifyReport(impure:any): Report {
    const result:Report = {}
    for (const [a, b] of Object.entries(impure)) {
        if (Array.isArray(b) && b.length == 2) {
            const [x, y] = b
            if (typeof(x) == 'number') {
                result[a] = [x, purifyReport(y)]
            } else {
                console.error(`Failed to parse report because ${x} is not a number.`)
            }
        } else {
            console.error(`Failed to parse report because ${b} is not an array of length 2.`)
        }
    }
    return result
}

export function deserializeReport(s:string): Report {
    const result = JSON.parse(s)
    return purifyReport(result)
}

function len(x:Report): number {
    return Object.keys(x).length
}

function total(x:Report): number {
    let result:number =0
    for (const [t, r] of Object.values(x)) {
        result += t
    }
    return result
}

// Compress paths (with no branches) into single steps
export function flattenReport(report:Report): Report {
    const entries = Object.entries(report)
    const result:Report = {}
    for (const [label, [time, sub]] of entries) {
        const flatSub = flattenReport(sub)
        const subEntries = Object.entries(flatSub);
        if (subEntries.length == 1 && subEntries[0][1][0] == time) {
            result[`${label}/${subEntries[0][0]}`] = subEntries[0][1]
        } else {
            result[label] = [time, flatSub] 
        }
    }
    return result
}

const TOTAL:string = 'total'
// If there are multiple top level parts in the report, put a "Total" category on top
// This seems like the wrong report semantics, but whatever
function capReport(report:Report): Report {
    if (len(report) == 1) return report
    const result:Report = {}
    result[TOTAL] = [total(report), report]
    return result
}

function totalReportTime(report:Report): number {
    let result:number = 0
    for (const [label, [time, sub]] of Object.entries(report)) {
        result += time
    }
    return result
}

function renderPercentage(x:number): string {
    return `${Math.round(x * 100)}%`
}

function renderColorPicker(label:Label, profile:Profile): HTMLInputElement {
    const picker = document.createElement('input')
    picker.setAttribute('type', 'color')
    picker.setAttribute('class', 'colorpicker')
    const colorHex = colorToHex(getColor(label, profile))
    picker.setAttribute('value', colorHex)
    picker.addEventListener('change', function() {
        console.log(picker.value)
        profile.colors.set(label, colorFromHex(picker.value))
        saveProfile(profile)
    })
    return picker
}

function renderReportLine(
    label:Label,
    time:number,
    onClick:() => void,
    onDoubleClick:() => void,
    hasChildren:boolean,
    fullLabel:Label,
    editParams:EditParams|null=null
): HTMLDivElement {
    const childString = (hasChildren) ? ' (+)' : ''
    const childClass = (hasChildren) ? ' clickable' : ''
    const result = div('ReportLine')
    const lineText = spanText(`reportLineText${hasChildren ? ' clickable' : ''}`, `[${renderDuration(time)}] ${label}${childString}`)
    lineText.addEventListener('click', onClick)
    lineText.addEventListener('dblclick', onDoubleClick)
    result.append(lineText)
    if (editParams != null) {
        const renameLink = spanText('renameButton clickable', '[rename]')
        renameLink.addEventListener('click', function() {
            labelPopup(fullLabel, editParams.callback, editParams.entries)
        })
        const picker = renderColorPicker(fullLabel, editParams.profile)
        result.append(picker, renameLink)
    }
    return result
    //return $(`<div class="reportLine"><span>${label}</span><span>${renderDuration(time)}</span><span>${renderPercentage(fraction)}</span></div>`)
}

//TODO: should have a profileChanged callback
interface EditParams {
    profile: Profile,
    callback: (t:TimeUpdate) => void,
    entries:Entry[],
}

function makeEditParams(entries:Entry[], credentials:Credentials): EditParams {
    function callback(update:TimeUpdate) {
        applyAndSave(entries, update, credentials)
    }
    return {profile: loadProfile(), callback: callback, entries: entries}
}

function addCallbackAfter(editParams:EditParams, callback: (t:TimeUpdate) => void): EditParams {
    return {...editParams, callback: function(t) {
        editParams.callback(t)
        callback(t)
    }}
}

function joinPrefix(prefix:string, label:string) {
    if (prefix == TOTAL || prefix.length == 0) return label
    return `${prefix}/${label}`
}

function renderReport(
    report:Report,
    editParams:EditParams|null = null,
    indentation:number=0,
    total:number|null = null,
    expanded:boolean=true,
    prefix:string = '',
    profile:Profile = loadProfile()
): [HTMLDivElement, () => void] {
    const totalNotNull = (total === null) ? totalReportTime(report) : total 
    const result = div('indent')
    const childExpanders:Array<() => void> = []
    function renderLineAndChildren(label:Label, time:number, sub:Report): [HTMLDivElement[], () => void] {
        const hasChildren = Object.keys(sub).length > 0
        const result:HTMLDivElement[] = []
        const fullLabel = joinPrefix(prefix, label)
        let toggleChildren = () => {}
        let expandAllChildren = () => {}
        if (hasChildren) {
            const [child, expander] = renderReport(sub, editParams, indentation+1, total, false, fullLabel, profile)
            let visible:boolean = true
            if (!expanded) {
                child.hidden = true
                visible = false
            }
            toggleChildren = function() {
                console.log(`toggle ${label}!`)
                if (visible) {
                    visible = false;
                    child.hidden = true
                } else {
                    visible = true;
                    child.hidden = false
                }
            }
            expandAllChildren = function() {
                console.log(`expand ${label}!`)
                visible = true;
                child.hidden = false;
                expander()
            }
            result.push(child)
        }
        const head = renderReportLine(label, time, toggleChildren, expandAllChildren, hasChildren, fullLabel, editParams)
        result.unshift(head)
        return [result, expandAllChildren]
    }
    const entries = Object.entries(report)
    entries.sort((x, y) => y[1][0] - x[1][0])
    for (const [label, [time, sub]] of entries) {
        const [elements, expandChildren] = renderLineAndChildren(label, time, sub)
        for (const e of elements) { result.append(e) }
        childExpanders.push(expandChildren)
    }
    return [result, () => { for (const f of childExpanders) f() }]
}

interface ReportParams {
    start?: string,
    end?: string,
    label?: Label
}

function renderParams(params:ReportParams): string {
    const parts:string[] = []
    if (params.start !== undefined) parts.push(`start=${params.start}`)
    if (params.end !== undefined) parts.push(`end=${params.end}`)
    if (params.label !== undefined) parts.push(`label=${params.label}`)
    return parts.join('&')
}

function reportFromParams(entries:Entry[], params: ReportParams): Report|null {
    const startParse = parseString(dateRule, params.start || 'start today')
    const endParse = parseString(dateRule, params.end || 'now')
    const labels = (params.label == undefined) ? [''] : params.label.split(',').map(x => x.trim())
    if (startParse == 'fail' || startParse == 'prefix') return null
    if (endParse == 'fail' || endParse == 'prefix') return null
    const startDate = startParse[0]
    const endDate = endParse[0]
    window.history.pushState(null, "", `report.html?${renderParams(params)}`)
    $('#startDate').val(params.start || '')
    $('#endDate').val(params.end || '')
    $('#topLabel').val(params.label || '')
    const report = makeReport(entries, specToDate(startDate, now(), 'closest'), specToDate(endDate, now(), 'closest'), labels)
    return capReport(flattenReport(report))
}

export async function loadReport() {
    const credentials = await getCredentials()
    const entries = await loadEntries(credentials)
    const editParams = makeEditParams(entries, credentials)
    function paramsFromInput(): ReportParams {
        return {
            start: $('#startDate').val() as string|undefined,
            end: $('#endDate').val() as string|undefined,
            label: $('#topLabel').val() as string|undefined,
        }
    }
    function paramsFromURL(url:string): ReportParams {
        const params = new URLSearchParams(url.split('?')[1])
        return {
            start: params.get('start') || undefined,
            end: params.get('end') || undefined,
            label: params.get('label') || undefined,
        }
    }

    function kd(e:any) {
        if (e.keyCode == 13) {
            e.preventDefault()
            render(paramsFromInput())
        }
    }
    $('.reportParamInput').keydown(kd)

    function render(params: ReportParams) {
        console.log(entries.length, entries[800])
        const report = reportFromParams(entries, params)
        if (report != null) displayReport(report, addCallbackAfter(editParams, () => render(params)))
    }

    window.addEventListener('popstate', function (event) {
        render(paramsFromURL(window.location.href))
    });
    $('#generate').click(() => render(paramsFromInput()))
    document.getElementById('editableReport')?.addEventListener('click', () => render(paramsFromInput()))
    $('#export').click(function() {
        const params = paramsFromInput()
        const report = reportFromParams(entries, params)
        if (report != null) {
            displayReport(report, addCallbackAfter(editParams, () => render(params)))
            exportReport(report)
        }
    })
    $('#startDate').val('start today')
    $('#endDate').val('now')
    render(paramsFromURL(window.location.href))
}

function baseURL(): string {
    const url = window.location;
    return url.protocol + '//' + url.host
}

function exportReport(report:Report) {
    $('#exportPopup').attr('active', 'true')
    $('#exportPopup').html(
        `<label for="link">Link:</label>` +
        `<textarea id="link"></textarea>` +
        `<div>` +
        `<span class="option" choosable id="copyLink">Copy (⏎)</span>` +
        `<span class="option" choosable id="cancel">Cancel (esc)</span>` +
        `</div>`
    )
    const id:string = randomLinkID()
    //TOOD: include base URL
    $('#link').val(`${baseURL()}/r/${id}`)
    $('#link').select()
    const serialized = serializeReport(report)
    console.log(serialized)
    $.get(`export?id=${id}&serialized=${encodeURIComponent(serialized)}`).done(function(x:string) {
        if (x != 'ok') {
            alert(x)
        }
    })
    function exit() {
        $('#link').blur()
        $('#exportPopup').attr('active', 'false')
    }
    function submit() {
        $('#link').select()
        document.execCommand('copy')
        exit()
    }
    $('#cancel').click(exit)
    $('#copyLink').click(submit)
    $('#link').keydown((e:any) => {
        if (e.keyCode == 27) {
            exit()
            e.preventDefault()
        } else if (e.keyCode == 13) {
            submit()
            e.preventDefault()
        }
    })
}

// Used in viewReport.ejs as well as from loadReport()
export function displayReport(report:Report, editParams:EditParams|null) {
    $('#reportContainer').empty()
    const editable = (document.getElementById('editableReport') as HTMLInputElement)
    console.log(report)
    $('#reportContainer').append(renderReport(
        capReport(flattenReport(report)),
        editable.checked ? editParams : null
    )[0])
}


function randomLinkID(): string {
    return Math.random().toString(36).substring(2, 8)
}
