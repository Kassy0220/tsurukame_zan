import inquirer from "inquirer";
import process from "node:process";

class Questioner {
  constructor(question) {
    this.animals = question.animals;
    this.answers = question.answers;
    this.statement = question.statement;
  }

  async askQuestion(result = { correct: 0, incorrect: 0 }) {
    const firstAnimal = this.animals.first.name;
    const secondAnimal = this.animals.second.name;
    const firstCorrectAnswer = this.answers.first;
    const secondCorrectAnswer = this.answers.second;

    const questions = [
      {
        type: "input",
        name: "first",
        message: `${firstAnimal}の数 :`,
      },
      {
        type: "input",
        name: "second",
        message: `${secondAnimal}の数 :`,
      },
    ];

    console.log(this.statement);
    this.#insertBlankLine();

    const receivedAnswers = await inquirer.prompt(questions);
    const firstAnswer = Number(receivedAnswers.first);
    const secondAnswer = Number(receivedAnswers.second);

    this.#insertBlankLine();
    console.log(
      `(あなたの答え) ${firstAnimal} : ${firstAnswer}匹, ${secondAnimal} : ${secondAnswer}匹`
    );
    console.log(
      `(正解)         ${firstAnimal} : ${firstCorrectAnswer}匹, ${secondAnimal} : ${secondCorrectAnswer}匹`
    );
    this.#insertBlankLine();

    if (
      firstAnswer === firstCorrectAnswer &&
      secondAnswer === secondCorrectAnswer
    ) {
      console.log("正解です 🎉🎉🎉");
      result.correct++;
    } else {
      console.log("残念...不正解です");
      result.incorrect++;
    }
  }

  #insertBlankLine() {
    process.stdout.write("\n");
  }
}

export { Questioner };
