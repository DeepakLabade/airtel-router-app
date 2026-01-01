import express from "express"
import { config } from "./config/config.js"

const app = express()

app.listen(config.PORT, () => {
    console.log(`server is runnint at PORT ${config.PORT}`)
})

app.get("/", (req, res) => {
    res.json({
        msg: "hii there"
    })
})