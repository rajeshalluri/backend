const express = require("express")
const app = express.Router()

const checkToken = require(`${__dirname}/../../middleware/checkToken`)
const cache = require(`${__dirname}/../../structs/caching`)
const errors = require(`${__dirname}/../../structs/errors`)

app.use(require(`${__dirname}/cloudstorage.js`))
app.use(require(`${__dirname}/timeline.js`))


app.use(require(`${__dirname}/mcp`))

app.all("/api/v2/versioncheck/Windows", (req, res) => {
    if(req.method != "GET") return res.status(405).json(errors.method("fortnite", "prod-live"))
    res.json({type: "NO_UPDATE"})
})

app.all("/api/game/v2/tryPlayOnPlatform/account/:accountId", checkToken, (req, res) => {
    if(req.method != "POST") return res.status(405).json(errors.method("fortnite", "prod-live"))
    res.setHeader('Content-Type', 'text/plain')
    res.send(true)
})

app.all("/api/game/v2/enabled_features", checkToken,  (req, res) => {
    if(req.method != "GET") return res.status(405).json(errors.method("fortnite", "prod-live"))
    res.json([])
})

app.all("/api/storefront/v2/keychain", checkToken, (req, res) => {
    if(req.method != "GET") return res.status(405).json(errors.method("fortnite", "prod-live"))

    res.json(cache.getKeychain())
})

app.all("/api/game/v2/matchmakingservice/ticket/player/:accountId", checkToken, (req, res) => {
    res.status(403).json(errors.create(
        "Matchmaking is not supported on FDev. Sorry for any inconvience.", 12002,
        "dev.slushia.fdev.matchmaking.not_enabled",
        "fortnite", "prod"
    ))
})

app.all("/api/game/v2/privacy/account/:accountId", checkToken, (req, res) => {
    res.json({
        acceptInvites: "public"
    })
})

app.use((req, res, next) => {
    res.status(404).json(errors.create(
        "errors.com.epicgames.common.not_found", 1004,
        "Sorry the resource you were trying to find could not be found",
        "fortnite", "prod"
    ))
})

module.exports = app