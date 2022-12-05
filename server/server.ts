import express from 'express'
import getRoutes from './routes/get';

const app = express();
const port = 8000;

for (const route of getRoutes) {
    app.get(route.route, route.callback)
}

app.listen(port, () => {
    console.warn(`Server listening on port ${port}`)
})
