import java.util.Random;

public class Bombas {

    private final Random random = new Random();
    private int pontos = 0;
    private boolean fimDeJogo = false;

    // Modo partida
    public void escolher(String cor) {
        boolean ativada = random.nextBoolean();

        if (ativada) {
            System.out.println("A bomba " + cor + " estava ATIVADA! Fim de jogo.");
            fimDeJogo = true;
        } else {
            pontos += 100;
            System.out.println("A bomba " + cor + " estava DESATIVADA! +100 pontos.");
        }
    }

    // Modo aposta
    public void apostar(String cor, int valor, Carteira carteira) {
        boolean ativada = random.nextBoolean();

        if (ativada) {
            carteira.retirar(valor);
            System.out.println("A bomba " + cor + " estava ATIVADA! Você perdeu " + valor + " pontos.");
        } else {
            carteira.depositar(valor);
            System.out.println("A bomba " + cor + " estava DESATIVADA! Você ganhou " + valor + " pontos.");
        }
    }

    public void reiniciar() {
        pontos = 0;
        fimDeJogo = false;
    }

    public int getPontos() {
        return pontos;
    }

    public boolean isFimDeJogo() {
        return fimDeJogo;
    }
}
