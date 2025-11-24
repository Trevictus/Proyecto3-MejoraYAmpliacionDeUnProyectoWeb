// *** CARRITO DE COMPRAS CON FUNCIONALIDADES AVANZADAS ***
// Versión mejorada con LocalStorage, Búsqueda/Filtrado Avanzado y Drag & Drop

//  *** CONSTANTES Y CONFIGURACIÓN ***
const CONFIG = {
    STORAGE_KEYS: {
        CARRITO: 'carritoCompras',
        FAVORITOS: 'cursosFavoritos',
        FILTROS: 'filtrosPreferidos',
        BUSQUEDAS: 'historialBusquedas'
    },
    DEBOUNCE_DELAY: 300, // ms para el debounce de búsqueda
    MAX_HISTORIAL: 5 // Máximo de búsquedas a guardar
}

//  *** Variables DOM ***
const carrito = document.querySelector('#carrito')
const contenedorCarrito = document.querySelector('#lista-carrito tbody')
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito')
const listaCursos = document.querySelector('#lista-cursos')
const buscadorInput = document.querySelector('#buscador')

//  *** Variables de Estado ***
let articulosCarrito = []
let cursosFavoritos = []
let todosLosCursos = [] // Array para almacenar todos los cursos
let filtrosActivos = {
    categoria: [],
    profesor: [],
    precioMax: Infinity
}


//  *** Listeners *** 
cargarEventListeners()
function cargarEventListeners () {
    // Cargar datos del LocalStorage al iniciar
    document.addEventListener('DOMContentLoaded', inicializarApp)

    // Eventos del carrito
    listaCursos.addEventListener('click', añadirCurso)
    carrito.addEventListener('click', eliminarCurso)

    // Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de vaciar el carrito?')) {
            articulosCarrito = []
            sincronizarLocalStorage()
            limpiarHTML()
            mostrarNotificacion('Carrito vaciado', 'info')
        }
    })

    // Búsqueda con debounce
    if (buscadorInput) {
        buscadorInput.addEventListener('input', debounce(realizarBusqueda, CONFIG.DEBOUNCE_DELAY))
    }

    // Prevenir submit del formulario de búsqueda
    const formularioBusqueda = document.querySelector('#busqueda')
    if (formularioBusqueda) {
        formularioBusqueda.addEventListener('submit', (e) => {
            e.preventDefault()
            realizarBusqueda()
        })
    }
}

//  *** FUNCIONES DE INICIALIZACIÓN ***

// Inicializar la aplicación
function inicializarApp() {
    cargarDesdeLocalStorage()
    extraerCursos()
    crearPanelFiltros()
    configurarDragAndDrop()
    carritoHTML()
    mostrarNotificacion('¡Bienvenido! Tu carrito ha sido restaurado', 'success')
}

// Extraer todos los cursos del DOM para búsqueda y filtrado
function extraerCursos() {
    const tarjetasCursos = document.querySelectorAll('.card')
    todosLosCursos = Array.from(tarjetasCursos).map(card => {
        return {
            elemento: card,
            titulo: card.querySelector('h4').textContent.toLowerCase(),
            profesor: card.querySelector('.info-card p').textContent.toLowerCase(),
            precio: parseFloat(card.querySelector('.precio span').textContent.replace('€', '')),
            id: card.querySelector('.agregar-carrito').getAttribute('data-id'),
            categoria: determinarCategoria(card.querySelector('h4').textContent)
        }
    })
}

// Determinar categoría basada en el título
function determinarCategoria(titulo) {
    const categorias = {
        'Programación': ['javascript', 'html5', 'css3', 'php', 'docker'],
        'Ciberseguridad': ['hacking', 'incidentes', 'bastionado', 'forense', 'producción']
    }

    titulo = titulo.toLowerCase()
    for (let [categoria, palabras] of Object.entries(categorias)) {
        if (palabras.some(palabra => titulo.includes(palabra))) {
            return categoria
        }
    }
    return 'Otros'
}


//  *** FUNCIONES DEL CARRITO ***

// Función para añadir cursos al carrito
function añadirCurso(e) {
    e.preventDefault()

    // Manejar click en botón de favoritos
    if (e.target.classList.contains('btn-favorito')) {
        const cursoId = e.target.getAttribute('data-id')
        toggleFavorito(cursoId)
        return
    }

    if (e.target.classList.contains('agregar-carrito')) {
        const curso = e.target.parentElement.parentElement 
        leerDatosCurso(curso)
        mostrarNotificacion('Curso añadido al carrito', 'success')
    }
 }

 // Elimina cursos del carrito
 function eliminarCurso(e) {
    if (e.target.classList.contains('borrar-curso')){
        const cursoId = e.target.getAttribute('data-id')
        articulosCarrito = articulosCarrito.filter((curso) => curso.id !== cursoId)
        sincronizarLocalStorage()
        carritoHTML()
        mostrarNotificacion('Curso eliminado del carrito', 'info')
    }
 }

 // Lee la información del curso seleccionado.
 function leerDatosCurso(curso) {
    const infoCurso = {
        imagen:curso.querySelector('img').src,
        titulo:curso.querySelector('h4').textContent,
        precio:curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id)
    if (existe) {
        const cursos = articulosCarrito.map((curso) => {
            if (curso.id === infoCurso.id) {
                curso.cantidad ++
                return curso 
            } else {
                return curso
            }
        })
        articulosCarrito = [...cursos]
    } else {
        articulosCarrito = [...articulosCarrito, infoCurso]
    }
    sincronizarLocalStorage()
    carritoHTML()
 }

 // Muestra el carrito de compras en el HTML
 function carritoHTML() {
    limpiarHTML()

    // Si el carrito está vacío, mostrar mensaje
    if (articulosCarrito.length === 0) {
        const mensajeVacio = document.createElement('tr')
        mensajeVacio.innerHTML = `
            <td colspan="5" class="vacio">
                🛒 El carrito está vacío
            </td>
        `
        contenedorCarrito.appendChild(mensajeVacio)
        actualizarContadorCarrito()
        return
    }

    articulosCarrito.forEach((curso) => {
        const {imagen, titulo, precio, cantidad, id} = curso
        const row = document.createElement('tr')
        row.innerHTML = `
            <td> 
                <img src="${imagen}" width="100" alt="${titulo}">
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}" title="Eliminar curso">X</a>
            </td>
        `
        contenedorCarrito.appendChild(row)
    })

    // Añadir fila con el total
    agregarFilaTotal()
    actualizarContadorCarrito()
 }

 // Agregar fila con el total del carrito
 function agregarFilaTotal() {
    const total = articulosCarrito.reduce((sum, curso) => {
        const precio = parseFloat(curso.precio.replace('€', ''))
        return sum + (precio * curso.cantidad)
    }, 0)

    const filaTotal = document.createElement('tr')
    filaTotal.classList.add('fila-total')
    filaTotal.innerHTML = `
        <td colspan="2"><strong>Total:</strong></td>
        <td colspan="3"><strong>${total.toFixed(2)}€</strong></td>
    `
    contenedorCarrito.appendChild(filaTotal)
 }

 // Actualizar contador visual del carrito
 function actualizarContadorCarrito() {
    const totalItems = articulosCarrito.reduce((sum, curso) => sum + curso.cantidad, 0)

    // Crear o actualizar badge con el número de items
    let badge = document.querySelector('.carrito-badge')
    if (!badge) {
        badge = document.createElement('span')
        badge.classList.add('carrito-badge')
        const imgCarrito = document.querySelector('#img-carrito')
        if (imgCarrito && imgCarrito.parentElement) {
            imgCarrito.parentElement.style.position = 'relative'
            imgCarrito.parentElement.appendChild(badge)
        }
    }

    badge.textContent = totalItems
    badge.style.display = totalItems > 0 ? 'flex' : 'none'
 }

 // Función para limpiar el HTML (elimina los cursos del tbody)
 function limpiarHTML() {
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.firstChild.remove()
    }
 }


//  *** FUNCIONES DE LOCAL STORAGE ***

// Sincronizar carrito con LocalStorage
function sincronizarLocalStorage() {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEYS.CARRITO, JSON.stringify(articulosCarrito))
    } catch (error) {
        console.error('Error al guardar en LocalStorage:', error)
        mostrarNotificacion('Error al guardar el carrito', 'error')
    }
}

// Cargar datos desde LocalStorage
function cargarDesdeLocalStorage() {
    try {
        // Cargar carrito
        const carritoGuardado = localStorage.getItem(CONFIG.STORAGE_KEYS.CARRITO)
        if (carritoGuardado) {
            articulosCarrito = JSON.parse(carritoGuardado)
        }

        // Cargar favoritos
        const favoritosGuardados = localStorage.getItem(CONFIG.STORAGE_KEYS.FAVORITOS)
        if (favoritosGuardados) {
            cursosFavoritos = JSON.parse(favoritosGuardados)
            marcarFavoritos()
        }

        // Cargar filtros preferidos
        const filtrosGuardados = localStorage.getItem(CONFIG.STORAGE_KEYS.FILTROS)
        if (filtrosGuardados) {
            filtrosActivos = JSON.parse(filtrosGuardados)
        }
    } catch (error) {
        console.error('Error al cargar desde LocalStorage:', error)
        // Inicializar con valores por defecto
        articulosCarrito = []
        cursosFavoritos = []
    }
}

// Guardar favoritos en LocalStorage
function guardarFavoritos() {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEYS.FAVORITOS, JSON.stringify(cursosFavoritos))
    } catch (error) {
        console.error('Error al guardar favoritos:', error)
    }
}

// Guardar filtros en LocalStorage
function guardarFiltros() {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEYS.FILTROS, JSON.stringify(filtrosActivos))
    } catch (error) {
        console.error('Error al guardar filtros:', error)
    }
}

// Guardar búsqueda en historial
function guardarBusquedaEnHistorial(termino) {
    if (!termino || termino.trim().length < 2) return

    try {
        let historial = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.BUSQUEDAS) || '[]')

        // Evitar duplicados
        historial = historial.filter(item => item !== termino)
        historial.unshift(termino)

        // Limitar el tamaño del historial
        historial = historial.slice(0, CONFIG.MAX_HISTORIAL)

        localStorage.setItem(CONFIG.STORAGE_KEYS.BUSQUEDAS, JSON.stringify(historial))
    } catch (error) {
        console.error('Error al guardar historial de búsquedas:', error)
    }
}


//  *** FUNCIONES DE BÚSQUEDA Y FILTRADO ***

// Realizar búsqueda
function realizarBusqueda() {
    const termino = buscadorInput.value.toLowerCase().trim()

    if (termino) {
        guardarBusquedaEnHistorial(termino)
    }

    aplicarFiltrosYBusqueda(termino)
}

// Aplicar filtros y búsqueda combinados
function aplicarFiltrosYBusqueda(terminoBusqueda = '') {
    let cursosFiltrados = [...todosLosCursos]

    // Filtrar por término de búsqueda
    if (terminoBusqueda) {
        cursosFiltrados = cursosFiltrados.filter(curso =>
            curso.titulo.includes(terminoBusqueda) ||
            curso.profesor.includes(terminoBusqueda)
        )
    }

    // Filtrar por categoría
    if (filtrosActivos.categoria.length > 0) {
        cursosFiltrados = cursosFiltrados.filter(curso =>
            filtrosActivos.categoria.includes(curso.categoria)
        )
    }

    // Filtrar por profesor
    if (filtrosActivos.profesor.length > 0) {
        cursosFiltrados = cursosFiltrados.filter(curso =>
            filtrosActivos.profesor.some(prof => curso.profesor.includes(prof.toLowerCase()))
        )
    }

    // Filtrar por precio
    if (filtrosActivos.precioMax !== Infinity) {
        cursosFiltrados = cursosFiltrados.filter(curso =>
            curso.precio <= filtrosActivos.precioMax
        )
    }

    // Mostrar/ocultar cursos
    mostrarCursosFiltrados(cursosFiltrados, terminoBusqueda)

    // Actualizar contador de resultados
    actualizarContadorResultados(cursosFiltrados.length)
}

// Mostrar cursos filtrados
function mostrarCursosFiltrados(cursosFiltrados, termino) {
    // Ocultar todos los cursos
    todosLosCursos.forEach(curso => {
        curso.elemento.style.display = 'none'
        // Eliminar resaltado previo
        const titulo = curso.elemento.querySelector('h4')
        titulo.innerHTML = titulo.textContent
    })

    // Mostrar solo los filtrados
    cursosFiltrados.forEach(curso => {
        curso.elemento.style.display = 'block'

        // Resaltar término de búsqueda
        if (termino) {
            resaltarTexto(curso.elemento, termino)
        }
    })
}

// Resaltar texto en los resultados de búsqueda
function resaltarTexto(elemento, termino) {
    const titulo = elemento.querySelector('h4')
    const textoOriginal = titulo.textContent
    const regex = new RegExp(`(${termino})`, 'gi')
    titulo.innerHTML = textoOriginal.replace(regex, '<mark>$1</mark>')
}

// Actualizar contador de resultados
function actualizarContadorResultados(cantidad) {
    let contador = document.querySelector('.contador-resultados')

    if (!contador) {
        contador = document.createElement('div')
        contador.classList.add('contador-resultados')
        const encabezado = document.querySelector('#encabezado')
        if (encabezado) {
            encabezado.insertAdjacentElement('afterend', contador)
        }
    }

    if (cantidad < todosLosCursos.length) {
        contador.textContent = `Mostrando ${cantidad} de ${todosLosCursos.length} cursos`
        contador.style.display = 'block'
    } else {
        contador.style.display = 'none'
    }
}

// Crear panel de filtros
function crearPanelFiltros() {
    const panelFiltros = document.createElement('div')
    panelFiltros.classList.add('panel-filtros')
    panelFiltros.innerHTML = `
        <div class="container">
            <h3>🔍 Filtros de Búsqueda</h3>
            <div class="filtros-container">
                <div class="filtro-grupo">
                    <h4>Categoría</h4>
                    <label><input type="checkbox" value="Programación" class="filtro-categoria"> Programación</label>
                    <label><input type="checkbox" value="Ciberseguridad" class="filtro-categoria"> Ciberseguridad</label>
                    <label><input type="checkbox" value="Otros" class="filtro-categoria"> Otros</label>
                </div>
                
                <div class="filtro-grupo">
                    <h4>Profesor</h4>
                    <label><input type="checkbox" value="Manuel R." class="filtro-profesor"> Manuel R.</label>
                    <label><input type="checkbox" value="Alejandro C." class="filtro-profesor"> Alejandro C.</label>
                    <label><input type="checkbox" value="Javier" class="filtro-profesor"> Javier O./G.</label>
                    <label><input type="checkbox" value="Eduardo F." class="filtro-profesor"> Eduardo F.</label>
                    <label><input type="checkbox" value="David R." class="filtro-profesor"> David R.</label>
                </div>
                
                <div class="filtro-grupo">
                    <h4>Precio Máximo</h4>
                    <input type="range" id="filtro-precio" min="1" max="200" value="200" step="1">
                    <span id="precio-valor">200€</span>
                </div>
                
                <div class="filtro-acciones">
                    <button id="btn-limpiar-filtros" class="button">🔄 Limpiar Filtros</button>
                    <button id="btn-toggle-filtros" class="button button-primary">▼ Ocultar</button>
                </div>
            </div>
        </div>
    `

    const listaCursosDiv = document.querySelector('#lista-cursos')
    listaCursosDiv.insertAdjacentElement('beforebegin', panelFiltros)

    // Restaurar filtros guardados
    restaurarFiltrosGuardados()

    // Event listeners para filtros
    configurarEventosFiltros()
}

// Configurar eventos de filtros
function configurarEventosFiltros() {
    // Filtros de categoría
    document.querySelectorAll('.filtro-categoria').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                filtrosActivos.categoria.push(e.target.value)
            } else {
                filtrosActivos.categoria = filtrosActivos.categoria.filter(c => c !== e.target.value)
            }
            guardarFiltros()
            aplicarFiltrosYBusqueda(buscadorInput.value.toLowerCase())
        })
    })

    // Filtros de profesor
    document.querySelectorAll('.filtro-profesor').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                filtrosActivos.profesor.push(e.target.value)
            } else {
                filtrosActivos.profesor = filtrosActivos.profesor.filter(p => p !== e.target.value)
            }
            guardarFiltros()
            aplicarFiltrosYBusqueda(buscadorInput.value.toLowerCase())
        })
    })

    // Filtro de precio
    const filtroPrecio = document.querySelector('#filtro-precio')
    const precioValor = document.querySelector('#precio-valor')

    filtroPrecio.addEventListener('input', (e) => {
        const valor = e.target.value
        precioValor.textContent = `${valor}€`
        filtrosActivos.precioMax = parseFloat(valor)
        guardarFiltros()
        aplicarFiltrosYBusqueda(buscadorInput.value.toLowerCase())
    })

    // Limpiar filtros
    document.querySelector('#btn-limpiar-filtros').addEventListener('click', limpiarFiltros)

    // Toggle panel filtros
    const btnToggle = document.querySelector('#btn-toggle-filtros')
    const filtrosContainer = document.querySelector('.filtros-container')

    btnToggle.addEventListener('click', () => {
        filtrosContainer.classList.toggle('oculto')
        btnToggle.textContent = filtrosContainer.classList.contains('oculto') ? '▲ Mostrar' : '▼ Ocultar'
    })
}

// Restaurar filtros guardados
function restaurarFiltrosGuardados() {
    // Restaurar categorías
    filtrosActivos.categoria.forEach(cat => {
        const checkbox = document.querySelector(`.filtro-categoria[value="${cat}"]`)
        if (checkbox) checkbox.checked = true
    })

    // Restaurar profesores
    filtrosActivos.profesor.forEach(prof => {
        const checkbox = document.querySelector(`.filtro-profesor[value="${prof}"]`)
        if (checkbox) checkbox.checked = true
    })

    // Restaurar precio
    if (filtrosActivos.precioMax !== Infinity) {
        const filtroPrecio = document.querySelector('#filtro-precio')
        const precioValor = document.querySelector('#precio-valor')
        if (filtroPrecio && precioValor) {
            filtroPrecio.value = filtrosActivos.precioMax
            precioValor.textContent = `${filtrosActivos.precioMax}€`
        }
    }
}

// Limpiar todos los filtros
function limpiarFiltros() {
    filtrosActivos = {
        categoria: [],
        profesor: [],
        precioMax: Infinity
    }

    // Desmarcar checkboxes
    document.querySelectorAll('.filtro-categoria, .filtro-profesor').forEach(cb => cb.checked = false)

    // Resetear precio
    const filtroPrecio = document.querySelector('#filtro-precio')
    const precioValor = document.querySelector('#precio-valor')
    filtroPrecio.value = 200
    precioValor.textContent = '200€'

    // Limpiar búsqueda
    if (buscadorInput) {
        buscadorInput.value = ''
    }

    guardarFiltros()
    aplicarFiltrosYBusqueda()
    mostrarNotificacion('Filtros limpiados', 'info')
}


//  *** FUNCIONES DE FAVORITOS ***

// Toggle favorito
function toggleFavorito(cursoId) {
    const index = cursosFavoritos.indexOf(cursoId)

    if (index > -1) {
        cursosFavoritos.splice(index, 1)
        mostrarNotificacion('Eliminado de favoritos', 'info')
    } else {
        cursosFavoritos.push(cursoId)
        mostrarNotificacion('Añadido a favoritos ⭐', 'success')
    }

    guardarFavoritos()
    marcarFavoritos()
}

// Marcar cursos favoritos visualmente
function marcarFavoritos() {
    // Primero, crear botones de favoritos si no existen
    document.querySelectorAll('.card').forEach(card => {
        const cursoId = card.querySelector('.agregar-carrito').getAttribute('data-id')
        const infoCard = card.querySelector('.info-card')

        let btnFav = card.querySelector('.btn-favorito')
        if (!btnFav) {
            btnFav = document.createElement('button')
            btnFav.classList.add('btn-favorito')
            btnFav.setAttribute('data-id', cursoId)
            btnFav.title = 'Agregar a favoritos'

            // Insertar antes del botón de añadir al carrito
            const btnCarrito = card.querySelector('.agregar-carrito')
            btnCarrito.insertAdjacentElement('beforebegin', btnFav)
        }

        // Actualizar estado
        if (cursosFavoritos.includes(cursoId)) {
            btnFav.textContent = '⭐'
            btnFav.classList.add('activo')
            card.classList.add('favorito')
        } else {
            btnFav.textContent = '☆'
            btnFav.classList.remove('activo')
            card.classList.remove('favorito')
        }
    })
}


//  *** FUNCIONES DE DRAG AND DROP ***

// Configurar drag and drop
function configurarDragAndDrop() {
    const tarjetas = document.querySelectorAll('.card')

    tarjetas.forEach(tarjeta => {
        tarjeta.setAttribute('draggable', 'true')

        tarjeta.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'copy'
            const cursoId = tarjeta.querySelector('.agregar-carrito').getAttribute('data-id')
            e.dataTransfer.setData('text/plain', cursoId)
            tarjeta.classList.add('arrastrando')
        })

        tarjeta.addEventListener('dragend', (e) => {
            tarjeta.classList.remove('arrastrando')
        })
    })

    // Configurar zona de drop (carrito)
    const zonaCarrito = document.querySelector('#img-carrito')
    if (zonaCarrito) {
        zonaCarrito.addEventListener('dragover', (e) => {
            e.preventDefault()
            e.dataTransfer.dropEffect = 'copy'
            zonaCarrito.classList.add('drag-over')
        })

        zonaCarrito.addEventListener('dragleave', (e) => {
            zonaCarrito.classList.remove('drag-over')
        })

        zonaCarrito.addEventListener('drop', (e) => {
            e.preventDefault()
            zonaCarrito.classList.remove('drag-over')

            const cursoId = e.dataTransfer.getData('text/plain')
            const tarjeta = document.querySelector(`[data-id="${cursoId}"]`).closest('.card')

            if (tarjeta) {
                leerDatosCurso(tarjeta)
                mostrarNotificacion('¡Curso añadido! 🎯', 'success')
            }
        })
    }
}


//  *** FUNCIONES AUXILIARES ***

// Función debounce para optimizar búsqueda
function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

// Mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Eliminar notificación anterior si existe
    const notifAnterior = document.querySelector('.notificacion')
    if (notifAnterior) {
        notifAnterior.remove()
    }

    const notificacion = document.createElement('div')
    notificacion.classList.add('notificacion', `notificacion-${tipo}`)

    const iconos = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    }

    notificacion.innerHTML = `
        <span class="notificacion-icono">${iconos[tipo] || iconos.info}</span>
        <span class="notificacion-mensaje">${mensaje}</span>
    `

    document.body.appendChild(notificacion)

    // Animación de entrada
    setTimeout(() => notificacion.classList.add('mostrar'), 10)

    // Auto-ocultar después de 3 segundos
    setTimeout(() => {
        notificacion.classList.remove('mostrar')
        setTimeout(() => notificacion.remove(), 300)
    }, 3000)
}

// Consola de información para debugging (solo en desarrollo)
console.log('%c🛒 Carrito de Compras Mejorado v2.0', 'color: #e93556; font-size: 20px; font-weight: bold;')
console.log('%cFuncionalidades activas:', 'color: #4CAF50; font-weight: bold;')
console.log('✅ LocalStorage persistente')
console.log('✅ Búsqueda y filtrado avanzado')
console.log('✅ Drag & Drop')
console.log('✅ Sistema de favoritos')
console.log('✅ Notificaciones')

