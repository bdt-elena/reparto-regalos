/********************
 * VARIABLES
 ********************/

// LISTA DE PERSONAS QUE PARTICIPARAN
const personas = [
    { persona: 'Nena', regalos: [] },
    { persona: 'Nenos', regalos: [] },
    { persona: 'Kuky', regalos: [] },
    { persona: 'Leny', regalos: [] }
];

// LISTA DE REGALOS Y SU CANTIDAD
const regalos = [
    { tipo: 'Peine', cantidad: 6 },
    { tipo: 'Crema de peinar', cantidad: 6 },
    { tipo: 'Calcetas', cantidad: 11 },
    { tipo: 'Sueter Termica', cantidad: 8 },
    { tipo: 'Labial bissu', cantidad: 6 }
];

/********************
 * UTILIDADES
 ********************/
function colorPorRegalo(regalo) {
    const r = regalo.toLowerCase();
    if (r.includes("peine")) return "#ffeaa7";
    if (r.includes("crema")) return "#fab1a0";
    if (r.includes("calcetas")) return "#ff7675";
    if (r.includes("termica")) return "#81ecec";
    if (r.includes("bissu")) return "#a29bfe";

    return "#ecf0f1";
}

function crearBolsaRegalos() {
    const bolsa = [];
    regalos.forEach(r => {
        for (let i = 0; i < r.cantidad; i++) bolsa.push(r.tipo);
    });
    return bolsa;
}

function mezclar(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}


/********************
 * LÓGICA DE SORTEO
 ********************/

let colaReparto = []; // {persona, regalo}
let indiceCola = 0;

function prepararSorteo() {

    personas.forEach(p => p.regalos = []);
    colaReparto = [];
    indiceCola = 0;

    const bolsa = crearBolsaRegalos();
    mezclar(bolsa);

    let iPersona = 0;

    while (bolsa.length > 0) {
        const persona = personas[iPersona];

        let index = bolsa.findIndex(r => !persona.regalos.includes(r));
        if (index === -1) index = 0;

        const regalo = bolsa.splice(index, 1)[0];
        persona.regalos.push(regalo);

        colaReparto.push({
            persona: persona.persona,
            regalo
        });

        iPersona = (iPersona + 1) % personas.length;
    }
}

/********************
 * RENDER BASE
 ********************/

const contenedor = document.getElementById("resultado");
const btnInicio = document.getElementById("btnSortear");

// botón nuevo
const btnPaso = document.createElement("button");
btnPaso.className = "btn";
btnPaso.textContent = "🎁 Siguiente regalo";
btnPaso.style.display = "none";
btnInicio.after(btnPaso);

function renderBase() {
    contenedor.innerHTML = "";

    personas.forEach(p => {
        const card = document.createElement("div");
        card.className = "persona";
        card.dataset.nombre = p.persona;

        card.innerHTML = `
            <h2>${p.persona}</h2>
            <div class="contador">0 regalos 🎁</div>
            <ul></ul>
        `;

        contenedor.appendChild(card);
    });
}

/********************
 * MOSTRAR UN PASO
 ********************/

function mostrarSiguiente() {

    // 🎯 Si ya no hay regalos
    if (indiceCola >= colaReparto.length) {

        btnPaso.disabled = true;
        btnPaso.textContent = "🎉 Sorteo terminado";

        // 🔄 restaurar botón principal
        btnInicio.disabled = false;
        btnInicio.textContent = "🎲 Iniciar nuevo sorteo";

        // 🎊 confeti final más grande
        lanzarConfeti(80);

        return;
    }

    const turno = colaReparto[indiceCola];
    const card = document.querySelector(`.persona[data-nombre="${turno.persona}"]`);
    const lista = card.querySelector("ul");
    const contador = card.querySelector(".contador");

    // ✨ resaltar tarjeta
    card.style.boxShadow = "0 0 20px rgba(46,204,113,.8)";
    card.style.transform = "scale(1.04)";

    const li = document.createElement("li");
    li.textContent = turno.regalo;
    li.style.background = colorPorRegalo(turno.regalo);
    li.style.opacity = "0";
    li.style.transform = "translateY(-10px)";
    lista.appendChild(li);

    setTimeout(() => {
        li.style.transition = "all .3s ease";
        li.style.opacity = "1";
        li.style.transform = "translateY(0)";
    }, 50);

    contador.textContent = `${lista.children.length} regalos 🎁`;

    // 🎊 confeti EN CADA CLICK
    lanzarConfeti(20);

    setTimeout(() => {
        card.style.boxShadow = "";
        card.style.transform = "";
    }, 300);

    indiceCola++;
}


/********************
 * CONFETI
 ********************/

function lanzarConfeti(cantidad = 30) {
    for (let i = 0; i < cantidad; i++) {
        const c = document.createElement("div");
        c.style.position = "fixed";
        c.style.top = "-10px";
        c.style.left = Math.random() * window.innerWidth + "px";
        c.style.width = "8px";
        c.style.height = "8px";
        c.style.background = `hsl(${Math.random()*360},80%,60%)`;
        c.style.borderRadius = "50%";
        c.style.opacity = "0.9";
        c.style.animation = "caer 1.5s linear forwards";
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 1500);
    }
}


/********************
 * EVENTOS
 ********************/

btnInicio.addEventListener("click", () => {

    btnInicio.disabled = true;
    btnInicio.textContent = "🎲 Sorteo en curso…";

    prepararSorteo();
    renderBase();

    btnPaso.style.display = "block";
    btnPaso.disabled = false;
});

btnPaso.addEventListener("click", mostrarSiguiente);
