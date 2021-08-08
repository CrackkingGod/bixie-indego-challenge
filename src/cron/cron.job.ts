import { CronJob } from 'cron';
import axios from 'axios';
import { StationsWeatherDetails } from '../models/StationsWeatherDetails';
import { CRON_EXPRESSION_5_MIN } from '../constants/common.constant';

export default new CronJob(CRON_EXPRESSION_5_MIN, async () => {
	console.log('You will see this message every 5 minute');
	const cityName = 'Philadelphia';
	const bikeStationsData = await (await axios.get('https://kiosks.bicycletransit.workers.dev/phl')).data;

	const weatherData = await (await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.OPEN_WEATHER_API_KEY}`)).data;

	const addedData = await StationsWeatherDetails.create({
		allStationsData: bikeStationsData,
		weatherData,
		createdAt: new Date().toISOString(),
	});
	console.log(addedData.get()?.id);
}, null, true, 'America/Los_Angeles');