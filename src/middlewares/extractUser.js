export default function (req, res, next) {
    // req.headers.authorization -- данные юзера
    // надо проверить подпись и
    // добавить юзера в req
    // req.user = extractedUserVkId
    req.user = req.headers.authorization.split('=')[1];
    next();
}
