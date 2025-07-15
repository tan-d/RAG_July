# Change Log

All notable changes to the "kudosflow" extension will be documented in this file.

## [v1.3.2]

- kudosflow.asking can now keep only listed functions when inputting a file.
    1. file:./path/to/file|func1,func2 (keep only listed functions)
    2. file:./path/to/file!func1,func2 (exclude listed functions)

        ```typescript
        import { useState } from 'react'
        import TodoForm from './components/TodoForm'
        import TodoItem from './components/TodoItem'

        const App = () => {
        const [todos, setTodos] = useState([])

        const addTodo = (text) => {
            setTodos([...todos, { id: Date.now(), text, completed: false }])
        }

        const toggleTodo = (id) => {
            setTodos(todos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            ))
        }

        const deleteTodo = (id) => {
            setTodos(todos.filter(todo => todo.id !== id))
        }

        return (
            <div className="max-w-lg mx-auto mt-10 p-4">
            <h1 className="text-2xl font-bold mb-4">Todo App</h1>
            <TodoForm onAdd={addTodo} />
            <div className="bg-white rounded shadow">
                {todos.map(todo => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                />
                ))}
                {todos.length === 0 && (
                    <p className="p-4 text-gray-500">No todos yet. Add one above!</p>
                )}
            </div>
            </div>
        )
        }

        export default App

        ```

        1. file:./src/App.jsx|App,toggleTodo
        2. file:./path/to/file!addTodo,deleteTodo

        ```typescript
        import { useState } from 'react'
        import TodoForm from './components/TodoForm'
        import TodoItem from './components/TodoItem'

        const App = () => {
        const [todos, setTodos] = useState([])

        const toggleTodo = (id) => {
            setTodos(todos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            ))
        }

        return (
            <div className="max-w-lg mx-auto mt-10 p-4">
            <h1 className="text-2xl font-bold mb-4">Todo App</h1>
            <TodoForm onAdd={addTodo} />
            <div className="bg-white rounded shadow">
                {todos.map(todo => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                />
                ))}
                {todos.length === 0 && (
                    <p className="p-4 text-gray-500">No todos yet. Add one above!</p>
                )}
            </div>
            </div>
        )
        }

        export default App

        ```

## [v1.3.1]
- Missing to edit README.md

## [v1.3.0]
- Markdown file(.md) is now split by section when registered in RAG.
    - Simplified development with llms-full.txt.
- Specific classes or functions can now be excluded when inputting a file.
    - Example: file:src/App.tsx!func1,func2,func3
- New button messages added under `"kudosflow.messages"`:
    - kudosflow.messages.asking
    - kudosflow.messages.askingImage
    - example...
  ```json
    "kudosflow.messages": {    
        "kudosflow.messages.asking": "CAUTION: If answering a question requires checking specific files in the project, do not provide an answer immediately. Instead, prompt the user with the following message: \"Please provide the actual filename including its full path.\" When the user’s request involves adding or modifying multiple files, follow these steps: 1. First, list all relevant filenames with their full paths. 2. Wait for the user to confirm or specify which file to proceed with. 3. Then, show only the additions or modifications for the selected file. 4. Repeat this process for each file individually.",
        "kudosflow.messages.askingImage": "CAUTION: If answering a question requires checking specific files in the project, do not provide an answer immediately. Instead, prompt the user with the following message: \"Please provide the actual filename including its full path.\" When the user’s request involves adding or modifying multiple files, follow these steps: 1. First, list all relevant filenames with their full paths. 2. Wait for the user to confirm or specify which file to proceed with. 3. Then, show only the additions or modifications for the selected file. 4. Repeat this process for each file individually.",   
    },

## [v1.2.0]

- Added support for direct file input using the "Direct asking" button with the file: prefix
    - Example: file:src/App.tsx
- Included node_modules in the .vsix package

## [v1.1.0]

- Add template button for querying
    -  create template.txt in .kudoflow folder and replace some variables to your project information below
        - ${{kudosflow_tree}} : project construction
        - ${{kudosflow_filename}} : current filename
        - ${{kudosflow_content}} : current file content
        - ${{kudosflow_terminal}} : terminal log
        - ${{kudosflow_query}} : query
- Some buttons below are deprecated
    - use "Direct asking" button instead of below
        - bugAssessment
        - vulnerabilityAssessment
        - speedEnhancement
        - etcEnhancement
        - makeTest
        - makeComment

## [v1.0.0]

- Initial release
