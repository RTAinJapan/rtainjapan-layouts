export interface HoraroApi {
	data: {
		columns: string[];
		items: {
			data: {[key: string]: any};
			scheduled_t: number;
		}[];
	};
}
