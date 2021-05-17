export interface Entry {
    before?: string,
    after?: string,
    time: Date,
    id: uid,
    lastModified: Date,
    deleted: boolean,
}

export type uid = string

export function newUID(): uid {
    return Math.random().toString(36).substring(2, 10)
}


export type Label = string

export function makeNewEntry(time:Date, before: string|undefined, after: string|undefined): Entry {
    return {time: time, id: newUID(), lastModified: now(), before: before, after: after, deleted: false}
}

export function serializeEntries(entries:Entry[]): string {
    return JSON.stringify(entries.map(x => ({
        time: x.time.getTime(),
        before: x.before,
        after: x.after,
        lastModified: x.lastModified.getTime(),
        deleted: x.deleted,
        id: x.id,
    })))
}

export function deserializeEntries(s:string): Entry[] {
    const result:Entry[] = []
    try {
        const json = JSON.parse(s)
        if (Array.isArray(json)) {
            for (const x of json) {
                const time:Date|undefined = (typeof x.time == 'number') ? new Date(x.time) : undefined
                if (time === undefined) continue
                const lastModified:Date = (typeof x.lastModified == 'number')
                    ? new Date(x.lastModified)
                    : now()
                const before:string|undefined = (typeof x.before == 'string') ? x.before : undefined
                const after:string|undefined = (typeof x.after == 'string') ? x.after : undefined
                const deleted:boolean = (typeof x.deleted == 'boolean') ? x.deleted : false
                const id:string = (typeof x.id == 'string') ? x.id : newUID()
                result.push({time:time, lastModified:lastModified, before:before, after:after, deleted:deleted, id:id})
            }
        }
    } finally {
        return result
    }
}

function now(): Date {
    return new Date()
}
