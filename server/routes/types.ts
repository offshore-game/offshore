import express from 'express'

export type routeType = {
    route: string,
    callback: (req: express.Request, res: express.Response) => {

    }
}
