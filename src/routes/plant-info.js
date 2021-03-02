import saveImage from '../middlewares/save-image.js';

export default app => {
    app.post('/plants-info', saveImage, (req, res) => {
        res.send(`http://localhost:3000/img/${req.imageFileName}`)
        // TODO: send api request
    })
}