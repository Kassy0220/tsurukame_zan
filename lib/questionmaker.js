import { animals } from "./animals.js";

class Questionmaker {
  constructor(maxOfAnswer = 20) {
    this.question = {};
    this.maxOfAnswer = maxOfAnswer;
  }

  create(mode) {
    if (mode === "basic") {
      this.question.animals = { first: animals[0], second: animals[1] };
    }

    this.#createAnswers();
    this.#createStatement();
    return this.question;
  }

  #createAnswers() {
    this.question.answers = {
      first: this.#setRandomValue(this.maxOfAnswer),
      second: this.#setRandomValue(this.maxOfAnswer),
    };
  }

  #setRandomValue(max) {
    return Math.floor(Math.random() * max + 1);
  }

  #createStatement() {
    const animals = this.question.animals;
    const answer = this.question.answers;

    const firstAnimal = animals.first.name;
    const firstAnimalLegs = animals.first.legs;
    const secondAnimal = animals.second.name;
    const secondAnimalLegs = animals.second.legs;
    const totalNumber = answer.first + answer.second;
    const totalLegs =
      firstAnimalLegs * answer.first + secondAnimalLegs * answer.second;

    this.question.statement = `( 問題 )
${firstAnimal}と${secondAnimal}が合わせて${totalNumber}匹います。
足の数が全部で${totalLegs}本の時、${firstAnimal}と${secondAnimal}はそれぞれ何匹いるでしょうか？
ただし、${firstAnimal}の足の数は${firstAnimalLegs}本、${secondAnimal}の足の数は${secondAnimalLegs}本とします。`;
  }
}

export { Questionmaker };
