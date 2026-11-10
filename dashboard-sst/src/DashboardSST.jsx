import React, { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardSST = () => {
  const [periodo1, setPeriodo1] = useState('2024');
  const [periodo2, setPeriodo2] = useState('2025');
  
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [numeroEmpleado, setNumeroEmpleado] = useState('');
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  
  const [horasTrabajadas, setHorasTrabajadas] = useState(500000);
  const [numeroTrabajadores, setNumeroTrabajadores] = useState(250);
  const [diasPerdidos, setDiasPerdidos] = useState(45);
  
  const [accidentesOficiales, setAccidentesOficiales] = useState([
    { tipo: 'Con incap. temporal', año1: 8, año2: 5 },
    { tipo: 'Con incap. permanente', año1: 1, año2: 0 },
    { tipo: 'Sin incapacidad', año1: 12, año2: 15 },
    { tipo: 'Mortal', año1: 0, año2: 0 },
    { tipo: 'Incidente', año1: 25, año2: 18 }
  ]);
  
  const [ocurrencias, setOcurrencias] = useState([
    { name: 'Sector A', value: 15 },
    { name: 'Sector B', value: 7 },
    { name: 'Sector C', value: 16 },
    { name: 'Sector D', value: 8 }
  ]);

  const [accidentesTurno, setAccidentesTurno] = useState([
    { turno: 'Turno A', accidentes: 11 },
    { turno: 'Turno B', accidentes: 26 },
    { turno: 'Turno C', accidentes: 9 }
  ]);

  const [causasAccidentes, setCausasAccidentes] = useState([
    { causa: 'Actos inseguros', cantidad: 18 },
    { causa: 'Condiciones inseguras', cantidad: 12 },
    { causa: 'Factores personales', cantidad: 8 },
    { causa: 'Factores del trabajo', cantidad: 7 }
  ]);

  const [cumplimientoEPP, setCumplimientoEPP] = useState([
    { area: 'Producción', cumplimiento: 95, capacitados: 98, sinEPP: 5 },
    { area: 'Mantenimiento', cumplimiento: 88, capacitados: 92, sinEPP: 12 },
    { area: 'Almacén', cumplimiento: 92, capacitados: 95, sinEPP: 8 },
    { area: 'Administración', cumplimiento: 100, capacitados: 100, sinEPP: 0 }
  ]);

  const [accionesCorrectivas, setAccionesCorrectivas] = useState({
    totalHallazgos: 45,
    accionesGeneradas: 42,
    accionesCerradas: 35,
    avance: 83
  });

  const [capacitacion, setCapacitacion] = useState({
    cursosImpartidos: 24,
    personalCapacitado: 92,
    horasCapacitacion: 450
  });

  const [riesgoPsicosocial, setRiesgoPsicosocial] = useState([
    { categoria: 'Nulo', casos: 120 },
    { categoria: 'Bajo', casos: 80 },
    { categoria: 'Medio', casos: 35 },
    { categoria: 'Alto', casos: 12 },
    { categoria: 'Muy alto', casos: 3 }
  ]);

  const [investigacionAccidentes, setInvestigacionAccidentes] = useState({
    accidentesOcurridos: 21,
    accidentesInvestigados: 19,
    investigacionesCerradas: 16,
    porcentajeCerradas: 76
  });

  const [programaAnual, setProgramaAnual] = useState({
    actividadesProgramadas: 120,
    actividadesRealizadas: 98,
    porcentajeCumplimiento: 82
  });

  const [cruzSeguridad, setCruzSeguridad] = useState(() => {
    const dias = [];
    for (let i = 1; i <= 31; i++) {
      dias.push({ dia: i, estado: 'verde' });
    }
    return dias;
  });

  const [diasSinAccidentes, setDiasSinAccidentes] = useState(15);
  const [recordDiasSinAccidentes, setRecordDiasSinAccidentes] = useState(45);
  const [totalDiasSinAccidentes, setTotalDiasSinAccidentes] = useState(280);

  const [accidentesSector, setAccidentesSector] = useState([
    { sector: 'Sector A', año1: 11, año2: 8 },
    { sector: 'Sector B', año1: 12, año2: 9 },
    { sector: 'Sector C', año1: 6, año2: 4 },
    { sector: 'Sector D', año1: 5, año2: 3 }
  ]);

  const [accidentesCuerpo, setAccidentesCuerpo] = useState({
    cabeza: { num: 0, porc: 0 },
    ojo: { num: 0, porc: 0 },
    torax: { num: 13, porc: 28 },
    dedo: { num: 11, porc: 24 },
    pierna: { num: 7, porc: 15 },
    costa: { num: 7, porc: 15 },
    pulso: { num: 8, porc: 17 },
    pie: { num: 0, porc: 0 },
    otros: { num: 0, porc: 0 }
  });

  const [regionCuerpo, setRegionCuerpo] = useState([
    { region: 'Tórax', año2: 9, año1: 4 },
    { region: 'Pulso/Brazo', año2: 6, año1: 2 },
    { region: 'Pierna/Muslo', año2: 5, año1: 2 },
    { region: 'Rodilla', año2: 9, año1: 2 },
    { region: 'Costilla', año2: 5, año1: 2 }
  ]);

  const COLORS_PIE = ['#FDB863', '#B8B8B8', '#F4D03F', '#E5E5E5'];

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const calcularIF = () => {
    if (horasTrabajadas <= 0) return '0.00';
    const totalAccidentes = accidentesOficiales.reduce((sum, item) => sum + item.año2, 0);
    return ((totalAccidentes * 1000000) / horasTrabajadas).toFixed(2);
  };

  const calcularIS = () => {
    if (horasTrabajadas <= 0) return '0.00';
    return ((diasPerdidos * 1000000) / horasTrabajadas).toFixed(2);
  };

  const calcularILI = () => {
    const IF = parseFloat(calcularIF());
    const IS = parseFloat(calcularIS());
    return ((IF * IS) / 1000).toFixed(2);
  };

  const calcularIncidentesPorTrabajador = () => {
    if (numeroTrabajadores <= 0) return '0.00';
    const totalIncidentes = accidentesOficiales.find(a => a.tipo === 'Incidente')?.año2 || 0;
    return (totalIncidentes / numeroTrabajadores).toFixed(2);
  };

  const calcularDiasConsecutivos = (dias = cruzSeguridad) => {
    let consecutivos = 0;
    for (let i = dias.length - 1; i >= 0; i--) {
      if (dias[i].estado === 'verde') {
        consecutivos++;
      } else if (dias[i].estado === 'rojo') {
        break;
      }
    }
    return consecutivos;
  };

  const cambiarEstadoDia = (index, nuevoEstado) => {
    const nuevaCruz = [...cruzSeguridad];
    nuevaCruz[index].estado = nuevoEstado;
    setCruzSeguridad(nuevaCruz);
    
    const consecutivos = calcularDiasConsecutivos(nuevaCruz);
    setDiasSinAccidentes(consecutivos);
    
    if (consecutivos > recordDiasSinAccidentes) {
      setRecordDiasSinAccidentes(consecutivos);
    }
    
    const totalVerdes = nuevaCruz.filter(d => d.estado === 'verde').length;
    setTotalDiasSinAccidentes(totalVerdes);
  };

  const exportarExcel = () => {
    const fecha = new Date().toLocaleDateString('es-MX');
    let csv = '\uFEFF';
    
    csv += 'REPORTE OFICIAL DE SEGURIDAD Y SALUD EN EL TRABAJO\n';
    csv += 'CONFORME A NORMATIVIDAD STPS\n\n';
    
    csv += '=== INFORMACIÓN GENERAL ===\n';
    csv += `Empresa:,${nombreEmpresa}\n`;
    csv += `Elaborado por:,${nombreUsuario}\n`;
    csv += `No. Empleado:,${numeroEmpleado}\n`;
    csv += `Fecha:,${fecha}\n`;
    csv += `Periodo:,${periodo1} - ${periodo2}\n\n`;
    
    csv += '=== INDICADORES NORMATIVOS ===\n';
    csv += `IF:,${calcularIF()}\n`;
    csv += `IS:,${calcularIS()}\n`;
    csv += `ILI:,${calcularILI()}\n\n`;
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Reporte_SST_${periodo1}_${periodo2}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-blue-400 mb-1">DASHBOARD SST</h1>
        <h2 className="text-3xl font-bold text-red-500 mb-2">SEGURIDAD Y SALUD EN EL TRABAJO</h2>
        <p className="text-yellow-400 text-sm mb-1">Panel de Seguridad y Salud en el Trabajo</p>
        <p className="text-gray-400 text-xs mb-3">Valores precargados de demostración: sustituye estos datos por registros verificados de tu centro de trabajo.</p>
        
        <div className="bg-gray-700 bg-opacity-70 rounded-lg p-3 max-w-6xl mx-auto mb-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input 
              type="text" 
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              className="px-2 py-1 rounded text-sm"
              placeholder="Nombre completo"
            />
            <input 
              type="text" 
              value={numeroEmpleado}
              onChange={(e) => setNumeroEmpleado(e.target.value)}
              className="px-2 py-1 rounded text-sm"
              placeholder="No. Empleado"
            />
            <input 
              type="text" 
              value={nombreEmpresa}
              onChange={(e) => setNombreEmpresa(e.target.value)}
              className="px-2 py-1 rounded text-sm"
              placeholder="Empresa"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          <input 
            type="text" 
            value={periodo1}
            onChange={(e) => setPeriodo1(e.target.value)}
            className="px-2 py-1 rounded w-20 text-sm"
            placeholder="2024"
          />
          <input 
            type="text" 
            value={periodo2}
            onChange={(e) => setPeriodo2(e.target.value)}
            className="px-2 py-1 rounded w-20 text-sm"
            placeholder="2025"
          />
          <button 
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-1 px-4 rounded text-sm"
            onClick={() => openModal('menu')}
          >
            ACTUALIZAR
          </button>
          <button 
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-4 rounded text-sm"
            onClick={exportarExcel}
          >
            📥 DESCARGAR
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-3 mb-4 max-w-6xl mx-auto">
        <h3 className="text-white font-bold text-center mb-2">INDICADORES NORMATIVOS NOM-030-STPS</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <div className="bg-white rounded p-2 text-center">
            <p className="text-xs text-gray-600">IF</p>
            <p className="text-2xl font-bold text-blue-600">{calcularIF()}</p>
          </div>
          <div className="bg-white rounded p-2 text-center">
            <p className="text-xs text-gray-600">IS</p>
            <p className="text-2xl font-bold text-orange-600">{calcularIS()}</p>
          </div>
          <div className="bg-white rounded p-2 text-center">
            <p className="text-xs text-gray-600">ILI</p>
            <p className="text-2xl font-bold text-red-600">{calcularILI()}</p>
          </div>
          <div className="bg-white rounded p-2 text-center">
            <p className="text-xs text-gray-600">Inc/Trab</p>
            <p className="text-2xl font-bold text-purple-600">{calcularIncidentesPorTrabajador()}</p>
          </div>
          <div className="bg-white rounded p-2 text-center">
            <p className="text-xs text-gray-600">Programa</p>
            <p className="text-2xl font-bold text-green-600">{programaAnual.porcentajeCumplimiento}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3 max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-3">
          <h3 className="font-bold text-gray-800 text-sm mb-2">🔬 Investigación NOM-004</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs">Ocurridos:</span>
              <span className="font-bold text-red-600">{investigacionAccidentes.accidentesOcurridos}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs">Investigados:</span>
              <span className="font-bold text-orange-600">{investigacionAccidentes.accidentesInvestigados}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs">Cerradas:</span>
              <span className="font-bold text-green-600">{investigacionAccidentes.investigacionesCerradas}</span>
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded h-4">
                <div 
                  className="bg-blue-600 h-4 rounded text-white text-xs flex items-center justify-center font-bold"
                  style={{width: `${investigacionAccidentes.porcentajeCerradas}%`}}
                >
                  {investigacionAccidentes.porcentajeCerradas}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-3">
          <h3 className="font-bold text-gray-800 text-sm mb-2">🧠 NOM-035 Psicosocial</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={riesgoPsicosocial} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoria" angle={-20} textAnchor="end" height={60} style={{fontSize: '9px'}} />
              <YAxis style={{fontSize: '10px'}} />
              <Tooltip />
              <Bar dataKey="casos" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-3">
          <h3 className="font-bold text-gray-800 text-sm mb-2">📊 Por Sector</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={accidentesSector}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sector" style={{fontSize: '10px'}} />
              <YAxis style={{fontSize: '10px'}} />
              <Tooltip />
              <Legend wrapperStyle={{fontSize: '10px'}} />
              <Bar dataKey="año1" fill="#FDB863" name={periodo1} />
              <Bar dataKey="año2" fill="#4A4A4A" name={periodo2} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NUEVA SECCIÓN: CRUZ DE SEGURIDAD */}
      <div className="bg-white rounded-lg shadow-xl p-4 mb-3 max-w-6xl mx-auto">
        <h3 className="font-bold text-gray-800 text-lg mb-3 text-center">🛡️ CRUZ DE SEGURIDAD - {periodo2}</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white text-center">
            <p className="text-sm mb-1">Días Consecutivos sin Accidentes</p>
            <p className="text-5xl font-bold">{diasSinAccidentes}</p>
            <p className="text-xs mt-2">🎯 ¡Sigamos así!</p>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white text-center">
            <p className="text-sm mb-1">Récord de Días sin Accidentes</p>
            <p className="text-5xl font-bold">{recordDiasSinAccidentes}</p>
            <p className="text-xs mt-2">🏆 Mejor marca</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white text-center">
            <p className="text-sm mb-1">Total Días sin Accidentes</p>
            <p className="text-5xl font-bold">{totalDiasSinAccidentes}</p>
            <p className="text-xs mt-2">📊 Del año</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-gray-700">Calendario del Mes</p>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 bg-green-500 rounded"></span> Sin accidente
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 bg-red-500 rounded"></span> Con accidente
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 bg-gray-300 rounded"></span> No aplica
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {cruzSeguridad.map((dia, index) => (
              <div 
                key={index}
                onClick={() => {
                  const estados = ['verde', 'rojo', 'gris'];
                  const currentIndex = estados.indexOf(dia.estado);
                  const nextEstado = estados[(currentIndex + 1) % estados.length];
                  cambiarEstadoDia(index, nextEstado);
                }}
                className={`
                  aspect-square rounded cursor-pointer flex items-center justify-center font-bold text-sm
                  transition-all duration-200 hover:scale-105 hover:shadow-lg
                  ${dia.estado === 'verde' ? 'bg-green-500 text-white' : ''}
                  ${dia.estado === 'rojo' ? 'bg-red-500 text-white' : ''}
                  ${dia.estado === 'gris' ? 'bg-gray-300 text-gray-600' : ''}
                `}
              >
                {dia.dia}
              </div>
            ))}
          </div>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            💡 Haz clic en cada día para cambiar su estado
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3 max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-3">
          <h3 className="font-bold text-gray-800 text-sm mb-2">🧍 Número de accidentes por cuerpo y repr %</h3>
          <div className="relative flex justify-center items-center" style={{height: '280px'}}>
            <svg width="200" height="260" viewBox="0 0 200 260" className="mx-auto">
              <ellipse cx="100" cy="30" rx="18" ry="22" fill="#7A7A7A" />
              <rect x="92" y="50" width="16" height="12" fill="#7A7A7A" />
              <rect x="85" y="62" width="30" height="45" fill="#7A7A7A" rx="5" />
              <rect x="65" y="68" width="18" height="8" fill="#7A7A7A" rx="3" />
              <rect x="117" y="68" width="18" height="8" fill="#7A7A7A" rx="3" />
              <rect x="55" y="76" width="10" height="25" fill="#7A7A7A" rx="3" />
              <rect x="135" y="76" width="10" height="25" fill="#7A7A7A" rx="3" />
              <circle cx="60" cy="105" r="5" fill="#7A7A7A" />
              <circle cx="140" cy="105" r="5" fill="#7A7A7A" />
              <rect x="88" y="107" width="24" height="20" fill="#7A7A7A" rx="4" />
              <rect x="88" y="127" width="10" height="50" fill="#7A7A7A" rx="4" />
              <rect x="102" y="127" width="10" height="50" fill="#7A7A7A" rx="4" />
              <ellipse cx="93" cy="182" rx="8" ry="5" fill="#7A7A7A" />
              <ellipse cx="107" cy="182" rx="8" ry="5" fill="#7A7A7A" />
            </svg>
            
            <div className="absolute" style={{top: '5px', left: '10px', fontSize: '9px'}}>
              <span className="font-semibold">CABEZA/FACE: {accidentesCuerpo.cabeza.num} ({accidentesCuerpo.cabeza.porc}%)</span>
            </div>
            <div className="absolute" style={{top: '5px', right: '10px', fontSize: '9px'}}>
              <span className="font-semibold">OLHO: {accidentesCuerpo.ojo.num} ({accidentesCuerpo.ojo.porc}%)</span>
            </div>
            <div className="absolute" style={{top: '65px', left: '10px', fontSize: '9px'}}>
              <span className={`font-semibold ${accidentesCuerpo.torax.num > 0 ? 'text-red-600' : ''}`}>
                TÓRAX: {accidentesCuerpo.torax.num} ({accidentesCuerpo.torax.porc}%)
              </span>
            </div>
            <div className="absolute" style={{top: '45px', right: '10px', fontSize: '9px'}}>
              <span className="font-semibold">COSTA: {accidentesCuerpo.costa.num} ({accidentesCuerpo.costa.porc}%)</span>
            </div>
            <div className="absolute" style={{top: '95px', left: '10px', fontSize: '9px'}}>
              <span className={`font-semibold ${accidentesCuerpo.dedo.num > 0 ? 'text-red-600' : ''}`}>
                DEDO/MÃO: {accidentesCuerpo.dedo.num} ({accidentesCuerpo.dedo.porc}%)
              </span>
            </div>
            <div className="absolute" style={{top: '115px', right: '10px', fontSize: '9px'}}>
              <span className="font-semibold">
                PULSO/BRAÇO/COTOVELO: {accidentesCuerpo.pulso.num} ({accidentesCuerpo.pulso.porc}%)
              </span>
            </div>
            <div className="absolute" style={{top: '160px', left: '10px', fontSize: '9px'}}>
              <span className="font-semibold">
                PERNA/JOELHO: {accidentesCuerpo.pierna.num} ({accidentesCuerpo.pierna.porc}%)
              </span>
            </div>
            <div className="absolute" style={{top: '220px', right: '10px', fontSize: '9px'}}>
              <span className="font-semibold">PÉ/TORNOZELO: {accidentesCuerpo.pie.num} ({accidentesCuerpo.pie.porc}%)</span>
            </div>
            <div className="absolute" style={{top: '240px', right: '10px', fontSize: '9px'}}>
              <span className="font-semibold">OUTROS: {accidentesCuerpo.otros.num} ({accidentesCuerpo.otros.porc}%)</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-3">
          <h3 className="font-bold text-gray-800 text-sm mb-2">📍 Por región del cuerpo</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={regionCuerpo}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" angle={-15} textAnchor="end" height={60} style={{fontSize: '10px'}} />
              <YAxis style={{fontSize: '10px'}} />
              <Tooltip />
              <Legend wrapperStyle={{fontSize: '10px'}} />
              <Bar dataKey="año2" fill="#FDB863" name={periodo2} />
              <Bar dataKey="año1" fill="#4A4A4A" name={periodo1} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3 max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-3">
          <h3 className="font-bold text-gray-800 text-sm mb-2">📋 Clasificación STPS</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={accidentesOficiales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" angle={-20} textAnchor="end" height={70} style={{fontSize: '9px'}} />
              <YAxis style={{fontSize: '10px'}} />
              <Tooltip />
              <Legend wrapperStyle={{fontSize: '10px'}} />
              <Bar dataKey="año1" fill="#FDB863" name={periodo1} />
              <Bar dataKey="año2" fill="#4A4A4A" name={periodo2} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-3">
          <h3 className="font-bold text-gray-800 text-sm mb-2">🔍 Causas AMEF</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={causasAccidentes}
                cx="50%"
                cy="50%"
                outerRadius={60}
                dataKey="cantidad"
                label={(entry) => entry.causa.split(' ')[0]}
                labelStyle={{fontSize: '9px'}}
              >
                {causasAccidentes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-3">
          <h3 className="font-bold text-gray-800 text-sm mb-2">📍 Ocurrencias por Área</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={ocurrencias}
                cx="50%"
                cy="50%"
                outerRadius={60}
                dataKey="value"
                label
                labelStyle={{fontSize: '10px'}}
              >
                {ocurrencias.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3 max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-3">
          <h3 className="font-bold text-gray-800 text-sm mb-2">🦺 EPP NOM-017</h3>
          {cumplimientoEPP.map((item, idx) => (
            <div key={idx} className="mb-2 border-b pb-2">
              <p className="text-xs font-semibold">{item.area}</p>
              <div className="flex gap-1 mt-1">
                <div className={`flex-1 p-1 text-center text-xs rounded ${item.cumplimiento >= 95 ? 'bg-green-500' : item.cumplimiento >= 85 ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                  {item.cumplimiento}%
                </div>
                <div className={`flex-1 p-1 text-center text-xs rounded ${item.capacitados >= 95 ? 'bg-green-500' : item.capacitados >= 85 ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                  C:{item.capacitados}%
                </div>
                <div className={`flex-1 p-1 text-center text-xs rounded ${item.sinEPP <= 5 ? 'bg-green-500' : item.sinEPP <= 10 ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                  S:{item.sinEPP}%
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-xl p-3">
          <h3 className="font-bold text-gray-800 text-sm mb-2">✅ Acciones Correctivas</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs">Hallazgos:</span>
              <span className="font-bold text-blue-600">{accionesCorrectivas.totalHallazgos}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs">Generadas:</span>
              <span className="font-bold text-orange-600">{accionesCorrectivas.accionesGeneradas}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs">Cerradas:</span>
              <span className="font-bold text-green-600">{accionesCorrectivas.accionesCerradas}</span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between mb-1">
                <span className="text-xs">Avance</span>
                <span className="text-xs font-bold">{accionesCorrectivas.avance}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-4">
                <div 
                  className="bg-green-600 h-4 rounded text-white text-xs flex items-center justify-center font-bold"
                  style={{width: `${accionesCorrectivas.avance}%`}}
                >
                  {accionesCorrectivas.avance}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-3">
          <h3 className="font-bold text-gray-800 text-sm mb-2">📚 Capacitación NOM-019</h3>
          <div className="space-y-3">
            <div className="text-center border-b pb-2">
              <p className="text-xs text-gray-600">Cursos</p>
              <p className="text-3xl font-bold text-blue-600">{capacitacion.cursosImpartidos}</p>
            </div>
            <div className="flex justify-between">
              <span className="text-xs">Personal capacitado:</span>
              <span className="font-bold text-green-600">{capacitacion.personalCapacitado}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs">Horas SST:</span>
              <span className="font-bold text-purple-600">{capacitacion.horasCapacitacion}h</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-gray-800 text-white py-3 rounded-lg text-center max-w-6xl mx-auto">
        <p className="text-sm">
          Created by{' '}
          <a 
            href="https://mx.linkedin.com/in/jose-angel-sifuentes-maltos-a80188170" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline font-semibold"
          >
            José Ángel Sifuentes Maltos
          </a>
        </p>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Actualizar Datos</h2>
            
            <div className="mb-4">
              <label className="block font-bold mb-2">Sección:</label>
              <select 
                className="w-full p-2 border rounded"
                value={modalType}
                onChange={(e) => setModalType(e.target.value)}
              >
                <option value="menu">Seleccionar...</option>
                <option value="indices">Índices STPS</option>
                <option value="accidentesOficiales">Clasificación Oficial</option>
                <option value="causas">Causas AMEF</option>
                <option value="epp">Cumplimiento EPP</option>
                <option value="acciones">Acciones Correctivas</option>
                <option value="capacitacion">Capacitación</option>
                <option value="psicosocial">NOM-035</option>
                <option value="investigacion">Investigación</option>
                <option value="ocurrencias">Ocurrencias por Área</option>
                <option value="turnos">Accidentes por Turno</option>
                <option value="sectores">Lesiones por Sector</option>
                <option value="cuerpo">Accidentes por Cuerpo</option>
                <option value="regionCuerpo">Región del Cuerpo</option>
                <option value="programaAnual">Programa Anual</option>
                <option value="cruzSeguridad">Cruz de Seguridad</option>
              </select>
            </div>

            {modalType === 'indices' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Horas trabajadas:</label>
                  <input 
                    type="number" 
                    value={horasTrabajadas}
                    onChange={(e) => setHorasTrabajadas(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Número de trabajadores:</label>
                  <input 
                    type="number" 
                    value={numeroTrabajadores}
                    onChange={(e) => setNumeroTrabajadores(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Días perdidos:</label>
                  <input 
                    type="number" 
                    value={diasPerdidos}
                    onChange={(e) => setDiasPerdidos(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            )}

            {modalType === 'accidentesOficiales' && (
              <div className="space-y-2">
                <h3 className="font-bold mb-2">Clasificación Oficial STPS</h3>
                <div className="grid grid-cols-3 gap-2 mb-2 font-semibold text-sm bg-gray-100 p-2 rounded">
                  <div>Tipo de Accidente</div>
                  <div className="text-center">{periodo1}</div>
                  <div className="text-center">{periodo2}</div>
                </div>
                {accidentesOficiales.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-2 items-center">
                    <span className="text-sm">{item.tipo}</span>
                    <input 
                      type="number"
                      value={item.año1}
                      onChange={(e) => {
                        const newData = [...accidentesOficiales];
                        newData[idx].año1 = parseInt(e.target.value) || 0;
                        setAccidentesOficiales(newData);
                      }}
                      className="p-2 border rounded text-center"
                    />
                    <input 
                      type="number"
                      value={item.año2}
                      onChange={(e) => {
                        const newData = [...accidentesOficiales];
                        newData[idx].año2 = parseInt(e.target.value) || 0;
                        setAccidentesOficiales(newData);
                      }}
                      className="p-2 border rounded text-center"
                    />
                  </div>
                ))}
              </div>
            )}

            {modalType === 'causas' && (
              <div className="space-y-2">
                <h3 className="font-bold mb-2">Causas de Accidentes (AMEF/STPS)</h3>
                <div className="grid grid-cols-2 gap-2 mb-2 font-semibold text-sm bg-gray-100 p-2 rounded">
                  <div>Causa</div>
                  <div className="text-center">Cantidad</div>
                </div>
                {causasAccidentes.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-2 items-center">
                    <input 
                      type="text"
                      value={item.causa}
                      onChange={(e) => {
                        const newData = [...causasAccidentes];
                        newData[idx].causa = e.target.value;
                        setCausasAccidentes(newData);
                      }}
                      className="p-2 border rounded"
                    />
                    <input 
                      type="number"
                      value={item.cantidad}
                      onChange={(e) => {
                        const newData = [...causasAccidentes];
                        newData[idx].cantidad = parseInt(e.target.value) || 0;
                        setCausasAccidentes(newData);
                      }}
                      className="p-2 border rounded text-center"
                    />
                  </div>
                ))}
                <button 
                  onClick={() => setCausasAccidentes([...causasAccidentes, { causa: 'Nueva causa', cantidad: 0 }])}
                  className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-sm"
                >
                  + Agregar Causa
                </button>
              </div>
            )}

            {modalType === 'epp' && (
              <div className="space-y-2">
                <h3 className="font-bold mb-2">Cumplimiento EPP (NOM-017-STPS)</h3>
                <div className="grid grid-cols-4 gap-2 mb-2 font-semibold text-sm bg-gray-100 p-2 rounded">
                  <div>Área</div>
                  <div className="text-center">% Cumplimiento</div>
                  <div className="text-center">% Capacitados</div>
                  <div className="text-center">% Sin EPP</div>
                </div>
                {cumplimientoEPP.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-2 items-center">
                    <input 
                      type="text"
                      value={item.area}
                      onChange={(e) => {
                        const newData = [...cumplimientoEPP];
                        newData[idx].area = e.target.value;
                        setCumplimientoEPP(newData);
                      }}
                      className="p-2 border rounded"
                    />
                    <input 
                      type="number"
                      value={item.cumplimiento}
                      onChange={(e) => {
                        const newData = [...cumplimientoEPP];
                        newData[idx].cumplimiento = parseInt(e.target.value) || 0;
                        setCumplimientoEPP(newData);
                      }}
                      className="p-2 border rounded text-center"
                      min="0"
                      max="100"
                    />
                    <input 
                      type="number"
                      value={item.capacitados}
                      onChange={(e) => {
                        const newData = [...cumplimientoEPP];
                        newData[idx].capacitados = parseInt(e.target.value) || 0;
                        setCumplimientoEPP(newData);
                      }}
                      className="p-2 border rounded text-center"
                      min="0"
                      max="100"
                    />
                    <input 
                      type="number"
                      value={item.sinEPP}
                      onChange={(e) => {
                        const newData = [...cumplimientoEPP];
                        newData[idx].sinEPP = parseInt(e.target.value) || 0;
                        setCumplimientoEPP(newData);
                      }}
                      className="p-2 border rounded text-center"
                      min="0"
                      max="100"
                    />
                  </div>
                ))}
                <button 
                  onClick={() => setCumplimientoEPP([...cumplimientoEPP, { area: 'Nueva área', cumplimiento: 0, capacitados: 0, sinEPP: 0 }])}
                  className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-sm"
                >
                  + Agregar Área
                </button>
              </div>
            )}

            {modalType === 'acciones' && (
              <div className="space-y-3">
                <h3 className="font-bold mb-2">Acciones Correctivas (NOM-019 / ISO 45001)</h3>
                <div>
                  <label className="block text-sm font-semibold mb-1">Total de Hallazgos:</label>
                  <input 
                    type="number"
                    value={accionesCorrectivas.totalHallazgos}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setAccionesCorrectivas({...accionesCorrectivas, totalHallazgos: val});
                    }}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Acciones Generadas:</label>
                  <input 
                    type="number"
                    value={accionesCorrectivas.accionesGeneradas}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setAccionesCorrectivas({...accionesCorrectivas, accionesGeneradas: val});
                    }}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Acciones Cerradas:</label>
                  <input 
                    type="number"
                    value={accionesCorrectivas.accionesCerradas}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      const generadas = accionesCorrectivas.accionesGeneradas || 1;
                      const avance = Math.round((val / generadas) * 100);
                      setAccionesCorrectivas({...accionesCorrectivas, accionesCerradas: val, avance: avance});
                    }}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">% de Avance:</label>
                  <input 
                    type="number"
                    value={accionesCorrectivas.avance}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">* Se calcula automáticamente</p>
                </div>
              </div>
            )}

            {modalType === 'capacitacion' && (
              <div className="space-y-3">
                <h3 className="font-bold mb-2">Capacitación (NOM-019 y NOM-030)</h3>
                <div>
                  <label className="block text-sm font-semibold mb-1">Cursos Impartidos:</label>
                  <input 
                    type="number"
                    value={capacitacion.cursosImpartidos}
                    onChange={(e) => {
                      setCapacitacion({...capacitacion, cursosImpartidos: parseInt(e.target.value) || 0});
                    }}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">% Personal Capacitado:</label>
                  <input 
                    type="number"
                    value={capacitacion.personalCapacitado}
                    onChange={(e) => {
                      setCapacitacion({...capacitacion, personalCapacitado: parseInt(e.target.value) || 0});
                    }}
                    className="w-full p-2 border rounded"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Horas de Capacitación SST:</label>
                  <input 
                    type="number"
                    value={capacitacion.horasCapacitacion}
                    onChange={(e) => {
                      setCapacitacion({...capacitacion, horasCapacitacion: parseInt(e.target.value) || 0});
                    }}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            )}

            {modalType === 'psicosocial' && (
              <div className="space-y-2">
                <h3 className="font-bold mb-2">Riesgo Psicosocial (NOM-035-STPS)</h3>
                <div className="grid grid-cols-2 gap-2 mb-2 font-semibold text-sm bg-gray-100 p-2 rounded">
                  <div>Categoría de Riesgo</div>
                  <div className="text-center">Número de Casos</div>
                </div>
                {riesgoPsicosocial.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-2 items-center">
                    <span className="text-sm">{item.categoria}</span>
                    <input 
                      type="number"
                      value={item.casos}
                      onChange={(e) => {
                        const newData = [...riesgoPsicosocial];
                        newData[idx].casos = parseInt(e.target.value) || 0;
                        setRiesgoPsicosocial(newData);
                      }}
                      className="p-2 border rounded text-center"
                    />
                  </div>
                ))}
              </div>
            )}

            {modalType === 'investigacion' && (
              <div className="space-y-3">
                <h3 className="font-bold mb-2">Investigación de Accidentes (NOM-004-STPS)</h3>
                <div>
                  <label className="block text-sm font-semibold mb-1">Accidentes Ocurridos:</label>
                  <input 
                    type="number"
                    value={investigacionAccidentes.accidentesOcurridos}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setInvestigacionAccidentes({...investigacionAccidentes, accidentesOcurridos: val});
                    }}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Accidentes Investigados:</label>
                  <input 
                    type="number"
