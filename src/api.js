// =====================================================================
// api.js — Cliente de API do módulo participante
// =====================================================================
// credentials: 'include' garante que o cookie httpOnly de sessão seja
// enviado automaticamente — o front-end nunca lê nem guarda o token.
// =====================================================================

const BASE_URL = import.meta.env.VITE_API_URL || "https://api.neratreinamento.com.br";

async function chamar(caminho, opcoes = {}) {
  const resp = await fetch(`${BASE_URL}${caminho}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...opcoes,
  });
  const dados = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const erro = new Error(dados.erro || "Erro na requisição.");
    erro.status = resp.status;
    erro.acessoExpirado = Boolean(dados.acessoExpirado);
    throw erro;
  }
  return dados;
}

export const api = {
  verificarEmail: (email, nome, empresa) => chamar("/participante/verificar-email", { method: "POST", body: JSON.stringify({ email, nome, empresa }) }),
  definirSenha: (email, senha) => chamar("/participante/definir-senha", { method: "POST", body: JSON.stringify({ email, senha }) }),
  login: (email, senha) => chamar("/participante/login", { method: "POST", body: JSON.stringify({ email, senha }) }),
  entrar: (nome, empresa) => chamar("/participante/entrar", { method: "POST", body: JSON.stringify({ nome, empresa }) }),
  painel: () => chamar("/participante/painel"),
  quizEstado: () => chamar("/participante/quiz-estado"),
  responder: (questaoId, alternativaSelecionada) =>
    chamar("/participante/responder", { method: "POST", body: JSON.stringify({ questaoId, alternativaSelecionada }) }),
};
