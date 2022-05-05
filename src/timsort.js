import { DEFAULT_MIN_MERGE } from "./const";

export let array_commands = new Array();

/**
 * Сравение целочисленных элементов
 *
 * @param {string|object|number} a - Первый элемент для сравнения.
 * @param {string|object|number} b - Второй элемент для сравнения.
 * @return {number} - Положительное число, если a > b, и отрицательное число, если a < b, 0 иначе.
 */
function alphabeticalCompare(a, b) {
    if (a === b) {
        return 0;
    }

    if (~~a === a && ~~b === b) {
        if (a < b) {
            return -1;
        } else {
            return 1;
        }
    }

    return 0;
}

/**
 * Подсчет минимального пробела для массива.
 *
 * @param {number} n - Размер массива.
 */
function minRunLength(n) {
    let r = 0;

    var checkedBox = document.getElementById("checkAuto");
    if (checkedBox.checked) {
        array_commands.push("MINRUN_START");
        array_commands.push("MINRUN_START");
    } else {
        array_commands.push("MINRUN_START");
    }

    while (n >= DEFAULT_MIN_MERGE) {
        r |= (n & 1);
        n >>= 1;

        if (checkedBox.checked) {
            array_commands.push("MINRUN_ITER " + n + " " + r);
            array_commands.push("MINRUN_ITER " + n + " " + r);
        } else {
            array_commands.push("MINRUN_ITER " + n + " " + r);
        }
    }

    if (checkedBox.checked) {
        array_commands.push("MINRUN_END " + (n + r));
        array_commands.push("MINRUN_END " + (n + r));
    } else {
        array_commands.push("MINRUN_END " + (n + r));
    }

    return n + r;
}

function insertionSort(array, compare, start, end) {
    array_commands.push("BINARY SORT");
    for (let i = start + 1; i < end; ++i) {
        let j = i - 1;
        array_commands.push("CHECK " + j + " " + (j + 1));
        while (j >= start && compare(array[j], array[j + 1]) > 0) {
            if (j !== i - 1) {
                array_commands.push("CHECK " + j + " " + (j + 1));
            }
            array_commands.push("SWAP " + j + " " + (j + 1));
            let temp = array[j];
            array[j] = array[j + 1];
            array[j + 1] = temp;
            --j;
        }
    }
    array_commands.push("END_BINARY SORT");
}

function mergeFunc(array, start_first, end_first, start_second, end_second) {
    array_commands.push("MERGE " + start_first + " " + end_second);
    let tempArray = new Array();
    let start_arr = start_first;
    let end_arr = end_second;
    let len = (end_first - start_first) + (end_second - start_second) + 2;

    var checkedBox = document.getElementById("checkAuto");

    let counterFirstArray = 0;
    let counterSecondArray = 0;
    let flagFindGalop = true;
    let countGalop = 0;

    for (let i = 0; i < len; ++i) {
        if (countGalop <= 0) {
            array_commands.push("CHECK " + start_first + " " + start_second);
            flagFindGalop = true;
        } else {
            --countGalop;
        }

        if (array[start_first] <= array[start_second]) {
            if (flagFindGalop) {
                array_commands.push("MOVE " + start_first + " " + array[start_first] + " ONE");
            } else {
                array_commands.push("MOVE " + start_first + " " + array[start_first] + " GALOP");
            }
            tempArray.push(array[start_first]);
            ++start_first;

            counterSecondArray = 0;
            if (flagFindGalop) {
                ++counterFirstArray;
            }
        } else {
            if (flagFindGalop) {
                array_commands.push("MOVE " + start_second + " " + array[start_second] + " ONE");
            } else {
                array_commands.push("MOVE " + start_second + " " + array[start_second] + " GALOP");
            }
            tempArray.push(array[start_second]);
            ++start_second;

            counterFirstArray = 0;
            if (flagFindGalop) {
                ++counterSecondArray;
            }
        }

        if (start_first > end_first) {
            while (start_second <= end_second) {
                array_commands.push("MOVE " + start_second + " " + array[start_second] + " ALL");
                tempArray.push(array[start_second++]);
            }
            break;
        }
        if (start_second > end_second) {
            while (start_first <= end_first) {
                array_commands.push("MOVE " + start_first + " " + array[start_first] + " ALL");
                tempArray.push(array[start_first++]);
            }
            break;
        }

        if (counterFirstArray >= 7) {
            let iterStartFirst = start_first;
            let valueStartSecond = start_second;

            while (iterStartFirst <= end_first && array[iterStartFirst] <= array[valueStartSecond]) {
                ++iterStartFirst;
            }

            countGalop = iterStartFirst - start_first;
            counterFirstArray = 0;
            flagFindGalop = false;
            if (checkedBox.checked) {
                array_commands.push("START_GALOP LEFT " + array[iterStartFirst - 1]);
                array_commands.push("START_GALOP LEFT " + array[iterStartFirst - 1]);
                array_commands.push("START_GALOP LEFT " + array[iterStartFirst - 1]);
                array_commands.push("START_GALOP LEFT " + array[iterStartFirst - 1]);
            } else {
                array_commands.push("START_GALOP LEFT " + array[iterStartFirst - 1]);
            }
        }

        if (counterSecondArray >= 7) {
            let iterStartFirst = start_second;
            let valueStartSecond = start_first;

            while (iterStartFirst <= end_second && array[iterStartFirst] <= array[valueStartSecond]) {
                ++iterStartFirst;
            }

            countGalop = iterStartFirst - start_second;
            counterSecondArray = 0;
            flagFindGalop = false;
            if (checkedBox.checked) {
                array_commands.push("START_GALOP RIGHT " + array[iterStartFirst - 1]);
                array_commands.push("START_GALOP RIGHT " + array[iterStartFirst - 1]);
                array_commands.push("START_GALOP RIGHT " + array[iterStartFirst - 1]);
                array_commands.push("START_GALOP RIGHT " + array[iterStartFirst - 1]);
            } else {
                array_commands.push("START_GALOP RIGHT " + array[iterStartFirst - 1]);
            }
        }
    }

    array.splice(start_arr, end_second - start_arr + 1);
    for (let i = 0; i < tempArray.length; ++i) {
        array.splice(start_arr + i, 0, tempArray[i]);
    }
    array_commands.push("MERGE_END " + start_arr + " " + end_arr);
}

/**
 * Sort an array in the range [lo, hi) using TimSort.
 *
 * @param {array} array - The array to sort.
 * @param {function} compare - Item comparison function. Default is
 *     alphabetical comparator.
 * @param {number} lo - First element in the range (inclusive).
 * @param {number} hi - Last element in the range.
 */
export function sort(array, compare, lo, hi) {
    if (!Array.isArray(array)) {
        throw new TypeError('Can only sort arrays');
    }

    array_commands.push("TIMSORT START");

    compare = alphabeticalCompare;
    lo = 0;
    hi = array.length;

    let remaining = hi - lo;

    if (remaining < 2) {
        return;
    }
    if (remaining < DEFAULT_MIN_MERGE) {
        var checkedBox = document.getElementById("checkAuto");
        if (checkedBox.checked) {
            array_commands.push("WITHOUT_MINRUN " + array.length);
            array_commands.push("WITHOUT_MINRUN " + array.length);
            array_commands.push("WITHOUT_MINRUN " + array.length);
            array_commands.push("WITHOUT_MINRUN " + array.length);
            array_commands.push("WITHOUT_MINRUN " + array.length);
            array_commands.push("WITHOUT_MINRUN " + array.length);
        } else {
            array_commands.push("WITHOUT_MINRUN " + array.length);
        }
        insertionSort(array, compare, 0, array.length);
    } else {
        var checkedBox = document.getElementById("checkAuto");
        if (checkedBox.checked) {
            array_commands.push("WITH_MINRUN CHANGE");
            array_commands.push("WITH_MINRUN NO");
            array_commands.push("WITH_MINRUN NO");
            array_commands.push("WITH_MINRUN NO");
            array_commands.push("WITH_MINRUN NO");
            array_commands.push("WITH_MINRUN NO");
            array_commands.push("WITH_MINRUN NO");

            array_commands.push("WITH_MINRUN_CHANGE CHANGE");
            array_commands.push("WITH_MINRUN_CHANGE NO");
            array_commands.push("WITH_MINRUN_CHANGE NO");
            array_commands.push("WITH_MINRUN_CHANGE NO");
            array_commands.push("WITH_MINRUN_CHANGE NO");
            array_commands.push("WITH_MINRUN_CHANGE NO");
            array_commands.push("WITH_MINRUN_CHANGE NO");

            array_commands.push("WITH_MINRUN_HINT CHANGE");
            array_commands.push("WITH_MINRUN_HINT NO");
            array_commands.push("WITH_MINRUN_HINT NO");
            array_commands.push("WITH_MINRUN_HINT NO");
            array_commands.push("WITH_MINRUN_HINT NO");
            array_commands.push("WITH_MINRUN_HINT NO");
            array_commands.push("WITH_MINRUN_HINT NO");
            array_commands.push("WITH_MINRUN_HINT NO");
            array_commands.push("WITH_MINRUN_HINT NO");
        } else {
            array_commands.push("WITH_MINRUN CHANGE");
            array_commands.push("WITH_MINRUN_CHANGE CHANGE");
            array_commands.push("WITH_MINRUN_HINT CHANGE");
        }

        let minRun = minRunLength(remaining);

        let stackStart = new Array();
        let stackEnd = new Array();

        do {
            stackStart.push(lo);
            if (remaining > minRun) {
                insertionSort(array, compare, lo, lo + minRun);
                stackEnd.push(lo + minRun - 1);
            } else {
                insertionSort(array, compare, lo, array.length);
                stackEnd.push(array.length - 1);
            }

            lo += minRun;
            remaining = hi - lo;
        } while (remaining > 0);

        if (stackStart.length % 2 !== 0) {
            let start_first = stackStart[stackStart.length - 2];
            let end_first = stackEnd[stackEnd.length - 2];

            let start_second = stackStart[stackStart.length - 1];
            let end_second = stackEnd[stackEnd.length - 1];

            mergeFunc(array, start_first, end_first, start_second, end_second);
            stackStart.splice(stackStart.length - 1, 1);
            stackEnd.splice(stackEnd.length - 1, 1);
            stackEnd[stackEnd.length - 1] = start_first + (end_first - start_first) + (end_second - start_second) + 1;
        }

        while (stackStart.length !== 1) {
            let merge_count = stackStart.length / 2;
            for (let i = 0; i < merge_count; ++i) {
                let start_first = stackStart[i];
                let end_first = stackEnd[i];

                let start_second = stackStart[i + 1];
                let end_second = stackEnd[i + 1];

                mergeFunc(array, start_first, end_first, start_second, end_second);
                stackStart.splice(i + 1, 1);
                stackEnd.splice(i + 1, 1);
                stackEnd[i] = start_first + (end_first - start_first) + (end_second - start_second) + 1;
            }
        }
    }

    array_commands.push("TIMSORT_END");
}