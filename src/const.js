import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/clike/clike';

/**
 * Минимальный размер пробега.
 */
export const DEFAULT_MIN_MERGE = 32;

export const WELCOME_TEXT = "// Здесь будет код, описывающий ход выполнения сортировки\n" +
    "int main() {\n" +
    "    std::cout << \"Hello Timsort!\";\n" +
    "    return 0;\n" +
    "}";

export const MINRUN_TEXT = "int minimum_run_length = 32;\n\n" +
    "int findLengthOfMinrun(int length_of_array) {\n" +
    "    int even = 0;\n" +
    "    while (length_of_array >= minimum_run_length) {\n" +
    "        even |= (length_of_array & 1); // логические операции ИЛИ/И\n" +
    "        length_of_array >>= 1; // побитовый сдвиг\n" +
    "    }\n" +
    "\n" +
    "    return length_of_array + even;\n" +
    "}";

export const MINRUN_CHANGE_TEXT = "int minimum_run_length = 32;\n\n" +
    "int findLengthOfMinrun(int length_of_array) {\n" +
    "    int even = 0;\n" +
    "    while (length_of_array >= minimum_run_length) {\n" +
    "        if (length_of_array % 2 == 1) { even = 1; } // проверка на нечетность числа\n" +
    "        length_of_array /= 2; // обычное деление на 2\n" +
    "    }\n" +
    "\n" +
    "    return length_of_array + even;\n" +
    "}";

export const INSERTION_SORT_TEXT = "for (int i = 0; i <= length_array; ++i) {\n" +
    "    int j = i - 1;\n" +
    "    while (j >= left && arr[j] > arr[j + 1]) {\n" +
    "        std::swap(arr[j], arr[j + 1]);\n" +
    "        --j;\n" +
    "    }\n" +
    "}\n";

export const MERGE_ARRAYS_TEXT = "void mergeArrays(int[] array, int start_first, int end_first, int start_second, int end_second) {\n" +
    "    int[] temp_array;\n" +
    "    int start_arr = start_first;\n" +
    "    int len = (end_first - start_first) + (end_second - start_second) + 2;\n" +
    "    for (let i = 0; i < len; ++i) {\n" +
    "        if (array[start_first] <= array[start_second]) {\n" +
    "            temp_array.push(array[start_first]);\n" +
    "            ++start_first;\n" +
    "        } else {\n" +
    "            temp_array.push(array[start_second]);\n" +
    "            ++start_second;" +
    "        }\n" +
    "    }\n" +
    "    array.replace(start_arr, end_second, temp_array)\n" +
    "}"

/**
 * Поле для отображения кода.
 */
export const EDITOR = CodeMirror(document.querySelector(".code-wrapper"), {
    lineNumbers: true,
    mode: "text/x-c++src",
    theme: "dracula"
});