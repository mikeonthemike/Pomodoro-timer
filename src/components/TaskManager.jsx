import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function TaskManager({ onTaskSelect }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [currentTask, setCurrentTask] = useState(null);

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), content: newTask }]);
      setNewTask('');
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
  };

  const selectTask = () => {
    if (tasks.length > 0) {
      const selectedTask = tasks[0];
      setCurrentTask(selectedTask);
      setTasks(tasks.slice(1));
      onTaskSelect(selectedTask);
    }
  };

  const completeTask = () => {
    setCurrentTask(null);
    onTaskSelect(null);
  };

  const returnTaskToList = () => {
    if (currentTask) {
      setTasks([currentTask, ...tasks]);
      setCurrentTask(null);
      onTaskSelect(null);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={addTask} className="mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded">Add Task</button>
      </form>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className="bg-gray-100 p-4 rounded">
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-white p-2 mb-2 rounded shadow"
                    >
                      {task.content}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      {currentTask ? (
        <div className="mt-4">
          <h3 className="font-bold">Current Task:</h3>
          <p>{currentTask.content}</p>
          <button onClick={completeTask} className="mt-2 bg-green-500 text-white p-2 rounded mr-2">Complete</button>
          <button onClick={returnTaskToList} className="mt-2 bg-yellow-500 text-white p-2 rounded">Return to List</button>
        </div>
      ) : (
        <button onClick={selectTask} className="mt-4 bg-blue-500 text-white p-2 rounded">Start Next Task</button>
      )}
    </div>
  );
}

export default TaskManager;