using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;

namespace TaskManagerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private static List<TaskItem> Tasks = new List<TaskItem>
        {
            new TaskItem { Id = 1, Title = "Sample Task 1", Description = "Description 1", DueDate = "2025-02-01", Priority = "High", Completed = false },
            new TaskItem { Id = 2, Title = "Sample Task 2", Description = "Description 2", DueDate = "2025-02-15", Priority = "Medium", Completed = false }
        };

        [HttpGet]
        public IActionResult GetTasks()
        {
            return Ok(Tasks);
        }

        [HttpPost]
        public IActionResult AddTask([FromBody] TaskItem newTask)
        {
            if (string.IsNullOrWhiteSpace(newTask.Title))
                return BadRequest("Task title cannot be empty.");

            newTask.Id = Tasks.Count + 1;
            Tasks.Add(newTask);
            return Ok(newTask);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateTask(int id, [FromBody] TaskItem updatedTask)
        {
            var task = Tasks.FirstOrDefault(t => t.Id == id);
            if (task == null) return NotFound();

            task.Title = updatedTask.Title;
            task.Description = updatedTask.Description;
            task.DueDate = updatedTask.DueDate;
            task.Priority = updatedTask.Priority;
            task.Completed = updatedTask.Completed;

            return Ok(task);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTask(int id)
        {
            var task = Tasks.FirstOrDefault(t => t.Id == id);
            if (task == null) return NotFound();

            Tasks.Remove(task);
            return NoContent();
        }
    }

    public class TaskItem
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string DueDate { get; set; }
        public string Priority { get; set; }
        public bool Completed { get; set; }
    }
}
