using NodeJS, GenieFramework

Genie.loadapp()
Genie.up(async=true)

npm = npm_cmd()
node = nodejs_cmd()
`$npm install` |> run
`$npm run start` |> run

