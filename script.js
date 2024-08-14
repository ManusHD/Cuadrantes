// Información de las personas
const turnos = 22;
const horasMes = 8 * turnos;
const mesMes = 8;

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

const personas = [
    {nombre: 'Loli', horas: horasMes, hUsadas: 0, hExtra: 0},
    {nombre: 'Upe A', horas: horasMes, hUsadas: 0, hExtra: 0},
    {nombre: 'M José', horas: horasMes, hUsadas: 0, hExtra: 0},
    {nombre: 'Pilar', horas: horasMes, hUsadas: 0, hExtra: 0},
    {nombre: 'Bea', horas: horasMes, hUsadas: 0, hExtra: 0},
    {nombre: 'Upe B', horas: horasMes, hUsadas: 0, hExtra: 0},
    {nombre: 'Paqui', horas: horasMes, hUsadas: 0, hExtra: 0},
    {nombre: 'Yure', horas: horasMes, hUsadas: 0, hExtra: 0}
];

// Ciclo de 4 días
const ciclo = [
    { nombre: 'Día 1', turnos: ['Tarde'], horas: 8 },
    { nombre: 'Día 2', turnos: ['Mañana', 'Noche'], horas: 16 },
    { nombre: 'Día 3', turnos: [], horas: 0 },
    { nombre: 'Día 4', turnos: [], horas: 0 }
];

// Generar cuadrante mensual
function generarCuadrante(mes, año) {
    const diasEnMes = new Date(año, mes, 0).getDate();
    let cuadrante = Array.from({ length: diasEnMes }, () => ({
        Mañana: [],
        Tarde: [],
        Noche: []
    }));

    for (let i = 0; i < personas.length; i++) {
        let cicloInicio = i % 4; // Rotación inicial para cada persona
        for (let dia = 1; dia <= diasEnMes; dia++) {
            let cicloDia = ciclo[(cicloInicio + dia - 1) % 4];
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

// Mostrar cuadrante en la tabla HTML
function mostrarCuadrante(cuadrante) {
    const thead = document.querySelector("#cuadrante thead tr");
    const tbody = document.querySelector("#cuadrante tbody");

    // Crear cabeceras para los días
    for (let dia = 1; dia <= cuadrante.length; dia++) {
        let th = document.createElement("th");
        th.textContent = `${dia}`;
        thead.appendChild(th);
    }

    // Crear filas para cada turno (Mañana, Tarde, Noche)
    ['Mañana', 'Tarde', 'Noche'].forEach(turno => {
        let row = document.createElement("tr");
        let turnoCell = document.createElement("td");
        turnoCell.textContent = turno;
        row.appendChild(turnoCell);

        cuadrante.forEach(dia => {
            let cell = document.createElement("td");
            cell.textContent = dia[turno].join(", ") || "-";
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });
}

// Mostrar horas trabajadas y extras en el HTML
function mostrarHorasTrabajadas() {
    const ul = document.getElementById("horas-trabajadas");
    personas.forEach(persona => {
        let li = document.createElement("li");
        li.textContent = `${persona.nombre}: ${persona.hUsadas} horas trabajadas, ${persona.hExtra} horas extra = ${persona.hExtra/8} turnos extras.`;
        ul.appendChild(li);
    });
}

// Generar y mostrar cuadrante para un mes específico
let mes = mesMes; // Agosto
let año = 2024;
let cuadrante = generarCuadrante(mes, año);
mostrarCuadrante(cuadrante);
mostrarHorasTrabajadas();

