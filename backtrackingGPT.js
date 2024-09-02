const trabajadores = [
    { nombre: "David", rol: "Cocinero", horas: 40, trabajadas: 0, extras: 0 },
    { nombre: "Susi", rol: ["Gerocultora", "Cocinero"], horas: 25, trabajadas: 0, extras: 0 },
    { nombre: "Amadori", rol: ["Gerocultora", "Cocinero"], horas: 26, trabajadas: 0, extras: 0 },
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
var nSolucionesEncontradas = 0;
var nSolucionesNoEncontradas = 0;

function esAsignacionValida(trabajador, puesto, dia) {
    const yaAsignado = cuadrante[dia].some(asignacion => asignacion.trabajador === trabajador.nombre);
    const horasRestantes = trabajador.horas - trabajador.trabajadas;
    const puedeDesempenar = Array.isArray(trabajador.rol)
        ? trabajador.rol.includes(puesto.nombre.split(" ")[0])
        : trabajador.rol === puesto.nombre.split(" ")[0];
    
    // Restringir trabajadores con horas sobrantes >= 1 a no trabajar sábados ni domingos
    if (horasRestantes >= 1 && (dia === 5 || dia === 6)) {
        return false;
    }
    
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
        // Verificación de días libres consecutivos
        let diasLibres = [];
        for (let i = 0; i < 7; i++) {
            const noTrabajo = !cuadrante[i].some(asignacion => asignacion.trabajador === trabajador.nombre);
            if (noTrabajo) diasLibres.push(i);
        }

        if (diasLibres.length > 0) {
            for (let i = 0; i < diasLibres.length - 1; i++) {
                if (diasLibres[i + 1] !== diasLibres[i] + 1) {
                    return false; // Los días libres no son consecutivos
                }
            }

            // Verificar si se libra el sábado, se debe librar el domingo
            if (diasLibres.includes(5) && !diasLibres.includes(6)) {
                return false;
            }

            // Verificar si se trabaja el sábado, se debe trabajar el domingo
            if (!diasLibres.includes(5) && diasLibres.includes(6)) {
                return false;
            }
        }
    }
    return true;
}

function resolverCuadrante(dia = 0, puestoIndex = 0) {
    if (soluciones.length >= maxSoluciones) return;
    if (dia === 7) {
        if (esCuadranteValido()) {
            soluciones.push(copiarCuadrante());
            nSolucionesEncontradas++;
            console.log( "Soluciones encontradas: " + nSolucionesEncontradas);
        }else{
            nSolucionesNoEncontradas++;
            console.log(nSolucionesNoEncontradas);
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
            p.textContent = `${puesto.trabajador} - Restantes: ${puesto.objTrabajador.horas - puesto.objTrabajador.trabajadas}`;
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
