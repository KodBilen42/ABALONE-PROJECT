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
//0 initialize_board                X
//1 is_position_in_range            X
//2 find_ball_by_position           X
//3 find_borders                    X
//4 find_border_direction           X
//5 opposite_direction              X
//6 find_force
//7 find_head
//8 block_check
//9 border_check
//10 direction_check
//11 force_check
//12 turn_color_check
//13 push
//14 move


class Board{

    constructor(){
        let balls = []
        let board = []
        
        let table_lengths = "567898765"
        for (let y = 0; y < 9; y++){
            board.push([])
            for(let x = 0; x < table_lengths[y]; x++){
                board[y].push(x)
            }
        }
    }
    
    initialize_board(state, swapped){
        for (let i = 0; i < state.length / 3; i++){
            id = state[i*3] + state[i*3 + 1]
            if (swapped)
            id = id[0] + (8 - parseInt(id[1])).toString()
            color = state[i*3 + 2]
            x = parseInt(id[0])
            y = parseInt(id[1])
            board[y][x] = color
            console.log(x, y, color, board[y][x])
        }    
        console.log(board)
    }

    is_position_in_range(position){
        let x = null
        let y = null
        if (position.length == 2 || position.length == 3){
            x = position[0]
            y = position[1]
        }
        if (y > 8)
            return false
        
        else if( x >= this.board[y].length)
            return false
        
        else
            return true        
    }

    find_ball_by_position(target_ball, balls=null){
        if(target_ball == null)
            return null;
        if(balls == null)
            balls = this.balls
        if(target_ball.length == 3){
            let target_x = target_ball[0]
            let target_y = target_ball[1]
            let target_color = target_ball[2]
        }
        else if(target_ball.length == 2){
            let target_x = target_ball[0]
            let target_y = target_ball[1]
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
        if(ball.length == 2 || ball.length == 3){
            let x = ball[0]
            let y = ball[1]
        }
        if(y < 4){
            let borders = [[x - 1, y - 1], [x, y - 1],
                       [x - 1, y], [x + 1, y],
                       [x, y + 1], [x + 1, y + 1]]
        }
        else if(y == 4){
            let borders = [[x - 1, y - 1], [x, y - 1],
                       [x - 1, y], [x + 1, y],
                       [x - 1, y + 1], [x, y + 1]]
        }
        else if(y > 4){
            let borders = [[x, y - 1], [x + 1, y - 1],
                       [x - 1, y], [x + 1, y],
                       [x - 1, y + 1], [x, y + 1]]
        }
        let final_borders = []
        for(let i = 0; i < borders.length; i++){
            x = borders[0]
            y = borders[1]
            if(y > 8)
                final_borders.push(null)
            else if(x >= this.board[y].length)
                final_borders.push(null)
            else if(x < 0 || y < 0)
                final_borders.push(null)
            else
                final_borders.push(borders[i])
        }
        return final_borders
    }

    display(){
        //______________
    }

    _display_borders(){
        //_______________
    }

    find_border_direction(ball_position, border_position){
        let borders = this.find_borders(ball_position)
        for (let i = 0; i < borders.length; i++){
            direction = i
            border = borders[i]
            if (border == border_position)
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
        if (this.find_ball_by_position(ball_borders[direction]) in this.balls)
            return attacking_ball
        else
            return false
    }

    find_force(ball, direction, attacking_color){
        let behind = ball
        force = 0
        while(true){
            behind = this.find_ball_by_position(ball)
            if(!ball)
                break
            ball = self.find_ball_by_position(ball)
            if(ball == null)
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
                borders = this.find_borders(ball)
                if(!(this.find_ball_by_position(borders[direction] in balls)))
                    return ball
            }
        }
        else
            return null
    }

}