import * as Sequelize from 'sequelize';
import { db } from "../config/db.config";

export const StationsWeatherDetails = db.define('StationsWeatherDetails', {
	id: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		type: Sequelize.INTEGER
	},
	allStationsData: {
		type: Sequelize.JSONB,
	},
	weatherData: {
		type: Sequelize.JSONB,
	},
	createdAt: {
		allowNull: false,
		type: Sequelize.DATE
	},
	deletedAt: {
		type: Sequelize.DATEONLY
	},
});