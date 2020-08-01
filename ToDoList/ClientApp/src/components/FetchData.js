import React, { Component } from 'react';
import AddTodo from './AddTodo'

export class FetchData extends Component {
    static displayName = FetchData.name;

    constructor(props) {
        super(props);
        this.state = { todos: [], loading: true };
    }

    componentDidMount() {

        this.populateWeatherData();
    }
    delTodo= async (id)=> {
        await fetch('todolist',
            {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: id
            }).then(res => {
                this.setState({

                    todos: [...this.state.todos.filter(todo => todo.id !== id)]
                })
            })
       

    }
     addTodo = async (title)=> {

        await fetch('todolist/add',
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(title)
            }).then(response => response.json()).then(res => {
                this.setState({ todos: [...this.state.todos, res] })
            }
                )

    }
    async markComplete(Todo) {
        console.log("Json:")
        console.log(JSON.stringify(Todo))
        let dbTodo = {...Todo}
        dbTodo.state = !dbTodo.state
        await fetch('todolist/update',
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dbTodo)
            }).then(response => response.text()).then(res => {
                console.log("response is :")
                console.log(res)
                this.setState({
                    todos: this.state.todos.map(todo => {

                        if (todo.id === Todo.id) {
                            todo.state = !todo.state
                        }
                        return todo;
                    })
                });
            });

        
    }
    getStyle = (Todo) => {
        return {
            textDecoration: Todo.state ? 'line-through' : 'none'
        }
    }
    static renderTodos(self , Todos) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Mark</th>
                        <th>Description</th>
                        <th>-</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Todos.map(Todo =>
                            <tr key={Todo.id} >
                                <td><input checked={Todo.state} type="checkbox" onChange={() => self.markComplete(Todo)} /></td>
                            <td style={self.getStyle(Todo)}>{Todo.description}</td>
                            <td>
                                <button onClick={() => self.delTodo(Todo.id)} className="btn-primary text-danger">x</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        var self = this
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : FetchData.renderTodos(self,this.state.todos);

        return (
            <div>
                <h1 id="tabelLabel" >To do list</h1>
                <p>Fetches todos from the server database.</p>
                <AddTodo addTodo={this.addTodo}/>
                {contents}
            </div>
        );
    }

    async populateWeatherData() {
        const response = await fetch('todolist');
        const data = await response.json();
        this.setState({ todos: data, loading: false });
    }
}

