<h1 align="center">kudosflow</h1>

<h4 align="center">
  <a href="#settings">Settings</a>
  ·
  <a href="#features">Features</a>
  ·
  <a href="https://github.com/akudo7/kudosflow/issues">Support</a>
</h4>

<p align="left">
kufosflow is a Flowise-like LangChain extension for VSCode that uses an innovative AI flow management engine (SceneGraphManager) and brings an AI chatbot right into your editor. Use it as your AI programming assistant to understand complex code, make improvements, or generate comments. To get started, launch it from the Command Menu, highlight a piece of code, click the plus icon on the left to open a chat, and start talking—just like in ChatGPT. All your conversations are saved in the chat history and can be exported as a JSON file.
</p>
  <p align="center">
    <img src="https://github.com/akudo7/kudos-gpt/raw/HEAD/kudosflow.png"/>
  </p>
&nbsp;

# New features

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

<p align="center">
  <img src="https://github.com/akudo7/kudosflow/raw/HEAD/images/v120.gif" />
</p>

&nbsp;

# Settings & Features

kudosflow provides powerful features for making requests to AI through an intuitive and easy-to-use interface.
So see in detail at the <a href="https://github.com/akudo7/kudosflow/blob/main/README.md">README.md on the Github.</a>

&nbsp;

# Technology overview

SceneGraphManager is an innovative AI flow management engine that dramatically accelerates enterprise AI adoption. This solution provides functionality to automatically execute LangChain applications from LLM application definitions described in JSON files. Implemented as a TypeScript library, it can be directly integrated into existing systems, significantly reducing system integration barriers.

The core functionality lies in its ability to visually design LLM applications and save/load them as JSON. Developers can execute different LLM applications simply by switching JSON files, dramatically reducing development and maintenance costs. As it's provided as a library, it operates in environments isolated from networks, such as desktop applications, embedded systems, and IoT devices. This enables AI utilization even in environments handling highly confidential information.

SceneGraphManager supports Flowise-compatible JSON format, allowing seamless import of AI flows designed and developed in existing Flowise environments. This enables an efficient workflow where AI flows can be designed using Flowise's intuitive visual interface and integrated into production environments through SceneGraphManager. AI applications verified in Flowise environments can be integrated into production systems without code changes, significantly shortening the development-to-deployment cycle.

Furthermore, it provides a more integrated development experience through the kudosflow VSCode extension. kudosflow provides a ReactFlow-based visual editor within VSCode, working in conjunction with SceneGraphManager. Developers can design, test, and debug AI flows without leaving their code editor, dramatically improving development efficiency. AI flows created in kudosflow are output as JSON directly executable by SceneGraphManager.

Technically, it's implemented as a directed acyclic graph engine, efficiently managing and executing LangChain component nodes. It analyzes node dependencies from JSON and automatically determines optimal execution order, eliminating the need for developers to spend time on complex workflow design.

SceneGraphManager's greatest strength is the democratization of AI application development. It enables general developers to implement sophisticated LLM applications that traditionally required AI specialists. This allows enterprises to rapidly deploy high-business-value AI solutions while significantly reducing AI implementation time and costs.

<p align="center">
<img src="https://github.com/akudo7/kudosflow/raw/HEAD/images/SceneGraphManager.png" />
</p>

Here's a translation of the introduction to LangChain nodes supported by SceneGraphManager:

- Chains
  - Conversational Retrieval QA Chain
  - Conversational Chain
- Chat model
  - Anthropic
  - OpenAI
  - Azure OpenAI
  - Ollama
- Embeddings
  - OpenAI Embeddings
  - Azure OpenAI Embeddings
  - Ollama Embeddings
- Memory
  - Buffer Memory
  - Redis Backed Chat Memory
- Vector Store Retriever
  - Weaviate
  - Qdrant

&nbsp;

# **Hand-crafted by [Akira Kudo](https://www.linkedin.com/in/akira-kudo-4b04163/) in Tokyo, Japan**
Feel free contact me if you are interested in SceneGraphManager!
<p align="center">Copyright and Reserved &copy; 2023-present Akira Kudo</p>
