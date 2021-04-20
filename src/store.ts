import { createEffect, createEvent, createStore } from 'effector-logger/macro'
import { withPersist } from './hocs/withPersist'

// Standard interface and functions
export interface ITodo {
  id: number
  text: string
  done: boolean
}

export const updateTodo = (todos: ITodo[], id: number, text: string): ITodo[] =>
  todos.map((todo) => ({
    ...todo,
    text: todo.id === id ? text : todo.text
  }))

export const toggleTodo = (todos: ITodo[], id: number): ITodo[] =>
  todos.map((todo) => ({
    ...todo,
    done: todo.id === id ? !todo.done : todo.done
  }))

export const removeTodo = (todos: ITodo[], id: number): ITodo[] => todos.filter((todo) => todo.id !== id)

export const addTodo = (todos: ITodo[], text: string): ITodo[] => [
  ...todos,
  {
    id: Math.max(0, Math.max(...todos.map(({ id }) => id))) + 1,
    text,
    done: false
  }
]

// Effector
interface IStore {
  todos: ITodo[]
  newTodo: string
}

const initialState = {
  todos: [],
  newTodo: ''
}

// Events
export const setNewTodo = createEvent<string>()
export const add = createEvent()
export const update = createEvent<{ id: number; text: string }>()
export const toggle = createEvent<number>()
export const remove = createEvent<number>()

// Effects
export const load = createEffect(async (url: string) => {
  const res = await fetch(url)
  return res.json()
})

const store = createStore<IStore>(initialState, { name: 'todos' })

store.on(setNewTodo, (state, newTodo) => ({
  ...state,
  newTodo
}))

store.on(add, (state) => ({
  ...state,
  newTodo: '',
  todos: addTodo(state.todos, state.newTodo)
}))

store.on(update, (state, { id, text }) => ({
  ...state,
  todos: updateTodo(state.todos, id, text)
}))

store.on(toggle, (state, id) => ({
  ...state,
  todos: toggleTodo(state.todos, id)
}))

store.on(remove, (state, id) => ({
  ...state,
  todos: removeTodo(state.todos, id)
}))

store.on(load.doneData, (state, todos) => ({
  ...state,
  todos
}))

export default withPersist(store)
