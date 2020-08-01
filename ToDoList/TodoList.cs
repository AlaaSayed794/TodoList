using System;
using System.ComponentModel.DataAnnotations;

namespace ToDoList
{
    public class TodoList
    {
        [Key]
        public int Id { get; set; }


        public bool State { get; set; }
        [Required]
        public string Description { get; set; }

    }
}
