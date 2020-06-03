    const currentDate = moment().format("dddd, MMMM Do");
    
    $("#currentDay").text(currentDate);
    
    function saveTask(task, hour){
        hourChecker();

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

        // remove current classes if they have been applied
        $(".time-block").each(function(){
            $(".container>row.past").removeClass("past");
            $(".container>row.present").removeClass("present");
            $(".container>row.future").removeClass("future");
            
            //get time block text and retrive numerical value
            const hour = $(this).children(".hour").text();
            let timeStr = hour.substring(0,2);
            let time = parseInt(timeStr);
            
            //get if it is AM or PM
            const pastNoon= hour.substring(6,8);

            //if it is AM or PM add 12 to the count
            if(pastNoon==="PM"&& time !=12){
                time+=12;
            }

            let currentHour = moment().hour();

            //add appropriate classes based on time
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
                let hour = $(this).children(".hour").text();
                
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

    function leadingZero(num){
        if (num < 10 && num >= 0)
            return '0' + num;
        else
            return num;
    }

    function createTimeBlocks(){
        //wrkDay is the first hour that work starts & how long the work day is in hours
        let wrkDay = [8,10]

        for(let i = 0; i<wrkDay[1]; i++){
            let wrkHour = i+wrkDay[0]
            let timeDisplayed = `${leadingZero(wrkHour)}:00`;

            if (wrkHour<=11){
                timeDisplayed += " AM"
            }else if(wrkHour>=13){
                timeDisplayed = `${leadingZero((wrkHour-12))}:00 PM`
            } else{
                timeDisplayed += " PM"
            }
            
            let divTimeBlock = $("<div></div>");
            divTimeBlock.addClass("row time-block");

            let divHour = $("<div></div>");
            divHour.addClass("col-2 hour");
            divHour.text(timeDisplayed)
            
            let textArea = $("<textarea></textarea>");
            textArea.addClass("col-8 description");

            let button = $("<button></button>");
            button.addClass("col-2 fas fa-save saveBtn");


            divTimeBlock.append(divHour);
            divTimeBlock.append(textArea);
            divTimeBlock.append(button);

            $(".container").append(divTimeBlock);
        }
    }

    createTimeBlocks();

    loadTasks();

    let timerCheck = setInterval(hourChecker, 900000);

    $(".saveBtn").click(function(){
        let hour = $(this).siblings(".hour").text();

        let task= $(this).siblings(".description").val();

        saveTask(task, hour);
    })
