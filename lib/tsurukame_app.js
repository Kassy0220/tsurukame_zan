import { Questionmaker } from "./questionmaker.js";
import { Questioner } from "./questioner.js";
import inquirer from "inquirer";
import process from "node:process";

class TsurukameApp {
  constructor() {
    this.questionmaker = new Questionmaker();
  }

  async selectMode(mode) {
    const prompt = this.#buildPrompt(mode);
    const selectedMode = await inquirer.prompt(prompt);
    this.#execute(selectedMode.mode);
  }

  #buildPrompt(mode) {
    const prompt = [
      {
        type: "list",
        name: "mode",
        message: "どのモードで遊びますか?",
      },
    ];

    if (mode === "menu") {
      prompt[0].choices = [
        { name: "つるかめ算の問題を解く(基本)", value: "basic" },
        { name: "終了する", value: "exit" },
      ];
    } else {
      prompt[0].choices = [
        { name: "同じモードで遊ぶ", value: mode },
        { name: "モード一覧に戻る", value: "menu" },
        { name: "終了する", value: "exit" },
      ];
    }

    return prompt;
  }

  #execute(mode) {
    switch (mode) {
      case "menu":
        this.#clearDisplay();
        this.selectMode("menu");
        break;
      case "basic":
        this.#executeBasic();
        break;
      case "exit":
        this.#exit();
        break;
    }
  }

  #clearDisplay() {
    console.clear();
  }

  async #executeBasic() {
    this.#clearDisplay();
    const question = this.questionmaker.create("basic");
    const questioner = new Questioner(question);
    await questioner.askQuestion();

    this.#insertBlankLine();
    this.selectMode("basic");
  }

  #exit() {
    this.#clearDisplay();
    console.log("遊んでくれてありがとう！またね👋");
  }

  #insertBlankLine() {
    process.stdout.write("\n");
  }
}

export { TsurukameApp };
