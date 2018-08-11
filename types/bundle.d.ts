export interface HoraroApi {
	data: {
		columns: string[];
		items: {
			data: {[key: string]: any};
			scheduled: string;
			scheduled_t: number;
		}[];
	};
}
