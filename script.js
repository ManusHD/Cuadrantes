
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

var personas = [];
var ciclo = [];

var turnos = 0;
var horasMes = 0;
var cuadrante;

var año = 2024;
var mes = 9;

var primeroGenerado = false;

function getPersonas() {
    fetch('https://sheets.googleapis.com/v4/spreadsheets/1PEJsta5NLLjPgiaL4GCMc-e1MW-ykzG93et-6Zqb4xs/values/Cuadrantes!A2:B?key=AIzaSyD1qXjPmgBaRtX0zJtH76nvU708Gvs3A-g')
    .then(response => response.json())
    .then(data => {
        const personasAux = data.values;

        personasAux.forEach(p => {

            let nCiclo = p[0];
            nCiclo = parseInt(nCiclo);
            
            const persona = {ciclo: nCiclo, nombre: p[1], horas: horasMes, hUsadas: 0, hExtra: 0};
            console.log("La persona creada es: ");
            console.log(persona);

            personas.push(persona);

        });

        

    });
}

function iniciarArrays(ciclo1, ciclo2, ciclo3, ciclo4) {
    /** 
     *  horas: horas que debe trabajar al mes
     *  hUsadas: horas trabajadas de las que debe trabajar al mes (max: horas máximas a trabajar de ese mes)
     *  hExtra: horas extras de ese mes
     * 
     * Quiero que al crear una persona en el fetch quede con el nombre del parámetro que entra en la función, en vez de que se asigne a ciclo: 'ciclo3', quiero que se asigne el valor de ciclo3, todo dependiendo del número que llegue desde la API
    */

    personas = [
        {ciclo: ciclo1, nombre: 'Loli', horas: horasMes, hUsadas: 0, hExtra: 0},
        {ciclo: ciclo1, nombre: 'Upe A', horas: horasMes, hUsadas: 0, hExtra: 0},
        {ciclo: ciclo2, nombre: 'M José', horas: horasMes, hUsadas: 0, hExtra: 0},
        {ciclo: ciclo2, nombre: 'Pilar', horas: horasMes, hUsadas: 0, hExtra: 0},
        {ciclo: ciclo3, nombre: 'Bea', horas: horasMes, hUsadas: 0, hExtra: 0},
        {ciclo: ciclo3, nombre: 'Upe B', horas: horasMes, hUsadas: 0, hExtra: 0},
        {ciclo: ciclo4, nombre: 'Paqui', horas: horasMes, hUsadas: 0, hExtra: 0},
        {ciclo: ciclo4, nombre: 'Yure', horas: horasMes, hUsadas: 0, hExtra: 0}
    ];

    console.log(personas);
    
    // Ciclo de 4 días
    ciclo = [
        { nombre: 'Día 1', turnos: ['Tarde'], horas: 8 },
        { nombre: 'Día 2', turnos: ['Mañana', 'Noche'], horas: 16 },
        { nombre: 'Día 3', turnos: [], horas: 0 },
        { nombre: 'Día 4', turnos: [], horas: 0 }
    ];
}

function obtenerDiasLaborables (año, mes) {
    let diasLaborables = 0;
    let diasEnMes = new Date(año, mes, 0).getDate();
    
    for(let dia = 1; dia <= diasEnMes; dia++) {
        const diaSemana = new Date(año, mes - 1, dia).getDay();
        if(diaSemana >= 1 && diaSemana <= 5) {
            diasLaborables++;
        }
    }

    console.log(`Días laborables: ${diasLaborables}`);

    return diasLaborables;
}

// Generar cuadrante mensual
function generarCuadrante(mes, año) {
    const diasEnMes = new Date(año, mes, 0).getDate();
    let cuadrante = Array.from({ length: diasEnMes }, () => ({
        Mañana: [],
        Tarde: [],
        Noche: []
    }));

    /** cicloInicio: Decide la rotación inicial de cada persona, junto al (+0)
     *  dia: Permite definir que ha cambiado el día y con esto deben cambiar los turnos, es decir, avanza el ciclo
     */
    for (let i = 0; i < personas.length; i++) {
        let cicloInicio = personas[i].ciclo; // Rotación inicial para cada persona
        for (let dia = 1; dia <= diasEnMes; dia++) {
            let cicloDia = ciclo[(cicloInicio + dia + 0) % 4]; // El (+0) cambia el orden de como quedan los turnos, si se toca cambian de orden los turnos
            cicloDia.turnos.forEach(turno => {
                // cuadrante[dia - 1][turno].push(personas[i].nombre);
                cuadrante[dia - 1][turno].push(i+1);
            });
            personas[i].hUsadas += cicloDia.horas;
            if (personas[i].hUsadas > personas[i].horas) {
                personas[i].hExtra += personas[i].hUsadas - personas[i].horas;
                personas[i].hUsadas = personas[i].horas; // No exceder horas normales
            }
        }
    }

    console.log(cuadrante);

    return cuadrante;
}

function obtenerColor(ciclo) {
    let bg = 'white';
    switch(ciclo){
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

        default:
            bg = 'white';
            break;
    }

    return bg;
}

function esLaborable(dia){
    return dia >= 1 && dia <= 5;
}

// Mostrar cuadrante en la tabla HTML
function mostrarCuadrante() {
    año = document.getElementById('año-cuadrante').value;
    mes = document.getElementById('mes-cuadrante').value;
    mes = parseInt(mes);
    console.log(`El año es: ${año}`);
    console.log(`El mes es: ${mes}`);
    turnos = obtenerDiasLaborables(año, mes);
    horasMes = 8 * turnos;
    let cicloSeleccionado = document.getElementById("comienza").value;
    cicloSeleccionado = parseInt(cicloSeleccionado);
    let ciclo1 = (3 + cicloSeleccionado) % 4;
    let ciclo2 = (2 + cicloSeleccionado) % 4;
    let ciclo3 = (1 + cicloSeleccionado) % 4;
    let ciclo4 = (0 + cicloSeleccionado) % 4;
    console.log(`Ciclo 1 (1-2): ${ciclo1}`);
    console.log(`Ciclo 2 (3-4): ${ciclo2}`);
    console.log(`Ciclo 3 (5-6): ${ciclo3}`);
    console.log(`Ciclo 4 (7-8): ${ciclo4}`);
    console.log(`Ciclo Seleccionado: ${cicloSeleccionado}`);
    iniciarArrays(ciclo1, ciclo2, ciclo3, ciclo4);
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

    // Crear filas para cada turno (Mañana, Tarde, Noche)
    ['Dirección', 'Mañana', 'Tarde', 'Noche'].forEach((turno, index) => {
        let filas = []; // Guardar las filas para manejar el rowspan
        let maxPersonasEnDia = 0; // Saber cuántas personas trabajan máximo en un día

        cuadrante.forEach((dia, index) => {
            const personasEnTurno = turno === 'Dirección' ? 1 : dia[turno].length;
            maxPersonasEnDia = Math.max(maxPersonasEnDia, personasEnTurno);
        });

        cuadrante.forEach((dia, index) => {
            let diaConcreto = new Date(año, mes - 1, index + 1).getDay();
            let personasTurno;

            if (turno === 'Dirección') {
                personasTurno = esLaborable(diaConcreto) ? 'T' : '';
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
        if (index != 0 && index < 3) { // Solo hasta el turno "Noche"
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
    const ul = document.getElementById("horas-trabajadas");
    ul.innerHTML = '';
    personas.forEach(persona => {
        let li = document.createElement("li");
        li.textContent = `${persona.nombre}: ${(persona.hExtra + persona.hUsadas)/8} turnos trabajados, ${persona.hExtra/8} son extras.`;
        ul.appendChild(li);
    });

    const dl = document.getElementById('dias-laborables');
    dl.textContent = turnos;
}

function main() {
    getPersonas();
}

main();
