class ServerError extends Error {
    static defaultMessage = 'Server is out of service';

    code = 1000;

    constructor(message) {
        message ||= ServerError.defaultMessage;
        super(message);
    }

}