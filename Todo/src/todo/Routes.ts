import { Router } from 'express'
import TodoController from './Controller.js'

const router = Router()
const controller = new TodoController()
//        |
//    New object bnake current object se call  


// bind(controller) ensures that inside the controller methods
// the `this` keyword correctly refers to the controller instance.
// Without bind(), Express would call the function without the class context,
// causing `this` to become undefined and class properties (like services)
// would not be accessible.

router.get('/', controller.handleGetAllTodos.bind(controller))
// router.get('/:id')

// router.post('/', controller.handleInsertTodo.bind(controller))

// router.put('/:id')
// router.delete('/:id')

export default router