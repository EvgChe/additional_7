module.exports = function solveSudoku(matrix) {

    matrix = basic(matrix);



    ////////////////////////////////////////////////////////////////////////////
    //////////////////////////////// Перебор   /////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    var  bust_array = last(matrix);
    var solve_matrix2 = [];
    for(var i=0; i<9; i++){
        solve_matrix2[i] = [];
        for(var j=0; j<9; j++){
            solve_matrix2[i][j] = matrix[i][j];
        }
    }

    var number_variant = Math.pow(2, bust_array.length);

    for(var n=0; n<number_variant; n++)
    {
        var string_variant = (n+number_variant).toString(2); // нужно bust_array.length нулей, а если мы запишем просто n, то при n=0 мы получим '0', а надо '100000'
        for(i=0; i<bust_array.length; i++){
            if(string_variant[i+1] == '0'){
                solve_matrix2[bust_array[i][0]][bust_array[i][1]] = bust_array[i][2];
            }
            else if(string_variant[i+1] == '1'){
                solve_matrix2[bust_array[i][0]][bust_array[i][1]] = bust_array[i][3];
            }
        }
        solve_matrix2 = basic(solve_matrix2);

        if (testMatrix(solve_matrix2)){
            break;
        }
        else{
            solve_matrix2 = [];
            for(var i=0; i<9; i++){
                solve_matrix2[i] = [];
                for(var j=0; j<9; j++){
                    solve_matrix2[i][j] = matrix[i][j];
                }
            }
        }
    }


    return solve_matrix2;

}

function basic(matrix) {
    var solve_matrix = []; // пустой массив для ввода окончательных решений
    for(var ii=0; ii<11; ii++) { // прокручиваем основные алгоритмы
        for (var i = 0; i < matrix.length; i++) { // поиск пустых ячеек
            solve_matrix[i] = []; // создание массива в массиве solve_matrix
            for (var j = 0; j <= 8; j++) {

                var find = matrix[i][j]; // индекс пустой ячейки
                if (find === 0) { //то мы начинаем заполнять для нее массив со значениями кандидатов option

                    var line_arr = searching_in_line(matrix, i);
                    var column_arr = searching_in_column(matrix, j);
                    var square_arr = searching_in_square(matrix, i, j);
                    var option = options(line_arr, column_arr, square_arr);
                    if (option.length === 1) {
                        solve_matrix[i][j] = option[0];
                    }
                    else solve_matrix[i][j] = 0;


                }
                else solve_matrix[i][j] = matrix[i][j];//записываем то число, что стоит в ячейке
            }
        }

        for(var i=0; i<9; i+=3){  // метод поиска по квадратам
            for(var j=0; j<9; j+=3){
                solve_matrix = exception(solve_matrix,i,j);

            }
        }



        for(var i=0; i<9; i++){  // по строкам
            for(var j=0; j<9; j++){

                solve_matrix = algoritm_3(solve_matrix ,i,j);

            }
        }


        var solve_matrixT = transp(matrix);


        for(var i=0; i<9; i++){  // транспорированная матрица
            for(var j=0; j<9; j++){

                solve_matrix = algoritm_3(solve_matrixT ,i,j);



            }
        }


        for(var n=0; n<9; n++){
            for(var m=0; m<9; m++){
                matrix[n][m] = solve_matrix[n][m];
            }
        }


    }

    var matrixT = transp(solve_matrix);

    return matrixT;

}


function searching_in_line(matrix, number_line) {
    var option_1 = []; // массива кандидатов 1

    for (var j = 0; j <= 8; j++ ){ // пробегаемся по массиву и ищем числа

        for (var k = 1 ; k <= 9; k++){ //проверяем строки на имеющиеся значения

            if (matrix[number_line][j] === k){//если не нашли значение в строке

                option_1[option_1.length] = k; // то записали значения в массив
            }
        }
    }

    return option_1;
}

function searching_in_column(matrix,number_column) {
    var option_2 = []; // массив кандидатов 2

    for(var i = 0; i <= 8; i++ ){

        for(var k = 1 ; k <= 9; k++){

            if (matrix[i][number_column] === k ){ // если числа k нету в столбце, то мы его записываем в кандидаты

                option_2[option_2.length] = k; // записали в массив кандидатов
            }
        }
    }

    return option_2;
}

function searching_in_square(matrix,number_line,number_column) {

    var square_i = Math.floor(number_line / 3) * 3 ; //  Ищет от куда будет начинаться поиск для i
    var square_j = Math.floor(number_column / 3) * 3; // Ищем от куда будет начинаться поиск для j
    var option_3 = []; // массив кандидатов 3

    for ( var i = square_i; i <= square_i+2; i++){

        for( var j = square_j; j <= square_j+2; j++){

            for(var k = 1 ; k <= 9; k++) {

                if (matrix[i][j] === k) { // если числа k нету, то мы его записываем в кандидаты

                    option_3.push(k); // записали в массив кандидатов
                }
            }
        }
    }

    return option_3;
}

function options ( option_1, option_2, option_3) {//функция для нахождения кандидатов

    var result= (option_1.join('')+option_2.join('')+option_3.join('')).split(''); //промежуточный массив
    var options = []; // конечный массив
    var compare = ['1','2','3','4','5','6','7','8','9'];

    for (var n = 0; n < compare.length; n++ ){ //сравниваю числа из промежуточного массива со эталонным

        for(var m = 0; m < result.length; m++){

            compare[n] = compare[n].replace(result[m]);

        }
    }

    for(var i=0; i<compare.length; i++){
        if(compare[i] !== 'undefined') {
            options.push(parseInt(compare[i]));       //Формируем массив кандидатов
        }
    }

    return options;
}

function exception (matrix,number_line,number_column) { // метод для квадратов 3*3


    var arr_1=''; // строка со всеми решениями для всех нулей, для одного квадрата 3*3
    var count_zero =0;
    for ( var i = number_line; i <= number_line + 2; i++  ){
        for (var j = number_column; j <= number_column + 2; j++){
            if( matrix[i][j] === 0 ){
                count_zero++;
                var line_arr = searching_in_line(matrix, i);
                var column_arr = searching_in_column(matrix, j);
                var square_arr = searching_in_square(matrix, i, j);
                var option = options(line_arr, column_arr, square_arr);
                arr_1 = arr_1 + option.join(''); // добавляем значения в строку

            }

        }
    }

    if(count_zero === 0){
        return matrix;
    }

    for ( var n = 1; n <= 9; n++ ){

        var length_new_arr = arr_1.split(String(n)).join('').length; // длинна нового массива после удаления n-го симв.
        var length_arr = arr_1.length; // длинна исходной строки
        if (length_arr - length_new_arr === 1){

            for ( var i = number_line; i <= number_line + 2; i++  ){
                for (var j = number_column; j <= number_column + 2; j++){
                    if( matrix[i][j] === 0 ){
                        var line_arr = searching_in_line(matrix, i);
                        var column_arr = searching_in_column(matrix, j);
                        var square_arr = searching_in_square(matrix, i, j);
                        var option = options(line_arr, column_arr, square_arr);
                        for (var m = 0; m < option.length; m++){
                            if ( option [m] === n){
                                matrix[i][j] = n;
                            }
                        }

                    }
                }
            }


        }
    }

    return matrix;
}

function algoritm_3 (matrix, number_line, number_column) { //алгоритм для поиска по столбцам и строком методом исклучения

    var arr_1=''; // строка со всеми решениями для всех нулей, для строки
    var count_zero =0;
    for ( var j = 0; j < 9; j++  ){

        if( matrix[number_line][j] === 0 ){
            count_zero++;
            var line_arr = searching_in_line(matrix, number_line);
            var column_arr = searching_in_column(matrix, j);
            var square_arr = searching_in_square(matrix, number_line, j);
            var option = options(line_arr, column_arr, square_arr);
            arr_1 = arr_1 + option.join(''); // добавляем значения в строку
        }
    }

    if(count_zero === 0){
        return matrix;
    }

    for ( var n = 1; n <= 9; n++ ){

        var length_new_arr = arr_1.split(String(n)).join('').length; // длинна нового массива после удаления n-го симв.
        var length_arr = arr_1.length; // длинна исходной строки
        if (length_arr - length_new_arr === 1){

            for (var j = number_column; j <= number_column + 2; j++){
                if( matrix[number_line][j] === 0 ){
                    var line_arr = searching_in_line(matrix, number_line);
                    var column_arr = searching_in_column(matrix, j);
                    var square_arr = searching_in_square(matrix, number_line, j);
                    var option = options(line_arr, column_arr, square_arr);
                    for (var m = 0; m < option.length; m++){
                        if ( option [m] === n){
                            matrix[number_line][j] = n;
                        }
                    }

                }
            }

        }
    }
    return matrix;

}

function transp(matrix) { //транспонирование матрицы
    var solve_matrixT = [];

    for (var i=0; i < 9; i++) {

        solve_matrixT [i] = [];

        for (var j = 0; j < 9; j++) {

            solve_matrixT[i][j] = matrix [j][i];

        }
    }

    return solve_matrixT;

}

///////////  Проверка на правильное выполнение матрицы   /////////////////////
function testMatrix(array) {  //Данная функция выводит true, если судоку решена правильно, false, если нет.

    //Проверка строк на наличие нулей
    for(var i=0; i<9; i++){
        if(array[i].includes(0))   return false;    //Если i-ая строка водержит 0, сразу выводим false функции testMatrix()
        for(var val=1; val<=9; val++){              //Проверяем, присутствует ли каждая цифра от 1 до 9 лишь единожды
            var lengthNew = array[i].join('').replace(String(val),'').length;
            var length_arr = array[i].join('').length;
            if(length_arr - lengthNew != 1){
                return false;  //если цифра присутствует больше одного раза выводим false функции testMatrix()
            }
        }
    }

    array = transp(array);  //Производим траспонирование матрицы и осуществляем те же операции, что и выше

    for(var i=0; i<9; i++){
        if(array[i].includes(0))   return false;
        for(var val=1; val<=9; val++){
            if(array[i].join('').length - array[i].join('').replace(String(val),'').length != 1){
                return false;
            }
        }
    }

    var arr = [[],[],[]];       //Массив, соответствующий квадрату 3 на 3.
    for(var i=0; i<3; i++){     //Координата квадрата 3 на 3 (по строке)
        for(var j=0; j<3; j++){ //Вторая координата квадрата 3 на 3 (по столбцу)

            for(var n=0; n<3; n++){     //Запись соответствующего квадрата с кооринатами [i][j] в массив arr
                for(var m=0; m<3; m++){
                    arr[n][m] = array[3*i+n][3*j+m];
                }
            }
            var stringArr = arr[0].join('')+arr[1].join('')+arr[2].join('');    //Преобразование массива в строку
            for(var val=1; val<=9; val++){                                      //Проверка, встечаются ли все символы в квадрате лишь единожды
                if(stringArr.length - stringArr.replace(String(val),'').length != 1){
                    return false;   //если нет, выводим false из функции
                }
            }
        }
    }

    return true; //Если всё выполнилось, то воводим true

}

function last (matrix, number_line, number_column ) {

    var count = 0;
    var arr = [];


    for(var i=0; i<9; i+=3){  // метод поиска по квадратам

        for(var j=0; j<9; j+=3){

            count = 0;

            for(var n=0; n < 3; n++) {
                for(var m=0; m < 3; m++) {

                    if  (count > 0){

                        continue;
                    }

                    var line_arr = searching_in_line(matrix, i+n);
                    var column_arr = searching_in_column(matrix, j +m);
                    var square_arr = searching_in_square(matrix, i+n, j+m);
                    var option = options(line_arr, column_arr, square_arr);

                    if (matrix [i+n][j+m] == 0) {

                        if (option.length === 2){
                            count++;
                            arr[arr.length] = [];
                            arr[arr.length-1][0] = i+n;
                            arr[arr.length-1][1] = j+m;
                            arr[arr.length-1].push(option[0]);
                            arr[arr.length-1].push(option[1]);
                        }

                    }
                }
            }

        }
    }
    return arr;
}













