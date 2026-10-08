// ===== Configurações (mude aqui) =====
const MAX_TENTATIVAS = 3;   // partidas por jogador, por dia (apostas não contam)
const SEQ_BONUS = 3;        // acertos seguidos para ativar o bônus
const MULT_BONUS = 2;       // multiplicador do bônus
const PONTOS_ACERTO = 100;  // pontos por bomba desativada
const MAX_RANKING = 10;
const CHAVE = "campoMinadoV2";

// ===== Estado =====
let dados = carregar();
let nome = "";
let pontos = 0;
let sequencia = 0;
let fimDeJogo = false;
let partidaIniciada = false;
let modo = "partida"; // "partida" ou "aposta"

const $ = id => document.getElementById(id);
const elMsg = $("msg"), elNovo = $("novo"), elAposta = $("aposta"), elValor = $("valor"), elNome = $("nome");
const botoes = document.querySelectorAll(".bomba");
const botoesModo = document.querySelectorAll(".modo");

// ===== Armazenamento (fica neste navegador) =====
function carregar() {
    try { return JSON.parse(localStorage.getItem(CHAVE)) || { jogadores: {} }; }
    catch (e) { return { jogadores: {} }; }
}
function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(dados)); } catch (e) {}
}

// ===== Jogador =====
function hoje() { return new Date().toLocaleDateString("sv-SE"); } // AAAA-MM-DD
function jogador() { return dados.jogadores[nome]; }

function renovarDia() {
    const j = jogador();
    if (j.dia !== hoje()) { j.dia = hoje(); j.usadas = 0; }
}

function entrar() {
    const n = elNome.value.trim();
    if (!n) { mostrar("Digite seu nome para jogar.", "fim"); return; }
    nome = n;
    if (!dados.jogadores[nome]) dados.jogadores[nome] = { carteira: 0, melhor: 0, dia: hoje(), usadas: 0 };
    jogador().ganhoApostas = jogador().ganhoApostas || 0;     // jogadores antigos não têm esses campos
    jogador().perdidoApostas = jogador().perdidoApostas || 0;
    renovarDia();
    resetarPartida();
    salvar();
    mostrar("Bem-vindo, " + nome + "! Você tem " + (MAX_TENTATIVAS - jogador().usadas) + " tentativas hoje.", "ok");
    atualizar();
}

function resetarPartida() {
    pontos = 0; sequencia = 0; fimDeJogo = false; partidaIniciada = false;
}

// ===== Jogo =====
function sortearAtivada() { return Math.random() < 0.5; }

function escolher(cor) {
    if (!nome) { mostrar("Digite seu nome e clique em Entrar primeiro.", "fim"); return; }
    if (modo === "partida") jogarPartida(cor); else apostar(cor);
    salvar();
    atualizar();
}

function jogarPartida(cor) {
    if (fimDeJogo) return;
    const j = jogador();

    if (!partidaIniciada) {
        renovarDia();
        if (j.usadas >= MAX_TENTATIVAS) {
            mostrar("Suas tentativas de hoje acabaram. Você ainda pode apostar.", "fim");
            return;
        }
        j.usadas++;
        partidaIniciada = true;
    }

    if (sortearAtivada()) {
        fimDeJogo = true;
        j.carteira += pontos;
        if (pontos > j.melhor) j.melhor = pontos;
        const restantes = MAX_TENTATIVAS - j.usadas;
        mostrar("A bomba " + cor + " estava ATIVADA! Fim de jogo. Você guardou " + pontos +
            " pontos. Tentativas restantes hoje: " + restantes + ".", "fim");
        sequencia = 0;
    } else {
        sequencia++;
        const bonus = sequencia >= SEQ_BONUS;
        const ganho = bonus ? PONTOS_ACERTO * MULT_BONUS : PONTOS_ACERTO;
        pontos += ganho;
        mostrar("A bomba " + cor + " estava DESATIVADA! " +
            (bonus ? "Sequência de " + sequencia + " acertos: BÔNUS " + MULT_BONUS + "x! " : "") +
            "+" + ganho + " pontos.", "ok");
    }
}

function apostar(cor) {
    const j = jogador();
    const valor = parseInt(elValor.value, 10);

    if (j.carteira === 0) { mostrar("Você não tem pontos para apostar. Jogue uma partida primeiro.", "fim"); return; }
    if (isNaN(valor) || valor <= 0) { mostrar("Digite um valor de aposta maior que 0.", "fim"); return; }
    if (valor > j.carteira) { mostrar("Você só tem " + j.carteira + " pontos na carteira.", "fim"); return; }

    if (sortearAtivada()) {
        j.carteira -= valor;
        j.perdidoApostas += valor;
        mostrar("A bomba " + cor + " estava ATIVADA! Você perdeu " + valor + " pontos. Total perdido em apostas: " + j.perdidoApostas + ".", "fim");
    } else {
        j.carteira += valor;
        j.ganhoApostas += valor;
        mostrar("A bomba " + cor + " estava DESATIVADA! Você ganhou " + valor + " pontos. Total ganho em apostas: " + j.ganhoApostas + ".", "ok");
    }
}

function reiniciar() {
    resetarPartida();
    const restantes = MAX_TENTATIVAS - jogador().usadas;
    mostrar(restantes > 0
        ? "Nova partida. Escolha uma bomba."
        : "Suas tentativas de hoje acabaram. Você ainda pode apostar.", "");
    atualizar();
}

function trocarModo(novo) {
    modo = novo;
    elAposta.hidden = modo !== "aposta";
    botoesModo.forEach(b => b.classList.toggle("ativo", b.dataset.modo === modo));
    mostrar(modo === "aposta" ? "Digite um valor, escolha uma bomba e arrisque." : "Escolha uma bomba para jogar a partida.", "");
    atualizar();
}

// ===== Tela =====
function mostrar(texto, tipo) {
    elMsg.textContent = texto;
    elMsg.className = "msg " + tipo;
}

function atualizar() {
    const j = nome ? jogador() : null;
    $("carteira").textContent = j ? j.carteira : 0;
    $("pontos").textContent = pontos;
    $("sequencia").textContent = sequencia;
    $("ganhoApostas").textContent = j ? j.ganhoApostas : 0;
    $("perdidoApostas").textContent = j ? j.perdidoApostas : 0;
    $("tentativas").textContent = j ? (MAX_TENTATIVAS - j.usadas) + "/" + MAX_TENTATIVAS : "-";

    const encerrada = modo === "partida" && fimDeJogo;
    botoes.forEach(b => b.disabled = encerrada);
    elNovo.classList.toggle("visivel", encerrada);
    desenharRanking();
}

function desenharRanking() {
    const lista = $("ranking");
    lista.textContent = "";
    const top = Object.entries(dados.jogadores)
        .filter(([, j]) => j.melhor > 0)
        .sort((a, b) => b[1].melhor - a[1].melhor)
        .slice(0, MAX_RANKING);

    if (top.length === 0) {
        const li = document.createElement("li");
        li.className = "vazio";
        li.textContent = "Ninguém no ranking ainda.";
        lista.appendChild(li);
        return;
    }
    top.forEach(([n, j]) => {
        const li = document.createElement("li");
        li.textContent = n + " — " + j.melhor + " pts (ganho em apostas: " + (j.ganhoApostas || 0) + ")";
        if (n === nome) li.className = "eu";
        lista.appendChild(li);
    });
}

// ===== Eventos =====
botoes.forEach(b => b.addEventListener("click", () => escolher(b.dataset.cor)));
botoesModo.forEach(b => b.addEventListener("click", () => trocarModo(b.dataset.modo)));
elNovo.addEventListener("click", reiniciar);
$("entrar").addEventListener("click", entrar);
elNome.addEventListener("keydown", e => { if (e.key === "Enter") entrar(); });
$("metade").addEventListener("click", () => { if (nome) elValor.value = Math.floor(jogador().carteira / 2); });
$("tudo").addEventListener("click", () => { if (nome) elValor.value = jogador().carteira; });

desenharRanking();