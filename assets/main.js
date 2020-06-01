$(document).ready(function(){
    const currentDate = moment().format("dddd, MMMM Do");
    let hour, task, taskDescription;
    
    $("#currentDay").text(currentDate);
    
    function saveTask(task, hour){
        let taskLog=[];
        let currentTask={time: hour, toDo:task};
        let jsonStr;
        let isRewriteTask =false;

        if ("tasks" in localStorage){
            jsonStr = localStorage.getItem("tasks");
            taskLog = JSON.parse(jsonStr);
            
            for(const timeSlot in taskLog){
                
                if(taskLog[timeSlot].time === hour){
                    taskLog[timeSlot].toDo = task;
                    isRewriteTask=true;
                }                             
            }

            if(isRewriteTask===false){
                taskLog.push(currentTask);
            }

            localStorage.setItem("tasks", JSON.stringify(taskLog));
        }

        if(localStorage.getItem("tasks")===null){
            taskLog.push(currentTask);
            localStorage.setItem("tasks", JSON.stringify(taskLog));
        }

    } 
    
    function loadTasks(){
        $(".time-block").each(function(){
            let pastNoon, time;
            hour = $(this).children(".hour");
            hour = hour.text();
            time = hour.substring(0,2);
            time = parseInt(time);
            
            pastNoon= hour.substring(6,8);

            if(pastNoon==="PM"&& time !=12){
                time+=12;
            }

            let currentHour = moment().hour();

            if(time<currentHour){
                $(this).addClass("past");
            }

            if(time===currentHour){
                $(this).addClass("present");
            }

            if(time>currentHour){
                $(this).addClass("future");
            }
        })


        if("tasks" in localStorage){
            let taskLog = localStorage.getItem("tasks");
            let toDoTask;
            taskLog = JSON.parse(taskLog);
            $(".time-block").each(function(){
                hour = $(this).children(".hour");
                hour = hour.text();

                for(const timeSlot in taskLog){
                    if(hour === taskLog[timeSlot].time){
                        taskDescription = $(this).children(".description")
                        toDoTask= taskLog[timeSlot].toDo;
                        taskDescription.text(toDoTask)
                    }
                }
            })
        }
    }

    $(".saveBtn").click(function(){
        hour = $(this).siblings(".hour");
        hour = hour.text();

        taskDescription= $(this).siblings(".description");
        task = taskDescription.val();

        //console.log("You've said "+task+" for "+hour);
        saveTask(task, hour);
    })

    loadTasks();
})