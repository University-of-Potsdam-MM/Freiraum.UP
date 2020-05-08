import {
  AfterViewInit,
  Component, OnInit
} from '@angular/core';
import {Storage} from '@ionic/storage';
import {BasicPageComponent} from "../../components/basic-page/basic-page.component";

interface Rect {
  isTarget: boolean;
  clicked: boolean;
  animations: string;
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function range(start, end) {
  return Array.from(
    {length: (end - start)},
    (v, k) => k + start
  );
}

function createRects(rows: number, cols: number, nTargets: number): Rect[][] {
  const finalRects: Rect[][] = [];
  let rects: Rect[] = [];
  const n = rows * cols;
  const threshold = n - nTargets;

  for (const i of range(0, n)) {
    rects.push({
      isTarget: i > threshold,
      clicked: false,
      animations: ''
    });
  }
  rects = shuffle(rects);

  let temp = [];
  for (let i = 0; i <= n; i++) {
    if (i % cols === 0 && i > 0) {
      finalRects.push(temp);
      temp = [];
    }
    temp.push(rects[i]);
  }

  return finalRects;
}

interface Difficulty {
  rows: number;
  cols: number;
  nTargets: number;
}

enum GameState {
  NOT_STARTED, STARTED, ENDED
}

/**
 * Generated class for the ReactionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-game',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent extends BasicPageComponent implements OnInit {

  states = GameState;
  currenState: GameState = this.states.NOT_STARTED;
  currentDifficulty: Difficulty;
  currentTargetRects = 0;
  rects: Rect[][] = [];
  score = 0;
  highscores: number[] = [];
  timeLeft = 5000;
  timer;
  penalty = 500;
  bonus = 2000;

  animationCorrect = 'animated zoomOut faster';
  animationsWrong = 'animated shake fast';

  constructor(private storage: Storage) { super('game'); }

  ngOnInit(): void {
    // this.events.subscribe(
    //   'reset',
    //   () => {
    //     this.reset();
    // });

    try {
      this.storage.get('highscores').then(
        highscores => {
          if (highscores == null) {
            this.highscores = [];
          } else {
            this.highscores = highscores;
          }
        }
      );
    } catch (e) {
      this.logger.info('Could not get highscores');
    }
  }

  startTimer() {
    this.timer = setInterval(
      () => {
        if (this.timeLeft > 0) {
          this.timeLeft -= 100;
        } else {
          //  game over
          this.stopTimer();
          this.gameOver();
        }
      },
      100
    );
  }

  stopTimer() {
    clearInterval(this.timer);
    this.timer = null;
  }

  startGame() {
    this.currenState = this.states.STARTED;
    this.currentDifficulty = {
      cols: 4,
      rows: 4,
      nTargets: 3
    };
    this.newLevel();
    this.startTimer();
  }

  increaseDifficulty() {
    this.currentDifficulty = {
      rows: this.currentDifficulty.rows === 5
            ? this.currentDifficulty.rows
            : this.currentDifficulty.rows + 1,
      cols: this.currentDifficulty.cols + 1,
      nTargets: this.currentDifficulty.nTargets === 1
              ? this.currentDifficulty.nTargets
              : this.currentDifficulty.nTargets + 1
    };
  }

  newLevel() {
    this.rects = createRects(
      this.currentDifficulty.rows,
      this.currentDifficulty.cols,
      this.currentDifficulty.nTargets
    );
    this.currentTargetRects = this.currentDifficulty.nTargets - 1;
  }

  checkLevel() {
    if (this.currentTargetRects === 0) {
      this.increaseDifficulty();
      this.timeLeft += this.bonus;
      this.newLevel();
    }
  }

  clicked(rect: Rect, event) {
    // event.stopPropagation();
    // event.preventDefault();
    rect.clicked = true;
    if (rect.isTarget) {
      this.score++;
      this.currentTargetRects--;
      rect.animations = this.animationCorrect;
      this.checkLevel();
    } else {
      rect.animations = this.animationsWrong;
      setTimeout(() => {rect.animations = ''; }, 500);
      this.timeLeft -= this.penalty;
    }
  }

  storeScore() {
    this.highscores.push(this.score);
    this.highscores.sort((a, b) => b - a);
    try {
      this.storage.set('highscores', this.highscores);
    } catch (e) {
      this.logger.info('Could not store highscores');
    }
  }

  gameOver() {
    this.currenState = this.states.ENDED;
    this.storeScore();
  }

  reset() {
    this.stopTimer();
    this.currenState = this.states.NOT_STARTED;
    this.timeLeft = 5000;
    this.score = 0;
  }
}
