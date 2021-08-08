import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import bodyParser from 'body-parser';
import helmet from 'helmet';
import Job from './cron/cron.job';
import { ERROR_MESSAGE } from './constants/common.constant';
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
		res.status(200).json({
			status: true,
		});
	} catch (error) {
		res.status(500).send(error);
	}
});

app.get(`/api/v1/stations`, async (req: Request, res: Response) => {
	try {
		if (!req.query.at) {
			res.status(400).send(ERROR_MESSAGE.BadRequest);
		}

		const stationAndWeatherDetails = await getWeatherAndStations(req.query.at as string);

		if (!stationAndWeatherDetails) {
			res.status(500).send({ message: ERROR_MESSAGE.Internal_Error });
		}

		res.status(200).json({
			at: stationAndWeatherDetails?.at,
			stations: stationAndWeatherDetails?.stations,
			weather: stationAndWeatherDetails?.weather,
		});
	} catch (error) {
		res.status(500).send(error);
	}
});

app.get(`/api/v1/stations/:kioskId`, async (req: Request, res: Response) => {
	try {
		const kioskId: number = +req.params.kioskId;
		const { at, from, to } = req.query as any;

		if (!at && (!from || !to)) {
			res.status(400).send(ERROR_MESSAGE.BadRequest);
		}

		if (at) {
			const stationAndWeatherDetails = await getWeatherAndStations(at as string, kioskId);

			if (!stationAndWeatherDetails) {
				res.status(404).send({ message: ERROR_MESSAGE.NotFound });
			}

			res.status(200).json(stationAndWeatherDetails);
		}
		if (from && to) {
			const frequency = req.query.frequency === 'daily' ? req.query.frequency : 'hourly';
			const stationAndWeatherDetails = await getWeatherAndStationsBetweenDates(from, to, kioskId, frequency);

			if (!stationAndWeatherDetails) {
				res.status(404).send({ message: ERROR_MESSAGE.NotFound });
			}

			res.status(200).json(stationAndWeatherDetails);
		}

		res.status(404).send({ message: ERROR_MESSAGE.NotFound });
	} catch (error) {
		res.status(500).send(error);
	}
});

app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));