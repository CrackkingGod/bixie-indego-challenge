import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import bodyParser from 'body-parser';
import helmet from 'helmet';
import Job from './cron/cron.job';
import { ERROR_MESSAGE, HTTP_STATUS_CODES } from './constants/common.constant';
import { db } from './config/db.config';
import { getWeatherAndStations, getWeatherAndStationsBetweenDates } from './index.service';

const PORT = process.env.PORT || 3000;
const app: Express = express();

Job.start();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.authenticate()
	.then(() => console.log('Database Connected'))
	.catch(err => console.log('Error', err));
db.sync();

app.get(`/`, (req: Request, res: Response) => {
	try {
		res.status(HTTP_STATUS_CODES.Ok).json({
			status: true,
		});
	} catch (error) {
		res.status(HTTP_STATUS_CODES.InternalServer).send(error);
	}
});

/** Snapshot of all stations at a specified time
 * @query at : snapshot of data on or after the requested time and the data
 */
app.get(`/api/v1/stations`, async (req: Request, res: Response) => {
	try {
		if (!req.query.at) {
			res.status(HTTP_STATUS_CODES.BadRequest).send({ message: ERROR_MESSAGE.BadRequest });
		}

		const stationAndWeatherDetails = await getWeatherAndStations(req.query.at as string);

		if (stationAndWeatherDetails?.status === false) {
			const { statusCode, message } = stationAndWeatherDetails;
			res.status(statusCode).send({ message });
		}
		if (!stationAndWeatherDetails) {
			res.status(HTTP_STATUS_CODES.InternalServer).send({ message: ERROR_MESSAGE.Internal_Error });
		}

		res.status(HTTP_STATUS_CODES.Ok).json({
			at: stationAndWeatherDetails?.at,
			stations: stationAndWeatherDetails?.stations,
			weather: stationAndWeatherDetails?.weather,
		});
	} catch (error) {
		res.status(HTTP_STATUS_CODES.InternalServer).send(error);
	}
});

/**
 * @query kioskId : Id of the station to get its data
 * @query at : Time for data on or after the requested time
 * @query from,to,frequency : Data at interval of frequency of (hourly,daily) between from - to
 */
app.get(`/api/v1/stations/:kioskId`, async (req: Request, res: Response) => {
	try {
		const kioskId: number = +req.params.kioskId;
		const { at, from, to } = req.query as any;

		if (!at && (!from || !to)) {
			res.status(HTTP_STATUS_CODES.BadRequest).send({ message: ERROR_MESSAGE.BadRequest });
		}

		if (at) {
			const stationAndWeatherDetails = await getWeatherAndStations(at as string, kioskId);

			if (stationAndWeatherDetails?.status === false) {
				const { statusCode, message } = stationAndWeatherDetails;
				res.status(statusCode).send({ message });
			}
			if (!stationAndWeatherDetails) {
				res.status(HTTP_STATUS_CODES.NotFound).send({ message: ERROR_MESSAGE.NotFound });
			}

			res.status(HTTP_STATUS_CODES.Ok).json(stationAndWeatherDetails);
		}
		if (from && to) {
			const frequency = req.query.frequency === 'daily' ? req.query.frequency : 'hourly';
			const stationAndWeatherDetails = await getWeatherAndStationsBetweenDates(from, to, kioskId, frequency);

			if (stationAndWeatherDetails?.status === false) {
				const { statusCode, message } = stationAndWeatherDetails;
				res.status(statusCode).send({ message });
			}
			if (!stationAndWeatherDetails) {
				res.status(HTTP_STATUS_CODES.NotFound).send({ message: ERROR_MESSAGE.NotFound });
			}

			res.status(HTTP_STATUS_CODES.Ok).json(stationAndWeatherDetails);
		}

		res.status(HTTP_STATUS_CODES.NotFound).send({ message: ERROR_MESSAGE.NotFound });
	} catch (error) {
		res.status(HTTP_STATUS_CODES.InternalServer).send(error);
	}
});

app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));