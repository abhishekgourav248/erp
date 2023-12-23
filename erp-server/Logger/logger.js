import winston from "winston";

const createLogger = (filename) => {
    return winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp(), // Add a timestamp to log entries
            winston.format.simple() // Use the default simple format
          ),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: `./Logger/logs/${filename}.log` })  // Log to a file
        ]
      });
}

export default createLogger;