import React, { useState, useEffect } from "react";
import { api } from "./api";
import logoHabitatCebrace from "./assets/logo-habitat-cebrace.png";

// =====================================================================
// Identidade visual Conversas de Conforto by Cebrace — extraída do material institucional
// (Arial em títulos e texto, fundo branco, laranja #F5811E)
// =====================================================================
const CSS = `
  :root{
    --dark:#FFFFFF; --card:#F7F6F3; --card2:#EFEDE7; --gold:#F5811E; --gold-dim:#F7973D;
    --text:#1A1A1A; --text-dim:#6B6660; --text-faint:#8A8377; --red:#ED1450; --green:#7FA66B; --line:#E3E0D9;
  }
  *{ box-sizing:border-box; }
  html,body,#root{ margin:0; padding:0; height:100%; background:var(--dark); }
  .app-shell{ font-family:Arial,Helvetica,sans-serif; color:var(--text); min-height:100vh; }
  .serif{ font-family:Arial,Helvetica,sans-serif; }
  .topbar{ display:flex; justify-content:space-between; align-items:center; padding:22px 48px; border-bottom:1px solid var(--line); }
  .brand{ display:flex; align-items:center; gap:12px; }
  .brand .mark{ height:34px; width:auto; display:block; }
  .brand .name{ font-size:15px; letter-spacing:0.02em; font-weight:700; color:var(--gold); }
  .login-wrap{ display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:80vh; padding:60px; text-align:center; }
  .mark-center{ height:56px; width:auto; display:block; margin:0 auto 24px; }
  .kicker{ font-size:13px; letter-spacing:0.16em; text-transform:uppercase; color:var(--gold); margin-bottom:18px; }
  .kicker .kicker-preto{ color:var(--text); text-transform:none; letter-spacing:0.02em; }
  .kicker .kicker-marca{ text-transform:none; letter-spacing:0.02em; }
  .kicker.kicker-login{ font-size:16px; letter-spacing:0.02em; }
  .login-title{ font-size:40px; font-weight:700; margin:0 0 16px; max-width:820px; line-height:1.2; }
  .field-hint{ font-size:12px; color:var(--text-faint); margin:-10px 0 18px; }
  .login-sub{ color:var(--text-dim); font-size:16px; max-width:520px; margin:0 0 40px; line-height:1.6; }
  .login-sub.login-sub-sm{ font-size:13px; }
  .login-card{ width:420px; background:var(--card); border:1px solid var(--line); border-radius:10px; padding:36px; text-align:left; }
  .flabel{ font-size:11px; letter-spacing:0.08em; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px; display:block; }
  .finput{ width:100%; background:#F0EEE8; border:1px solid var(--line); border-radius:6px; padding:14px 15px; color:var(--text); font-size:15px; margin-bottom:18px; font-family:inherit; }
  .fbtn{ width:100%; background:var(--gold); color:#1A1A1A; border:none; border-radius:6px; padding:15px; font-weight:700; font-size:15px; cursor:pointer; font-family:inherit; }
  .fbtn:disabled{ opacity:0.5; cursor:not-allowed; }
  .fbtn-link{ display:block; width:100%; background:none; border:none; color:var(--text-dim); font-size:13px; text-decoration:underline; text-underline-offset:3px; cursor:pointer; padding:12px; margin-top:2px; font-family:inherit; }
  .fbtn-link:hover{ color:var(--text); }
  .fbtn-link:disabled{ opacity:0.5; cursor:not-allowed; }
  .fnote{ margin-top:18px; padding-top:16px; border-top:1px solid var(--line); font-size:12.5px; color:var(--text-faint); line-height:1.6; }
  .err{ color:var(--red); font-size:13px; margin-top:10px; }
  .lawdetails{ margin-top:16px; text-align:left; }
  .lawdetails summary{ font-size:12.5px; color:var(--text-dim); text-decoration:underline; text-underline-offset:3px; cursor:pointer; list-style:none; display:inline-flex; align-items:center; gap:5px; }
  .lawdetails summary::-webkit-details-marker{ display:none; }
  .lawdetails summary::after{ content:'↗'; text-decoration:none; font-size:11px; }
  .lawdetails summary:hover{ color:var(--text); }
  .lawdetails[open] summary{ margin-bottom:12px; }
  .lawdetails .lawbody{ background:var(--card2); border-radius:8px; padding:16px 18px; font-size:12.5px; line-height:1.65; color:var(--text-dim); }
  .lawdetails .lawbody p{ margin:0 0 10px; }
  .lawdetails .lawbody p:last-child{ margin-bottom:0; }
  .content{ padding:36px 48px; max-width:920px; margin:0 auto; }
  .topstat{ text-align:right; } .topstat .v{ font-size:20px; font-weight:700; color:var(--gold); } .topstat .l{ font-size:10px; color:var(--text-faint); text-transform:uppercase; letter-spacing:0.05em; }
  .qbar-row{ display:flex; justify-content:space-between; align-items:center; padding:18px 60px 0; max-width:1000px; margin:0 auto; }
  .qbar-track{ flex:1; height:5px; background:#F0EEE8; border-radius:3px; overflow:hidden; margin-right:20px; }
  .qbar-track .fill{ height:100%; background:var(--gold); }
  .qbar-label{ font-size:12.5px; color:var(--text-dim); white-space:nowrap; }
  .streak-badge{ display:inline-flex; align-items:center; gap:8px; background:rgba(245,129,30,0.12); border:1px solid var(--gold); color:var(--gold); padding:6px 14px; border-radius:20px; font-size:12.5px; font-weight:700; }
  .quiz-wrap{ padding:30px 60px 60px; max-width:880px; margin:0 auto; }
  .cenario{ background:var(--card2); border-left:3px solid var(--gold); padding:16px 20px; border-radius:0 8px 8px 0; font-size:14px; line-height:1.6; margin-bottom:26px; }
  .cenario b{ color:var(--gold); font-size:11px; text-transform:uppercase; display:block; margin-bottom:8px; letter-spacing:0.05em; }
  .qtext{ font-size:19px; font-weight:700; margin-bottom:22px; }
  .option{ display:flex; align-items:center; gap:16px; padding:16px 20px; background:var(--card); border:1px solid var(--line); border-radius:8px; margin-bottom:12px; cursor:pointer; }
  .option:hover{ border-color:var(--gold-dim); }
  .option.selected{ border-color:var(--gold); background:rgba(245,129,30,0.08); }
  .option.disabled{ cursor:default; opacity:0.7; }
  .letter{ width:28px; height:28px; border-radius:50%; background:#F0EEE8; border:1px solid var(--line); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; flex-shrink:0; }
  .option.selected .letter{ background:var(--gold); color:#1A1A1A; border-color:var(--gold); }
  .feedback{ margin-top:22px; padding:18px 22px; border-radius:8px; font-size:15px; line-height:1.6; }
  .feedback.ok{ background:rgba(127,166,107,0.12); border:1px solid var(--green); color:#3D6B2E; }
  .feedback.bad{ background:rgba(237,20,80,0.12); border:1px solid var(--red); color:#8A1338; }
  .feedback .ftitle{ font-weight:700; font-size:16px; margin-bottom:6px; display:block; }
  .btn-row{ display:flex; justify-content:space-between; align-items:center; margin-top:16px; }
  .end-wrap{ display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:80vh; padding:60px; text-align:center; }
  .seal-glow{ width:120px; height:120px; border-radius:50%; border:2px solid var(--gold); display:flex; align-items:center; justify-content:center; margin-bottom:28px; position:relative; }
  .seal-glow::before{ content:''; position:absolute; inset:-14px; border-radius:50%; border:1px solid var(--gold-dim); }
  .end-title{ font-size:32px; font-weight:700; margin-bottom:14px; }
  .end-sub{ font-size:16px; color:var(--text-dim); max-width:560px; line-height:1.7; margin-bottom:36px; }
  .end-sub b{ color:var(--gold); }
  .podium{ display:flex; align-items:flex-end; justify-content:center; gap:10px; width:100%; max-width:400px; }
  .step{ display:flex; flex-direction:column; align-items:center; flex:1; min-width:0; }
  .step-card{ display:flex; flex-direction:column; align-items:center; text-align:center; margin-bottom:12px; padding:0 4px; }
  .step-avatar{ width:42px; height:42px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; color:#fff; margin-bottom:9px; }
  .step-1 .step-avatar{ width:52px; height:52px; font-size:16px; background:var(--gold); }
  .step-2 .step-avatar{ background:var(--text-dim); }
  .step-3 .step-avatar{ background:var(--text-faint); }
  .step-name{ font-size:12.5px; font-weight:700; color:var(--text); line-height:1.3; }
  .step-1 .step-name{ font-size:14px; }
  .step-empresa{ font-size:10px; color:var(--text-faint); margin-top:2px; line-height:1.3; }
  .step-xp{ font-size:11.5px; color:var(--text-dim); font-variant-numeric:tabular-nums; margin-top:5px; font-weight:700; }
  .step-block{ width:100%; border-radius:8px 8px 0 0; display:flex; align-items:flex-start; justify-content:center; padding-top:10px; box-shadow:inset 0 -22px 16px -10px rgba(0,0,0,0.3); }
  .step-1 .step-block{ height:118px; background:var(--gold); }
  .step-2 .step-block{ height:82px; background:var(--text-dim); }
  .step-3 .step-block{ height:56px; background:var(--text-faint); }
  .step-rank{ font-size:22px; font-weight:700; color:rgba(255,255,255,0.94); }
  .step-1 .step-rank{ font-size:27px; }
  .podium-ground{ width:100%; max-width:400px; height:4px; background:var(--line); border-radius:2px; margin-top:-1px; }
`;

function iniciais(nome) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] || "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

// Ordem visual do pódio (estilo pedestal): 2º à esquerda, 1º ao centro
// (mais alto), 3º à direita — a ordem dos dados continua sendo 1º, 2º,
// 3º, só a exibição é remontada.
function ordemDoPodio(tamanho) {
  if (tamanho >= 3) return [1, 0, 2];
  if (tamanho === 2) return [1, 0];
  return [0];
}

function Podium({ dados }) {
  if (!dados || dados.length === 0) {
    return <div style={{ fontSize: 12.5, color: "var(--text-faint)" }}>O pódio será revelado em instantes.</div>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="podium">
        {ordemDoPodio(dados.length).map((idx) => {
          const pos = dados[idx];
          const posicao = idx + 1;
          return (
            <div className={`step step-${posicao}`} key={idx}>
              <div className="step-card">
                <div className="step-avatar">{iniciais(pos.nome)}</div>
                <div className="step-name">{pos.nome}</div>
                {pos.empresa && <div className="step-empresa">{pos.empresa}</div>}
                <div className="step-xp">{pos.pontos} XP</div>
              </div>
              <div className="step-block"><span className="step-rank">{posicao}º</span></div>
            </div>
          );
        })}
      </div>
      <div className="podium-ground" />
    </div>
  );
}

export default function ParticipantApp() {
  const [screen, setScreen] = useState("login-email");
  const [nome, setNome] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [painel, setPainel] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [selecionada, setSelecionada] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [mostrarPodio1, setMostrarPodio1] = useState(false);
  const [mostrarPodio2, setMostrarPodio2] = useState(false);

  // Chamado logo após o login (primeiro acesso ou não) — decide se mostra
  // a tela de autorização de contato da Nera antes da sala. Só pergunta
  // uma vez: consentimentoNera null = nunca respondeu; qualquer outra
  // coisa (true/false) já foi decidido antes, então vai direto pra sala.
  async function entrarAposLogin() {
    const pn = await api.painel();
    setPainel(pn);
    setScreen(pn.consentimentoNera === null ? "consentimento-nera" : "sala");
  }

  // Login virou um passo só (22/09) — sem e-mail, não dá mais pra usar
  // senha (nada pra recuperar identidade em outra sessão). Identifica
  // por nome + empresa: acha e reaproveita quem já existe, ou cadastra
  // na hora — e já entra direto, sem tela de senha.
  async function handleEntrar(e) {
    e.preventDefault();
    setErro("");
    if (!nome.trim() || !empresa.trim()) {
      setErro("Informe nome e empresa.");
      return;
    }
    setCarregando(true);
    try {
      const resultado = await api.entrar(nome, empresa);
      if (resultado.encontrado === false) {
        setErro("Não há nenhum evento em andamento no momento.");
        return;
      }
      await entrarAposLogin();
    } catch (err) {
      if (err.acessoExpirado) { setScreen("sessao-encerrada"); return; }
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  async function handleDefinirSenha(e) {
    e.preventDefault();
    setErro("");
    if (senha.length < 6) { setErro("A senha deve ter pelo menos 6 caracteres."); return; }
    if (senha !== confirmarSenha) { setErro("As senhas não coincidem."); return; }
    setCarregando(true);
    try {
      await api.definirSenha(email, senha);
      await entrarAposLogin();
    } catch (err) {
      if (err.acessoExpirado) { setScreen("sessao-encerrada"); return; }
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      await api.login(email, senha);
      await entrarAposLogin();
    } catch (err) {
      if (err.acessoExpirado) { setScreen("sessao-encerrada"); return; }
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  // A sala é conduzida pelo admin/tutor — não há mais "próxima pergunta"
  // clicada pelo participante. O polling detecta o que o host fez
  // (iniciar fase, avançar pergunta, liberar fase 2) e a tela reage.
  useEffect(() => {
    if (screen !== "sala") return;
    let ativo = true;
    let intervalo;
    async function consultar() {
      try {
        const [q, pn] = await Promise.all([api.quizEstado(), api.painel()]);
        if (ativo) { setQuiz(q); setPainel(pn); }
      } catch (err) {
        if (ativo && err.acessoExpirado) { setScreen("sessao-encerrada"); clearInterval(intervalo); }
        // demais erros: silencioso — próximo ciclo tenta de novo
      }
    }
    consultar();
    intervalo = setInterval(consultar, 2000);
    return () => { ativo = false; clearInterval(intervalo); };
  }, [screen]);

  // Timer visual — só exibição, e só quando a pergunta tem limite de
  // tempo (Fase 2 "cada um no seu ritmo" não tem — vem sem
  // tempoLimiteSegundos/iniciadaEm do servidor). A autoridade real é o
  // servidor, que recalcula tudo no momento de "responder".
  useEffect(() => {
    if (quiz?.quizEstado !== "pergunta_ativa" || !quiz.iniciadaEm || !quiz.tempoLimiteSegundos) { setTempoRestante(0); return; }
    function tick() {
      const decorridoMs = Date.now() - new Date(quiz.iniciadaEm).getTime();
      setTempoRestante(Math.max(0, quiz.tempoLimiteSegundos - decorridoMs / 1000));
    }
    tick();
    const t = setInterval(tick, 250);
    return () => clearInterval(t);
  }, [quiz?.quizEstado, quiz?.iniciadaEm, quiz?.tempoLimiteSegundos]);

  // Nova pergunta do host — limpa a seleção anterior.
  useEffect(() => {
    setSelecionada(null);
  }, [quiz?.questao?.id]);

  async function confirmarResposta(alternativa) {
    if (!quiz?.questao || quiz.jaRespondida || enviando) return;
    setEnviando(true);
    setErro("");
    try {
      await api.responder(quiz.questao.id, alternativa);
      setQuiz((q) => (q ? { ...q, jaRespondida: true } : q));
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  }

  // ---------------- SESSÃO ENCERRADA ----------------
  // Cai aqui em duas situações: (1) login recusado porque a janela de 24h
  // do participante já tinha fechado antes mesmo de autenticar, ou (2) a
  // sessão estava válida e expirou/foi revogada enquanto a pessoa já
  // estava na sala (detectado pelo polling). Nos dois casos a mensagem é a
  // mesma — o que mudou é só quando a gente percebeu.
  if (screen === "sessao-encerrada") {
    return (
      <div className="app-shell">
        <style>{CSS}</style>
        <div className="end-wrap">
          <div className="kicker">Sessão encerrada</div>
          <div className="end-title serif">Seu acesso a este treinamento expirou</div>
          <p className="end-sub">
            Por segurança, o acesso a esta conta foi encerrado. Se você acredita que isso é um engano, entre em contato com o organizador do evento.
          </p>
          <button
            className="fbtn"
            style={{ width: "auto", padding: "14px 36px" }}
            onClick={() => {
              setScreen("login-email"); setEmail(""); setSenha(""); setConfirmarSenha("");
              setErro(""); setPainel(null); setQuiz(null);
            }}
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  // ---------------- LOGIN E-MAIL ----------------
  if (screen === "login-email") {
    return (
      <div className="app-shell">
        <style>{CSS}</style>
        <div className="login-wrap">
          <img className="mark-center" src={logoHabitatCebrace} alt="Habitat by Cebrace" />
          <div className="kicker kicker-login"><span className="kicker-preto">Acesso ao evento</span></div>
          <p className="login-sub login-sub-sm">Informe seu nome e empresa para acessar o evento.</p>
          <div className="login-card">
            <form onSubmit={handleEntrar}>
              <span className="flabel">Nome completo</span>
              <input className="finput" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome completo" />
              <span className="flabel">Empresa</span>
              <input className="finput" value={empresa} onChange={(e) => setEmpresa(e.target.value)} placeholder="Sua empresa" />
              <button className="fbtn" type="submit" disabled={carregando}>{carregando ? "Entrando..." : "Continuar"}</button>
              {erro && <div className="err">{erro}</div>}
              <div className="fnote">
                Em caso de dúvidas entre em contato conosco.
                <br /><br />
                Seus dados (nome e empresa) são usados apenas para a gestão deste treinamento.
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- CRIAR SENHA (PRIMEIRO ACESSO) ----------------
  if (screen === "criar-senha") {
    return (
      <div className="app-shell">
        <style>{CSS}</style>
        <div className="topbar">
          <div className="brand"><img className="mark" src={logoHabitatCebrace} alt="Habitat by Cebrace" /></div>
        </div>
        <div className="login-wrap">
          <div style={{ marginBottom: 22 }}><span className="streak-badge" style={{ background: "transparent" }}>Primeiro acesso</span></div>
          <div className="kicker">Crie sua senha</div>
          <h1 className="login-title serif">Defina uma senha de acesso</h1>
          <p className="login-sub">Para <b style={{ color: "var(--text)" }}>{email}</b>. Só você vai saber essa senha — nem o organizador tem acesso a ela.</p>
          <div className="login-card">
            <form onSubmit={handleDefinirSenha}>
              <span className="flabel">Nova senha</span>
              <input className="finput" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Mínimo 6 caracteres" />
              <span className="flabel">Confirmar senha</span>
              <input className="finput" type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />
              <button className="fbtn" type="submit" disabled={carregando}>{carregando ? "Salvando..." : "Criar senha e entrar"}</button>
              {erro && <div className="err">{erro}</div>}
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- LOGIN SENHA ----------------
  if (screen === "login-senha") {
    return (
      <div className="app-shell">
        <style>{CSS}</style>
        <div className="login-wrap">
          <img className="mark-center" src={logoHabitatCebrace} alt="Habitat by Cebrace" />
          <div className="kicker kicker-login"><span className="kicker-preto">Acesso ao evento</span></div>
          <p className="login-sub">Para <b style={{ color: "var(--text)" }}>{email}</b>.</p>
          <div className="login-card">
            <form onSubmit={handleLogin}>
              <span className="flabel">Senha</span>
              <input className="finput" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
              <div className="field-hint">Digite sua senha</div>
              <button className="fbtn" type="submit" disabled={carregando}>{carregando ? "Entrando..." : "Entrar no treinamento"}</button>
              {erro && <div className="err">{erro}</div>}
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- AUTORIZAÇÃO DE CONTATO COMERCIAL (NERA) ----------------
  // Só aparece uma vez, logo após o login (primeiro acesso ou não), quando
  // consentimentoNera ainda é null. Qualquer resposta libera a sala —
  // isso é uma classificação de contato futuro, não um gate de acesso.
  if (screen === "consentimento-nera") {
    async function responderConsentimento(autorizou) {
      setCarregando(true);
      setErro("");
      try {
        await api.consentimentoNera(autorizou);
        setScreen("sala");
      } catch (err) {
        if (err.acessoExpirado) { setScreen("sessao-encerrada"); return; }
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    }

    return (
      <div className="app-shell">
        <style>{CSS}</style>
        <div className="topbar">
          <div className="brand"><img className="mark" src={logoHabitatCebrace} alt="Habitat by Cebrace" /></div>
        </div>
        <div className="login-wrap">
          <div className="kicker">Antes de começar</div>
          <h1 className="login-title serif">Podemos te avisar sobre outras oportunidades da Nera no futuro?</h1>
          <p className="login-sub">Seu e-mail foi cadastrado apenas para este treinamento. A Nera, que conduz essa capacitação, gostaria de usar esse mesmo e-mail pra te contar sobre outros serviços no futuro, somente se você topar.</p>
          <p className="login-sub">Sua resposta não muda sua participação neste treinamento.</p>
          <div className="login-card" style={{ width: 440, textAlign: "center" }}>
            <button className="fbtn" disabled={carregando} onClick={() => responderConsentimento(true)}>
              {carregando ? "Salvando..." : "Autorizo o contato da Nera"}
            </button>
            <button className="fbtn-link" disabled={carregando} onClick={() => responderConsentimento(false)}>
              Prefiro não, por enquanto
            </button>
            <details className="lawdetails">
              <summary>Ver a íntegra com a base legal (LGPD)</summary>
              <div className="lawbody">
                <p>Em atendimento à Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018), o endereço de e-mail utilizado para acesso a este treinamento foi disponibilizado pela Cebrace exclusivamente para fins de gestão e execução deste evento.</p>
                <p>A Nera solicita, em caráter separado e específico, sua manifestação livre, informada e inequívoca quanto à possibilidade de utilizar seus dados pessoais (nome, e-mail e, quando informada, empresa) para fins de contato comercial e divulgação de serviços em oportunidades futuras.</p>
                <p>A concessão ou a recusa desta autorização é facultativa, não constitui condição para sua participação neste treinamento e não implica qualquer prejuízo ao exercício de seus direitos como titular de dados pessoais.</p>
                <p>Você poderá revogar este consentimento a qualquer momento, mediante solicitação enviada para contato@neracompany.com.br.</p>
              </div>
            </details>
            {erro && <div className="err">{erro}</div>}
          </div>
        </div>
      </div>
    );
  }

  // ---------------- SALA — quiz ao vivo, conduzido pelo admin/tutor ----------------
  if (screen === "sala") {
    if (!quiz || !painel) {
      return (
        <div className="app-shell">
          <style>{CSS}</style>
          <div className="content" style={{ textAlign: "center", paddingTop: 100, color: "var(--text-dim)" }}>Carregando...</div>
        </div>
      );
    }

    const letras = ["A", "B", "C", "D", "E"];
    const semLimiteDeTempo = !quiz.tempoLimiteSegundos;
    const podeResponder = !quiz.jaRespondida && !enviando && (semLimiteDeTempo || tempoRestante > 0);
    // XP exibido é só da fase em andamento — Fase 1 e Fase 2 nunca são
    // somadas na tela do participante, cada uma é ranqueada por conta própria.
    const xpFaseAtual = quiz.fase === 2 ? painel.xpFase2 : painel.xpFase1;

    return (
      <div className="app-shell">
        <style>{CSS}</style>
        <div className="topbar">
          <div className="brand"><img className="mark" src={logoHabitatCebrace} alt="Habitat by Cebrace" /></div>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <div className="topstat"><div className="v">{xpFaseAtual}</div><div className="l">XP · Fase {quiz.fase || 1}</div></div>
            <div className="topstat"><div className="v">{painel.melhorStreak}</div><div className="l">Melhor streak</div></div>
          </div>
        </div>

        {quiz.quizEstado === "aguardando" && (
          <div className="end-wrap">
            <div className="kicker">{quiz.fase === 2 ? "Fase 2" : "Fase 1"}</div>
            <div className="end-title serif">{quiz.fase === 2 ? "Aguardando início da segunda etapa" : "Aguarde o início"}</div>
            <p className="end-sub">Bem-vindo, <b>{painel.nome}</b>{painel.empresa ? <> — <b>{painel.empresa}</b></> : null}. O organizador vai iniciar {quiz.fase === 2 ? "a segunda etapa" : "a primeira pergunta"} em instantes — fique nesta tela.</p>
          </div>
        )}

        {quiz.quizEstado === "pergunta_ativa" && quiz.questao && (
          <>
            {semLimiteDeTempo ? (
              <div className="qbar-row">
                <div className="qbar-label">
                  Sem tempo limite por pergunta{quiz.prazo && (
                    <> — responda todas até <b>{new Date(quiz.prazo).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</b></>
                  )}.
                </div>
              </div>
            ) : (
              <div className="qbar-row">
                <div className="qbar-track"><div className="fill" style={{ width: Math.max(0, (tempoRestante / quiz.tempoLimiteSegundos) * 100) + "%" }}></div></div>
                <div className="qbar-label">Fase {quiz.fase} · {Math.ceil(tempoRestante)}s</div>
              </div>
            )}
            <div className="quiz-wrap">
              {quiz.questao.cenario && <div className="cenario"><b>Cenário</b>{quiz.questao.cenario}</div>}
              <div className="qtext">{quiz.questao.pergunta}</div>
              {quiz.questao.alternativas.map((alt, i) => {
                let cls = "option" + (podeResponder ? "" : " disabled");
                if (i === selecionada) cls += " selected";
                return (
                  <div key={i} className={cls} onClick={() => podeResponder && setSelecionada(i)}>
                    <span className="letter">{letras[i]}</span><span style={{ fontSize: 13 }}>{alt}</span>
                  </div>
                );
              })}

              {quiz.jaRespondida ? (
                <div className="feedback ok"><span className="ftitle">Resposta registrada</span>Aguarde a próxima pergunta.</div>
              ) : !semLimiteDeTempo && tempoRestante <= 0 ? (
                <div className="feedback bad"><span className="ftitle">Tempo esgotado</span>Aguarde a próxima pergunta.</div>
              ) : (
                <div className="btn-row">
                  <span style={{ fontSize: 12, color: "var(--text-faint)" }}>Escolha uma alternativa e confirme</span>
                  <button className="fbtn" style={{ width: "auto", padding: "12px 22px" }} disabled={selecionada === null || enviando} onClick={() => confirmarResposta(selecionada)}>
                    {enviando ? "Enviando..." : "Confirmar resposta"}
                  </button>
                </div>
              )}
              {erro && <div className="err" style={{ marginTop: 14 }}>{erro}</div>}
            </div>
          </>
        )}

        {quiz.quizEstado === "fase1_concluida" && (
          <div className="end-wrap">
            <div className="kicker">Fase 1 concluída</div>
            <div className="end-title serif">Sua pontuação</div>
            <p className="end-sub">
              Você fechou a Fase 1 com <b>{painel.xpFase1} XP</b>, melhor sequência de <b>{painel.melhorStreak}</b> acertos consecutivos.
            </p>
            {!painel.podio1Liberado ? (
              <p style={{ fontSize: 13, color: "var(--text-faint)", marginBottom: 24 }}>Aguardando o organizador liberar o pódio da Fase 1.</p>
            ) : mostrarPodio1 ? (
              <div style={{ marginBottom: 36 }}><Podium dados={painel.podio1} /></div>
            ) : (
              <button className="fbtn" style={{ width: "auto", padding: "14px 36px", marginBottom: 24 }} onClick={() => setMostrarPodio1(true)}>
                Ver pódio da Fase 1
              </button>
            )}
            <p className="end-sub" style={{ marginBottom: 0 }}>Aguarde — a Fase 2 começa depois da apresentação do conteúdo pelo tutor.</p>
          </div>
        )}

        {quiz.quizEstado === "fase2_concluida" && (
          <div className="end-wrap">
            <div className="seal-glow">
              <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#F5811E" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <div className="kicker">Treinamento concluído</div>
            <div className="end-title serif">Parabéns, {painel.nome}</div>
            <p className="end-sub">
              Você concluiu com <b>{painel.xpFase2} XP</b>{painel.empresa ? <> representando a <b>{painel.empresa}</b></> : null}, melhor sequência de <b>{painel.melhorStreak}</b> acertos consecutivos.
            </p>
            {!painel.podio2Liberado ? (
              <p style={{ fontSize: 13, color: "var(--text-faint)" }}>Aguardando o organizador liberar o pódio final.</p>
            ) : mostrarPodio2 ? (
              <Podium dados={painel.podio2} />
            ) : (
              <button className="fbtn" style={{ width: "auto", padding: "14px 36px" }} onClick={() => setMostrarPodio2(true)}>
                Ver pódio final
              </button>
            )}
          </div>
        )}

        {quiz.quizEstado === "prazo_encerrado" && (
          <div className="end-wrap">
            <div className="kicker">Prazo encerrado</div>
            <div className="end-title serif">O tempo para responder acabou</div>
            <p className="end-sub">
              Você chegou com <b>{painel.xpFase2} XP</b> até o prazo de hoje (22/09) às 23h59. Não é mais possível responder as perguntas restantes.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app-shell">
      <style>{CSS}</style>
      <div className="content" style={{ textAlign: "center", paddingTop: 100, color: "var(--text-dim)" }}>Carregando...</div>
    </div>
  );
}
