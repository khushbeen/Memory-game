$(function() {
    $('#start').click(function() {
        startRound(START_LEVEL, START_LEVEL, START_TILES);
        
        $('#start').html("TERMINATE");
        $('#start').attr('onclick','if (confirm(\'Are you sure you want to terminate?\')) terminate();');
        $('#start').attr('id','terminate');
    });
    
    
});

function generateMatrix(row, col) {
    let matr = [];  
    for (let i = 0; i < row; i++) {
        matr[i] = [];
        for (let j = 0; j < col; j++) {
            
            matr[i][j] = 0;
            
        }
    }
    return matr;
}

function generatePosition(tiles, row, col) {
    let position = [];
    let positionStr = [];
    let flag = true;
    let i, j;
    for (let k = 0; k < tiles; ++k) {
         do{
            i = Math.floor(Math.random() * row);
            j = Math.floor(Math.random() * col);
            if(positionStr.indexOf("" + i + j) == -1)
                flag = false;
        }while(flag);

        position.push([i,j]);
        positionStr.push("" + i + j);
        flag = true;
    }
   
    return position;
}

function checkTile(elem) {
    let value = $(elem).data('remember');
    let score = parseInt($('#score').html());
    let tiles = parseInt($('#tiles').html());
    
    if (value == '1') {
        let opened = $('.active-tile');
        if (opened.length + 1 == tiles) {
            // If last tile
            $(elem).addClass('success-tile');
            $("#bonus").html("BONUS +" +tiles);
            $('#bonus').animate({ bottom: -30, opacity: 1 }, { duration: 1000 });
            $('#score').html(score + 1 + BONUS_COEF * tiles);
            $('.matrix').addClass('disabled');
            prepareNextRound(tiles);
        } else {
            //If correct tile
            $(elem).addClass('active-tile');
            $('#score').html(score + 1);
        }
    } else {
        // If incorrect tile
        $(elem).addClass('fail-tile');
        $('#score').html(score - 1);
        if (score - 1 < 1) {
            terminate();
        }
    }
}

function startRound(row, col, tile) {
    //generate matrix
    let matrix = generateMatrix(row, col);

    //generate random tiles
    let position = generatePosition(tile, row, col);
    //console.log(position);

    //place tiles on matrix
    for (let i = 0; i < position.length; ++i) {
        matrix[position[i][0]][position[i][1]] = 1;
    }

    //place matrix on screen
    let desk = $('.matrix');
    desk.html('');
    let str = '';
    $.each( matrix, function( i, value ) {
        str += '<div class="row line">';
         $.each( value, function( j, subvalue ) {
             str += '<div class="tile" id="'+i+j+'" data-remember="'+subvalue+'" onclick="checkTile(this)"></div>';
         });
        str += '</div>';
        desk.append(str);
        str = '';
    });
    desk.attr('data-row', row);
    desk.attr('data-col', col);
    
    desk.css('margin-top', (window.innerHeight - desk.height() )/ 2);
    //show tiles
    $('[data-remember=1]').addClass('active-tile');

    //hide tiles
    setTimeout(function(){
        $('[data-remember=1]').removeClass('active-tile');
        $('.matrix').addClass('rotate90');
    }, 1000);
    $('.matrix').removeClass('disabled');

}

function prepareNextRound(tiles) {
    $('#bonus').animate({ bottom: 0, opacity: 0 }, { duration: 1000 });
    setTimeout(function() {
        let row = parseInt($('.matrix').attr('data-row'));
        let col = parseInt($('.matrix').attr('data-col'));
        let fails = $('.fail-tile');
        
        if (fails.length > 0) {
            //Next matrix is downgrade
            if (!((row == col) && (row == START_LEVEL))) {
                 tiles -= 1;
                if (row == col) {
                    col -= 1;
                } else {
                    row -= 1;
                }
            }
           
        } else {
            if (!((row == col) && (row == FINAL_LEVEL))) {
                tiles += 1;
                if (row == col) {
                    row += 1;
                } else {
                    col += 1;
                }
            }
        }
        
        
        $('#tiles').html(tiles);
        $('.matrix').removeClass('rotate90');
        startRound(row, col, tiles);
    }, 2000);
}

function terminate() {
    window.location.href = "summary.html";
}
