import generateRandomHex from '../core/lib/generate-random-hex.js';

export default (req, res, next) => {
    const file = req.files.image;
    const extension = file.name.split('.').pop();
    const fileName = generateRandomHex() + '.' + extension;
    file.mv(process.cwd() + '/public/img/' + fileName, function(err) {
        if (err) {
            // TODO: throw error
        }
        req.imageFileName = fileName;
        next();
    });
}