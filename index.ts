import express from 'express'
const PORT = process.env.PORT || 5000

import postgres from 'postgres'
const sql = (process.env.DATABASE_URL == undefined) ? null : postgres(process.env.DATABASE_URL)

export type Credentials = {username: string, hashedPassword: string}

async function signup(credentials:Credentials): Promise<void> {
    await sql`INSERT INTO users (name, password_hash)
             VALUES (
               ${credentials.username},
               ${credentials.hashedPassword}
    )`
  }
  
  //TODO: deal with the login logic
  async function userExists(credentials:Credentials): Promise<boolean> {
    const results = await sql`SELECT * FROM users
      WHERE name=${credentials.username}
      AND password_hash=${credentials.hashedPassword}`
    return (results.length > 0)
  }
  

express()
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
  
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))