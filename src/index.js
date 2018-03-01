module.exports = function solveSudoku(matrix) {

    var solve_matrix = []; // пустой массив для ввода окончательных решений
    for(var ii=0; ii<81; ii++) { // прокручиваем основные алгоритмы
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


        for(var n=0; n<9; n++){
            for(var m=0; m<9; m++){
                matrix[n][m] = solve_matrix[n][m];
            }
        }

    }
    for(var i=0; i<9; i+=3){  // метод поиска по квадратам
        for(var j=0; j<9; j+=3){
            solve_matrix = exception(matrix,i,j);

        }
    }
    return solve_matrix;
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

                    option_3[option_3.length] = k; // записали в массив кандидатов
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









