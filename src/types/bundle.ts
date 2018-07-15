export interface HoraroApi {
	columns: string[];
	items: {
		data: {[key: string]: any};
		scheduled_t: number;
	}[]
}
