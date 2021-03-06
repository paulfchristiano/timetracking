import express from 'express'
import bodyParser from 'body-parser'

const PORT = process.env.PORT || 5000

import {Entry, serializeEntries, deserializeEntries} from './public/entries.js'

import postgres from 'postgres'
const db_url = process.env.DATABASE_URL
const runningLocally = (db_url == undefined || db_url.search('localhost') > 0)
const sql = postgres(
    db_url,
    runningLocally ? {} : {ssl: {rejectUnauthorized: false}}
)

export type Credentials = {username: string, hashedPassword: string}

async function signup(credentials:Credentials): Promise<void> {
    await sql`INSERT INTO users (name, password_hash)
                VALUES (
                ${credentials.username},
                ${credentials.hashedPassword}
                )`
}

async function userExists(credentials:Credentials): Promise<boolean> {
    const results = await sql`SELECT * FROM users
        WHERE name=${credentials.username}
        AND password_hash=${credentials.hashedPassword}`
    return (results.length > 0)
}

async function updateEntry(credentials:Credentials, entry:Entry): Promise<void> {
    await sql`INSERT INTO entries (username, id, time, before, after, lastmodified, deleted)
        VALUES (
            ${credentials.username},
            ${entry.id},
            ${entry.time.getTime()},
            ${entry.before || null},
            ${entry.after || null},
            ${entry.lastModified.getTime()},
            ${entry.deleted}
        )
        ON CONFLICT ON CONSTRAINT uniqueness DO UPDATE SET
            before = EXCLUDED.before,
            after = EXCLUDED.after,
            time = EXCLUDED.time,
            lastmodified = EXCLUDED.lastmodified,
            deleted = EXCLUDED.deleted
        WHERE
            entries.lastmodified < EXCLUDED.lastmodified
    `
}

async function getEntries(credentials:Credentials): Promise<Entry[]> {
    const rows = await sql`SELECT id, time, before, after, lastmodified, deleted from entries WHERE username = ${credentials.username}`
    return rows.map((row:any) => ({
        time: new Date(row.time as number),
        before: (row.before || undefined) as string|undefined,
        after: (row.after || undefined) as string|undefined,
        lastModified: new Date(row.lastmodified as number),
        deleted: row.deleted as boolean,
        id: row.id as string,
    }))
}

const app = express()

app.use(bodyParser.urlencoded({extended: false}))

app
    .set('view engine', 'ejs')
    .set('views', './views')
    .get('/test', async (req: any, res: any) => {
        res.send('Hello, world!')
    })
    .use(express.static('./public'))
    .post('/signup', async (req: any, res:any) => {
        const credentials:Credentials = {
          username:req.query.username,
          hashedPassword:req.query.hashedPassword
        }
        if (credentials.username.length < 1) {
          res.send('Non-empty username required')
        } else if (credentials.hashedPassword.length < 1) {
          res.send("Non-empty password hash required (shouldn't be possible)")
        } else {
          try {
            await signup(credentials)
            res.send('ok')
          } catch (e) {
              console.log(e)
            res.send(e)
          }
        }
      })
    .post('/login', async (req: any, res:any) => {
    const credentials:Credentials = {
        username:req.query.username,
        hashedPassword:req.query.hashedPassword
    }
    try {
        const success:boolean = await userExists(credentials)
        if (success) {
        res.send('ok')
        } else {
        res.send('username+password not found')
        }
    } catch (e) {
        res.send(e)
    }
    })
    .post('/update', async (req: any, res:any) => {
        console.log('updating!')
        const credentials:Credentials = {
            username:req.query.username,
            hashedPassword:req.query.hashedPassword
        }
        try {
            const success:boolean = await userExists(credentials)
            if (success) {
                const entries = deserializeEntries(decodeURIComponent(req.body.entries))
                for (const entry of entries) {
                    updateEntry(credentials, entry)
                }
                res.send('ok')
            } else {
                res.send('username+password not found')
            }
        } catch (e) {
            res.send(e)
        }
    })
    .get('/entries', async (req: any, res:any) => {
        const credentials:Credentials = {
            username:req.query.username,
            hashedPassword:req.query.hashedPassword
        }
        try {
            const success:boolean = await userExists(credentials)
            if (success) {
                const entries = await getEntries(credentials)
                const s = serializeEntries(entries)
                res.send(encodeURIComponent(s))
            } else {
                res.send('username+password not found')
            }
        } catch (e) {
            res.send(e)
        }
    })
    .get('/export', async (req: any, res:any) => {
        const id = req.query.id;
        try{
          const results = await sql`
            INSERT INTO reports (id, serialized)
            VALUES (${id}, ${decodeURIComponent(req.query.serialized)})
          `
          res.send('ok')
        } catch(err) {
          res.send(err)
        }
    })
    .get('/r/:id', async (req:any, res:any) => {
        const result = await sql`
            SELECT serialized FROM reports
            WHERE id = ${req.params.id}
        `
        if (result.length < 1) res.send('Report not found')
        res.render('viewReport', {report: encodeURIComponent(result[0].serialized)}) 
    })
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))