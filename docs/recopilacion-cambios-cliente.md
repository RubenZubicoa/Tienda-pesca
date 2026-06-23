# Recopilación de trabajo — Tienda Pesca (The Lake)

**Proyecto:** Frontend e-commerce Angular  
**Periodo registrado en repositorio:** 22 de abril de 2026 – 23 de junio de 2026  
**Días con actividad:** 12  
**Total de commits:** 43  
**Autor:** Zubicoa Garijo  

Este documento resume el trabajo realizado, agrupado **por día laboral** (un hito representativo por jornada), para justificar las horas dedicadas al cliente.

---

## Resumen por áreas funcionales

| Área | Trabajo realizado |
|------|-------------------|
| **Diseño e identidad visual** | Tema negro/dorado, logo, imagen de portada, ajustes de layout y espaciado |
| **Arquitectura frontend** | Componentización, modelos, servicios, entornos (dev/prod) |
| **Navegación** | Header, sidenav con categorías expandibles, footer fijo |
| **Catálogo** | Página de categorías, listado y tarjetas de producto |
| **Producto** | Vista de detalle (galería, opciones, cantidad, descripción) |
| **Carrito y checkout** | Sección de carrito, flujo de compra |
| **API** | Conexión con backend, variables de entorno, interceptores |
| **Autenticación** | Login, registro, token JWT, usuario en sesión, logout |
| **Área de cliente** | Pantalla de cuenta: historial de pedidos y datos personales |
| **Accesibilidad** | Contraste, foco visible, tamaños táctiles, `prefers-reduced-motion` |

---

## Detalle por día

### 22 de abril de 2026
**Commit representativo:** `d9958a0` — *feat: añadir logo*  
**Commits del día:** 5

- Arranque del repositorio y estructura inicial del proyecto Angular.
- Integración de imágenes en el catálogo de productos.
- Primeras iteraciones de diseño de la interfaz.
- Incorporación del logotipo *The Lake* y ajustes del layout principal.

**Entregable del día:** Base visual de la tienda con branding y contenido de producto.

---

### 23 de abril de 2026
**Commit representativo:** `6849b91` — *feat: mejorar estilos*  
**Commits del día:** 4

- Carga de recursos gráficos adicionales (imágenes de producto y fondo de portada).
- Refinamiento del hero y de los estilos globales de la aplicación.

**Entregable del día:** Página de inicio con imagen de portada y estilos más pulidos.

---

### 24 de abril de 2026
**Commit representativo:** `67d3c1f` — *feat: añadir espaciado*  
**Commits del día:** 1

- Ajuste de márgenes y espaciado en el layout para mejorar la legibilidad y el equilibrio visual.

**Entregable del día:** Corrección de espaciado en la maquetación principal.

---

### 28 de abril de 2026
**Commit representativo:** `d07ba28` — *feat: componentizar la app*  
**Commits del día:** 2

- Refactorización hacia componentes reutilizables (tarjetas de producto, estructura modular).
- Separación de responsabilidades en la UI para facilitar el mantenimiento.

**Entregable del día:** Arquitectura de componentes compartidos.

---

### 29 de abril de 2026
**Commit representativo:** `4ea2cde` — *feat: mejorar los estilos de la app*  
**Commits del día:** 6

- Configuración de entornos (`environment.development`, `environment.production`).
- Definición de modelos de datos (producto, categoría, marca, etc.).
- Creación de servicios para consumo de API.
- Implementación del **sidenav** lateral con categorías y subcategorías expandibles.
- Mejoras globales de estilos (paneles, grid de productos, coherencia visual).

**Entregable del día:** Capa de datos, servicios HTTP y navegación lateral por categorías.

---

### 5 de mayo de 2026
**Commit representativo:** `73472e2` — *refactor: mejorar los estilos de los productos*  
**Commits del día:** 4

- Desarrollo de la **página de categorías** y su configuración de rutas.
- Resolvers para cargar categorías y subcategorías desde la API.
- Refactor del listado y presentación visual de productos.

**Entregable del día:** Navegación por categorías con datos dinámicos del backend.

---

### 6 de mayo de 2026
**Commit representativo:** `03c9ca4` — *feat: conectar api*  
**Commits del día:** 3

- Continuación del refinamiento visual del catálogo.
- Implementación de la **sección del carrito de compra** (listado, cantidades, resumen).
- Conexión de la aplicación con la **API REST** (URL de entorno y primeras integraciones).

**Entregable del día:** Carrito funcional e integración inicial con el backend.

---

### 8 de mayo de 2026
**Commit representativo:** `d80f5a9` — *feat: añadir elementos al header*  
**Commits del día:** 2

- **Vista de detalle de producto** (imagen, información, selección de opciones y cantidad).
- Correcciones en el sidenav.
- Ampliación del **header** (enlaces de acción, carrito, acceso a login).

**Entregable del día:** Ficha de producto y cabecera con acciones de usuario.

---

### 14 de mayo de 2026
**Commit representativo:** `75cd70e` — *feat: fijar el footer*  
**Commits del día:** 2

- Mejoras generales de estilos en toda la aplicación.
- **Footer fijo** en la parte inferior con enlaces, redes sociales y newsletter.

**Entregable del día:** Pie de página persistente y pulido visual global.

---

### 21 de mayo de 2026
**Commit representativo:** `3b2b965` — *feat: crear formulario de registro*  
**Commits del día:** 2

- Pantalla de **inicio de sesión** (`/login`) con formulario reactivo y validaciones.
- Componente de **registro** separado, activable desde el login.
- Estilos compartidos de formularios de autenticación (`auth-form.scss`).

**Entregable del día:** Módulo de autenticación (UI) con login y registro.

---

### 22 de junio de 2026
**Commit representativo:** `6c2c3fc` — *feat: modificar detalles de producto*  
**Commits del día:** 1

- Rediseño de la **página de detalle de producto** según referencia de e-commerce:
  - Migas de pan (breadcrumbs).
  - Galería con imagen principal y miniaturas.
  - Descripción en columna izquierda; compra en columna derecha.
  - Selector de color, cantidad, acordeón de política y botón de añadir al carrito.
- Ampliación del modelo `Product` para soportar nuevos datos.

**Entregable del día:** Experiencia de producto alineada con estándares de tienda online.

---

### 23 de junio de 2026
**Commit representativo:** `3f0e4f3` — *feat: mejorar estilos de la app*  
**Commits del día:** 11

Jornada de integración de autenticación, área de cliente y accesibilidad:

| Commit | Descripción |
|--------|-------------|
| `954dedb` | Petición de login contra la API y servicio de token |
| `059348c` | Servicio de usuario actual (`CurrentUserService`) |
| `637311f` | Nombre del usuario visible en el header |
| `6b6ccd7` | Persistencia de usuario y token en `localStorage` |
| `c861319` | Botón de logout (icono, visible solo con sesión activa) |
| `a78662e` | Interceptor HTTP para adjuntar el token JWT |
| `05b7864` | Formulario de registro: nombre, apellidos y teléfono separados |
| `64155cd` | Registro de usuarios conectado a la API |
| `3ad63d9` | Pantalla **Mi cuenta** (`/account`): historial de pedidos y edición de datos personales |
| `2d5e524` | Actualización de la URL de la API en entornos |
| `3f0e4f3` | Mejoras de **accesibilidad** (WCAG): contraste, foco visible, tamaños táctiles 44px, `prefers-reduced-motion` |

**Entregable del día:** Flujo completo de autenticación, área privada del usuario y cumplimiento de estándares de accesibilidad en estilos.

---

## Cronología visual

```
Abr 2026   ████░░  22–24  Diseño inicial, logo, portada, espaciado
           ██░░░░  28–29  Componentización, modelos, servicios, sidenav
May 2026   ███░░░  05–06  Categorías, carrito, conexión API
           ██░░░░  08–14  Detalle producto, header, footer fijo
           █░░░░░  21     Login y registro (UI)
Jun 2026   █░░░░░  22     Rediseño ficha de producto
           ██████  23     Auth API, cuenta, accesibilidad
```

---

## Estado actual de la aplicación (fin de periodo)

Al cierre de esta recopilación, la tienda incluye:

1. **Página principal** con hero, categorías destacadas y productos.
2. **Navegación** por categorías y subcategorías (sidenav + rutas).
3. **Detalle de producto** con galería, opciones y carrito.
4. **Carrito** y flujo de **checkout**.
5. **Login / registro** integrados con API.
6. **Sesión persistente** (token + usuario en localStorage).
7. **Área de cuenta** con historial de pedidos (datos de prueba) y edición de perfil.
8. **Estilos accesibles** según buenas prácticas WCAG 2.2 AA.

---

## Notas para facturación / justificación

- Cada fila de la sección «Detalle por día» corresponde a **una jornada de trabajo documentada en Git**.
- Los días con más commits (p. ej. 29-abr, 23-jun) concentran entregas de mayor alcance técnico (arquitectura, auth completa).
- El trabajo no incluye únicamente cambios visuales: abarca modelos, servicios, rutas, guards, interceptores y formularios reactivos.
- Para auditar cualquier día: `git log --after="YYYY-MM-DD" --before="YYYY-MM-DD 23:59:59" --oneline`

---

*Documento generado a partir del historial del repositorio Git. Última actualización: 23 de junio de 2026.*
