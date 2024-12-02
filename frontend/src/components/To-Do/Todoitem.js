import React, { useState } from "react"

function Todoitem(props){
    const [isDone, setisDone] = useState(false);

    function handleClick(){
        setisDone(prevValue => {
            return !prevValue
        })
    }
    
    return (
        <div onClick={handleClick}>
            <li style={{textDecoration: isDone ? "line-through" : "none", cursor: "pointer" }}>{props.text}</li>
        </div>
    )
}
export default Todoitem;