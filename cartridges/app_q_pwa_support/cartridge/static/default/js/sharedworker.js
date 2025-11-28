// simple fan out message queue worker
const ports = []
onconnect = function (event) {
    const port = event.ports[0];
    ports.push(port);
    port.onmessage = function (e) {
        ports.forEach((p) => {
            p.postMessage(e.data);
        })
    };
};
