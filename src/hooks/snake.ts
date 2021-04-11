import { ref, reactive, onUnmounted, watchEffect, computed } from "vue";
import { babelParse } from "@vue/compiler-sfc";

type KeyEvent = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";
type GrowDirection = "pop" | "shift";

interface Point {
  x: number;
  y: number;
}

const isArrowKey = (key: string): key is KeyEvent => {
  switch (key) {
    case "ArrowUp":
    case "ArrowDown":
    case "ArrowLeft":
    case "ArrowRight":
      return true;
    default:
      return false;
  }
};

const generatePoint = (max: number) => {
  const x = Math.floor(Math.random() * max);
  const y = Math.floor(Math.random() * max);
  return [x, y];
};

export const useSnake = (_size = 8) => {
  const size = ref(_size);

  const snakePoint = reactive<Point>({
    x: 0,
    y: 0,
  });

  const foodPoint = reactive<Point>({
    x: -1,
    y: -1,
  });

  const bodyPoints = reactive<Point[]>([]);

  const _spawnFood = () => {
    const [x, y] = generatePoint(size.value);
    foodPoint.x = x;
    foodPoint.y = y;
  };

  const _currentDuration = ref<KeyEvent>("ArrowDown");
  const _setCurrentDuration = (key: KeyEvent) => {
    _currentDuration.value = key;
  };

  const init = () => {
    _spawnFood();

    window.addEventListener("keyup", (e: KeyboardEvent) => {
      if (isArrowKey(e.key)) {
        _setCurrentDuration(e.key);
      }
    });
    setInterval(() => {
      // 移動前に snake の末尾の地点を保存する
      const snakeTail = bodyPoints[0] || snakePoint;
      const lastTailPoint = snakeTail;

      // snake が移動する
      _moveSnakceController(_currentDuration.value);

      // 移動した先に food が存在した場合
      if (judgeFeeding()) {
        _growSnakeBody(lastTailPoint);
        _spawnFood();
        _recordSnakeBodyHisotry("pop");
      } else {
        _recordSnakeBodyHisotry("shift");
      }
    }, 500);
  };

  const _growSnakeBody = (point: Point) => {
    bodyPoints.push({ ...point });
  };

  const _recordSnakeBodyHisotry = (direction: GrowDirection) => {
    switch (direction) {
      case "shift":
        bodyPoints.shift();
        break;
      case "pop":
        bodyPoints.pop();
        break;
    }
    _growSnakeBody(snakePoint);
  };

  const judgeFeeding = () => {
    // snake と food が重なった時
    return snakePoint.x === foodPoint.x && snakePoint.y === foodPoint.y;
  };

  const _moveSnakceController = (key: KeyEvent) => {
    switch (key) {
      case "ArrowUp":
        _moveSnake(0, -1);
        break;
      case "ArrowDown":
        _moveSnake(0, 1);
        break;
      case "ArrowLeft":
        _moveSnake(-1, 0);
        break;
      case "ArrowRight":
        _moveSnake(1, 0);
        break;
    }
  };

  const _checkLimit = (value: number) => {
    if (value < 0) {
      return 0;
    }
    if (value > size.value - 1) {
      return size.value - 1;
    }
    return value;
  };

  const _moveSnake = (axisX: number, axisY: number) => {
    // 次のポイントへ移動する
    snakePoint.x = _checkLimit(snakePoint.x + axisX);
    snakePoint.y = _checkLimit(snakePoint.y + axisY);
  };

  const isLocationingSnake = (x: number, y: number) => {
    return x === snakePoint.x && y === snakePoint.y;
  };
  const isLocationingFood = (x: number, y: number) => {
    return x === foodPoint.x && y === foodPoint.y;
  };
  const isLocationAnyBody = (x: number, y: number) => {
    return bodyPoints.find(
      (bodyPoint) => bodyPoint.x === x && bodyPoint.y === y
    );
  };

  return {
    init,
    snakePoint,
    foodPoint,
    bodyPoints,
    size,
    isLocationingSnake,
    isLocationingFood,
    isLocationAnyBody,
  };
};
