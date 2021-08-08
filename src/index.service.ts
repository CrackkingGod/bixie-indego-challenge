import moment from 'moment';
import { Op } from 'sequelize';
import { ApiError } from './constants/api.error';
import { ERROR_MESSAGE, HTTP_STATUS_CODES } from './constants/common.constant';
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
            throw new ApiError(false, HTTP_STATUS_CODES.NotFound, ERROR_MESSAGE.NotFound);
        }

        let bikeStationsData = stationAndWeatherDetails?.allStationsData;
        const weatherData = stationAndWeatherDetails?.weatherData;

        if (kioskId) {
            bikeStationsData = bikeStationsData.features.find(station => {
                return station.properties.kioskId === kioskId;
            });
        }
        if (!bikeStationsData) {
            throw new ApiError(false, HTTP_STATUS_CODES.NotFound, ERROR_MESSAGE.NotFound);
        }

        return {
            at: stationAndWeatherDetails.createdAt,
            stations: bikeStationsData,
            weather: weatherData,
        }

    } catch (error) {
        return {
            status: error?.status,
            statusCode: error?.statusCode,
            message: error?.message
        };
    }
};

export const getWeatherAndStationsBetweenDates = async (from: string, to: string, kioskId: number = undefined, frequency): Promise<any> => {
    try {
        from = moment.utc(from).format();
        to = moment.utc(to).format();

        // check if date_to is greater than today and give error
        if (moment.utc(from).isSameOrAfter(moment.utc(to))) {
            throw new ApiError(false, HTTP_STATUS_CODES.BadRequest, ERROR_MESSAGE.BadRequest);
        }
        frequency = (frequency === 'daily' ? 'd' : 'h');

        const resultList = [];
        for (let frequencyFrom = moment.utc(from); frequencyFrom.isSameOrBefore(to); frequencyFrom.add(1, frequency)) {

            const stationAndWeatherDetails: any = await StationsWeatherDetails.findOne({
                attributes: ['id', 'createdAt', 'allStationsData', 'weatherData'],
                where: {
                    createdAt: {
                        // Below line for data needed strictly between the frequency interval
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
                if (bikeStationsData) {
                    resultList.push({
                        at: stationAndWeatherDetails.createdAt,
                        stations: bikeStationsData,
                        weather: stationAndWeatherDetails?.weatherData,
                    });
                }

            }
        }
        return resultList;

    } catch (error) {
        return {
            status: error?.status,
            statusCode: error?.statusCode,
            message: error?.message
        };
    }
};