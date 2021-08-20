import WebSocket from "ws";

const randomInt = (max: number) => {
	return Math.ceil(Math.random() * max);
};

const ws = new WebSocket.Server({port: 8080});
let total = randomInt(10000);

ws.on("connection", (ws) => {
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
