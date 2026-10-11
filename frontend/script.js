const API = "/api";


/* ==============================
   DATABASE CONNECTION
================================ */

async function checkConnection() {

    const indicator =
        document.getElementById("connectionIndicator");

    const text =
        document.getElementById("connectionText");

    try {

        const response =
            await fetch(`${API}/test`);

        const data =
            await response.json();

        if (data.success) {

            indicator.classList.add("online");

            text.textContent =
                "PostgreSQL Connected Successfully";

        }

    } catch (error) {

        indicator.classList.add("offline");

        text.textContent =
            "PostgreSQL Connection Failed";

        console.error(error);

    }
}


/* ==============================
   LOAD PROJECTS
================================ */

async function loadProjects() {

    const container =
        document.getElementById("projectsList");

    try {

        const response =
            await fetch(`${API}/projects`);

        const projects =
            await response.json();

        container.innerHTML = "";

        if (projects.length === 0) {

            container.innerHTML =
                "<p>No projects found.</p>";

            return;
        }

        projects.forEach(project => {

            const card =
                document.createElement("div");

            card.className = "card";

            card.innerHTML = `
                <h3>${escapeHTML(project.title)}</h3>

                <p>
                    ${escapeHTML(project.description || "No description")}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${escapeHTML(project.status || "N/A")}
                </p>

                <p>
                    <strong>Client ID:</strong>
                    ${project.client_id}
                </p>

                <div class="price">
                    Budget: ₹${project.budget || "N/A"}
                </div>
            `;

            container.appendChild(card);

        });

    } catch (error) {

        container.innerHTML =
            "<p>Unable to load projects.</p>";

        console.error(error);

    }
}


/* ==============================
   LOAD CLIENTS
================================ */

async function loadClients() {

    const container =
        document.getElementById("clientsList");

    try {

        const response =
            await fetch(`${API}/clients`);

        const clients =
            await response.json();

        container.innerHTML = "";

        if (clients.length === 0) {

            container.innerHTML =
                "<p>No clients found.</p>";

            return;
        }

        clients.forEach(client => {

            const card =
                document.createElement("div");

            card.className = "card";

            card.innerHTML = `
                <h3>${escapeHTML(client.name)}</h3>

                <p>
                    <strong>Email:</strong>
                    ${escapeHTML(client.email)}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${escapeHTML(client.phone || "N/A")}
                </p>

                <p>
                    <strong>Company:</strong>
                    ${escapeHTML(client.company_name || "N/A")}
                </p>

                <p>
                    <strong>User ID:</strong>
                    ${client.user_id || "N/A"}
                </p>
            `;

            container.appendChild(card);

        });

    } catch (error) {

        container.innerHTML =
            "<p>Unable to load clients.</p>";

        console.error(error);

    }
}


/* ==============================
   ADD CLIENT
================================ */

document
    .getElementById("clientForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const message =
            document.getElementById("clientMessage");

        const client = {

            name:
                document.getElementById("clientName").value,

            email:
                document.getElementById("clientEmail").value,

            phone:
                document.getElementById("clientPhone").value,

            company_name:
                document.getElementById("companyName").value,

            user_id:
                document.getElementById("userId").value || null

        };


        try {

            const response =
                await fetch(`${API}/clients`, {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(client)

                });


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error || "Unable to add client"
                );

            }


            message.textContent =
                "Client added successfully.";

            message.style.color = "green";


            document
                .getElementById("clientForm")
                .reset();


            loadClients();


        } catch (error) {

            message.textContent =
                error.message;

            message.style.color = "red";

        }

    });


/* ==============================
   LOAD DATABASE TABLES
================================ */

async function loadTables() {

    const container =
        document.getElementById("tableList");

    try {

        const response =
            await fetch(`${API}/tables`);

        const tables =
            await response.json();

        container.innerHTML =
            `<div class="table-list"></div>`;

        const list =
            container.querySelector(".table-list");


        tables.forEach(table => {

            const item =
                document.createElement("div");

            item.className = "table-item";

            item.textContent =
                table.table_name;

            list.appendChild(item);

        });

    } catch (error) {

        container.innerHTML =
            "<p>Unable to load database tables.</p>";

        console.error(error);

    }
}


/* ==============================
   HTML SAFETY
================================ */

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* ==============================
   NAVIGATION
================================ */

function scrollToProjects() {

    document
        .getElementById("projects")
        .scrollIntoView();

}


function scrollToClients() {

    document
        .getElementById("clients")
        .scrollIntoView();

}


/* ==============================
   INITIALIZE
================================ */

checkConnection();
loadProjects();
loadClients();
loadTables();