import { useState, useEffect, useCallback } from "react";
import { db, ref, set, onValue } from "./firebase";

const TEAM = ["Felipe", "Geraldine", "Diego"];
const TEAM_COLORS = { Felipe: "#E63946", Geraldine: "#2A9D8F", Diego: "#F4A261" };

const PHASES_DATA = [
  {
    id: "fase0", name: "Fase 0", title: "Definición del Alcance y Diagnóstico Real", color: "#E63946",
    tasks: [
      { id: "f0t1", text: "Cerrar el marco del proyecto: definir alcance, límites y entregables" },
      { id: "f0t2", text: "Reunir base documental interna: estatutos, reglamentos, actas, organigramas" },
      { id: "f0t3", text: "Reunir insumos de referencia externa: ADALAC, SEPLA, regulación colombiana" },
      { id: "f0t4", text: "Consolidar listado oficial de comités con líder, integrantes y contacto" },
      { id: "f0t5", text: "Preparar y validar cuestionario estándar de entrevista" },
      { id: "f0t6", text: "Enviar cuestionario a cada líder de comité con antelación" },
      { id: "f0t7", text: "Realizar entrevistas estructuradas comité por comité" },
      { id: "f0t8", text: "Documentar cada entrevista en ficha estándar" },
      { id: "f0t9", text: "Levantar estado actual del rol del presidente" },
      { id: "f0t10", text: "Comparación de 4 dimensiones: qué tenemos, hacemos, deberíamos y queremos" },
      { id: "f0t11", text: "Analizar patrones transversales: duplicidades, vacíos, cruces, dependencias" },
      { id: "f0t12", text: "Consolidar diagnóstico con hallazgos, brechas, riesgos y prioridades" },
    ],
  },
  {
    id: "fase1", name: "Fase 1", title: "Mapeo y Organización", color: "#457B9D",
    tasks: [
      { id: "f1t1", text: "Organizar toda la información recolectada en estructura lógica" },
      { id: "f1t2", text: "Definir estructura organizacional: áreas, jerarquía y dependencias" },
      { id: "f1t3", text: "Definir rol institucional del presidente y criterios de delegación" },
      { id: "f1t4", text: "Redactar función real de cada comité basada en levantamiento" },
      { id: "f1t5", text: "Mapear relación entre comités y áreas funcionales" },
      { id: "f1t6", text: "Identificar interacciones, dependencias y cruces entre comités" },
      { id: "f1t7", text: "Detectar áreas sin responsable claro y zonas grises" },
    ],
  },
  {
    id: "fase2", name: "Fase 2", title: "Diseño Metodológico del Sistema", color: "#2A9D8F",
    tasks: [
      { id: "f2t1", text: "Definir formato estándar de documentación por área y comité" },
      { id: "f2t2", text: "Definir estructura para documentar procesos" },
      { id: "f2t3", text: "Diseñar modelo de reporte ejecutivo hacia la presidencia" },
      { id: "f2t4", text: "Definir metodología general de KPIs" },
      { id: "f2t5", text: "Definir herramientas y repositorio documental centralizado" },
    ],
  },
  {
    id: "fase3", name: "Fase 3", title: "Estructuración y Estandarización", color: "#E9C46A",
    tasks: [
      { id: "f3t1", text: "Validar y formalizar estructura organizacional" },
      { id: "f3t2", text: "Formalizar redistribución de funciones del presidente" },
      { id: "f3t3", text: "Definir flujos de escalamiento hacia la presidencia" },
      { id: "f3t4", text: "Estandarizar procesos bajo mismo formato" },
      { id: "f3t5", text: "Eliminar duplicidades entre comités" },
      { id: "f3t6", text: "Simplificar flujos innecesarios" },
      { id: "f3t7", text: "Asignar responsables preliminares por proceso y función" },
    ],
  },
  {
    id: "fase4", name: "Fase 4", title: "Definición de KPIs", color: "#F4A261",
    tasks: [
      { id: "f4t1", text: "Asignar indicadores a procesos clave de cada comité y área" },
      { id: "f4t2", text: "Diferenciar entre actividad, resultado e impacto" },
      { id: "f4t3", text: "Definir métricas claras, comprensibles y medibles" },
      { id: "f4t4", text: "Definir frecuencia, fuente de datos y responsable de reporte" },
    ],
  },
  {
    id: "fase5", name: "Fase 5", title: "Consolidación Documental", color: "#264653",
    tasks: [
      { id: "f5t1", text: "Consolidar información estructurada en repositorio único" },
      { id: "f5t2", text: "Elaborar documentación de estructura organizacional" },
      { id: "f5t3", text: "Elaborar manual de cada comité con funciones, procesos y KPIs" },
      { id: "f5t4", text: "Diseñar formato de reporte periódico consolidado para el presidente" },
      { id: "f5t5", text: "Asegurar consistencia total entre todos los documentos" },
    ],
  },
  {
    id: "fase6", name: "Fase 6", title: "Seguimiento y Tablero de Control", color: "#6A4C93",
    tasks: [
      { id: "f6t1", text: "Consolidar KPIs de todas las áreas y comités en un panel" },
      { id: "f6t2", text: "Diseñar tablero de control para visualizar estado y desempeño" },
      { id: "f6t3", text: "Definir reportes periódicos: frecuencia, formato y destinatario" },
      { id: "f6t4", text: "Integrar reporte ejecutivo del presidente al tablero" },
      { id: "f6t5", text: "Establecer criterios de revisión y ajuste" },
    ],
  },
  {
    id: "fase7", name: "Fase 7", title: "Entrega y Formalización", color: "#1D3557",
    tasks: [
      { id: "f7t1", text: "Consolidar y entregar proyecto completo a junta directiva" },
      { id: "f7t2", text: "Presentar organigrama oficial y arquitectura del sindicato" },
      { id: "f7t3", text: "Presentar modelo de gobernanza y rol del presidente" },
      { id: "f7t4", text: "Presentar sistema de comités integrado" },
      { id: "f7t5", text: "Definir qué incorporar en estatutos, reglamentos o lineamientos" },
    ],
  },
  {
    id: "fase8", name: "Fase 8", title: "Institucionalización", color: "#A8DADC",
    tasks: [
      { id: "f8t1", text: "Formalizar uso de estructura, gobernanza y sistema de comités" },
      { id: "f8t2", text: "Integrar en normas internas o lineamientos del sindicato" },
      { id: "f8t3", text: "Definir responsables definitivos del mantenimiento del sistema" },
      { id: "f8t4", text: "Establecer esquema de actualización periódica" },
    ],
  },
];

const STATUS_OPTIONS = [
  { value: "pending", label: "Pendiente", color: "#6b7280", bg: "#374151" },
  { value: "in_progress", label: "En curso", color: "#f59e0b", bg: "#78350f" },
  { value: "done", label: "Completada", color: "#10b981", bg: "#064e3b" },
  { value: "blocked", label: "Bloqueada", color: "#ef4444", bg: "#7f1d1d" },
];

function getInitialState() {
  const state = {};
  PHASES_DATA.forEach((phase) => {
    phase.tasks.forEach((task) => {
      state[task.id] = { status: "pending", notes: "", assignees: [] };
    });
  });
  return state;
}

function Initials({ name, size = 28 }) {
  const c = TEAM_COLORS[name] || "#666";
  return (
    <div title={name} style={{ width: size, height: size, borderRadius: "50%", background: c + "22", border: `2px solid ${c}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, fontWeight: 700, color: c, flexShrink: 0, cursor: "default" }}>
      {name[0]}
    </div>
  );
}

export default function App() {
  const [taskStates, setTaskStates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [view, setView] = useState("overview");
  const [filterPerson, setFilterPerson] = useState(null);

  useEffect(() => {
    const dataRef = ref(db, "roadmap");
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const merged = { ...getInitialState() };
        Object.keys(merged).forEach((k) => {
          if (data[k]) merged[k] = { ...merged[k], ...data[k], assignees: data[k].assignees || [] };
        });
        setTaskStates(merged);
      } else {
        const initial = getInitialState();
        setTaskStates(initial);
        set(ref(db, "roadmap"), initial);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const save = useCallback((newState) => {
    setTaskStates(newState);
    set(ref(db, "roadmap"), newState);
  }, []);

  const updateStatus = (taskId, status) => save({ ...taskStates, [taskId]: { ...taskStates[taskId], status } });

  const toggleAssignee = (taskId, name) => {
    const current = taskStates[taskId].assignees || [];
    const next = current.includes(name) ? current.filter((n) => n !== name) : [...current, name];
    save({ ...taskStates, [taskId]: { ...taskStates[taskId], assignees: next } });
  };

  const saveNote = (taskId) => {
    save({ ...taskStates, [taskId]: { ...taskStates[taskId], notes: noteText } });
    setEditingNote(null);
  };

  const resetAll = () => { if (confirm("Reiniciar todo el progreso?")) save(getInitialState()); };

  if (loading || !taskStates) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0a0a0a", color: "#888", fontFamily: "'DM Sans', sans-serif" }}>Cargando...</div>;
  }

  const getPhaseStats = (phase, person) => {
    const tasks = person ? phase.tasks.filter((t) => (taskStates[t.id]?.assignees || []).includes(person)) : phase.tasks;
    const total = tasks.length;
    const done = tasks.filter((t) => taskStates[t.id]?.status === "done").length;
    const inProgress = tasks.filter((t) => taskStates[t.id]?.status === "in_progress").length;
    const blocked = tasks.filter((t) => taskStates[t.id]?.status === "blocked").length;
    return { total, done, inProgress, blocked, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
  };

  const allTasks = PHASES_DATA.flatMap((p) => p.tasks);
  const filteredTasks = filterPerson ? allTasks.filter((t) => (taskStates[t.id]?.assignees || []).includes(filterPerson)) : allTasks;
  const totalTasks = filteredTasks.length;
  const totalDone = filteredTasks.filter((t) => taskStates[t.id]?.status === "done").length;
  const globalPct = totalTasks === 0 ? 0 : Math.round((totalDone / totalTasks) * 100);

  const activePhase = PHASES_DATA.find((p) => p.id === selectedPhase);

  const personStats = (name) => {
    const assigned = allTasks.filter((t) => (taskStates[t.id]?.assignees || []).includes(name));
    const done = assigned.filter((t) => taskStates[t.id]?.status === "done").length;
    return { total: assigned.length, done };
  };

  const taskMatchesFilter = (task) => !filterPerson || (taskStates[task.id]?.assignees || []).includes(filterPerson);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e5e5e5", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #1a1a1a", padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Estructura</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>ODEAA</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", fontFamily: "'JetBrains Mono', monospace" }}>{globalPct}%</div>
            <div style={{ fontSize: 11, color: "#666" }}>{totalDone}/{totalTasks} tareas{filterPerson ? ` (${filterPerson})` : ""}</div>
          </div>
          <button onClick={resetAll} style={{ background: "none", border: "1px solid #333", color: "#666", padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontSize: 11 }}>Reiniciar</button>
        </div>
      </div>

      <div style={{ height: 3, background: "#1a1a1a" }}>
        <div style={{ height: "100%", width: `${globalPct}%`, background: "linear-gradient(90deg, #E63946, #2A9D8F, #6A4C93)", transition: "width 0.5s" }} />
      </div>

      {/* Team strip */}
      <div style={{ display: "flex", gap: 12, padding: "14px 28px", borderBottom: "1px solid #1a1a1a", alignItems: "center", overflowX: "auto" }}>
        <span style={{ fontSize: 11, color: "#555", fontWeight: 600, marginRight: 4 }}>EQUIPO</span>
        <button onClick={() => setFilterPerson(null)} style={{ background: !filterPerson ? "#1f1f1f" : "transparent", border: "1px solid #2a2a2a", color: !filterPerson ? "#fff" : "#666", padding: "4px 12px", borderRadius: 20, fontSize: 11, cursor: "pointer", fontWeight: 500 }}>Todos</button>
        {TEAM.map((name) => {
          const ps = personStats(name);
          const active = filterPerson === name;
          return (
            <button key={name} onClick={() => setFilterPerson(active ? null : name)} style={{ display: "flex", alignItems: "center", gap: 8, background: active ? TEAM_COLORS[name] + "18" : "transparent", border: `1px solid ${active ? TEAM_COLORS[name] + "55" : "#2a2a2a"}`, padding: "4px 14px 4px 6px", borderRadius: 20, cursor: "pointer" }}>
              <Initials name={name} size={22} />
              <span style={{ fontSize: 12, color: active ? TEAM_COLORS[name] : "#999", fontWeight: 500 }}>{name}</span>
              <span style={{ fontSize: 10, color: "#555", fontFamily: "'JetBrains Mono', monospace" }}>{ps.done}/{ps.total}</span>
            </button>
          );
        })}
      </div>

      {/* Nav */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #1a1a1a", overflowX: "auto" }}>
        <button onClick={() => { setView("overview"); setSelectedPhase(null); }} style={{ background: view === "overview" ? "#1a1a1a" : "transparent", color: view === "overview" ? "#fff" : "#666", border: "none", padding: "12px 20px", cursor: "pointer", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", borderBottom: view === "overview" ? "2px solid #fff" : "2px solid transparent" }}>Vista General</button>
        {PHASES_DATA.map((p) => {
          const s = getPhaseStats(p, filterPerson);
          const active = selectedPhase === p.id;
          return (
            <button key={p.id} onClick={() => { setView("detail"); setSelectedPhase(p.id); }} style={{ background: active ? "#1a1a1a" : "transparent", color: active ? "#fff" : "#666", border: "none", padding: "12px 16px", cursor: "pointer", fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", borderBottom: active ? `2px solid ${p.color}` : "2px solid transparent", display: "flex", alignItems: "center", gap: 6 }}>
              {p.name}
              {s.total > 0 && s.pct === 100 && <span style={{ color: "#10b981" }}>✓</span>}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ padding: "24px 28px", maxWidth: 1100, margin: "0 auto" }}>
        {view === "overview" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {PHASES_DATA.map((phase) => {
              const s = getPhaseStats(phase, filterPerson);
              if (filterPerson && s.total === 0) return null;
              return (
                <div key={phase.id} onClick={() => { setView("detail"); setSelectedPhase(phase.id); }} style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: 8, padding: 20, cursor: "pointer", transition: "border-color 0.2s", position: "relative", overflow: "hidden" }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = phase.color)} onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1f1f1f")}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: `${s.pct}%`, height: 3, background: phase.color, transition: "width 0.5s" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: phase.color, fontWeight: 600 }}>{phase.name}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: s.pct === 100 ? "#10b981" : "#fff" }}>{s.pct}%</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 12 }}>{phase.title}</div>
                  <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#888" }}>
                    <span>{s.done}/{s.total} completadas</span>
                    {s.inProgress > 0 && <span style={{ color: "#f59e0b" }}>{s.inProgress} en curso</span>}
                    {s.blocked > 0 && <span style={{ color: "#ef4444" }}>{s.blocked} bloqueadas</span>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : activePhase ? (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: activePhase.color, fontWeight: 600, marginBottom: 4 }}>{activePhase.name}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{activePhase.title}</div>
              <div style={{ height: 4, background: "#1a1a1a", borderRadius: 2, marginTop: 12 }}>
                <div style={{ height: "100%", width: `${getPhaseStats(activePhase, filterPerson).pct}%`, background: activePhase.color, borderRadius: 2, transition: "width 0.4s" }} />
              </div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>{getPhaseStats(activePhase, filterPerson).done} de {getPhaseStats(activePhase, filterPerson).total} completadas</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {activePhase.tasks.filter(taskMatchesFilter).map((task, idx) => {
                const ts = taskStates[task.id];
                const statusObj = STATUS_OPTIONS.find((s) => s.value === ts.status);
                const isEditing = editingNote === task.id;
                return (
                  <div key={task.id} style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: 6, padding: "14px 16px", borderLeft: `3px solid ${statusObj.color}` }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#444", minWidth: 24, paddingTop: 2 }}>{String(idx + 1).padStart(2, "0")}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
                          <div style={{ fontSize: 13, color: ts.status === "done" ? "#888" : "#e5e5e5", textDecoration: ts.status === "done" ? "line-through" : "none" }}>{task.text}</div>
                          <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                            {(ts.assignees || []).map((n) => <Initials key={n} name={n} size={24} />)}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                          {STATUS_OPTIONS.map((opt) => (
                            <button key={opt.value} onClick={() => updateStatus(task.id, opt.value)} style={{ background: ts.status === opt.value ? opt.bg : "transparent", color: ts.status === opt.value ? opt.color : "#555", border: `1px solid ${ts.status === opt.value ? opt.color + "44" : "#2a2a2a"}`, padding: "3px 10px", borderRadius: 4, fontSize: 11, cursor: "pointer", fontWeight: ts.status === opt.value ? 600 : 400 }}>{opt.label}</button>
                          ))}
                          <span style={{ width: 1, height: 16, background: "#2a2a2a", margin: "0 4px" }} />
                          {TEAM.map((name) => {
                            const assigned = (ts.assignees || []).includes(name);
                            return (
                              <button key={name} onClick={() => toggleAssignee(task.id, name)} style={{ display: "flex", alignItems: "center", gap: 4, background: assigned ? TEAM_COLORS[name] + "18" : "transparent", border: `1px solid ${assigned ? TEAM_COLORS[name] + "44" : "#2a2a2a"}`, padding: "2px 8px 2px 4px", borderRadius: 14, cursor: "pointer" }}>
                                <Initials name={name} size={18} />
                                <span style={{ fontSize: 10, color: assigned ? TEAM_COLORS[name] : "#555" }}>{name}</span>
                              </button>
                            );
                          })}
                          <span style={{ width: 1, height: 16, background: "#2a2a2a", margin: "0 4px" }} />
                          <button onClick={() => { if (isEditing) { saveNote(task.id); } else { setEditingNote(task.id); setNoteText(ts.notes || ""); } }} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 11 }}>{isEditing ? "Guardar nota" : ts.notes ? "Editar nota" : "+ Nota"}</button>
                        </div>
                        {isEditing && (
                          <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Notas, observaciones..." style={{ width: "100%", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: 4, color: "#ccc", padding: 8, marginTop: 8, fontSize: 12, fontFamily: "'DM Sans', sans-serif", resize: "vertical", minHeight: 50 }} />
                        )}
                        {!isEditing && ts.notes && (
                          <div style={{ marginTop: 8, fontSize: 11, color: "#666", fontStyle: "italic", background: "#0d0d0d", padding: "6px 10px", borderRadius: 4 }}>{ts.notes}</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
