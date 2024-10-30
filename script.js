
/*
1 - Loli
2 - Upe A
3 - M José
4 - Pilar
5 - Bea
6 - Upe B
7 - Paqui
8 - Yure
*/

const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const SUPERFESTIVOS = [
    new Date('January 1, 2023'),    // Año Nuevo
    // new Date('May 1, 2023'),        // Día del trabajador
    new Date('August 15, 2023'),    // Asunción de la Virgen
    // new Date('October 12, 2023'),   // Día de la Hispanidad
    // new Date('November 1, 2023'),   // Día de Todos los Santos
    // new Date('December 6, 2023'),   // Día de la Constitución
    new Date('December 25, 2023')   // Navidad
];

var personas = [];
var ciclo = [
    { nombre: 'Día 1', turnos: ['Tarde'], horas: 8 },
    { nombre: 'Día 2', turnos: ['Mañana', 'Noche'], horas: 16 },
    { nombre: 'Día 3', turnos: [], horas: 0 },
    { nombre: 'Día 4', turnos: [], horas: 0 }
];

var ponderaciones = [];

var turnos = 0;
var horasMes = 0;
var cuadrante;

var año = 2024;
var mes = 9;

var primeroGenerado = false;

var nGruposGerocultoras = 4;

function obtenerColor(ciclo) {
    let bg = 'white';
    switch (ciclo) {
        case 1:
            bg = '#cdb4db';
            break;

        case 2:
            bg = '#cdb4db';
            break;

        case 3:
            bg = '#ffafcc';
            break;

        case 4:
            bg = '#ffafcc';
            break;

        case 5:
            bg = '#bde0fe';
            break;

        case 6:
            bg = '#bde0fe';
            break;

        case 7:
            bg = '#a2d2ff';
            break;

        case 8:
            bg = '#a2d2ff';
            break;

        case 'T':
            bg = '#dad7cd';
            break;

        case 'A':
            bg = '#dad7cd';
            break;

        default:
            bg = 'white';
            break;
    }

    return bg;
}

function esLaborable(dia) {
    return dia >= 1 && dia <= 5;
}


function obtenerDiasLaborables(año, mes) {
    let diasLaborables = 0;
    let diasEnMes = new Date(año, mes, 0).getDate();

    for (let dia = 1; dia <= diasEnMes; dia++) {
        const diaSemana = new Date(año, mes - 1, dia).getDay();
        if (diaSemana >= 1 && diaSemana <= 5) {
            diasLaborables++;
        }
    }

    console.log(`Días laborables: ${diasLaborables}`);

    return diasLaborables;
}


function cargarPersonas() {

    año = document.getElementById('año-cuadrante').value;
    mes = document.getElementById('mes-cuadrante').value;
    mes = parseInt(mes);
    console.log(`El año es: ${año}`);
    console.log(`El mes es: ${mes}`);
    turnos = obtenerDiasLaborables(año, mes);
    horasMes = 8 * turnos;

    fetch('https://sheets.googleapis.com/v4/spreadsheets/1PEJsta5NLLjPgiaL4GCMc-e1MW-ykzG93et-6Zqb4xs/values/Cuadrantes!A2:B?key=AIzaSyD1qXjPmgBaRtX0zJtH76nvU708Gvs3A-g')
        .then(response => response.json())
        .then(data => {

            personas = [];

            const personasAux = data.values;

            let cicloSeleccionado = document.getElementById("comienza").value;
            cicloSeleccionado = parseInt(cicloSeleccionado);
            console.log(`Ciclo Seleccionado: ${cicloSeleccionado}`);

            personasAux.forEach(p => {

                let nCiclo = p[0];
                nCiclo = parseInt(nCiclo);

                const persona = { ciclo: (nCiclo + cicloSeleccionado) % 4, nombre: p[1], horas: horasMes, hUsadas: 0, hExtra: 0, domingos: 0, noches: 0, superfestivos: 0 };
                personas.push(persona);

            });

        });
}

function cargarPonderaciones() {
    fetch('https://sheets.googleapis.com/v4/spreadsheets/1PEJsta5NLLjPgiaL4GCMc-e1MW-ykzG93et-6Zqb4xs/values/Extras!B2:B4?key=AIzaSyD1qXjPmgBaRtX0zJtH76nvU708Gvs3A-g')
    .then(response => response.json())
    .then(data => {
        const ponderacionesAux = data.values;
        ponderacionesAux.forEach(p => {
            ponderaciones.push(p[0].replace(',', '.'));
            console.log(p[0].replace(',', '.'));
        });
    })
}

function esSuperfestivo(fecha) {

    // Iteramos sobre el arreglo de días festivos
    for (let i = 0; i < SUPERFESTIVOS.length; i++) {
        const fechaFestiva = new Date(SUPERFESTIVOS[i]);

        // Comparamos si los días y meses coinciden (ignoramos el año)
        if (fecha.getDate() === fechaFestiva.getDate() &&
            fecha.getMonth() === fechaFestiva.getMonth()) {
            return true;
        }
    }

    // Si no se encontró coincidencia, retornamos false
    return false;
}

// Generar cuadrante mensual
function generarCuadrante(mes, año) {
    const diasEnMes = new Date(año, mes, 0).getDate();
    let cuadrante = Array.from({ length: diasEnMes }, () => ({
        Mañana: [],
        Tarde: [],
        Noche: []
    }));

    console.log("Los SUPERFESTIVOS son:");
    console.log(SUPERFESTIVOS);
    for (let i = 0; i < personas.length; i++) {
        let cicloInicio = personas[i].ciclo;
        for (let dia = 1; dia <= diasEnMes; dia++) {
            let cicloDia = ciclo[(cicloInicio + dia) % 4];
            let diaConcreto = new Date(año, mes - 1, dia).getDay();
            let fechaConcreta = new Date(año, mes - 1, dia);

            cicloDia.turnos.forEach(turno => {
                cuadrante[dia - 1][turno].push(i + 1);
                
                if (turno === 'Noche') {
                    personas[i].noches++;
                } else if (esSuperfestivo(fechaConcreta)){
                    personas[i].superfestivos++;
                } else if (diaConcreto === 0) {
                    personas[i].domingos++;
                }
            });

            personas[i].hUsadas += cicloDia.horas;
            if (personas[i].hUsadas > personas[i].horas) {
                personas[i].hExtra += personas[i].hUsadas - personas[i].horas;
                personas[i].hUsadas = personas[i].horas;
            }

        }
    }

    console.log(cuadrante);

    return cuadrante;
}


// Mostrar cuadrante en la tabla HTML
function mostrarCuadrante() {

    cuadrante = generarCuadrante(mes, año);

    const thead = document.querySelector("#cuadrante thead tr");
    const tbody = document.querySelector("#cuadrante tbody");
    tbody.innerHTML = ""; // Limpiar el cuerpo de la tabla antes de llenarlo

    // Crear cabeceras para los días
    if (!primeroGenerado) {
        for (let dia = 1; dia <= cuadrante.length; dia++) {
            let th = document.createElement("th");
            th.textContent = `${dia}`;
            thead.appendChild(th);
        }
        primeroGenerado = true;
    }

    // Crear filas para cada turno (Dirección, Mañana, Correturnos, Tarde, Noche)
    ['Dirección', 'Mañana', 'Correturnos', 'Tarde', 'Noche'].forEach((turno, index) => {
        let filas = []; // Guardar las filas para manejar el rowspan
        let maxPersonasEnDia = 0; // Saber cuántas personas trabajan máximo en un día

        // Encontrar cuántas personas hay en el turno más ocupado para ese día
        cuadrante.forEach((dia, index) => {
            const personasEnTurno = turno === 'Dirección' || turno === 'Correturnos' ? 1 : dia[turno].length;
            maxPersonasEnDia = Math.max(maxPersonasEnDia, personasEnTurno);
        });

        // Para cada día del cuadrante
        cuadrante.forEach((dia, index) => {
            let diaConcreto = new Date(año, mes - 1, index + 1).getDay();
            let personasTurno;

            // Manejar el caso especial para Correturnos
            if (turno === 'Correturnos') {
                // Pinta una "A" en todas las celdas del Correturnos
                personasTurno = esLaborable(diaConcreto) ? ['A'] : [''];
            } else if (turno === 'Dirección') {
                personasTurno = esLaborable(diaConcreto) ? ['T'] : [''];
            } else {
                personasTurno = dia[turno];
            }

            for (let i = 0; i < maxPersonasEnDia; i++) {
                if (!filas[i]) {
                    filas[i] = document.createElement("tr");
                    if (i === 0) {
                        let turnoCell = document.createElement("td");
                        turnoCell.textContent = turno;
                        turnoCell.rowSpan = maxPersonasEnDia;
                        turnoCell.style.backgroundColor = '#219ebc';
                        filas[i].appendChild(turnoCell);
                    }
                }

                let cell = document.createElement("td");
                cell.textContent = personasTurno[i] ? personasTurno[i] : "";
                cell.style.backgroundColor = obtenerColor(personasTurno[i]);
                filas[i].appendChild(cell);
            }
        });

        filas.forEach(fila => {
            tbody.appendChild(fila);
        });

        // Añadir una fila en blanco después de cada conjunto de turnos (excepto el último)
        if (index != 0 && index < 4 && index != 2) { // Solo hasta el turno "Noche"
            let filaBlanca = document.createElement("tr");
            let cellBlanca = document.createElement("td");
            cellBlanca.setAttribute("colspan", cuadrante.length + 1); // +1 por la columna de turnos
            cellBlanca.innerHTML = "&nbsp;"; // Espacio en blanco
            filaBlanca.appendChild(cellBlanca);
            tbody.appendChild(filaBlanca);
        }
    });

    mostrarHorasTrabajadas();
}




// Mostrar horas trabajadas y extras en el HTML
function mostrarHorasTrabajadas() {

    const pNoche = ponderaciones[0];    // Ponderación para las noches
    const pDomingo = ponderaciones[1];  // Ponderación para los domingos
    const pSuperfestivo = ponderaciones[2];    // Ponderación para las noches

    console.log(pNoche);
    console.log(pDomingo);
    console.log(pSuperfestivo);

    const tbody = document.querySelector("#trabajado tbody");
    tbody.innerHTML = '';

    personas.forEach((persona, index) => {

        let tr = document.createElement("tr");

        let p = document.createElement("td");
        p.textContent = index + 1; // Aparecen los números de las gerocultoras
        // p.textContent = persona.nombre; // Aparecen los nombres de las gerocultoras

        let turnosTrabajados = document.createElement("td");
        turnosTrabajados.textContent = (persona.hExtra + persona.hUsadas) / 8;

        let nochesTrabajadas = document.createElement("td");
        nochesTrabajadas.textContent = persona.noches;

        let pagaNoches = document.createElement("td");
        pagaNoches.textContent = persona.noches * pNoche + ' €';

        let domingosTrabajados = document.createElement("td");
        domingosTrabajados.textContent = persona.domingos;

        let pagaDomingos = document.createElement("td");
        pagaDomingos.textContent = persona.domingos * pDomingo + ' €';

        let superfestivosTrabajados = document.createElement("td");
        superfestivosTrabajados.textContent = persona.superfestivos;

        let pagaSuperfestivos = document.createElement("td");
        pagaSuperfestivos.textContent = persona.superfestivos * pSuperfestivo + ' €';

        let totalPluses = document.createElement("td");
        totalPluses.textContent = (persona.superfestivos * pSuperfestivo + persona.noches * pNoche + persona.domingos * pDomingo) + ' €';
        
        if (persona.hUsadas < persona.horas){
            persona.hExtra = persona.hUsadas - persona.horas;
        }
        
        let turnosExtras = document.createElement("td");
        turnosExtras.textContent = persona.hExtra / 8;

        tr.appendChild(p);
        tr.appendChild(turnosTrabajados);
        tr.appendChild(turnosExtras);
        tr.appendChild(domingosTrabajados);
        tr.appendChild(pagaDomingos);
        tr.appendChild(nochesTrabajadas);
        tr.appendChild(pagaNoches);
        tr.appendChild(superfestivosTrabajados);
        tr.appendChild(pagaSuperfestivos);
        tr.appendChild(totalPluses);

        tbody.appendChild(tr);

    });

    const dl = document.getElementById('dias-laborables');
    dl.textContent = turnos;
}


function main() {
    cargarPersonas();
    cargarPonderaciones();
}

main();
