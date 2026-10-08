public class Main {

    public static void main(String[] args) {
        Selecao selecao = new Quadrados();
        Bombas bombas = new Bombas();
        Carteira carteira = new Carteira();

        boolean rodando = true;

        while (rodando) {
            switch (selecao.Menu()) {
                case 1:
                    jogarPartida(selecao, bombas, carteira);
                    break;
                case 2:
                    apostar(selecao, bombas, carteira);
                    break;
                case 3:
                    System.out.println("Saldo na carteira: " + carteira.getSaldo());
                    break;
                case 4:
                    rodando = false;
                    break;
            }
        }

        System.out.println("Saldo final: " + carteira.getSaldo() + ". Obrigado por jogar!");
    }

    private static void jogarPartida(Selecao selecao, Bombas bombas, Carteira carteira) {
        bombas.reiniciar();

        while (!bombas.isFimDeJogo()) {
            String cor = selecao.Escolha();
            bombas.escolher(cor);
            System.out.println("Pontos da partida: " + bombas.getPontos());
        }

        carteira.depositar(bombas.getPontos());
        System.out.println("Você guardou " + bombas.getPontos() + " pontos na carteira.");
        System.out.println("Saldo na carteira: " + carteira.getSaldo());
    }

    private static void apostar(Selecao selecao, Bombas bombas, Carteira carteira) {
        if (carteira.getSaldo() == 0) {
            System.out.println("Você não tem pontos para apostar. Jogue uma partida primeiro.");
            return;
        }

        int valor = selecao.EscolherAposta(carteira.getSaldo());
        if (valor == 0) {
            System.out.println("Aposta cancelada.");
            return;
        }

        String cor = selecao.Escolha();
        bombas.apostar(cor, valor, carteira);
        System.out.println("Saldo na carteira: " + carteira.getSaldo());
    }
}