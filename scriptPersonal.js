const trabajadores = [
    { nombre: "Amadori", rol: ["Gerocultora", "Cocinero"], horas: 26, trabajadas: 0, extras: 0 },
    { nombre: "David", rol: "Cocinero", horas: 40, trabajadas: 0, extras: 0 },
    { nombre: "Susi", rol: ["Gerocultora", "Cocinero"], horas: 25, trabajadas: 0, extras: 0 },
    { nombre: "Mavi", rol: ["Gerocultora", "Reparto"], horas: 30, trabajadas: 0, extras: 0 },
    { nombre: "Nines", rol: ["Gerocultora", "Reparto"], horas: 30, trabajadas: 0, extras: 0 },
    { nombre: "Raquel", rol: "Gerocultora", horas: 24, trabajadas: 0, extras: 0 },
];

const puestos = [
    { nombre: "Reparto", horas: 6 },
    { nombre: "Gerocultora 1", horas: 5 },
    { nombre: "Cocinero", horas: 8 },
    { nombre: "Gerocultora 2", horas: 3.5 },
    { nombre: "Gerocultora 3", horas: 2 },
];

const nombreDias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

var cuadrante = [[], [], [], [], [], [], []];
var soluciones = [];
const maxSoluciones = 20;

function esAsignacionValida(trabajador, puesto, dia) {
    const yaAsignado = cuadrante[dia].some(asignacion => asignacion.trabajador === trabajador.nombre);
    const horasRestantes = trabajador.horas - trabajador.trabajadas;
    const puedeDesempenar = Array.isArray(trabajador.rol)
        ? trabajador.rol.includes(puesto.nombre.split(" ")[0])
        : trabajador.rol === puesto.nombre.split(" ")[0];
    
    return !yaAsignado && puedeDesempenar && horasRestantes >= puesto.horas;
}

function asignarPuesto(dia, puesto, trabajador) {
    cuadrante[dia].push({ puesto: puesto.nombre, trabajador: trabajador.nombre, objTrabajador: trabajador });
    trabajador.trabajadas += puesto.horas;
}

function desasignarPuesto(dia, puesto, trabajador) {
    const index = cuadrante[dia].findIndex(a => a.puesto === puesto.nombre && a.trabajador === trabajador.nombre);
    if (index > -1) {
        cuadrante[dia].splice(index, 1);
        trabajador.trabajadas -= puesto.horas;
    }
}

function copiarCuadrante() {
    return cuadrante.map(dia => dia.map(asignacion => ({
        puesto: asignacion.puesto,
        trabajador: asignacion.trabajador,
        objTrabajador: { ...asignacion.objTrabajador }
    })));
}

function esCuadranteValido() {

    for (const trabajador of trabajadores) {
        let diasLibres = [];
        for (let i = 0; i < 7; i++) {
            const noTrabajo = !cuadrante[i].some(asignacion => asignacion.trabajador === trabajador.nombre);
            if (noTrabajo) diasLibres.push(i);
        }

        if (diasLibres.length < 1) {
            return false; // Todos los trabajadores deben librar al menos un día
        }

        // Verificar si se libra el sábado, se debe librar el domingo
        if (diasLibres.includes(5) && !diasLibres.includes(6)) {
            return false;
        }

        // Verificar si se trabaja el sábado, se debe trabajar el domingo
        if (!diasLibres.includes(5) && diasLibres.includes(6)) {
            return false;
        }

        if (trabajador.nombre === 'Raquel' && ((trabajador.horas - trabajador.trabajadas) > 0)) {
            console.log(`Muchas horas para ${trabajador.nombre}`);
            return false;
        }


    }

    return true;
}

var noValido = 0;
function resolverCuadrante(dia = 0, puestoIndex = 0) {
    if (soluciones.length >= maxSoluciones) return;
    if (dia === 7) {
        if (esCuadranteValido()) {
            soluciones.push(copiarCuadrante());
        }else{
            noValido++;
            console.log(noValido);
        }
        return;
    }
    if (puestoIndex === puestos.length) {
        resolverCuadrante(dia + 1, 0);
        return;
    }

    const puesto = puestos[puestoIndex];

    for (const trabajador of trabajadores) {
        if (esAsignacionValida(trabajador, puesto, dia)) {
            asignarPuesto(dia, puesto, trabajador);
            resolverCuadrante(dia, puestoIndex + 1);
            desasignarPuesto(dia, puesto, trabajador);
        }
    }
}

function mostrarCuadrante(cuadrante, index) {
    console.log(`Mostrando cuadrante ${index + 1}`);

    const tbody = document.querySelector("#cuadrante-personal tbody");
    const h3 = document.createElement("h3");
    h3.textContent = `Cuadrante ${index + 1}`;
    tbody.appendChild(h3);

    cuadrante.forEach((dia, index) => {
        let tr = document.createElement("tr");

        let nDia = document.createElement("td");
        nDia.textContent = nombreDias[index];
        tr.appendChild(nDia);

        dia.forEach(puesto => {
            let p = document.createElement("td");
            p.textContent = `${puesto.trabajador} - Total: ${puesto.objTrabajador.trabajadas} - Restantes: ${puesto.objTrabajador.horas - puesto.objTrabajador.trabajadas}`;
            tr.appendChild(p);
        });

        tbody.appendChild(tr);
    });
    tbody.appendChild(document.createElement("br"));
}

// Ejecutamos el algoritmo de backtracking para encontrar todas las soluciones
resolverCuadrante();

// Mostrar todas las soluciones encontradas
if (soluciones.length > 0) {
    soluciones.forEach((sol, index) => {
        mostrarCuadrante(sol, index);
    });
} else {
    console.log("No se encontró una solución válida para cubrir todos los puestos.");
}