# 🛒 Carrito de Compras - Versión Mejorada v2.0

## 📋 Proyecto Mejorado - Funcionalidades Implementadas

### ✅ Funcionalidades Originales Solicitadas:
1. ✅ **Implementar funcionalidades de arrastrar y soltar (drag and drop)** - COMPLETADO
2. ✅ **Añadir capacidades de búsqueda o filtrado avanzadas** - COMPLETADO
3. ✅ **Ampliar el uso de almacenamiento en el navegador (LocalStorage)** - COMPLETADO

---

## 🚀 Nuevas Características Implementadas

### 1️⃣ **Sistema de Búsqueda y Filtrado Avanzado**

#### 🔍 Búsqueda Inteligente
- Búsqueda en tiempo real con **debounce** (optimización de rendimiento)
- Búsqueda por **nombre de curso** y **profesor**
- **Resaltado visual** de términos encontrados
- Historial de búsquedas guardado en LocalStorage
- Contador de resultados encontrados

#### 🎯 Filtros Múltiples
- **Por Categoría:** Programación, Ciberseguridad, Otros
- **Por Profesor:** Manuel R., Alejandro C., Javier O./G., Eduardo F., David R.
- **Por Precio:** Slider de rango de precio
- Panel de filtros **plegable/desplegable**
- Botón para **limpiar todos los filtros**
- Filtros **persistentes** entre sesiones (LocalStorage)

### 2️⃣ **LocalStorage Avanzado con Buenas Prácticas**

#### 💾 Datos Persistentes
- **Carrito de compras** guardado automáticamente
- **Lista de favoritos** persistente
- **Preferencias de filtros** restauradas al recargar
- **Historial de búsquedas** (últimas 5 búsquedas)

#### 🛡️ Gestión Robusta
- Manejo de errores con `try-catch`
- Validación de datos antes de guardar
- Recuperación ante fallos
- Configuración centralizada con constantes
- Sincronización automática en cada cambio

#### 📊 Estructura de Datos
```javascript
CONFIG.STORAGE_KEYS = {
    CARRITO: 'carritoCompras',
    FAVORITOS: 'cursosFavoritos',
    FILTROS: 'filtrosPreferidos',
    BUSQUEDAS: 'historialBusquedas'
}
```

### 3️⃣ **Drag & Drop (Arrastrar y Soltar)**

#### 🎨 Funcionalidad
- **Arrastra** cualquier tarjeta de curso
- **Suelta** sobre el icono del carrito
- Feedback visual durante el arrastre:
    - Tarjeta con efecto transparente
    - Borde punteado
    - Icono del carrito se agranda
    - Efecto de sombra verde

#### 💡 Ventajas
- Experiencia de usuario moderna e intuitiva
- Compatibilidad total con el método tradicional (click)
- Notificación visual al añadir

### 4️⃣ **Sistema de Favoritos ⭐**

#### ❤️ Características
- Botón de estrella en cada curso
- Marca visual especial para cursos favoritos
- Borde dorado y sombra
- Guardado en LocalStorage
- Animación al marcar/desmarcar

### 5️⃣ **Sistema de Notificaciones**

#### 🔔 Tipos de Notificaciones
- **Success** (verde): Curso añadido, favorito guardado
- **Info** (azul): Curso eliminado, filtros limpiados
- **Error** (rojo): Problemas con LocalStorage
- **Warning** (naranja): Advertencias

#### ✨ Características
- Aparición suave desde arriba
- Auto-desaparición después de 3 segundos
- Iconos descriptivos
- Posición fija en la esquina superior derecha
- Diseño responsivo

### 6️⃣ **Mejoras en el Carrito**

#### 🛍️ Nuevas Funcionalidades
- **Contador visual** (badge) con número de items
- **Fila de total** con suma automática
- **Mensaje** cuando el carrito está vacío
- **Confirmación** antes de vaciar el carrito
- **Efectos hover** en las filas
- **Sincronización** automática con LocalStorage

### 7️⃣ **Optimizaciones y Buenas Prácticas**

#### 🎯 Arquitectura
- **Separación de responsabilidades** por bloques de funciones
- **Constantes de configuración** centralizadas
- **Comentarios descriptivos** en todo el código
- **Funciones reutilizables** y modulares

#### ⚡ Rendimiento
- **Debounce** en búsqueda (300ms)
- **Event delegation** para mejor performance
- **Lazy loading** de elementos dinámicos
- **Optimización** del DOM

#### 🛡️ Robustez
- **Manejo de errores** con try-catch
- **Validación** de datos
- **Valores por defecto** seguros
- **Prevención** de duplicados

#### ♿ Accesibilidad
- **Títulos descriptivos** en elementos
- **Atributos alt** en imágenes
- **Clases sr-only** para lectores de pantalla
- **Navegación por teclado** compatible

---

## 🎨 Estilos CSS Añadidos

### Nuevas Clases y Componentes:
- `.notificacion` - Sistema de notificaciones
- `.carrito-badge` - Contador del carrito
- `.panel-filtros` - Panel de filtros
- `.btn-favorito` - Botones de favoritos
- `.contador-resultados` - Contador de búsqueda
- `mark` - Resaltado de texto
- Animaciones: `pulse`, `spin`
- Efectos hover mejorados
- Transiciones suaves
- Diseño responsive mejorado

---

## 📂 Estructura de Archivos

```
├── index.html          # HTML principal (sin cambios)
├── README.md           # Requerimientos originales
├── DOCUMENTACION.md    # Esta documentación completa
├── css/
│   ├── custom.css      # Estilos mejorados ✨
│   ├── normalize.css
│   └── skeleton.css
├── js/
│   ├── app1.js - app7.js  # Versiones anteriores (compatibilidad)
│   └── app8.js         # Versión mejorada ACTIVA ⭐
└── img/                # Imágenes
```

---

## 🚦 Cómo Usar

### Inicio Rápido:
1. Abre `index.html` en tu navegador
2. El carrito se cargará automáticamente desde LocalStorage
3. ¡Listo! Todas las funcionalidades están activas

### Funcionalidades:

#### 🔍 Búsqueda:
- Escribe en el campo de búsqueda
- Los resultados se filtran automáticamente
- El texto se resalta en amarillo

#### 🎯 Filtros:
- Marca las categorías deseadas
- Selecciona profesores
- Ajusta el precio máximo con el slider
- Los filtros se combinan con la búsqueda

#### 🛒 Añadir al Carrito:
- **Método 1:** Click en "Añadir al carrito"
- **Método 2:** Arrastra la tarjeta al icono del carrito

#### ⭐ Favoritos:
- Click en la estrella (☆/⭐)
- Los favoritos se guardan automáticamente

#### 🗑️ Eliminar:
- Click en la "X" de cada curso en el carrito
- O vacía todo el carrito con el botón

---

## 🔧 Configuración Técnica

### Constantes (pueden modificarse en app8.js):
```javascript
DEBOUNCE_DELAY: 300     // Delay de búsqueda en ms
MAX_HISTORIAL: 5        // Máximo de búsquedas guardadas
```

### LocalStorage Keys:
- `carritoCompras` - Artículos del carrito
- `cursosFavoritos` - IDs de cursos favoritos
- `filtrosPreferidos` - Estado de filtros
- `historialBusquedas` - Últimas búsquedas

---

## 🌟 Mejoras Futuras (Opcional)

- [ ] Ordenamiento de resultados (A-Z, precio, popularidad)
- [ ] Sistema de valoraciones
- [ ] Comparador de cursos
- [ ] Vista de lista/cuadrícula
- [ ] Modo oscuro automático
- [ ] Exportar carrito como PDF
- [ ] Compartir carrito por URL

---

## 📱 Compatibilidad

- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Responsive (móviles y tablets)
- ✅ LocalStorage compatible con todos los navegadores modernos

---

## 👨‍💻 Información Técnica

### Tecnologías Utilizadas:
- HTML5
- CSS3 (Grid, Flexbox, Animaciones)
- JavaScript ES6+ (Arrow Functions, Destructuring, Spread Operator)
- LocalStorage API
- Drag and Drop API

### Patrones Implementados:
- Event Delegation
- Debouncing
- Module Pattern
- Single Responsibility Principle

---

## 📝 Notas del Desarrollador

Este proyecto ha sido mejorado manteniendo la **compatibilidad total** con las versiones anteriores (app1-app7). El código sigue las **mejores prácticas** de JavaScript moderno y está **completamente documentado**.

**Características destacadas:**
- ✨ Código limpio y organizado
- 🎯 Funciones bien definidas y reutilizables
- 🛡️ Manejo robusto de errores
- 📦 Persistencia de datos confiable
- 🎨 UX/UI mejorada significativamente

---

## 🐛 Debugging y Consola

Al cargar la página, verás en la consola del navegador:
```
🛒 Carrito de Compras Mejorado v2.0
Funcionalidades activas:
✅ LocalStorage persistente
✅ Búsqueda y filtrado avanzado
✅ Drag & Drop
✅ Sistema de favoritos
✅ Notificaciones
```

---
