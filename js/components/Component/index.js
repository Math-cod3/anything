class Component {
  constructor(element) {
    this.element = element;
  }

  init() {
    if (this.canRun()) {
      this.run();
    }
  }

  canRun() {
    if (!this.element) {
      console.error(
        ` Não foi possível inicializar o componente ${this.constructor.name}.

          Verifique se o elemento onde ele deve ser inicializado foi informado corretamente.
        `
      );

      return false;
    }

    return true;
  }

  run() {
    console.error(
      ` O método \`run\` da classe pai \`Component\` não deve ser chamado.

        Verifique se os seus componentes estão definindo \'run\' corretamente.
      `
    );
  }
}
export default Component;
