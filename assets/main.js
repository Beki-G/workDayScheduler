$(document).ready(function(){
    const currentDate = moment().format("dddd, MMMM Do");
    let hour, task, taskDescription;
    
    $("#currentDay").text(currentDate);
    //how to get current hour
    //console.log(moment().format("ddd, hA"));
    
    function saveTask(task, hour){
        let taskLog=[];
        let currentTask={time: hour, toDo:task};
        let jsonStr;
        let isRewriteTask =false;

        //console.log(currentTask)

        if ("tasks" in localStorage){
            jsonStr = localStorage.getItem("tasks");
            taskLog = JSON.parse(jsonStr);
            //console.log(taskLog)
            
            for(const timeSlot in taskLog){
                //console.log(taskLog[timeSlot].time)
                
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
                        //console.log("found a match in "+ hour)
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


