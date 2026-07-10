import React, { useState, useEffect, useRef, useCallback } from "react";
import { api } from "./api";

// =====================================================================
// Identidade visual Nera — extraída do material institucional
// (Cambria/Caladea para títulos, Calibri/Carlito para texto,
//  fundo #1A1A1A, dourado #B5966A)
// =====================================================================
const CSS = `
  :root{
    --dark:#1A1A1A; --card:#232323; --card2:#2A2A2A; --gold:#B5966A; --gold-dim:#4A3F30;
    --text:#F5F2ED; --text-dim:#A8A29A; --text-faint:#6E6A63; --red:#C0564F; --green:#7FA66B; --line:#333333;
  }
  *{ box-sizing:border-box; }
  html,body,#root{ margin:0; padding:0; height:100%; background:var(--dark); }
  .nera-app{ font-family:'Carlito','Calibri',sans-serif; color:var(--text); min-height:100vh; }
  .serif{ font-family:'Caladea','Cambria',serif; }
  .topbar{ display:flex; justify-content:space-between; align-items:center; padding:22px 48px; border-bottom:1px solid var(--line); }
  .brand{ display:flex; align-items:center; gap:12px; }
  .brand .mark{ width:34px; height:34px; border:1.5px solid var(--gold); border-radius:50%; display:flex; align-items:center; justify-content:center; color:var(--gold); font-weight:700; font-size:14px; }
  .brand .name{ font-size:15px; letter-spacing:0.14em; text-transform:uppercase; font-weight:700; }
  .login-wrap{ display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:80vh; padding:60px; text-align:center; }
  .kicker{ font-size:13px; letter-spacing:0.16em; text-transform:uppercase; color:var(--gold); margin-bottom:18px; }
  .login-title{ font-size:40px; font-weight:700; margin:0 0 16px; max-width:820px; line-height:1.2; }
  .login-sub{ color:var(--text-dim); font-size:16px; max-width:520px; margin:0 0 40px; line-height:1.6; }
  .login-card{ width:420px; background:var(--card); border:1px solid var(--line); border-radius:10px; padding:36px; text-align:left; }
  .flabel{ font-size:11px; letter-spacing:0.08em; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px; display:block; }
  .finput{ width:100%; background:#141414; border:1px solid var(--line); border-radius:6px; padding:14px 15px; color:var(--text); font-size:15px; margin-bottom:18px; font-family:inherit; }
  .fbtn{ width:100%; background:var(--gold); color:#1A1A1A; border:none; border-radius:6px; padding:15px; font-weight:700; font-size:15px; cursor:pointer; }
  .fbtn:disabled{ opacity:0.5; cursor:not-allowed; }
  .fnote{ margin-top:18px; padding-top:16px; border-top:1px solid var(--line); font-size:12.5px; color:var(--text-faint); line-height:1.6; }
  .err{ color:var(--red); font-size:13px; margin-top:10px; }
  .highlight-box{ background:var(--card); border:1px solid var(--gold); border-radius:10px; padding:18px 22px; font-size:14px; line-height:1.6; }
  .highlight-box b{ color:var(--gold); }
  .content{ padding:36px 48px; max-width:920px; margin:0 auto; }
  .h1-under{ font-size:26px; font-weight:700; margin:0 0 14px; padding-bottom:16px; border-bottom:1px solid var(--line); }
  .welcome{ font-size:15px; color:var(--text-dim); margin-bottom:32px; line-height:1.6; }
  .welcome b{ color:var(--text); }
  .circle-num{ width:38px; height:38px; border-radius:50%; border:1.5px solid var(--gold); color:var(--gold); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:15px; flex-shrink:0; }
  .module-card{ display:flex; align-items:center; gap:18px; padding:22px 24px; background:var(--card); border:1px solid var(--line); border-radius:10px; margin-bottom:14px; }
  .module-card.locked{ opacity:0.45; }
  .module-card.current{ border-color:var(--gold); }
  .module-progress-track{ width:140px; height:6px; background:#141414; border-radius:3px; overflow:hidden; }
  .module-progress-track .fill{ height:100%; background:var(--gold); }
  .topstat{ text-align:right; } .topstat .v{ font-size:20px; font-weight:700; color:var(--gold); } .topstat .l{ font-size:10px; color:var(--text-faint); text-transform:uppercase; letter-spacing:0.05em; }
  .qbar-row{ display:flex; justify-content:space-between; align-items:center; padding:18px 60px 0; max-width:1000px; margin:0 auto; }
  .qbar-track{ flex:1; height:5px; background:#141414; border-radius:3px; overflow:hidden; margin-right:20px; }
  .qbar-track .fill{ height:100%; background:var(--gold); }
  .qbar-label{ font-size:12.5px; color:var(--text-dim); white-space:nowrap; }
  .streak-badge{ display:inline-flex; align-items:center; gap:8px; background:var(--gold-dim); border:1px solid var(--gold); color:var(--gold); padding:6px 14px; border-radius:20px; font-size:12.5px; font-weight:700; }
  .quiz-wrap{ padding:30px 60px 60px; max-width:880px; margin:0 auto; }
  .cenario{ background:var(--card2); border-left:3px solid var(--gold); padding:16px 20px; border-radius:0 8px 8px 0; font-size:14px; line-height:1.6; margin-bottom:26px; }
  .cenario b{ color:var(--gold); font-size:11px; text-transform:uppercase; display:block; margin-bottom:8px; letter-spacing:0.05em; }
  .qtext{ font-size:19px; font-weight:700; margin-bottom:22px; }
  .option{ display:flex; align-items:center; gap:16px; padding:16px 20px; background:var(--card); border:1px solid var(--line); border-radius:8px; margin-bottom:12px; cursor:pointer; }
  .option:hover{ border-color:var(--gold-dim); }
  .option.selected{ border-color:var(--gold); background:rgba(181,150,106,0.08); }
  .option.correct{ border-color:var(--green); background:rgba(127,166,107,0.1); }
  .option.wrong{ border-color:var(--red); background:rgba(192,86,79,0.1); }
  .letter{ width:28px; height:28px; border-radius:50%; background:#141414; border:1px solid var(--line); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; flex-shrink:0; }
  .option.selected .letter{ background:var(--gold); color:#1A1A1A; border-color:var(--gold); }
  .option.correct .letter{ background:var(--green); color:#0d1a08; border-color:var(--green); }
  .option.wrong .letter{ background:var(--red); color:#2a0d0b; border-color:var(--red); }
  .feedback{ margin-top:22px; padding:18px 22px; border-radius:8px; font-size:15px; line-height:1.6; }
  .feedback.ok{ background:rgba(127,166,107,0.12); border:1px solid var(--green); color:#D9E8CF; }
  .feedback.bad{ background:rgba(192,86,79,0.12); border:1px solid var(--red); color:#F3D6D3; }
  .feedback .ftitle{ font-weight:700; font-size:16px; margin-bottom:6px; display:block; }
  .btn-row{ display:flex; justify-content:space-between; align-items:center; margin-top:16px; }
  .end-wrap{ display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:80vh; padding:60px; text-align:center; }
  .seal-glow{ width:120px; height:120px; border-radius:50%; border:2px solid var(--gold); display:flex; align-items:center; justify-content:center; margin-bottom:28px; position:relative; }
  .seal-glow::before{ content:''; position:absolute; inset:-14px; border-radius:50%; border:1px solid var(--gold-dim); }
  .end-title{ font-size:32px; font-weight:700; margin-bottom:14px; }
  .end-sub{ font-size:16px; color:var(--text-dim); max-width:560px; line-height:1.7; margin-bottom:36px; }
  .end-sub b{ color:var(--gold); }
`;

const MODULOS_META = {
  1: { nome: "Fundamentos", subtitulo: "O que é o som, decibel, ressonância e momentos críticos" },
  2: { nome: "Desempenho Técnico", subtitulo: "Vidros, esquadrias e fachadas — comparação aplicada" },
  3: { nome: "Aplicação e Decisão", subtitulo: "Normas ABNT, psicoacústica e simulação de atendimento" },
};

function formatarTempo(s) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export default function ParticipantApp() {
  const [screen, setScreen] = useState("login-email");
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [painel, setPainel] = useState(null);
  const [questao, setQuestao] = useState(null);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [selecionada, setSelecionada] = useState(null);
  const [respondida, setRespondida] = useState(false);
  const [resultado, setResultado] = useState(null); // { resultado, pontosGanhos, alternativaCorreta, explicacao }

  const timerRef = useRef(null);

  async function carregarPainel() {
    const dados = await api.painel();
    setPainel(dados);
    return dados;
  }

  async function handleSolicitarCodigo(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await api.solicitarCodigo(email);
      setScreen("login-codigo");
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  async function handleConfirmarCodigo(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await api.confirmarCodigo(email, codigo);
      await carregarPainel();
      setScreen("painel");
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  async function iniciarDesafio() {
    setErro("");
    try {
      const q = await api.questaoAtual();
      setQuestao(q);
      setSelecionada(null);
      setRespondida(false);
      setResultado(null);
      const decorridoMs = Date.now() - new Date(q.iniciadaEm).getTime();
      setTempoRestante(Math.max(0, q.tempoLimiteSegundos - decorridoMs / 1000));
      setScreen("desafio");
    } catch (err) {
      setErro(err.message);
    }
  }

  const confirmarResposta = useCallback(
    async (alternativa) => {
      if (respondida || !questao) return;
      clearInterval(timerRef.current);
      try {
        const r = await api.responder(questao.questaoId, alternativa);
        setResultado(r);
        setRespondida(true);
        setPainel((p) => (p ? { ...p, xpTotal: r.xpTotal, respondidas: r.respondidas } : p));
      } catch (err) {
        setErro(err.message);
      }
    },
    [respondida, questao]
  );

  // Timer visual — só exibição. A autoridade real é o servidor, que
  // recalcula o timeout no momento de "responder" independentemente
  // do que o cliente mostrar aqui.
  useEffect(() => {
    if (screen !== "desafio" || respondida) return;
    timerRef.current = setInterval(() => {
      setTempoRestante((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          confirmarResposta(null); // envia sem alternativa — o servidor decide se estourou
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [screen, respondida, confirmarResposta]);

  async function continuar() {
    if (resultado.treinamentoConcluido) {
      setScreen("encerramento");
      return;
    }
    await carregarPainel();
    if (resultado.moduloConcluido) {
      setScreen("painel");
    } else {
      iniciarDesafio();
    }
  }

  // ---------------- LOGIN E-MAIL ----------------
  if (screen === "login-email") {
    return (
      <div className="nera-app">
        <style>{CSS}</style>
        <div className="topbar">
          <div className="brand"><div className="mark">N</div><div className="name serif">Nera treinamento</div></div>
        </div>
        <div className="login-wrap">
          <div className="kicker">Acesso ao evento</div>
          <h1 className="login-title serif">Treinamento em Acústica Aplicada a Esquadrias</h1>
          <p className="login-sub">Informe o e-mail cadastrado pelo organizador do seu evento.</p>
          <div className="login-card">
            <form onSubmit={handleSolicitarCodigo}>
              <span className="flabel">E-mail</span>
              <input className="finput" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu.email@empresa.com.br" />
              <button className="fbtn" type="submit" disabled={carregando}>{carregando ? "Enviando..." : "Enviar código de acesso"}</button>
              {erro && <div className="err">{erro}</div>}
              <div className="fnote">
                Se o e-mail informado estiver na lista de uma turma ativa, você receberá um código por e-mail em instantes.
                <br /><br />
                Seu nome e e-mail são usados apenas para o acesso a este treinamento e removidos após a janela de 24h.
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- LOGIN CÓDIGO ----------------
  if (screen === "login-codigo") {
    return (
      <div className="nera-app">
        <style>{CSS}</style>
        <div className="topbar">
          <div className="brand"><div className="mark">N</div><div className="name serif">Nera treinamento</div></div>
        </div>
        <div className="login-wrap">
          <div style={{ marginBottom: 22 }}><span className="streak-badge" style={{ background: "transparent" }}>Etapa 2 de 2 — Confirmação de identidade</span></div>
          <div className="kicker">Confirmação de identidade</div>
          <h1 className="login-title serif">Digite o código</h1>
          <p className="login-sub">Enviamos um código de 6 dígitos para <b style={{ color: "#F5F2ED" }}>{email}</b>. Ele é válido por 10 minutos.</p>
          <div className="login-card">
            <form onSubmit={handleConfirmarCodigo}>
              <span className="flabel">Código de confirmação</span>
              <input className="finput" style={{ textAlign: "center", letterSpacing: 6, fontSize: 18 }} value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="000000" />
              <button className="fbtn" type="submit" disabled={carregando}>{carregando ? "Confirmando..." : "Entrar no treinamento"}</button>
              {erro && <div className="err">{erro}</div>}
              <div className="fnote">Não recebeu o código? Confirme com o organizador do evento se seu e-mail está correto na lista.</div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- PAINEL ----------------
  if (screen === "painel" && painel) {
    const mAtual = painel.moduloAtual;
    return (
      <div className="nera-app">
        <style>{CSS}</style>
        <div className="topbar">
          <div className="brand"><div className="mark">N</div><div className="name serif">Nera treinamento</div></div>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <div className="topstat"><div className="v">{painel.xpTotal}</div><div className="l">XP</div></div>
            <div className="topstat"><div className="v">{painel.melhorStreak}</div><div className="l">Melhor streak</div></div>
          </div>
        </div>
        <div className="content">
          <div className="h1-under serif">Sua trilha</div>
          <div className="welcome">
            Bem-vindo, <b>{painel.nome}</b>{painel.empresa ? <> — <b>{painel.empresa}</b></> : null}. Você está no Módulo {mAtual} de 3. Continue de onde parou.
          </div>

          {[1, 2, 3].map((m) => {
            const concluido = m < mAtual || painel.status === "concluido";
            const isCurrent = m === mAtual && painel.status !== "concluido";
            const locked = m > mAtual;
            const progressoModulo = concluido ? 100 : isCurrent ? Math.round(((painel.respondidas % 5) / 5) * 100) : 0;
            return (
              <div key={m} className={"module-card" + (locked ? " locked" : "") + (isCurrent ? " current" : "")}>
                <div className="circle-num" style={locked ? { borderColor: "var(--text-faint)", color: "var(--text-faint)" } : {}}>
                  {String(m).padStart(2, "0")}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{MODULOS_META[m].nome}</div>
                  <div style={{ fontSize: 12.5, color: "var(--text-faint)", marginTop: 3 }}>{MODULOS_META[m].subtitulo}</div>
                </div>
                {!locked && (
                  <>
                    <div className="module-progress-track"><div className="fill" style={{ width: progressoModulo + "%" }}></div></div>
                    <div style={{ fontSize: 13, width: 70, textAlign: "right", color: concluido ? "var(--gold)" : "var(--text)" }}>
                      {concluido ? "Concluído" : progressoModulo + "%"}
                    </div>
                  </>
                )}
                {isCurrent && <button className="fbtn" style={{ width: "auto", padding: "12px 22px", marginLeft: 16 }} onClick={iniciarDesafio}>Continuar</button>}
                {locked && <span style={{ fontSize: 20, color: "var(--text-faint)" }}>🔒</span>}
              </div>
            );
          })}

          {painel.status === "concluido" && (
            <button className="fbtn" style={{ marginTop: 8, width: "auto", padding: "12px 22px" }} onClick={() => setScreen("encerramento")}>
              Ver encerramento
            </button>
          )}

          <div className="highlight-box" style={{ marginTop: 28 }}>
            <b>No módulo {mAtual}</b>, você vai aprofundar {MODULOS_META[mAtual].subtitulo.toLowerCase()} — cada etapa constrói a base técnica da próxima.
          </div>
        </div>
      </div>
    );
  }

  // ---------------- DESAFIO ----------------
  if (screen === "desafio" && questao) {
    const letras = ["A", "B", "C", "D", "E"];
    return (
      <div className="nera-app">
        <style>{CSS}</style>
        <div className="topbar">
          <div className="brand"><div className="mark">N</div><div className="name serif">Nera treinamento</div></div>
          <div className="app-mono" style={{ color: "var(--gold)" }}>{formatarTempo(tempoRestante)}</div>
        </div>
        <div className="qbar-row">
          <div className="qbar-track"><div className="fill" style={{ width: ((questao.posicao + 1) / 5) * 100 + "%" }}></div></div>
          <div className="qbar-label">Pergunta {questao.posicao + 1} de 5 · Módulo {String(questao.modulo).padStart(2, "0")}</div>
        </div>
        <div className="quiz-wrap">
          {painel && painel.melhorStreak > 0 && !respondida && (
            <div style={{ marginBottom: 20 }}>
              <span className="streak-badge">Sequência atual em andamento</span>
            </div>
          )}
          {questao.cenario && <div className="cenario"><b>Cenário</b>{questao.cenario}</div>}
          <div className="qtext">{questao.pergunta}</div>
          {questao.alternativas.map((alt, i) => {
            let cls = "option";
            if (respondida) {
              if (i === resultado.alternativaCorreta) cls += " correct";
              else if (i === selecionada) cls += " wrong";
            } else if (i === selecionada) cls += " selected";
            return (
              <div key={i} className={cls} onClick={() => !respondida && setSelecionada(i)}>
                <span className="letter">{letras[i]}</span><span style={{ fontSize: 13 }}>{alt}</span>
              </div>
            );
          })}

          {!respondida ? (
            <div className="btn-row">
              <span style={{ fontSize: 12, color: "var(--text-faint)" }}>Escolha uma alternativa e confirme</span>
              <button className="fbtn" style={{ width: "auto", padding: "12px 22px" }} disabled={selecionada === null} onClick={() => confirmarResposta(selecionada)}>
                Confirmar resposta
              </button>
            </div>
          ) : (
            <>
              <div className={"feedback " + (resultado.resultado === "correto" ? "ok" : "bad")}>
                {resultado.resultado === "correto" && <span className="ftitle">Correto +{resultado.pontosGanhos} XP</span>}
                {resultado.resultado === "incorreto" && (
                  <>
                    <span className="ftitle">Questão incorreta</span>
                    {resultado.explicacao}
                  </>
                )}
                {resultado.resultado === "tempo_esgotado" && (
                  <>
                    <span className="ftitle">Tempo esgotado</span>
                    Contabilizado como erro automático, sem pontos. Seguindo em frente.
                  </>
                )}
              </div>
              <button className="fbtn" style={{ marginTop: 14, width: "auto", padding: "12px 22px" }} onClick={continuar}>
                {resultado.treinamentoConcluido ? "Finalizar treinamento" : resultado.moduloConcluido ? "Concluir módulo" : "Próxima questão"}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ---------------- ENCERRAMENTO ----------------
  if (screen === "encerramento" && painel) {
    return (
      <div className="nera-app">
        <style>{CSS}</style>
        <div className="topbar">
          <div className="brand"><div className="mark">N</div><div className="name serif">Nera treinamento</div></div>
        </div>
        <div className="end-wrap">
          <div className="seal-glow">
            <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#B5966A" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <div className="kicker">Treinamento concluído</div>
          <div className="end-title serif">Parabéns, {painel.nome}</div>
          <p className="end-sub">
            Você concluiu as 3 etapas{painel.empresa ? <> representando a <b>{painel.empresa}</b></> : null}, com <b>{painel.xpTotal} XP</b> e
            melhor sequência de <b>{painel.melhorStreak}</b> acertos consecutivos.
          </p>
          <div style={{ fontSize: 12.5, color: "var(--text-faint)" }}>
            O pódio da turma será revelado pelo organizador no encerramento do evento.
            Seu certificado de conclusão e o relatório da turma já estão disponíveis para o organizador.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nera-app">
      <style>{CSS}</style>
      <div className="content" style={{ textAlign: "center", paddingTop: 100, color: "var(--text-dim)" }}>Carregando...</div>
    </div>
  );
}
