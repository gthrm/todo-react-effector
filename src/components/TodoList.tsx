import * as React from 'react'
import { Button, Input, Flex, Checkbox, Heading } from '@chakra-ui/react'
import { useStore } from 'effector-react'
import $store, { update, toggle, remove } from '../store'

function TodoListItems() {
  const { todos } = useStore($store)
  return (
    <>
      {todos.map((todo) => (
        <Flex pt={2} key={todo.id}>
          <Checkbox isChecked={todo.done} onChange={() => toggle(todo.id)} />
          <Input mx={2} value={todo.text} onChange={(event) => update({ id: todo.id, text: event.target.value })} />
          <Button onClick={() => remove(todo.id)}>Delete</Button>
        </Flex>
      ))}
    </>
  )
}

function TodoList() {
  return (
    <>
      <Heading>Todo List</Heading>
      <TodoListItems />
    </>
  )
}

export default TodoList
