import express from 'express'
const PORT = process.env.PORT || 5000

import postgres from 'postgres'
const sql = (process.env.DATABASE_URL == undefined) ? null : postgres(process.env.DATABASE_URL)

express()
    .get('/test', async (req: any, res: any) => {
        res.send('Hello, world!')
    })
    .use(express.static('./public'))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))