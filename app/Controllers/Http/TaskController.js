'use strict'

const Task = use('App/Models/Task')
const { validate } = use('Validator')

class TaskController {
  async index({ view }) {
    const tasks = await Task.all()

    return view.render('tasks.index', {
      tasks: tasks.toJSON()
    })
  }

  async store({ request, response, session }) {
    const validation = await validate(request.all(), {
      title: 'required|min:3|max:255',
      description: 'required|min:15'
    })

    if(validation.fails()) {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }

    const task = new Task()
    task.title = request.input('title')
    task.description = request.input('description')
    await task.save()

    session.flash({ notification: 'Task added!' })

    return response.redirect('back')
  }

  async edit({ request, response, params, view }) {
    const task_id = params.id
    const task = await Task.find(task_id)

    return view.render('tasks.edit', {
      task: task.toJSON()
    })
  }

  async update({ request, response, params, session }) {
    const validation = await validate(request.all(), {
      title: 'required|min:3|max:255',
      description: 'required|min:15'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }

    const task = await Task.find(params.id)
    task.title = request.input('title')
    task.description = request.input('description')
    await task.save()

    session.flash({ notification: 'Task updated!' })

    return response.redirect('/')

  }

  async destroy({ params, session, response }) {
    const task = await Task.find(params.id)
    await task.delete()

    // Fash success message to session
    session.flash({ notification: 'Task deleted!' })

    return response.redirect('back')
  }
}

module.exports = TaskController
