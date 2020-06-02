// $(document).ready is not needed if js file is imported at the bottom of the html
const currentDate = moment().format("dddd, MMMM Do");
let hour;
// task, taskDescription arent shared among functions, so I would move them to where they are used  
$("#currentDay").text(currentDate);
function saveTask(task, hour) {
  let taskLog = [];
  let currentTask = { time: hour, toDo: task };
  let jsonStr;
  let isRewriteTask = false;
  // I never seen in operator inside if statement, love it!!!
  if ("tasks" in localStorage) {
    jsonStr = localStorage.getItem("tasks");
    console.log(jsonStr);
    taskLog = JSON.parse(jsonStr);
    for (const timeSlot in taskLog) {
      if (taskLog[timeSlot].time === hour) {
        taskLog[timeSlot].toDo = task;
        isRewriteTask = true;
      }
    }
    if (isRewriteTask === false) {
      taskLog.push(currentTask);
    }
    localStorage.setItem("tasks", JSON.stringify(taskLog));
  }
  if (localStorage.getItem("tasks") === null) {
    taskLog.push(currentTask);
    localStorage.setItem("tasks", JSON.stringify(taskLog));
  }
}
function loadTasks() {
    // nice!
  $(".time-block").each(function () {
    // we can avoid reasigning hour, and use const
    hour = $(this).children(".hour").text();
    // we would use let here because we are reasigning the value
    // but in general I would avoid assigning different types of data structures (number and string here) to the same value. 
    let time = hour.substring(0, 2);
    time = parseInt(time);
    // we use const here because we aren't reasigning the value
    const pastNoon = hour.substring(6, 8);
    if (pastNoon === "PM" && time != 12) {
      time += 12;
    }
    const currentHour = moment().hour();
    if (time < currentHour) {
      $(this).addClass("past");
    }
    if (time === currentHour) {
      $(this).addClass("present");
    }
    if (time > currentHour) {
      $(this).addClass("future");
    }
  });
  if ("tasks" in localStorage) {
    // same as with time above
    let taskLog = localStorage.getItem("tasks");
    taskLog = JSON.parse(taskLog);
    $(".time-block").each(function () {
      let hour = $(this).children(".hour").text();
      console.log("Here is hour: "+ hour);
      for (const timeSlot in taskLog) {
        if (hour === taskLog[timeSlot].time) {
          const taskDescription = $(this).children(".description");
          const toDoTask = taskLog[timeSlot].toDo;
          taskDescription.text(toDoTask);
        }
      }
    });
  }
}
$(".saveBtn").click(function () {
  hour = $(this).siblings(".hour");
  hour = hour.text();
  taskDescription = $(this).siblings(".description");
  task = taskDescription.val();
  saveTask(task, hour);
});
loadTasks();