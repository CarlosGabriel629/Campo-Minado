
let carteira = 0;
let pontos = 0;
let fimDeJogo = false;
let modo = "partida"; // "partida" ou "aposta"

const elCarteira = document.getElementById("carteira");
const elPontos = document.getElementById("pontos");
const elMsg = document.getElementById("msg");
const elNovo = document.getElementById("novo");
const elAposta = document.getElementById("aposta");
const elValor = document.getElementById("valor");
const botoes = document.querySelectorAll(".bomba");
const botoesModo = document.querySelectorAll(".modo");

function sortearAtivada() {
    return Math.random() < 0.5; // true = ativada, false = desativada
}

function escolher(cor) {
    if (modo === "partida") jogarPartida(cor);
    else apostar(cor);
    atualizar();
}

function jogarPartida(cor) {
    if (fimDeJogo) return;

    if (sortearAtivada()) {
        fimDeJogo = true;
        carteira += pontos;
        mostrar("A bomba " + cor + " estava ATIVADA! Fim de jogo. Você guardou " + pontos + " pontos na carteira.", "fim");
    } else {
        pontos += 100;
        mostrar("A bomba " + cor + " estava DESATIVADA! +100 pontos.", "ok");
    }
}

function apostar(cor) {
    const valor = parseInt(elValor.value, 10);

    if (carteira === 0) {
        mostrar("Você não tem pontos para apostar. Jogue uma partida primeiro.", "fim");
        return;
    }
    if (isNaN(valor) || valor <= 0) {
        mostrar("Digite um valor de aposta maior que 0.", "fim");
        return;
    }
    if (valor > carteira) {
        mostrar("Você só tem " + carteira + " pontos na carteira.", "fim");
        return;
    }

    if (sortearAtivada()) {
        carteira -= valor;
        mostrar("A bomba " + cor + " estava ATIVADA! Você perdeu " + valor + " pontos.", "fim");
    } else {
        carteira += valor;
        mostrar("A bomba " + cor + " estava DESATIVADA! Você ganhou " + valor + " pontos.", "ok");
    }
}

function reiniciar() {
    pontos = 0;
    fimDeJogo = false;
    mostrar("Nova partida. Escolha uma bomba.", "");
    atualizar();
}

function trocarModo(novo) {
    modo = novo;
    elAposta.hidden = modo !== "aposta";
    botoesModo.forEach(b => b.classList.toggle("ativo", b.dataset.modo === modo));
    mostrar(modo === "aposta"
        ? "Digite um valor, escolha uma bomba e arrisque."
        : "Escolha uma bomba para jogar a partida.", "");
    atualizar();
}

function mostrar(texto, tipo) {
    elMsg.textContent = texto;
    elMsg.className = "msg " + tipo;
}

function atualizar() {
    elCarteira.textContent = carteira;
    elPontos.textContent = pontos;

    const partidaEncerrada = modo === "partida" && fimDeJogo;
    botoes.forEach(b => b.disabled = partidaEncerrada);
    elNovo.classList.toggle("visivel", partidaEncerrada);
}

botoes.forEach(b => b.addEventListener("click", () => escolher(b.dataset.cor)));
botoesModo.forEach(b => b.addEventListener("click", () => trocarModo(b.dataset.modo)));
elNovo.addEventListener("click", reiniciar);
document.getElementById("metade").addEventListener("click", () => { elValor.value = Math.floor(carteira / 2); });
document.getElementById("tudo").addEventListener("click", () => { elValor.value = carteira; });