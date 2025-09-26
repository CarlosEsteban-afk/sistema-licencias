
# Sistema de Licencias

Este proyecto implementa un sistema distribuido de licencias médicas, validado mediante **Pact** para pruebas de contrato entre los distintos servicios.

## Servicios principales

El sistema está compuesto por los siguientes servicios en Docker:

- **db_licencias** → Base de datos PostgreSQL.  
- **licencias** → Proveedor principal (API de licencias).  
- **portal-paciente** → API que consume licencias.  
- **validador-aseguradora** → Servicio que valida licencias con el proveedor.  
- **consumer-tests-medico** → Generador de archivos pact usando Jest.  
- **consumer-tests-portal** → Generador de archivos pact usando Jest.  
- **consumer-tests-validador** → Generador de archivos pact usando Jest.  
- **verify-licencias** → Servicio de verificación Pact que asegura la compatibilidad entre consumidores y el proveedor.

---

## Levantar el sistema

1. Levantar la base de datos y el servicio principal junto con consumidores:

```bash
docker compose up -d db_licencias licencias portal-paciente validador-aseguradora
```

Esto pondrá en marcha:

- Base de datos PostgreSQL

- API de Licencias

- Portal Paciente

- Validador Aseguradora

## Generar contratos (pacts)

Los contratos Pact se generan al correr los tests de cada consumidor.
Esto crea la carpeta pacts/ con los archivos .json.

Ejecutar los siguientes comandos:


```bash
# Tests del portal paciente
docker compose run --rm consumer-tests-portal

# Tests del médico
docker compose run --rm consumer-tests-medico

# Tests del validador de aseguradora
docker compose run --rm consumer-tests-validador
```

## Verificar contratos

Una vez generados los pacts, se corre la verificación contra el proveedor (Licencias):

```bash
docker compose run --rm verify-licencias
```

## Estructura de carpetas: 

```bash
.
├── consumer-tests
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── tests
│       ├── medicoAppLicencias.test.js
│       ├── portalPacienteLicencias.test.js
│       └── validadorLicencias.test.js
├── docker-compose.yml
├── estructura.txt
├── licencias
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── prisma
│   │   ├── migrations
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── src
│       ├── db.js
│       ├── index.js
│       ├── providerStates.js
│       └── routes.js
├── package-lock.json
├── portal-paciente
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── src
│       └── index.js
├── README.md
├── validador-aseguradora
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── src
│       └── index.js
└── verify-licencias
    ├── Dockerfile
    ├── package.json
    ├── package-lock.json
    └── src
        └── index.js

12 directories, 31 files

```

## Principales desafios

Dentro de los desafios más complejos se encuentra la utilizacion de docker para crear y conectar los servicios.<br>
Entender las pruebas de contrato fue complicado ya que son un estilo distinto de probar las cosas.<br>
Pact tenia muchas manereas de implementarse, existian muchas formas distintas de llegar al mismo resultado, 
trabajando con mis compañeros cada uno tenia una version disitnta de llegar al mismo resultado.