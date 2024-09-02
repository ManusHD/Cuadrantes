/**
 * K -> Cada vez que relleno un día paso a la siguiente etapa
 * Op -> Poner a una persona en una hora concreta o no ponerla
 * Aceptable -> Si la persona a colocar puede y tiene horas de sobra para desempeñar ese puesto y, además, no ha venido ya hoy
 * Solucion completa -> Cuando todos los días tengan rellenas sus horas
 * Desanotar opcion -> Una Opcion se debe desanotar si la persona no puede desempeñar el puesto o no tiene horas suficientes para desempeñarlo
 * 
 * La entrada de datos será la lista de trabajadores.
 * La solución será anotada en un Cuadrante, que es un array de Días que a su vez son un array de horas.
 * Se anotará de tal manera que el array almacenará Objetos de tipo persona, para luego poder poner en el cuadrante la información que se quiera de la persona designada a esa hora
 * 
 */

// Datos de los trabajadores
const trabajadores = [
    { nombre: "David", rol: "Cocinero", horas: 40, trabajadas: 0, extras: 0 },
    { nombre: "Susi", rol: ["Gerocultora", "Cocinero"], horas: 25, trabajadas: 0, extras: 0 },
    { nombre: "Mavi", rol: ["Gerocultora", "Reparto"], horas: 30, trabajadas: 0, extras: 0 },
    { nombre: "Nines", rol: ["Gerocultora", "Reparto"], horas: 30, trabajadas: 0, extras: 0 },
    { nombre: "Amadori", rol: ["Gerocultora", "Cocinero"], horas: 26, trabajadas: 0, extras: 0 },
    { nombre: "Raquel", rol: "Gerocultora", horas: 24, trabajadas: 0, extras: 0 },
];
const personaVacia = { nombre: "", rol: "", horas: 0, trabajadas: 0, extras: 0 };

const nombreDias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

var cuadrante = [];

var lunes = [];
var martes = [];
var miercoles = [];
var jueves = [];
var viernes = [];
var sabado = [];
var domingo = [];

cuadrante = [lunes, martes, miercoles, jueves, viernes, sabado, domingo];

/** k: Etapa */
function backtracking (k) {
    let exito = false;
    if(k === 6) {
        console.log("Cuadrante terminado");
    } else{

        trabajadores.forEach(trabajador => {

            /** 0: Gerocultora/Reparto, 1: Gerocultora, 2: Cocinero, 3: Gerocultora, 4: Gerocultora */
            for(puesto = 0; puesto < 5 && !exito; puesto++) {
                if (aceptable(trabajador, k, puesto)) {

                    // Anotar opción
                    cuadrante[k][puesto] = trabajador;
                    console.log(`${trabajador.nombre} puede coger ${nombreDias[k]} en el puesto ${puesto}, tiene ${trabajador.trabajadas} horas trabajadas.`);
                    
                    if(esCompleta()) {
                        return true;
                    } else{
                        exito = backtracking(k+1);
                        if (!exito) {
                            // Desanotar opción
                            desanotar(trabajador, puesto);
                            cuadrante[k][puesto] = undefined;
                            console.log(`${trabajador.nombre} desanotado del ${nombreDias[k]} en el puesto ${puesto}, tiene ${trabajador.trabajadas} horas trabajadas.`);
                        }
                    }
                }
            }
        });
    }

    return exito;
}

function aceptable (trabajador, k, puesto) {

    let dia = cuadrante[k];
    let hRestantes = trabajador.horas - trabajador.trabajadas;

    switch(puesto) {
        case 0:
            if( trabajador.rol.includes('Reparto') && dia[puesto] === undefined && hRestantes >= 6 && !haVenidoHoy(trabajador, dia)) {
                trabajador.trabajadas += 6;
                return true;
            }
            break;
        case 1:
            if( trabajador.rol.includes('Gerocultora') && dia[puesto] === undefined && hRestantes >= 5 && !haVenidoHoy(trabajador, dia)) {
                trabajador.trabajadas += 5;
                return true;
            }
            break;
        case 2:
            if( trabajador.rol.includes('Cocinero') && dia[puesto] === undefined && hRestantes >= 8 && !haVenidoHoy(trabajador, dia)) {
                trabajador.trabajadas += 8;
                return true;
            }
            break;
        case 3:
            if( trabajador.rol.includes('Gerocultora') && dia[puesto] === undefined && hRestantes >= 3.5 && !haVenidoHoy(trabajador, dia)) {
                trabajador.trabajadas += 3.5;
                return true;
            }
            break;
        case 4:
            if( trabajador.rol.includes('Gerocultora') && dia[puesto] === undefined && hRestantes >= 2 && !haVenidoHoy(trabajador, dia)) {
                trabajador.trabajadas += 2;
                return true;
            }
            break;
        default:
            console.log("False por defecto");
            return false;
    }

    return false;
}


function desanotar(trabajador, puesto) {
    console.log(puesto);
    switch(puesto) {
        case 0:
            trabajador.trabajadas -= 6;
            break;
        case 1:
            trabajador.trabajadas -= 5;
            break;
        case 2:
            trabajador.trabajadas -= 8;
            break;
        case 3:
            trabajador.trabajadas -= 3.5;
            break;
        case 4:
            trabajador.trabajadas -= 2;
            break;
        default:
            console.log("False por defecto en desanotar");
            return false;
    }
}


function haVenidoHoy(trabajador, dia) {
    
    let enc = false;
    dia.forEach(puesto => {
        if(trabajador === puesto){
            enc = true;
        };
    });

    // console.log(`¿${trabajador.nombre} ha venido hoy?`);

    // if (enc) {
    //     console.log(`SI`);
    // } else {
    //     console.log(`NO`);
    // }

    return enc;
}

function esCompleta() {
    let es = true;

    for(i = 0; i < 7 && es; i++) {
        if(cuadrante[i].length < 5){
            es = false;
        }
    }

    return es;
}

function mostrarCuadrante() {
    console.log("Voy a mostrar el cuadrante");

    const tbody = document.querySelector("#cuadrante-personal tbody");

    cuadrante.forEach((dia, index) => {
        console.log(`Creando cuadrante del ${nombreDias[index]}`);

        let tr = document.createElement("tr");

        let nDia = document.createElement("td");
        nDia.textContent = nombreDias[index];
        tr.appendChild(nDia);

        dia.forEach(persona => {

            let p = document.createElement("td");
            p.textContent = `${persona.nombre} - Totales: ${persona.horas}, Horas: ${persona.trabajadas}, Extras: ${persona.trabajadas - persona.horas}`;

            tr.appendChild(p);

        });

        tbody.appendChild(tr);
    });

}


let creado = backtracking(0);

if(creado) {
    console.log("------------ Ha habido éxito -------------");
} else{
    console.log("NO ha habido éxito");
}


console.log(trabajadores);
console.log(cuadrante);