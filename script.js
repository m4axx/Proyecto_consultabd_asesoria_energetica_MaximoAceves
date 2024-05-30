const apiUrl = 'http://192.168.101.4:3000/asesoria_energetica';

document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;

    if (currentPath.endsWith('consulta.html')) {
        setupConsulta();
    } else if (currentPath.endsWith('crud.html')) {
        setupAddEdit();
    } else if (currentPath.endsWith('graficos.html')) {
        setupStats();
    }
});

function setupConsulta() {
    document.getElementById('search-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const cif = document.getElementById('query').value.trim();
        const nombre = document.getElementById('queryNombre').value.trim();
        const comercializadora = document.getElementById('queryComercializadora').value.trim();
        const estado = document.getElementById('queryEstado').value.trim();

        let queryString = '';
        if (cif) queryString += `cif=${cif}&`;
        if (nombre) queryString += `nombre=${nombre}&`;
        if (comercializadora) queryString += `comercializadora=${comercializadora}&`;
        if (estado) queryString += `estado=${estado}`;

        fetch(`${apiUrl}?${queryString}`)
            .then(response => response.json())
            .then(data => displayResults(data))
            .catch(error => console.error('Error fetching data:', error));
    });
}

function setupAddEdit() {
    document.getElementById('add-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const newContract = {
            CIF: document.getElementById('add-CIF').value,
            NOMBRE: document.getElementById('add-NOMBRE').value,
            CUPS: document.getElementById('add-CUPS').value,
            TARIFA: document.getElementById('add-TARIFA').value,
            COMERCIALIZADORA: document.getElementById('add-COMERCIALIZADORA').value,
            COMERCIAL: document.getElementById('add-COMERCIAL').value,
            ESTADO: document.getElementById('add-ESTADO').value,
            ACCIONES: document.getElementById('add-ACCIONES').value,
            FECHA: document.getElementById('add-FECHA').value,
            PAGADO: document.getElementById('add-PAGADO').value,
            O50: document.getElementById('add-O50').value,
            DOCUMENTOS: document.getElementById('add-DOCUMENTOS').value,
            FECHA_CONTRATO: document.getElementById('add-FECHA_CONTRATO').value
        };

        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newContract)
        })
        .then(response => response.json())
        .then(data => {
            alert('Contrato añadido exitosamente.');
            document.getElementById('add-form').reset();
        })
        .catch(error => console.error('Error adding contract:', error));
    });
}


    document.getElementById('search-edit-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const query = document.getElementById('edit-query').value.trim();
        if (query) {
            fetch(`${apiUrl}?search=${query}`)
                .then(response => response.json())
                .then(data => displayEditResults(data))
                .catch(error => console.error('Error fetching data:', error));
        }
    });

    document.getElementById('edit-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const editedContract = {
            id: document.getElementById('edit-id').value,
            CIF: document.getElementById('edit-CIF').value,
            NOMBRE: document.getElementById('edit-NOMBRE').value,
            CUPS: document.getElementById('edit-CUPS').value,
            TARIFA: document.getElementById('edit-TARIFA').value,
            COMERCIALIZADORA: document.getElementById('edit-COMERCIALIZADORA').value,
            COMERCIAL: document.getElementById('edit-COMERCIAL').value,
            ESTADO: document.getElementById('edit-ESTADO').value,
            ACCIONES: document.getElementById('edit-ACCIONES').value,
            FECHA: document.getElementById('edit-FECHA').value,
            PAGADO: document.getElementById('edit-PAGADO').value,
            O50: document.getElementById('edit-O50').value,
            DOCUMENTOS: document.getElementById('edit-DOCUMENTOS').value,
            FECHA_CONTRATO: document.getElementById('edit-FECHA_CONTRATO').value
        };

        fetch(`${apiUrl}/${editedContract.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editedContract)
        })
        .then(response => response.json())
        .then(data => {
            alert('Contrato editado exitosamente.');
            $('#editModal').modal('hide');
            document.getElementById('edit-form').reset();
        })
        .catch(error => console.error('Error editing contract:', error));
    });

    document.getElementById('edit-results').addEventListener('click', function(event) {
        if (event.target.classList.contains('edit-button')) {
            const contractId = event.target.dataset.id;
            fetch(`${apiUrl}/${contractId}`)
                .then(response => response.json())
                .then(data => {
                    document.getElementById('edit-id').value = data.id;
                    document.getElementById('edit-CIF').value = data.CIF;
                    document.getElementById('edit-NOMBRE').value = data.NOMBRE;
                    document.getElementById('edit-CUPS').value = data.CUPS;
                    document.getElementById('edit-TARIFA').value = data.TARIFA;
                    document.getElementById('edit-COMERCIALIZADORA').value = data.COMERCIALIZADORA;
                    document.getElementById('edit-COMERCIAL').value = data.COMERCIAL;
                    document.getElementById('edit-ESTADO').value = data.ESTADO;
                    document.getElementById('edit-ACCIONES').value = data.ACCIONES;
                    document.getElementById('edit-FECHA').value = data.FECHA;
                    document.getElementById('edit-PAGADO').value = data.PAGADO;
                    document.getElementById('edit-O50').value = data.O50;
                    document.getElementById('edit-DOCUMENTOS').value = data.DOCUMENTOS;
                    document.getElementById('edit-FECHA_CONTRATO').value = data.FECHA_CONTRATO;
                    $('#editModal').modal('show');
                })
                .catch(error => console.error('Error fetching contract data:', error));
        } else if (event.target.classList.contains('delete-button')) {
            const contractId = event.target.dataset.id;
            if (confirm('¿Está seguro de que desea eliminar este contrato?')) {
                fetch(`${apiUrl}/${contractId}`, { method: 'DELETE' })
                    .then(() => {
                        alert('Contrato eliminado exitosamente.');
                        document.querySelector(`#contract-${contractId}`).remove();
                    })
                    .catch(error => console.error('Error deleting contract:', error));
            }
        }
    });


function setupStats() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => displayChart(data))
        .catch(error => console.error('Error fetching data:', error));
}


function displayResults(data) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (data.length === 0) {
        resultsContainer.innerHTML = '<p class="text-center">No se encontraron contratos.</p>';
        return;
    }

    // Crear un elemento para cada contrato y mostrar todos los datos
    data.forEach(contract => {
        const listItem = document.createElement('div');
        listItem.classList.add('list-group-item');
        listItem.innerHTML = `
            <h5>${contract.NOMBRE} (${contract.CIF})</h5>
            <p>CUPS: ${contract.CUPS}</p>
            <p>Tarifa: ${contract.TARIFA}</p>
            <p>Comercializadora: ${contract.COMERCIALIZADORA}</p>
            <p>Estado: ${contract.ESTADO}</p>
            <p>Fecha: ${contract.FECHA}</p>
            <p>Acciones: ${contract.ACCIONES}</p>
            <p>Comercial: ${contract.COMERCIAL}</p>
            <p>Pagado: ${contract.PAGADO}</p>
            <p>O 50%: ${contract["O 50%"]}</p>
            <p>Documentos Adjuntos: ${contract["DOCUMENTOS ADJUNTOS"]}</p>
            <p>Fecha de Acabar Contrato: ${contract["FECHA DE ACABAR CONTRATO"]}</p>
        `;
        resultsContainer.appendChild(listItem);
    });
}


function displayEditResults(data) {
    const resultsContainer = document.getElementById('edit-results');
    resultsContainer.innerHTML = '';

    if (data.length === 0) {
        resultsContainer.innerHTML = '<p class="text-center">No se encontraron contratos.</p>';
        return;
    }

    data.forEach(contract => {
        const listItem = document.createElement('div');
        listItem.classList.add('list-group-item');
        listItem.id = `contract-${contract.id}`;
        listItem.innerHTML = `
            <h5>${contract.NOMBRE} (${contract.CIF})</h5>
            <p>CUPS: ${contract.CUPS}</p>
            <p>Tarifa: ${contract.TARIFA}</p>
            <p>Comercializadora: ${contract.COMERCIALIZADORA}</p>
            <p>Estado: ${contract.ESTADO}</p>
            <p>Fecha: ${contract.FECHA}</p>
            <button class="btn btn-warning btn-block edit-button" data-id="${contract.id}">Editar</button>
            <button class="btn btn-danger btn-block delete-button" data-id="${contract.id}">Eliminar</button>
        `;
        resultsContainer.appendChild(listItem);
    });
}

async function fetchData() {
    try {
        const response = await fetch('http://192.168.101.4:3000/asesoria_energetica');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Función para generar el gráfico con Plotly
// Función para generar el gráfico con Plotly
async function displayChart() {
    // Obtener los datos de la API
    const data = await fetchData();

    // Preparar los datos para Plotly
    const comercializadoras = [];
    const cantidadContratos = [];

    data.forEach(contract => {
        const comercializadora = contract.COMERCIALIZADORA;
        const index = comercializadoras.indexOf(comercializadora);
        if (index === -1) {
            comercializadoras.push(comercializadora);
            cantidadContratos.push(1);
        } else {
            cantidadContratos[index]++;
        }
    });

    // Configurar el gráfico con Plotly
    const layout = {
        title: 'Porcentaje de contratos por Comercializadora',
    };

    const trace = {
        labels: comercializadoras,
        values: cantidadContratos,
        type: 'pie'
    };

    // Mostrar el gráfico en tu página
    Plotly.newPlot('comercializadoraChart', [trace], layout);
}
