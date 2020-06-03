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

    function hourChecker(){
        console.log("15 min mark")
        $(".time-block").each(function(){
            $(".container>row.past").removeClass("past");
            $(".container>row.present").removeClass("present");
            $(".container>row.future").removeClass("future");
            
            hour = $(this).children(".hour").text();
            // hour = hour.text();
            let timeStr = hour.substring(0,2);
            let time = parseInt(timeStr);
            
            const pastNoon= hour.substring(6,8);

            if(pastNoon==="PM"&& time !=12){
                time+=12;
            }

            let currentHour = moment().hour();

            if(time<currentHour){
                $(this).addClass("past");
            }else if(time===currentHour){
                $(this).addClass("present");
            }else{
                $(this).addClass("future");
            }
        })


    }
    
    function loadTasks(){
        hourChecker();

        if("tasks" in localStorage){
            let taskLog = localStorage.getItem("tasks");
            taskLog = JSON.parse(taskLog);
            $(".time-block").each(function(){
                hour = $(this).children(".hour").text();
                
                for(const timeSlot in taskLog){
                    if(hour === taskLog[timeSlot].time){
                        taskDescription = $(this).children(".description")
                        let toDoTask= taskLog[timeSlot].toDo;
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

    let timerCheck = setInterval(hourChecker, 900000);
