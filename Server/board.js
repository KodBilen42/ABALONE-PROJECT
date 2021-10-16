// ---- checks ----
//1 block check
//2 border check
//3 force check
//4 turn color check

// ---- calculations ----
//1 calculate straight moving positions
//2 calculate paralel moving positions
    //2sub1 for two balls
    //2sub2 for three balls

// ---- needed funtions ----
//0 initialize_board                XX
//1 is_position_in_range            XX
//2 find_ball_by_position           XX
//3 find_borders                    XX
//4 find_border_direction           XX
//5 opposite_direction              XX
//6 find_force                      XX
//7 find_head                       XX
//8 block_check                     XX
//9 border_check                    XX
//10 direction_check                XX
//11 force_check                    XX
//12 turn_color_check               XX
//13 push                           XX
//14 move                           XX

//15 return_data                    XX

//define display functions to be able to check move and push functions XX

//js only function
function present(array, element){
    for ( let i = 0; i < array.length; i++){
        if (array_equal(array[i], element)){
            return true;
        }
    }
    return false
}
//js only function
function array_location(array, element){
    if (present(array, element)){
        for (let i = 0; i < array.length; i++){
            if( array_equal(array[i], element))
                return i
        }
    }
    return null
}

//js only function
function array_equal(array_a, array_b){
    if ( array_a == null || array_b == null){
        return false
    }
    else if (array_a.length != array_b.length){
        return false;
    }
    else{
        for(let i = 0; i < array_a.length; i++){
            if (array_a[i] != array_b[i])
                return false
        }
        return true
    }    
}

class Board{

    balls = []
    board = []
    turn = "R"

    constructor(){
        let table_lengths = "567898765"
        for (let y = 0; y < 9; y++){
            this.board.push([])
            for(let x = 0; x < table_lengths[y]; x++){
                this.board[y].push(x)
            }
        }
    }
    
    initialize_board(state="00R10R20R30R40R01R11R21R31R41R51R22R32R42R26W36W46W07W17W27W37W47W57W08W18W28W38W48W", swapped){
        for (let i = 0; i < state.length / 3; i++){
            let id = state[i*3] + state[i*3 + 1]
            if (swapped)
            id = id[0] + (8 - parseInt(id[1])).toString()
            let color = state[i*3 + 2]
            let x = parseInt(id[0])
            let y = parseInt(id[1])

            //this.board[y][x] = color
            this.balls.push([x, y, color])
        }
    }

    is_position_in_range(position){
        let x = null, y = null
        if (position.length == 2 || position.length == 3){
            x = position[0]
            y = position[1]
        }
        if (y > 8)
            return false
        
        else if( x >= this.board[y].length)
            return false
        else if( x < 0 || y < 0)
            return false
        else
            return true
    }

    find_ball_by_position(target_ball, balls=null){
        if(target_ball === null)
            return null;
        if(balls === null)
            balls = this.balls

        let target_x
        let target_y
        let target_color
        if(target_ball.length == 3){
            target_x = target_ball[0]
            target_y = target_ball[1]
            target_color = target_ball[2]
        }
        else if(target_ball.length == 2){
            target_x = target_ball[0]
            target_y = target_ball[1]
        }

        for(let i = 0; i < balls.length; i++){
            let ball_x = balls[i][0]
            let ball_y = balls[i][1]
            let ball_color = balls[i][2]
            if(ball_x == target_x && ball_y == target_y)
                return balls[i]
        }
        return null
    }

    find_borders(ball){
        let x = null, y = null
        if(ball.length == 2 || ball.length == 3){
            x = ball[0]
            y = ball[1]
        }
        let borders
        if(y < 4){
            borders = [[x - 1, y - 1], [x, y - 1],
                       [x - 1, y], [x + 1, y],
                       [x, y + 1], [x + 1, y + 1]]
}
        else if(y == 4){
            borders = [[x - 1, y - 1], [x, y - 1],
                       [x - 1, y], [x + 1, y],
                       [x - 1, y + 1], [x, y + 1]]
}
        else if(y > 4){
            borders = [[x, y - 1], [x + 1, y - 1],
                       [x - 1, y], [x + 1, y],
                       [x - 1, y + 1], [x, y + 1]]
}
        let final_borders = []
        for(let i = 0; i < borders.length; i++){
            x = borders[i][0]
            y = borders[i][1]
            if(y > 8)
                final_borders.push(null)
            else if( y < 0 || x < 0)
                final_borders.push(null)
            else if(x < 0 || y < 0)
                final_borders.push(null)
            else if(x >= this.board[y].length)
                final_borders.push(null)
            else
                final_borders.push(borders[i])
        }
        return final_borders
    }

    display(){

        for(let y = 0; y < this.board.length; y++){
            let line = y + " ".repeat(Math.abs(4 - y) + 2)
            for (let x of this.board[y]){
                if (present(this.balls, [x, y, "R"]))
                    line += 'R' + ' '
                else if (present(this.balls, [x, y, "W"]))
                    line += 'W' + ' '
                else
                    line += x + ' '
            }
            console.log(line)
        }
        console.log(this.turn)
    }

    _display_borders(){
        //______________
    }

    //js only function
    array_equals(array1, array2){
        if( array1 === array2) return true
        if( array1 == null || array2 == null) return false
        if( array1.length != array2.length) return false

        for( let i = 0; i < array1.length; i++){
            if( array1[i] != array2[i]) return false
        }
        return true
    }

    find_border_direction(ball_position, border_position){
        let borders = this.find_borders(ball_position)
        let direction
        let border
        for (let i = 0; i < borders.length; i++){
            border = borders[i]
            direction = i
            if (this.array_equals(border , border_position))
                return direction
        }
        return null
    }

    opposite_direction(direction_index){
        if (0 > direction_index || direction_index > 5)
            return null
        let opposite_direction = 5 - direction_index
        return opposite_direction
    }
 
    is_backed(ball, direction){
        let ball_borders = this.find_borders(ball)
        let attacking_ball = this.find_ball_by_position(ball_borders[direction])
        if ( present(this.balls, this.find_ball_by_position(ball_borders[direction])))
            return attacking_ball
        else
            return false
    }

    find_force(ball, direction, attacking_color){
        
        let behind = ball
        let force = 0
        while(true){
            behind = this.is_backed(behind, direction)
            if(!behind)
                break
            ball = this.find_ball_by_position(ball)
            if(ball === null)
                return 0
            if(behind[2] != attacking_color)
                force += 1
            else if(behind[2] == attacking_color)
                force = 9
        }
        force += 1
        return force
    }
    
    find_head(balls, direction){
        let block_direction = this.block_check(balls)
        if(block_direction === false){
            console.log("find_head failed (block ckeck fail)")
            return false
        }
        if(block_direction == direction || block_direction == this.opposite_direction(direction)){
            for(let i = 0; i < balls.length; i++){
                let ball = balls[i]
                let borders = this.find_borders(ball)
                if(!(present(balls, this.find_ball_by_position(borders[direction])))){
                    return ball
                }
            }
        }
        else
            return null
    }

    block_check(balls){
        let color = null
        for(let i = 0; i < balls.length; i++){
            let ball = balls[i]
            if(color === null)
                color = ball[2]
            else if(ball[2] != color){
                console.log("block check fail (colors are not identical)")
                return false
            }
        }
        if(balls.length == 1)
            return true
        if(balls.length > 3){
            console.log("length test failed")
            return false
        }
        
        let first_detected_direction = null
        let direction;
        for(let j = 0; j < balls.length; j++){
            let ball = balls[j]
            direction = null
            let ball_borders = this.find_borders(ball)
            for(let i = 0; i < ball_borders.length; i++){
                let ball_border = ball_borders[i]
                if(ball_border === null)
                    continue
                else if(this.find_ball_by_position([ball_border[0], ball_border[1]], balls) !== null){
                    direction = i
                    if(first_detected_direction === null)
                        first_detected_direction = direction
                    else{
                        if(direction != first_detected_direction && direction != this.opposite_direction(first_detected_direction)){
                            console.log("linearity test failed (linearity couldn't proven)")
                            return false
                        }
                    }
                }
            }
        }
        if(direction === null){
            console.log("linearity test failed (second ball couldn't found)")
            return false
        }
        return first_detected_direction
    }

    border_check(balls, direction){
        for(let i = 0; i < balls.length; i++){
            let ball = balls[i]
            let borders = this.find_borders(ball)
            if(borders[direction] === null){
                console.log("border check fail")
                return false
            }
        }
        return true
    }

    direction_check(balls, move_direction){
        if(balls.length == 1)
            return null
        let block_direction = this.block_check(balls)
        if(block_direction === false)
            return false
        else{
            if(block_direction != move_direction && block_direction != this.opposite_direction(move_direction))
                return false
        }
        return true
    }

    force_check(balls, direction){
        if( this.direction_check(balls, direction)){
            let head = this.find_head(balls, direction)
            if( head !== null && head !== false){
                let attacking_position = this.find_borders(head)[direction]
                let defending_force = this.find_force(attacking_position, direction, head[2])
                if( balls.length > defending_force)
                    return true
            }
            console.log("force_check (insufficiant force)")
            return false
        }
        else if(!(this.direction_check(balls, direction))){
            for(let i = 0; i < balls.length; i++){
                let ball = balls[i]
                let borders = this.find_borders(ball)
                let moving_position = borders[direction]
                if( present(this.balls, this.find_ball_by_position(moving_position))){
                    console.log("force check (barricated")
                    return false
                }
            }
            return true
        }
    }

    input_check(balls, direction){
        if( direction > 5){
            console.log("direction is invalid")
            return false
        }
        for( let i = 0; i < balls.length; i++){
            let ball = balls[i]
            if(!(present(this.balls, ball))){
                console.log("input error")
                return false
            }
        }
        return true
    }

    turn_color_check(balls){
        let color = null
        for(let i = 0; i < balls.length; i++){
            let ball = balls[i]
            if(color === null)
                color = ball[2]
            else if(ball[2] != color){
                console.log("turn check failed (colors are not identical)")
                return false
            }
        }
        if(this.turn != color){
            console.log("turn check failed")
            return false
        }
        return true
    }

    push(ball, direction){
        if( this.find_ball_by_position(ball) === null)
            return false
        let borders = this.find_borders(ball)
        let moving_position = borders[direction]
        if( this.find_ball_by_position(moving_position) !== null)
            this.push(this.find_ball_by_position(moving_position), direction)
        this.balls.splice(array_location(this.balls, ball), 1)
        if( moving_position === null)
            return new ["pushed", ball]
        if( this.is_position_in_range(moving_position)){
            moving_position.push(ball[2])
            this.balls.push(moving_position)
        }
        return true
    }

    move(balls, direction){
        if( this.input_check(balls, direction) ===  false)
            return false
        if( this.block_check(balls) === false)
            return false
        if( !this.border_check(balls, direction))
            return false
        if( !this.force_check(balls, direction))
            return false
        if( this.turn_color_check(balls) === false)
            return false
        
        for( let i = 0; i < balls.length; i++){
            let ball = balls[i]
            let borders = this.find_borders(ball)
            let moving_position = borders[direction]
            let moving_ball = this.find_ball_by_position(moving_position)
            if( moving_ball !== null && ! present(balls, moving_ball))
                this.push(moving_ball, direction)
            this.balls.splice(array_location(this.balls, ball), 1)
            moving_position.push(ball[2])
            this.balls.push(moving_position)
        }
        
        if( this.turn == "W")
            this.turn = "R"
        else if( this.turn == "R")
            this.turn = "W"

    }

    return_data(){
        let data_pack = ""
        for( let ball of this.balls){
            let id_data = String(ball[0]) + String(ball[1])
            let data = id_data + ball[2]
            data_pack += data
        }
        return ["data" + data_pack, this.turn]
    }
}

module.exports ={
    Board
}

/*
let myboard = new Board()
myboard.initialize_board(state = "00R10R20R30R40R01R11R21R31R41R51R22R32R42R26W36W46W07W17W27W37W47W57W08W18W28W38W48W")
myboard.display()
myboard.move([[2, 2, "R"], [1, 1, "R"], [0, 0, "R"]], 5)
myboard.display()
myboard.move([[2, 6, "W"], [1, 7, "W"], [0, 8, "W"]], 1)
myboard.display()
myboard.move([[3, 3, "R"], [2, 2, "R"], [1, 1, "R"]], 5)
myboard.display()
myboard.move([[3, 5, "W"], [2, 6, "W"], [1, 7, "W"]], 1)
myboard.display()
 */



