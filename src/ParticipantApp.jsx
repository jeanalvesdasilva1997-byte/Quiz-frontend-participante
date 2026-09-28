import React, { useState, useEffect } from "react";
import { api } from "./api";
import neraJanela from "./assets/nera-janela.png";
import neraLogo from "./assets/nera-logo.png";

// =====================================================================
// Identidade visual Nera treinamento
// (tokens do site neracompany.com.br: Cormorant nos títulos, Hanken Grotesk
// no texto, fundo creme #EEECDF, taupe #6B5F4E nos botões e destaques)
// =====================================================================
const CSS = `
  :root{
    --dark:#EEECDF; --card:#FFFFFF; --card2:#F4F2E8; --gold:#6B5F4E; --gold-dim:#AEA087;
    --text:#111111; --text-dim:#555555; --text-faint:#8C7F6A; --red:#C0504D; --green:#3E8E43; --line:rgba(58,48,40,0.14);
  }
  *{ box-sizing:border-box; }
  html,body,#root{ margin:0; padding:0; height:100%; background:var(--dark); }
  .app-shell{ font-family:'Hanken Grotesk',system-ui,'Helvetica Neue',Arial,sans-serif; color:var(--text); min-height:100vh; }
  .serif{ font-family:'Cormorant',Cambria,Georgia,serif; font-weight:600; }
  .topbar{ display:flex; justify-content:space-between; align-items:center; padding:22px 48px; border-bottom:1px solid var(--line); }
  .brand{ display:flex; align-items:center; gap:12px; }
  .brand .mark{ height:30px; width:auto; display:block; }
  .brand .name{ font-size:24px; letter-spacing:0.04em; font-weight:600; color:var(--text); }
  .login-wrap{ display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:80vh; padding:60px; text-align:center; }
  .mark-center{ height:130px; width:auto; display:block; margin:0 auto 28px; }
  .kicker{ font-size:13px; letter-spacing:0.16em; text-transform:uppercase; color:var(--gold); margin-bottom:18px; }
  .kicker .kicker-preto{ color:var(--text); text-transform:none; letter-spacing:0.02em; }
  .kicker .kicker-marca{ text-transform:none; letter-spacing:0.02em; }
  .kicker.kicker-login{ font-size:16px; letter-spacing:0.02em; }
  .login-title{ font-size:52px; font-weight:500; margin:0 0 16px; max-width:820px; line-height:1.2; }
  .field-hint{ font-size:12px; color:var(--text-faint); margin:-10px 0 18px; }
  .login-sub{ color:var(--text-dim); font-size:16px; max-width:520px; margin:0 0 40px; line-height:1.6; }
  .login-sub.login-sub-sm{ font-size:13px; }
  .login-card{ width:420px; background:var(--card); border:1px solid var(--line); border-radius:10px; padding:36px; text-align:left; }
  .flabel{ font-size:11px; letter-spacing:0.08em; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px; display:block; }
  .finput{ width:100%; background:var(--card2); border:1px solid var(--line); border-radius:6px; padding:14px 15px; color:var(--text); font-size:15px; margin-bottom:18px; font-family:inherit; }
  .fbtn{ width:100%; background:var(--gold); color:#FBFAF4; border:none; border-radius:4px; padding:15px; font-weight:700; font-size:13.5px; text-transform:uppercase; letter-spacing:0.12em; cursor:pointer; font-family:inherit; }
  .fbtn:hover:not(:disabled), .btn:hover:not(:disabled){ background:#3A3028; }
  .fbtn:disabled{ opacity:0.5; cursor:not-allowed; }
  .fbtn-link{ display:block; width:100%; background:none; border:none; color:var(--text-dim); font-size:13px; text-decoration:underline; text-underline-offset:3px; cursor:pointer; padding:12px; margin-top:2px; font-family:inherit; }
  .fbtn-link:hover{ color:var(--text); }
  .fbtn-link:disabled{ opacity:0.5; cursor:not-allowed; }
  .fnote{ margin-top:18px; padding-top:16px; border-top:1px solid var(--line); font-size:12.5px; color:var(--text-faint); line-height:1.6; }
  .err{ color:var(--red); font-size:13px; margin-top:10px; }
  .content{ padding:36px 48px; max-width:920px; margin:0 auto; }
  .topstat{ text-align:right; } .topstat .v{ font-size:20px; font-weight:700; color:var(--gold); } .topstat .l{ font-size:10px; color:var(--text-faint); text-transform:uppercase; letter-spacing:0.05em; }
  .qbar-row{ display:flex; justify-content:space-between; align-items:center; padding:18px 60px 0; max-width:1000px; margin:0 auto; }
  .qbar-track{ flex:1; height:5px; background:var(--card2); border-radius:3px; overflow:hidden; margin-right:20px; }
  .qbar-track .fill{ height:100%; background:var(--gold); }
  .qbar-label{ font-size:12.5px; color:var(--text-dim); white-space:nowrap; }
  .streak-badge{ display:inline-flex; align-items:center; gap:8px; background:rgba(107,95,78,0.12); border:1px solid var(--gold); color:var(--gold); padding:6px 14px; border-radius:20px; font-size:12.5px; font-weight:700; }
  .quiz-wrap{ padding:30px 60px 60px; max-width:880px; margin:0 auto; }
  .cenario{ background:var(--card2); border-left:3px solid var(--gold); padding:16px 20px; border-radius:0 8px 8px 0; font-size:14px; line-height:1.6; margin-bottom:26px; }
  .cenario b{ color:var(--gold); font-size:11px; text-transform:uppercase; display:block; margin-bottom:8px; letter-spacing:0.05em; }
  .qtext{ font-size:19px; font-weight:700; margin-bottom:22px; }
  .option{ display:flex; align-items:center; gap:16px; padding:16px 20px; background:var(--card); border:1px solid var(--line); border-radius:8px; margin-bottom:12px; cursor:pointer; }
  .option:hover{ border-color:var(--gold-dim); }
  .option.selected{ border-color:var(--gold); background:rgba(107,95,78,0.08); }
  .option.disabled{ cursor:default; opacity:0.7; }
  .letter{ width:28px; height:28px; border-radius:50%; background:var(--card2); border:1px solid var(--line); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; flex-shrink:0; }
  .option.selected .letter{ background:var(--gold); color:#FBFAF4; border-color:var(--gold); }
  .feedback{ margin-top:22px; padding:18px 22px; border-radius:8px; font-size:15px; line-height:1.6; }
  .feedback.ok{ background:rgba(127,166,107,0.12); border:1px solid var(--green); color:#2E6B32; }
  .feedback.bad{ background:rgba(192,80,77,0.12); border:1px solid var(--red); color:#8E2F2B; }
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

  // Chamado logo após o login (primeiro acesso ou não). Nesta versão não há
  // tela de autorização de contato (LGPD): o estabelecimento já está ciente
  // do uso da plataforma, então o participante vai direto pra sala.
  async function entrarAposLogin() {
    const pn = await api.painel();
    setPainel(pn);
    setScreen("sala");
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

  // Timer visual de 10s — só exibição. A autoridade real é o servidor,
  // que recalcula o timeout no momento de "responder" a partir de
  // turmas.quiz_iniciada_em, independentemente do que o cliente mostrar.
  useEffect(() => {
    if (quiz?.quizEstado !== "pergunta_ativa" || !quiz.iniciadaEm) { setTempoRestante(0); return; }
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
      // Atualiza XP e streak na hora, sem esperar o próximo ciclo do polling.
      api.painel().then(setPainel).catch(() => {});
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
          <img className="mark-center" src={neraLogo} alt="Nera, a janela para o seu conforto" />
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
          <div className="brand"><img className="mark" src={neraJanela} alt="" /><div className="name serif">NERA</div></div>
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
          <img className="mark-center" src={neraLogo} alt="Nera, a janela para o seu conforto" />
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
    const podeResponder = !quiz.jaRespondida && tempoRestante > 0 && !enviando;
    // XP exibido é só da fase em andamento — Fase 1 e Fase 2 nunca são
    // somadas na tela do participante, cada uma é ranqueada por conta própria.
    const xpFaseAtual = quiz.fase === 2 ? painel.xpFase2 : painel.xpFase1;

    return (
      <div className="app-shell">
        <style>{CSS}</style>
        <div className="topbar">
          <div className="brand"><img className="mark" src={neraJanela} alt="" /><div className="name serif">NERA</div></div>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <div className="topstat"><div className="v">{xpFaseAtual}</div><div className="l">XP · Fase {quiz.fase || 1}</div></div>
            <div className="topstat"><div className="v">{painel.melhorStreak}</div><div className="l">Melhor streak</div></div>
          </div>
        </div>

        {quiz.quizEstado === "aguardando" && (
          <div className="end-wrap">
            <div className="kicker">{quiz.fase === 2 ? "Fase 2" : "Fase 1"}</div>
            <div className="end-title serif">Olá, {painel.nome}! {quiz.fase === 2 ? "A segunda etapa começa em breve" : "As questões começam em breve"}</div>
            <p className="end-sub">
              {painel.empresa ? <>Que bom ter você aqui representando a <b>{painel.empresa}</b>. </> : null}
              Assim que o host liberar a primeira pergunta{quiz.fase === 2 ? " da segunda etapa" : ""}, ela vai aparecer nesta tela automaticamente. Não precisa atualizar a página, é só manter esta tela aberta.
            </p>
          </div>
        )}

        {quiz.quizEstado === "pergunta_ativa" && quiz.questao && (
          <>
            <div className="qbar-row">
              <div className="qbar-track"><div className="fill" style={{ width: Math.max(0, (tempoRestante / quiz.tempoLimiteSegundos) * 100) + "%" }}></div></div>
              <div className="qbar-label">Fase {quiz.fase} · {Math.ceil(tempoRestante)}s</div>
            </div>
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
              ) : tempoRestante <= 0 ? (
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
            {!painel.podio1Liberado ? null : mostrarPodio1 ? (
              <div style={{ marginBottom: 36 }}><Podium dados={painel.podio1} /></div>
            ) : (
              <button className="fbtn" style={{ width: "auto", padding: "14px 36px", marginBottom: 24 }} onClick={() => setMostrarPodio1(true)}>
                Ver pódio da Fase 1
              </button>
            )}
          </div>
        )}

        {quiz.quizEstado === "fase2_concluida" && (
          <div className="end-wrap">
            <div className="seal-glow">
              <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#6B5F4E" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
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
