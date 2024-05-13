function updateDiagram() {
    console.log("Updating diagram...");

    const frontend = $('#frontendInputs input').map(function () {
        return $(this).val();
    }).get();

    const reverseProxy = $('#reverseProxy').val();

    const backend = $('#backendInputs input').map(function () {
        return $(this).val();
    }).get();

    const database = $('#databaseInputs input').map(function () {
        return $(this).val();
    }).get();

    console.log("Frontend:", frontend);
    console.log("Reverse Proxy:", reverseProxy);
    console.log("Backend:", backend);
    console.log("Database:", database);

    let diagramContent = `
        <div class="node-container">
            <div class="node-label">Frontend</div>`;

    if (Array.isArray(frontend)) {
        frontend.forEach((server) => {
            console.log(server.split(","));
            diagramContent += `<span class="server-ip">${server.split(',')[1]}</span>`;
        });
    } else {
        diagramContent += `<span class="server-ip">${frontend.ip}</span>`;
    }

    if (reverseProxy) {
        diagramContent += `
            <div class="arrow"></div>
            <div class="node-label">Reverse Proxy</div>
            <span class="server-ip">${reverseProxy}</span>`;
    }

    if (Array.isArray(backend)) {
        backend.forEach((server, index) => {
            if (index !== 0) {
                diagramContent += `<span class="server-ip new-line"></span>`;
            }
            diagramContent += `
                <div class="arrow"></div>
                <div class="node-label">Backend</div>
                <span class="server-ip">${server}</span>`;
        });
    } else {
        diagramContent += `<span class="server-ip">${backend}</span>`;
    }

    diagramContent += `
            <div class="arrow"></div>
            <div class="node-label">Database</div>`;

    if (Array.isArray(database)) {
        database.forEach((server) => {
            diagramContent += `<span class="server-ip">${server}</span>`;
        });
    } else {
        diagramContent += `<span class="server-ip">${database}</span>`;
    }

    diagramContent += `</div>`;

    $("#diagramPreview").html(diagramContent);
}