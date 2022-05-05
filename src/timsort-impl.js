import * as d3 from "d3";
import { WELCOME_TEXT, EDITOR, MINRUN_TEXT, MINRUN_CHANGE_TEXT, INSERTION_SORT_TEXT, MERGE_ARRAYS_TEXT } from "./const";
import { array_commands, sort } from "./timsort";

EDITOR.doc.setValue(WELCOME_TEXT);

let multipleSpeedAlgo = 0.5;
let countCompares = 0;

document.addEventListener("DOMContentLoaded", function () {
  var scrollbar = document.body.clientWidth - window.innerWidth + 'px';
  document.querySelector('[href="#openModal"]').addEventListener('click', function () {
    document.body.style.overflow = 'hidden';
    document.querySelector('#openModal').style.marginLeft = scrollbar;
  });
  document.querySelector('[href="#close"]').addEventListener('click', function () {
    document.body.style.overflow = 'visible';
    document.querySelector('#openModal').style.marginLeft = '0px';
  });
});

function minrunChangeCodeAndHint(lengthOfArrayValue, evenValue) {
  var text = "int minimum_run_length = 32;\n\n" +
    "int findLengthOfMinrun(int length_of_array) {\n" +
    "    int even = 0;\n" +
    "    while (length_of_array >= minimum_run_length) {\n" +
    "        if (length_of_array % 2 == 1) { even = 1; } // even = " + evenValue + "\n" +
    "        length_of_array /= 2; // length_of_array = " + lengthOfArrayValue + "\n" +
    "    }\n" +
    "\n" +
    "    return length_of_array + even;\n" +
    "}";

    EDITOR.doc.setValue(text);
}

function changeTextHint(newText) {
  document.getElementById("hint").innerHTML = newText;
}

let data = new Array();
let data_sort = new Array();

function setDefaultColorAllColumns() {
  for (let i = 0; i < data.length; ++i) {
    document.getElementById(String(i)).style.fill = "#ba40db";
  }
}

var widthMain = (document.documentElement.clientWidth - 100);
var heightMain = (document.documentElement.clientHeight - 100) / 2;

var xScaleMain = d3.scaleBand()
  .domain(d3.range(data.length))
  .rangeRound([0, widthMain])
  .paddingInner(0.05);

var yScaleMain = d3.scaleLinear()
  .domain([0, d3.max(data)])
  .range([0, heightMain]);

var svgMain = d3.select("body")
  .append("svg")
  .attr("width", widthMain)
  .attr("height", heightMain);

function drawMain() {
  const bars = svgMain.selectAll('.bar').data(data);

  bars
    .enter()
    .append("rect")
    .attr('class', 'bar')
    .style("fill", "#ba40db")
    .attr('id', function (d, i) {
      return i;
    })
    .attr("x", function (d, i) {
      return xScaleMain(i);
    })
    .attr("y", function (d) {
      return heightMain - yScaleMain(d);
    })
    .attr("width", xScaleMain.bandwidth())
    .attr("height", function (d) {
      return yScaleMain(d);
    });


  const texts = svgMain.selectAll("text").data(data);

  texts
    .enter()
    .append("text")
    .text(function (d) {
      return d;
    })
    .attr("x", function (d, i) {
      return xScaleMain(i) + xScaleMain.bandwidth() / 2;
    })
    .attr("y", function (d) {
      return heightMain - yScaleMain(d) - 10;
    })
    .attr("font-family", "monospace")
    .attr("font-size", "20px")
    .attr("fill", "black")
    .attr("text-anchor", "middle");
}

function changeDrawMain() {
  const bars = svgMain.selectAll('.bar').data(data);

  //build bars
  const addBars = bars
    .enter()
    .append("rect")
    .attr("x", function (d, i) {
      return xScaleMain(i);
    })
    .attr("y", function (d) {
      return heightMain - yScaleMain(d);
    })
    .attr("width", xScaleMain.bandwidth())
    .attr("height", function (d) {
      return yScaleMain(d);
    });


  addBars.merge(bars)
    .attr("y", function (d) {
      return heightMain - yScaleMain(d);
    })
    .attr("height", function (d) {
      return yScaleMain(d);
    });

  const texts = svgMain.selectAll("text").data(data);
  const addTexts = texts
    .enter()
    .append("text")
    .text(function (d) {
      return d;
    })
    .attr("x", function (d, i) {
      return xScaleMain(i) + xScaleMain.bandwidth() / 2;
    })
    .attr("y", function (d) {
      return heightMain - yScaleMain(d) - 10;
    })
    .attr("font-family", "monospace")
    .attr("font-size", "20px")
    .attr("fill", "black")
    .attr("text-anchor", "middle");

  addTexts.merge(texts)
    .text(function (d) {
      return d;
    })
    .attr("x", function (d, i) {
      return xScaleMain(i) + xScaleMain.bandwidth() / 2;
    })
    .attr("y", function (d) {
      return heightMain - yScaleMain(d) - 10;
    });
}

function swapBars(firstColumnIndex, secondColumIndex) {
  let firstBarValue = data[firstColumnIndex];
  data[firstColumnIndex] = data[secondColumIndex];
  data[secondColumIndex] = firstBarValue;

  changeDrawMain();
}

var widthMerge = (document.documentElement.clientWidth - 100);
var heightMerge = (document.documentElement.clientHeight - 100) / 2;

var dataMerge = new Array();

var xScaleMerge = d3.scaleBand()
  .domain(d3.range(dataMerge.length))
  .rangeRound([0, widthMerge])
  .paddingInner(0.05);

var yScaleMerge = d3.scaleLinear()
  .domain([0, d3.max(dataMerge)])
  .range([0, heightMerge]);

var svgMerge = d3.select("body")
  .append("svg")
  .attr("width", widthMerge)
  .attr("height", heightMerge);

function drawMerge() {
  const bars = svgMerge.selectAll('.bar').data(dataMerge);

  bars
    .enter()
    .append("rect")
    .attr('class', 'bar')
    .style("fill", "#1a94bd")
    .attr('id', function (d, i) {
      return "m" + i;
    })
    .attr("x", function (d, i) {
      return xScaleMerge(i);
    })
    .attr("y", function (d) {
      return heightMerge - yScaleMerge(d);
    })
    .attr("width", xScaleMerge.bandwidth())
    .attr("height", function (d) {
      return yScaleMerge(d);
    });


  const texts = svgMerge.selectAll("text").data(dataMerge);

  texts
    .enter()
    .append("text")
    .text(function (d) {
      return d;
    })
    .attr("x", function (d, i) {
      return xScaleMerge(i) + xScaleMerge.bandwidth() / 2;
    })
    .attr("y", function (d) {
      return heightMerge - yScaleMerge(d) - 10;
    })
    .attr("font-family", "monospace")
    .attr("font-size", "20px")
    .attr("fill", "black")
    .attr("text-anchor", "middle");
}

function changeDrawMerge() {
  const bars = svgMerge.selectAll('.bar').data(dataMerge);

  const addBars = bars
    .enter()
    .append("rect")
    .attr("x", function (d, i) {
      return xScaleMerge(i);
    })
    .attr("y", function (d) {
      return heightMerge - yScaleMerge(d);
    })
    .attr("width", xScaleMerge.bandwidth())
    .attr("height", function (d) {
      return yScaleMerge(d);
    });


  addBars.merge(bars)
    .transition()
    .duration(1000)
    .attr("y", function (d) {
      return heightMerge - yScaleMerge(d);
    })
    .attr("height", function (d) {
      return yScaleMerge(d);
    });

  const texts = svgMerge.selectAll("text").data(dataMerge);
  const addTexts = texts
    .enter()
    .append("text")
    .text(function (d) {
      return d;
    })
    .attr("x", function (d, i) {
      return xScaleMerge(i) + xScaleMerge.bandwidth() / 2;
    })
    .attr("y", function (d) {
      return heightMerge - yScaleMerge(d) - 10;
    })
    .attr("font-family", "monospace")
    .attr("font-size", "20px")
    .attr("fill", "black")
    .attr("text-anchor", "middle");

  addTexts.merge(texts)
    .transition()
    .duration(1000)
    .text(function (d) {
      return d;
    })
    .attr("x", function (d, i) {
      return xScaleMerge(i) + xScaleMerge.bandwidth() / 2;
    })
    .attr("y", function (d) {
      return heightMerge - yScaleMerge(d) - 10;
    });
}

function onlyNumbers(str) {
  str = str.replace(/\s+/g, '');
  return /^[0-9]+$/.test(str);
}

document.addEventListener("DOMContentLoaded", function () {
  var timeouts = [];
  var slider = document.getElementById("myRange");
  multipleSpeedAlgo = 3 - (slider.value / 10);

  slider.oninput = function () {
    multipleSpeedAlgo = 3 - (this.value / 10);
  }

  let newIter = 0;
  let iter = 0;
  let minindexStep = 0;
  
  document.getElementById("bestCaseSort").onclick = function () {
    document.getElementById('dataInput').value = "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52";
  }

  document.getElementById("middleCaseSort").onclick = function () {
    document.getElementById('dataInput').value = "16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1 32 31 30 29 28 27 26 25 24 23 22 21 20 19 18 17";
  }

  document.getElementById("worstCaseSort").onclick = function () {
    document.getElementById('dataInput').value = "16 15 22 14 1 17 13 12 11 3 2 11 32 10 9 64 12 3 22 89 22 8 7 44 6 55 5 4 32 5 7 22 3 18 23 2 65 13 32 59 16 4 2 53 3 55 13 4 7 21";
  }

  document.getElementById("randomCaseSort").onclick = function () {
    document.getElementById('dataInput').value = "1 15 2 13 3 12 13 11 4 9 14 9 10 11 12 13 14 15 7 12 13 14 48 4 16 5 98 15 7 46 47 48 4 16 5 10 3 3 46 47 48 4 16 5 10 3 3 14 15 16 5 8 17 99 19 15 78 16 17 32 33 34 35 56 36 37 3 20 21 12 1";
  }

  function disableButton(buttonId) {
    document.getElementById(buttonId).classList.remove("button");
    document.getElementById(buttonId).classList.remove("button5");
    document.getElementById(buttonId).classList.add("buttonDisable");
    document.getElementById(buttonId).disabled = true;
  }

  function enableButton(buttonId) {
    document.getElementById(buttonId).classList.remove("buttonDisable");
    document.getElementById(buttonId).classList.add("button");
    document.getElementById(buttonId).classList.add("button5");
    document.getElementById(buttonId).disabled = false;
  }

  function disableButtonsBeforeStartSort() {
    disableButton("resetSort");
    disableButton("backStepSort");
    disableButton("forwardStepSort");
    disableButton("endSort");
  }

  function disableButtonsStartSortWithAuto() {
    enableButton("resetSort");
    enableButton("endSort");

    disableButton("startSort");
    disableButton("settings");
    disableButton("bestCaseSort");
    disableButton("middleCaseSort");
    disableButton("worstCaseSort");
    disableButton("randomCaseSort");
  }

  function disableButtonsStartSortWithoutAuto() {
    enableButton("resetSort");
    enableButton("endSort");
    enableButton("forwardStepSort");
    enableButton("backStepSort");

    disableButton("startSort");
    disableButton("settings");
    disableButton("bestCaseSort");
    disableButton("middleCaseSort");
    disableButton("worstCaseSort");
    disableButton("randomCaseSort");
  }

  disableButtonsBeforeStartSort();

  function showProgressSort(currentStep) {
    let valueProgress = Math.trunc((100 * currentStep / array_commands.length) / 10);
    let stringProgress = "#".repeat(valueProgress);
    stringProgress += ".".repeat(10 - valueProgress);
    document.getElementById("progressSort").innerHTML = "[" + stringProgress + "] " + (100 * currentStep / array_commands.length).toFixed(2) + "%, $=" + countCompares;
  }

  function stepSortShow(i, flagBack) {
    let command = array_commands[i].split(' ');
    showProgressSort(i);
    if (command[0] == "CHECK") {
      if (flagBack) {
        --countCompares;
      } else {
        ++countCompares;
      }
      changeTextHint("Сравниваем столбец со значением " + data[command[1]] + " слева и столбец со значнием " + data[command[2]] + " справа!");
      setDefaultColorAllColumns();

      document.getElementById(String(command[1])).style.fill = "red";
      document.getElementById(String(command[2])).style.fill = "#ff7912";
    }
    else if (command[0] == "SWAP") {
      if (flagBack) {
        changeTextHint("Меняем местами столбцы, так как " + data[command[1]] + " меньше " + data[command[2]] + "!");
      } else {
        changeTextHint("Меняем местами столбцы, так как " + data[command[2]] + " меньше " + data[command[1]] + "!");
      }
      swapBars(command[1], command[2]);
    } else if (command[0] == "MOVE") {
      if (command[3] == "ONE") {
        changeTextHint("Выбираем столбец со значением " + command[2] + " потому что оно меньше или равно значению в сравниваемом столбце!");
      } else if (command[3] == "ALL") {
        changeTextHint("Переносим все столбцы подряд, так как элементы в одном подмассиве закончились!");
      } else if (command[3] == "GALOP") {
        changeTextHint("Используем метод галопа и переносим все столбцы подряд не используя сравнение!");
      }

      if (!flagBack) {
        dataMerge[newIter++] = data[command[1]];
        changeDrawMerge();
        data[command[1]] = 0;
        changeDrawMain();
      } else {
        data[command[1]] = command[2];
        changeDrawMain();
        let index = 0;
        for (let i = 0; i < dataMerge.length; ++i) {
          if (dataMerge[i] == 0) {
            index = i;
            break
          }
        }
        if (index == 0) {
          index = dataMerge.length;
        }
        dataMerge[index - 1] = 0;
        --newIter;
        changeDrawMerge();
      }
    } else if (command[0] == "START_GALOP") {
      if (command[1] = "LEFT") {
        changeTextHint("Данный метод позволяет сократить число сравнений. Из левой части массивы мы взяли несколько элементов подряд, логично предположить, что дальше тенденция сохранится, поэтому с помощью бинарного поиска мы находим значение = " + command[2] + " и будем брать до него все столбцы не сравнивая со столбцами правого подмассива!");
      }
      if (command[1] == "RIGHT") {
        changeTextHint("Данный метод позволяет сократить число сравнений. Из правой части массивы мы взяли несколько элементов подряд, логично предположить, что дальше тенденция сохранится, поэтому с помощью бинарного поиска мы находим значение = " + command[2] + " и будем брать до него все столбцы не сравнивая со столбцами левого подмассива!");
      }
    } else if (command[0] == "MERGE") {
      changeTextHint("Начинаем выполнять сортировку слиянием!");
      EDITOR.doc.setValue(MERGE_ARRAYS_TEXT);
    } else if (command[0] == "TIMSORT") {
      changeTextHint("Приготовься, мы начинаем! 3..2..1... Обращай внимание на число сравнений в правом нижнем углу, чем их меньше - тем лучше!");
      EDITOR.doc.setValue(MINRUN_TEXT);
    } else if (command[0] == "BINARY") {
      changeTextHint("Начинаем сортировать подмассив!");
      EDITOR.doc.setValue(INSERTION_SORT_TEXT);
    } else if (command[0] == "MERGE_END") {
      changeTextHint("Эти подмассивы успешно соединили, идем дальше!");
      newIter = 0;
      minindexStep = i;
      EDITOR.doc.setValue(INSERTION_SORT_TEXT);
      for (let j = command[1], k = 0; j <= command[2]; ++j, ++k) {
        data[j] = dataMerge[k];
        dataMerge[k] = 0;
      }
      changeDrawMerge();
      changeDrawMain();
    } else if (command[0] == "TIMSORT_END") {
      setDefaultColorAllColumns();
      showProgressSort(array_commands.length);
      disableButton("endSort");
      disableButton("backStepSort");
      disableButton("forwardStepSort");
      changeTextHint("Сортировка успешно выполнена, для того, чтобы выполнить сортировку еще раз нажмите кнопку 'Заново'!");
    } else if (command[0] == "END_BINARY") {
      changeTextHint("Этот подмассив успешно отсортировали, идем дальше!");
      setDefaultColorAllColumns();
    } else if (command[0] == "WITHOUT_MINRUN") {
      changeTextHint("Как и упоминалось раньше, для выполнения Timsort, по специальному алгоритму массив разделяется на подмассивы, но так как вы ввели всего " + command[1] + " элемента будет применена простая сортировка вставками. Чтобы увидеть всю мощь Timsort введите хотя бы 32 элемента!");
    } else if (command[0] == "WITH_MINRUN") {
      timeouts.push(setTimeout(() => {
        changeTextHint("Настало время чтобы найти специальное число, по которому мы будем делить наш массив на подмассивы. Давайте посмотрим на код в окне слева!");
      }, 1000 * (i) * multipleSpeedAlgo));
    } else if (command[0] == "WITH_MINRUN_CHANGE") {
      EDITOR.doc.setValue(MINRUN_CHANGE_TEXT);
      changeTextHint("Можно заметить, что в коде присутствуют какие-то сдвиги, логические операции, да и вообще под капотом преобразование десятичных чисел в двоичные числа! Попробуем упростить код и заменим данные операции на более привычные нам.");
    } else if (command[0] == "WITH_MINRUN_HINT") {
      changeTextHint("Согласно утверждениям Тима Петерса наиболее оптимально выбирать длину для подмассивов в диапазоне (32; 64], так как для сортировки вставками массив не должен быть слишком большой, а для сортировки слиянием он не должен быть слишком маленьким. Мы будем использовать диапазон (16; 32] чтобы несколько подмассивов помещались на экране. Если код не очень понятен: исходную длину массива будем делить на 2 до тех пор, пока не попадем в нужный интервал.");
    } else if (command[0] == "MINRUN_START") {
      changeTextHint("Начинаем вычисление размера минимальной длины подмассива. Количество элементов в массиве = " + data.length);
    } else if (command[0] == "MINRUN_ITER") {
      changeTextHint("Итерация в цикле while! Результат: минимальный размер пробега = " + command[1] + ", значение четности = " + command[2]);
      minrunChangeCodeAndHint(command[1], command[2]);
    } else if (command[0] == "MINRUN_END") {
      changeTextHint("Число " + command[1] + " попадает в интервал (16; 32], а значит минимальный размер пробега для подмассивов будет = " + command[1] + ". Переходим к сортировкам!");
    }
  }

  function resetSortFunc() {
    location.reload();
  }

  document.getElementById("resetSort").onclick = function () {
    for (var i = 0; i < timeouts.length; i++) {
      clearTimeout(timeouts[i]);
    }
    resetSortFunc();
  }

  document.getElementById("endSort").onclick = function () {
    setDefaultColorAllColumns();
    data = data_sort;
    dataMerge = new Array(data.length).fill(0);
    for (var i = 0; i < timeouts.length; i++) {
      clearTimeout(timeouts[i]);
    }
    changeDrawMain();
    changeDrawMerge();
    showProgressSort(array_commands.length);
    changeTextHint("Сортировка успешно выполнена, для того, чтобы выполнить сортировку еще раз нажмите кнопку 'Заново'!");
    disableButton("endSort");
    disableButton("forwardStepSort");
    disableButton("backStepSort");
  }

  document.getElementById("startSort").onclick = function () {
    document.getElementById("endSort").disabled = false;
    if (!onlyNumbers(dataInput.value)) {
      changeTextHint("Массив должен состоять из натуральных чисел!");
      return;
    }

    data = dataInput.value.split(" ").map(item => parseInt(item));
    data_sort = data.slice();

    for (let i = 0; i < data.length; ++i) {
      if (!Number.isInteger(data[i]) || data[i] <= 0 || data[i] > 1000) {
        changeTextHint("Массив должен состоять из натуральных чисел от 1 до 999!");
        return;
      }
    }

    if (data.length < 5) {
      changeTextHint("Необходимо ввести хотя бы 5 чисел!");
      return;
    }

    if (data.length > 256) {
      changeTextHint("Необходимо ввести не более 256 чисел!");
      return;
    }

    document.getElementById("startSort").disabled = true;
    widthMain = (document.documentElement.clientWidth - 100);
    heightMain = (document.documentElement.clientHeight - 100) / 2;

    if (widthMain / data.length <= 50) {
      widthMain = data.length * 52;
    }

    svgMain
      .attr("width", widthMain);

    xScaleMain = d3.scaleBand()
      .domain(d3.range(data.length))
      .rangeRound([0, widthMain])
      .paddingInner(0.05);

    yScaleMain = d3.scaleLinear()
      .domain([0, d3.max(data) + (d3.max(data) / 10)])
      .range([0, heightMain]);

    drawMain();

    dataMerge = new Array(data.length).fill(0);

    svgMerge
      .attr("width", widthMain);

    xScaleMerge = d3.scaleBand()
      .domain(d3.range(data.length))
      .rangeRound([0, widthMain])
      .paddingInner(0.05);

    yScaleMerge = d3.scaleLinear()
      .domain([0, d3.max(data) + (d3.max(data) / 10)])
      .range([0, heightMain]);

    drawMerge();

    sort(data.slice());
    data_sort.sort(function (a, b) {
      return a - b;
    })

    var checkedBox = document.getElementById("checkAuto");
    if (checkedBox.checked) {
      disableButtonsStartSortWithAuto();
      for (let i = 0; i < array_commands.length; ++i) {
        timeouts.push(setTimeout(() => {
          showProgressSort(i);
        }, 1000 * (i) * multipleSpeedAlgo));
        let command = array_commands[i].split(' ')
        if (command[0] == "CHECK") {
          timeouts.push(setTimeout(() => {
            ++countCompares;
            changeTextHint("Сравниваем столбец со значением " + data[command[1]] + " слева и столбец со значнием " + data[command[2]] + " справа!");
            setDefaultColorAllColumns();

            document.getElementById(String(command[1])).style.fill = "red";
            document.getElementById(String(command[2])).style.fill = "#ff7912";
          }, 1000 * (i) * multipleSpeedAlgo));
        }
        else if (command[0] == "SWAP") {
          timeouts.push(setTimeout(() => {
            changeTextHint("Меняем местами столбцы, так как " + data[command[2]] + " меньше " + data[command[1]] + "!");
            swapBars(command[1], command[2]);
          }, 1000 * (i) * multipleSpeedAlgo));
        } else if (command[0] == "MOVE") {
          timeouts.push(setTimeout(() => {
            if (command[3] == "ONE") {
              changeTextHint("Выбираем столбец со значением " + command[2] + " потому что оно меньше или равно значению в сравниваемом столбце!");
            } else if (command[3] == "ALL") {
              changeTextHint("Переносим все столбцы подряд, так как элементы в одном подмассиве закончились!");
            } else if (command[3] == "GALOP") {
              changeTextHint("Используем метод галопа и переносим все столбцы подряд не используя сравнение!");
            }

            dataMerge[iter++] = data[command[1]];
            changeDrawMerge();
            data[command[1]] = 0;
            changeDrawMain();
          }, 1000 * (i) * multipleSpeedAlgo));
        } else if (command[0] == "START_GALOP") {
          timeouts.push(setTimeout(() => {
            if (command[1] = "LEFT") {
              changeTextHint("Данный метод позволяет сократить число сравнений. Из левой части массивы мы взяли несколько элементов подряд, логично предположить, что дальше тенденция сохранится, поэтому с помощью бинарного поиска мы находим значение = " + command[2] + " и будем брать до него все столбцы не сравнивая со столбцами правого подмассива!");
            }
            if (command[1] == "RIGHT") {
              changeTextHint("Данный метод позволяет сократить число сравнений. Из правой части массивы мы взяли несколько элементов подряд, логично предположить, что дальше тенденция сохранится, поэтому с помощью бинарного поиска мы находим значение = " + command[2] + " и будем брать до него все столбцы не сравнивая со столбцами левого подмассива!");
            }
          }, 1000 * (i) * multipleSpeedAlgo));
        } else if (command[0] == "MERGE") {
          timeouts.push(setTimeout(() => {
            changeTextHint("Начинаем выполнять сортировку слиянием!");
            EDITOR.doc.setValue(MERGE_ARRAYS_TEXT);
          }, 1000 * (i) * multipleSpeedAlgo));
        } else if (command[0] == "TIMSORT") {
          timeouts.push(setTimeout(() => {
            changeTextHint("Приготовься, мы начинаем! 3..2..1... Обращай внимание на число сравнений в правом нижнем углу, чем их меньше - тем лучше");
            EDITOR.doc.setValue(MINRUN_TEXT);
          }, 1000 * (i) * multipleSpeedAlgo));
        } else if (command[0] == "BINARY") {
          timeouts.push(setTimeout(() => {
            changeTextHint("Начинаем сортировать подмассив!");
            EDITOR.doc.setValue(INSERTION_SORT_TEXT);
          }, 1000 * (i) * multipleSpeedAlgo));
        } else if (command[0] == "MERGE_END") {
          timeouts.push(setTimeout(() => {
            changeTextHint("Эти подмассивы успешно соединили, идем дальше!");
            setDefaultColorAllColumns();
            iter = 0;
            EDITOR.doc.setValue(INSERTION_SORT_TEXT);
            for (let j = command[1], k = 0; j <= command[2]; ++j, ++k) {
              data[j] = dataMerge[k];
              dataMerge[k] = 0;
            }
            changeDrawMerge();
            changeDrawMain();
          }, 1000 * (i) * multipleSpeedAlgo));
        } else if (command[0] == "TIMSORT_END") {
          timeouts.push(setTimeout(() => {
            setDefaultColorAllColumns();
            disableButton("endSort");
            showProgressSort(array_commands.length);
            changeTextHint("Сортировка успешно выполнена, для того, чтобы выполнить сортировку еще раз нажмите кнопку 'Заново'!");
          }, 1000 * (i) * multipleSpeedAlgo));
        } else if (command[0] == "END_BINARY") {
          timeouts.push(setTimeout(() => {
            changeTextHint("Этот подмассив успешно отсортировали, идем дальше!");
            setDefaultColorAllColumns();
          }, 1000 * (i) * multipleSpeedAlgo));
        } else if (command[0] == "WITHOUT_MINRUN") {
          timeouts.push(setTimeout(() => {
            changeTextHint("Как и упоминалось раньше, для выполнения Timsort, по специальному алгоритму массив разделяется на подмассивы, но так как вы ввели всего " + command[1] + " элемента будет применена простая сортировка вставками. Чтобы увидеть всю мощь Timsort введите хотя бы 32 элемента!");
          }, 1000 * (i) * multipleSpeedAlgo));
        } else if (command[0] == "WITH_MINRUN") {
          timeouts.push(setTimeout(() => {
            if (command[1] == "CHANGE") {
              changeTextHint("Настало время чтобы найти специальное число, по которому мы будем делить наш массив на подмассивы. Давайте посмотрим на код в окне слева!");
            }
          }, 1000 * (i) * multipleSpeedAlgo));
        } else if (command[0] == "WITH_MINRUN_CHANGE") {
          timeouts.push(setTimeout(() => {
            if (command[1] == "CHANGE") {
              EDITOR.doc.setValue(MINRUN_CHANGE_TEXT);
              changeTextHint("Можно заметить, что в коде присутствуют какие-то сдвиги, логические операции, да и вообще под капотом преобразование десятичных чисел в двоичные числа! Попробуем упростить код и заменим данные операции на более привычные нам.");
            }
          }, 1000 * (i) * multipleSpeedAlgo));
        } else if (command[0] == "WITH_MINRUN_HINT") {
          timeouts.push(setTimeout(() => {
            if (command[1] == "CHANGE") {
              changeTextHint("Согласно утверждениям Тима Петерса наиболее оптимально выбирать длину для подмассивов в диапазоне (32; 64], так как для сортировки вставками массив не должен быть слишком большой, а для сортировки слиянием он не должен быть слишком маленьким. Мы будем использовать диапазон (16; 32] чтобы несколько подмассивов помещались на экране. Если код не очень понятен: исходную длину массива будем делить на 2 до тех пор, пока не попадем в нужный интервал.");
            }
          }, 1000 * (i) * multipleSpeedAlgo));
        } else if (command[0] == "MINRUN_START") {
          timeouts.push(setTimeout(() => {
            changeTextHint("Начинаем вычисление размера минимальной длины подмассива. Количество элементов в массиве = " + data.length);
          }, 1000 * (i) * multipleSpeedAlgo));
        } else if (command[0] == "MINRUN_ITER") {
          timeouts.push(setTimeout(() => {
            changeTextHint("Итерация в цикле while! Результат: минимальный размер пробега = " + command[1] + ", значение четности = " + command[2]);
            minrunChangeCodeAndHint(command[1], command[2]);
          }, 1000 * (i) * multipleSpeedAlgo));
        } else if (command[0] == "MINRUN_END") {
          timeouts.push(setTimeout(() => {
            changeTextHint("Число " + command[1] + " попадает в интервал (16; 32], а значит минимальный размер пробега для подмассивов будет = " + command[1] + ". Переходим к сортировкам!");
          }, 1000 * (i) * multipleSpeedAlgo));
        }
      }
    } else {
      disableButtonsStartSortWithoutAuto();
      let indexShowSort = 0;
      stepSortShow(0);
      disableButton("backStepSort");

      document.getElementById("backStepSort").onclick = function () {
        if (indexShowSort < 0 || indexShowSort - 1 < minindexStep) {
          disableButton("backStepSort");
          setDefaultColorAllColumns();
          if (indexShowSort < 0) {
            stepSortShow(0);
          }
          return;
        }

        stepSortShow(indexShowSort, true);
        --indexShowSort;

        if (indexShowSort < array_commands.length) {
          enableButton("forwardStepSort");
          enableButton("endSort");
        }
      }

      document.getElementById("forwardStepSort").onclick = function () {
        if (indexShowSort + 1 >= array_commands.length) {
          disableButton("forwardStepSort");
          disableButton("backStepSort");
          disableButton("endSort");
          return;
        }

        ++indexShowSort;
        stepSortShow(indexShowSort, false);

        if (indexShowSort - 1 >= 0 && indexShowSort - 1 >= minindexStep) {
          enableButton("backStepSort");
        }
      }
    }
  };
});