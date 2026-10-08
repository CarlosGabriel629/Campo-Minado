import java.util.Scanner;

public class Quadrados implements Selecao {

    private final Scanner scanner = new Scanner(System.in);

    @Override
    public String Escolha() {
        while (true) {
            System.out.println("Escolha uma bomba: 1 - Azul | 2 - Verde | 3 - Vermelha");
            String entrada = scanner.nextLine().trim();

            switch (entrada) {
                case "1": return "Azul";
                case "2": return "Verde";
                case "3": return "Vermelha";
                default: System.out.println("Opção inválida, tente de novo.");
            }
        }
    }

    @Override
    public int Menu() {
        while (true) {
            System.out.println();
            System.out.println("=== MENU ===");
            System.out.println("1 - Jogar partida (acumula pontos)");
            System.out.println("2 - Apostar pontos");
            System.out.println("3 - Ver saldo");
            System.out.println("4 - Sair");
            String entrada = scanner.nextLine().trim();

            switch (entrada) {
                case "1": return 1;
                case "2": return 2;
                case "3": return 3;
                case "4": return 4;
                default: System.out.println("Opção inválida, tente de novo.");
            }
        }
    }

    @Override
    public int EscolherAposta(int saldo) {
        while (true) {
            System.out.println("Seu saldo: " + saldo + ". Quanto quer apostar? (0 para cancelar)");
            String entrada = scanner.nextLine().trim();

            try {
                int valor = Integer.parseInt(entrada);
                if (valor >= 0 && valor <= saldo) {
                    return valor;
                }
                System.out.println("Valor inválido. Digite entre 0 e " + saldo + ".");
            } catch (NumberFormatException e) {
                System.out.println("Digite apenas números.");
            }
        }
    }
}