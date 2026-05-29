import {WebSocketServer, type WebSocket} from "ws";

const randomInt = (max: number) => {
	return Math.ceil(Math.random() * max);
};

const wss = new WebSocketServer({port: 8080});
let total = randomInt(10000);

wss.on("connection", (ws: WebSocket) => {
	const a = () => {
		const amount = randomInt(10000);
		total += amount;
		const data = JSON.stringify({amount, new_total: total});
		ws.send(data);
		console.log(data);
		setTimeout(a, randomInt(10 * 1000));
	};
	a();
});
