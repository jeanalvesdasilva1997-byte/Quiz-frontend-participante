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
    throw erro;
  }
  return dados;
}

export const api = {
  solicitarCodigo: (email) => chamar("/participante/solicitar-codigo", { method: "POST", body: JSON.stringify({ email }) }),
  confirmarCodigo: (email, codigo) => chamar("/participante/confirmar-codigo", { method: "POST", body: JSON.stringify({ email, codigo }) }),
  painel: () => chamar("/participante/painel"),
  questaoAtual: () => chamar("/participante/questao-atual"),
  responder: (questaoId, alternativaSelecionada) =>
    chamar("/participante/responder", { method: "POST", body: JSON.stringify({ questaoId, alternativaSelecionada }) }),
};
