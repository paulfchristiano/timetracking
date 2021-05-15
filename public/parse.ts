//TODO: wish I could accurately typecheck this...
//(at least it can be separated and be kind of easy to debug)
type Rule<T> = {kind: 'token', bind: (x:string) => T, applies: (x:string) => boolean}
    | {kind: 'sequence', parts: Rule<any>[], map: (xs:any[]) => T}
    | {kind: 'either', options: [Rule<any>, (x:any) => T][]}

export function parseString<T>(rule:Rule<T>, s:string) {
    return parse(rule, tokenize(s))
}

//fail means no match
//prefix means it may be possible to extend into a match
//[a, xs, ys] means that a was the result, xs is what got parsed, ys are the remaining tokens
function parse<T>(rule:Rule<T>, tokens:string[]): 'fail' | 'prefix' | [T, string[], string[]] {
    if (tokens.length == 0) return 'prefix'
    switch (rule.kind) {
        case 'token':
            for (let i = 0; i < tokens.length; i++) {
                if rule.applies(tokens[i]) {
                    return [rule.bind(tokens[i])]
                }
            }
            if (!rule.applies(tokens[0])) {
                return 'fail'
            }
            return [rule.bind(tokens[0]), [tokens[0]], tokens.slice(1)]
        case 'sequence':
            const vals = []
            for (const part of rule.parts) {
                const result = parse(part, tokens)
                if (result == 'fail' || result == 'prefix') return result
                vals.push(result[0])
                tokens = result[1]
            }
            return [rule.map(vals),vals,tokens]
        case 'either':
            let prefix = false;
            for (const [option, f] of rule.options) {
                const result = parse(option, tokens)
                if (result == 'prefix') {
                    prefix = true
                } else if (result == 'fail') { 
                    continue
                } else {
                    return [f(result[0]), result[1], result[2]]
                }
            }
            return 'fail'
        default:
            return assertNever(rule)
    }
}

const splitters = ` .:,;"'`

function isNum(c:string) {
    return (c == '0' || c == '1' || c == '2' || c == '3' || c == '4' || c == '5' || c == '6' || c == '7' || c == '8' || c == '9')
}

//splits into a sequence of blocks
//splitters become their own single-character blocks
//spaces also divide blocks
//also splits numbers from other stuff
export function tokenize(s:string): string[] {
    let nextPart:string[] = [];
    const parts = [];
    function addPart() {
        if (nextPart.length > 0) {
            parts.push(nextPart.join(''))
            nextPart = []
        }
    }
    for (const c of s) {
        if (c == ' ') {
            addPart()
        } else if (splitters.indexOf(c) >= 0) {
            addPart()
            parts.push(c)
        } else {
            if (nextPart.length > 0 && isNum(c) != isNum(nextPart[0]) ) {
                addPart()
            }
            nextPart.push(c)
        }
    }
    addPart()
    return parts
}

function raw(s:string, ignoreCaps:boolean=true): Rule<string> {
    if (ignoreCaps) s = s.toLowerCase()
    return {kind: 'token', applies: x => (ignoreCaps) ? x.toLowerCase() == s : x == s, bind: () => s}
}

function anyToken(tokens:string[]): Rule<number> {
    return {kind: 'either', options: tokens.map((token, i) => ([raw(token), () => i]))}
}

const month: Rule<number> = anyToken(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'])

const number: Rule<number> = {kind: 'token', applies: x => !isNaN(parseInt(x)), bind: x => parseInt(x)}

function seq<T>(rules:Rule<any>[], f: (xs:any[]) => T): Rule<T> {
    return {kind: 'sequence', parts: rules, map: f}
}

function any<T>(rules:Rule<T>[]): Rule<T> {
    return {kind: 'either', options: rules.map(r => [r, x => x])}
}

const colonTime:Rule<[number, number]> = seq([number, raw(':'), number], xs => [xs[0], xs[2]])

const hToken = any([raw('h'), raw('hours'), raw('hour')])
const mToken = any([raw('m'), raw('minute'), raw('minutes')])

function map<S, T>(from:Rule<S>, f:(s:S) => T): Rule<T> {
    return seq([from], xs => f(xs[0] as S))
}

export const duration: Rule<number> = any<number>([
    map(colonTime, xs => 60 * xs[0] + xs[1]),
    seq([number, hToken, number, mToken], xs => 60 * (xs[0] as number) + (xs[2] as number)),
    seq([number, hToken], xs => 60 * (xs[0] as number)),
    seq([number, mToken], xs => xs[0] as number),
    number,
])

const ampm:Rule<'am'|'pm'> = {kind: 'either', options: [[raw('am'), () => 'am'], [raw('pm'), () => 'pm']]}

export interface DateSpec {
    hours: number,
    minutes: number,
    ampm?: 'am'|'pm',
    month?: number,
    day?: number,
}

const ampmTimeRule:Rule<DateSpec> = any([
    seq([colonTime, ampm], xs => ({hours: xs[0][0], minutes: xs[0][1], ampm: xs[1]})),
    seq([number, ampm], xs => ({hours: xs[0], minutes: 0, ampm: xs[1]}))
])

const dateRule:Rule<DateSpec> = any<DateSpec>([
    seq([ampmTimeRule, raw(','), month, number], x => ({
        hours: x[0].hours,
        minutes: x[0].minutes,
        ampm: x[0].ampm,
        month: (x[2] as number),
        day: (x[3] as number),
    })),
    ampmTimeRule,
    seq([colonTime], x => ({
        hours: (x[0][0] as number),
        minutes: x[0][1] as number,
    }))
])

function assertNever(value: never): never {
    throw new Error("Shouldn't reach this case!")
}

export type Action = {kind: 'raw'} 
    | {kind: 'first', minutes: number}
    | {kind: 'number', number: number}
    | {kind: 'now'}
    | {kind: 'last', minutes: number}
    | {kind: 'until', time: DateSpec}
    | {kind: 'after', time: DateSpec}

export const actionRule:Rule<Action> = any<Action>([
    map(number, x => ({kind: 'number', number: x})),
    map(raw('now'), () => ({kind: 'now'})),
    seq([any([raw('first'), raw('last')]), duration], xs => ({kind: xs[0] as ('first' | 'last'), minutes: xs[1] as number})),
    seq([any([raw('until'), raw('after')]), dateRule], xs => ({kind: xs[0] as ('until'| 'after'),  time: xs[1] as DateSpec}))
])