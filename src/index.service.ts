import moment from 'moment';
import { Op } from 'sequelize';
import { StationsWeatherDetails } from './models/StationsWeatherDetails';

export const getWeatherAndStations = async (at: string, kioskId: number = undefined) => {
    try {
        const stationAndWeatherDetails: any = await StationsWeatherDetails.findOne({
            attributes: ['id', 'createdAt', 'allStationsData', 'weatherData'],
            where: {
                createdAt: {
                    [Op.gte]: at,
                }
            },
            raw: true,
        });
        if (!stationAndWeatherDetails) {
            throw new Error('No Data found.');
        }

        let bikeStationsData = stationAndWeatherDetails?.allStationsData;
        const weatherData = stationAndWeatherDetails?.weatherData;

        if (kioskId) {
            bikeStationsData = bikeStationsData.features.find(station => {
                return station.properties.kioskId === kioskId;
            });
        }
        if (!bikeStationsData) {
            throw new Error('No Data found for given kioskId.');
        }

        return {
            at: stationAndWeatherDetails.createdAt,
            stations: bikeStationsData,
            weather: weatherData,
        }

    } catch (error) {
        return null;
    }
};

export const getWeatherAndStationsBetweenDates = async (from: string, to: string, kioskId: number = undefined, frequency) => {
    try {
        // check if date_to is greater than today and give error
        frequency = (frequency === 'daily' ? 'd' : 'h');

        // console.log("from : ", moment.utc(from).add(1, `${frequency}` as any).format());
        // console.log("from : ", moment.utc(to).format());

        from = moment.utc(from).format();
        to = moment.utc(to).format();

        // get createdAt for that value
        const resultList = [];
        for (let frequencyFrom = moment.utc(from); frequencyFrom.isSameOrBefore(to); frequencyFrom.add(1, frequency)) {
            // console.log(frequencyFrom.format(), moment(frequencyFrom).add(1, frequency).format());

            const stationAndWeatherDetails: any = await StationsWeatherDetails.findOne({
                attributes: ['id', 'createdAt', 'allStationsData', 'weatherData'],
                where: {
                    createdAt: {
                        // [Op.between]: [frequencyFrom.format(), moment(frequencyFrom).add(1, frequency).format()]
                        [Op.gte]: frequencyFrom.format(),
                    }
                },
                raw: true,
                order: [
                    ['createdAt', 'asc'],
                ]
            });
            if (stationAndWeatherDetails && kioskId) {
                const bikeStationsData = stationAndWeatherDetails?.allStationsData?.features.find(station => {
                    return station.properties.kioskId === kioskId;
                });
                resultList.push({
                    at: stationAndWeatherDetails.createdAt,
                    stations: bikeStationsData,
                    weather: stationAndWeatherDetails?.weatherData,
                });
            }
        }
        return resultList;

    } catch (error) {
        return null;
    }
};