public class Carteira {

    private int saldo = 0;

    public void depositar(int valor) {
        saldo += valor;
    }

    public void retirar(int valor) {
        saldo -= valor;
    }

    public int getSaldo() {
        return saldo;
    }
}
