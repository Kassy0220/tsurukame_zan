import { Questionmaker } from "./questionmaker.js";
import { Questioner } from "./questioner.js";
import inquirer from "inquirer";
import chalk from "chalk";
import process from "node:process";
import * as fs from "node:fs";
import * as readline from "node:readline";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

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
        { name: "つるかめ算の問題を解く(応用)", value: "applied" },
        { name: "タイムアタックに挑戦する", value: "timeAttack" },
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
      case "applied":
        this.#executeApplication();
        break;
      case "timeAttack":
        this.#executeTimeAttack();
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

  async #executeApplication() {
    this.#clearDisplay();
    const question = this.questionmaker.create("applied");
    const questioner = new Questioner(question);
    await questioner.askQuestion();

    this.#insertBlankLine();
    this.selectMode("applied");
  }

  async #executeTimeAttack() {
    this.#clearDisplay();
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const recordPath = path.join(__dirname, "timeAttackScore.json");
    const record = JSON.parse(fs.readFileSync(recordPath, "utf-8"));
    const highscore = record.highscore;
    const description = `[ タイムアタックの説明 ]

タイムアタックは、つるかめ算の問題をできるだけ早く解くモードです。
5問正解するまでにかかった時間がスコアになります。

解答を間違えると、間違えた数 x 5秒 スコアに加算されるので注意してください。
Enter を押すとタイムアタックが始まります。

現在のハイスコア : ${chalk.yellowBright(highscore)}秒`;

    console.log(description);
    process.stdin.resume();
    await this.#waitUntilPressEnter();
    this.#timeAttack(record, highscore, recordPath);
  }

  #waitUntilPressEnter() {
    return new Promise((resolve) => {
      readline.emitKeypressEvents(process.stdin);
      if (process.stdin.isTTY) process.stdin.setRawMode(true);

      process.stdin.on("keypress", (_, key) => {
        if (key.name === "return") {
          process.stdin.setRawMode(false);
          resolve();
        }
      });
    });
  }

  async #timeAttack(record, highscore, recordPath) {
    const result = { correct: 0, incorrect: 0 };
    const startTime = new Date();

    while (result.correct < 5) {
      console.clear();
      const question = this.questionmaker.create("timeAttack");
      const questioner = new Questioner(question);
      await questioner.askQuestion(result);
      await this.#sleep(1500);
    }

    const finishTime = new Date();
    const clearTime = Math.floor(
      (finishTime.getTime() - startTime.getTime()) / 1000
    );
    const penalty = result.incorrect * 5;
    const score = clearTime + penalty;

    const resultTemplate = `終了です！

    [ 結果 ]

クリアタイム   :  ${clearTime}秒
ミス(x5秒)     : +${penalty.toString().padStart(2)}秒
${chalk.yellow(`スコア         :  ${score}秒`)}
`;

    console.clear();
    console.log(resultTemplate);
    if (score < highscore) {
      console.log(`${chalk.bgMagenta("ハイスコア更新です！")}🎉`);
      record.highscore = score;
      fs.writeFileSync(recordPath, JSON.stringify(record), "utf-8");
    }

    this.#insertBlankLine();
    this.selectMode("timeAttack");
  }

  #sleep(waitTime) {
    return new Promise((resolve) => setTimeout(resolve, waitTime));
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
