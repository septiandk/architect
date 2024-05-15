const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

const serversFilePath = path.join(__dirname, 'servers.json');
let servers = [];

if (fs.existsSync(serversFilePath)) {
    const serversData = fs.readFileSync(serversFilePath);
    servers = JSON.parse(serversData);
}

// Routes
app.get('/', (req, res) => {
    res.render('index', { servers });
});

app.get('/server/diagram/list', (req, res) => {
    res.render('serverDiagram', { servers });
});

app.get('/diagram/:appName', (req, res) => {
    const appName = req.params.appName;
    const server = servers.find(server => server.appName === appName);
    res.render('diagram', { server });
});

app.get('/form/:type', (req, res) => {
    const type = req.params.type;
    res.render('forms/diagramform', { type });
});

app.post('/addServer', (req, res) => {
    const { appName, frontend, isPublic, reverseProxy, backend, database } = req.body;
    const frontendIPs = frontend.split(',').map(ip => ip.trim());
    const fedomain = frontendIPs.shift();
    const feip = frontendIPs;
    const formattedFrontend = {
        domain: fedomain, 
        ip: feip
    };

    servers.push({ appName, frontend: formattedFrontend, isPublic, reverseProxy, backend, database });
    saveServers();
    res.redirect('/');
});

app.get('/edit/:appName', (req, res) => {
    const appName = req.params.appName;
    const server = servers.find(server => server.appName === appName);
    res.render('edit', { server });
});

app.post('/edit/:appName', (req, res) => {
    const appName = req.params.appName;
    const index = servers.findIndex(server => server.appName === appName);
    if (index !== -1) {
        const { frontend, isPublic, reverseProxy, backend, database } = req.body;

        // Update frontend field separately to match the required structure
        let updatedServer = { ...servers[index] }; // Make a copy of the existing server object
        if (frontend) {
            if (frontend.includes(',')) {
                const [domain, ip] = frontend.split(',');
                updatedServer.frontend = {
                    domain: domain.trim(),
                    ip: [ip.trim()]
                };
            } else {
                updatedServer.frontend = {
                    domain: '',
                    ip: [frontend.trim()]
                };
            }
        }

        if (isPublic !== undefined) updatedServer.isPublic = isPublic;
        if (reverseProxy) updatedServer.reverseProxy = reverseProxy;
        if (backend) updatedServer.backend = backend;
        if (database) updatedServer.database = database;

        servers[index] = updatedServer;
        saveServers();
    }
    res.redirect('/');
});


app.post('/delete/:appName', (req, res) => {
    const appName = req.params.appName;
    servers = servers.filter(server => server.appName !== appName);
    saveServers();
    res.redirect('/server/diagram/list');
});

function saveServers() {
    fs.writeFileSync(serversFilePath, JSON.stringify(servers, null, 2));
}

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
