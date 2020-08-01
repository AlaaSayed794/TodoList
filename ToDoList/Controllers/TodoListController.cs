using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Serialization;

namespace ToDoList.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TodoListController : ControllerBase
    {


        private readonly ILogger<TodoListController> _logger;
        private readonly ApplicationDbContext _db;


        public TodoListController(ILogger<TodoListController> logger, ApplicationDbContext db)
        {
            _logger = logger;
            _db = db;
        }

        [HttpGet]
        public IEnumerable<TodoList> Get()
        {
            return (_db.TodoList.ToArray());
        }
        [HttpPost]
        [Route("Add")]
        public TodoList Add([FromBody] string title)
        {
            TodoList dbItem = new TodoList { Description = title, State = false };
            _db.TodoList.Add(dbItem);
            _db.SaveChanges();
            return dbItem;

        }

        [HttpPost]
        [Route("Update")]
        public bool Update([FromBody] TodoList todolist)
        {
            //Console.WriteLine(todolist.Description);
            var dbItem =  _db.TodoList.Find(todolist.Id);
            dbItem.Description = todolist.Description;
            dbItem.State = todolist.State;
            _db.SaveChanges();
            return dbItem.State;

        }
        [HttpDelete]
        public void Delete([FromBody] int id)
        {
            var dbItem = _db.TodoList.Find(id);
            _db.Remove(dbItem);
            _db.SaveChanges();
      

        }
    }
}
