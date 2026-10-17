document.addEventListener('DOMContentLoaded', () => {
    fetchData(paginaActual);
});

const cards = document.querySelector('#card-dinamica');
const templateCard = document.querySelector('#template-card').content;
const btnAnterior = document.querySelector('#btn-anterior');
const btnSiguiente = document.querySelector('#btn-siguiente');
const infoPagina = document.querySelector('#info-pagina');

const API_URL = 'https://rickandmortyapi.com/api/character';
let paginaActual = 1;
let totalPaginas = 1;

const fetchData = async (pagina) => {
    try {
        loadingData(true);

        const res = await fetch(`${API_URL}?page=${pagina}`);
        const data = await res.json();

        paginaActual = pagina;
        totalPaginas = data.info.pages;

        showData(data);
        actualizarPaginacion();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.log(error);
    } finally {
        loadingData(false);
    }
}

const loadingData = (estado) => {
    const loading = document.querySelector('#loading');
    if (estado) {
        loading.classList.remove('d-none');
    } else {
        loading.classList.add('d-none');
    }
}

const actualizarPaginacion = () => {
    infoPagina.textContent = `Página ${paginaActual} de ${totalPaginas}`;
    btnAnterior.disabled = paginaActual === 1;
    btnSiguiente.disabled = paginaActual === totalPaginas;
}

btnAnterior.addEventListener('click', () => {
    if (paginaActual > 1) fetchData(paginaActual - 1);
});

btnSiguiente.addEventListener('click', () => {
    if (paginaActual < totalPaginas) fetchData(paginaActual + 1);
});

const showData = (data) => {
    const fragment = document.createDocumentFragment();

    cards.textContent = "";

    data.results.forEach((item) => {
        const clone = templateCard.cloneNode(true);

        clone.querySelector('h5').textContent = item.name;
        clone.querySelector('img').setAttribute('src', item.image);
        clone.querySelector('img').setAttribute('alt', item.name);

        const pEspecie = clone.querySelector('p');
        pEspecie.textContent = `Especie: ${item.species}`;

        const datosExtra = [
            `Estado: ${item.status}`,
            `Género: ${item.gender}`,
            `Origen: ${item.origin.name}`
        ];

        let anterior = pEspecie;
        datosExtra.forEach((texto) => {
            const p = document.createElement('p');
            p.className = pEspecie.className;
            p.textContent = texto;
            anterior.after(p);
            anterior = p;
        });

        fragment.appendChild(clone);
    });

    cards.appendChild(fragment);
}