import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

/** @typedef {{id: string, content: string}} Task */

/**
 * @param {Object} props
 * @param {(task: Task | null) => void} props.onTaskSelect
 * @param {(handlers: { completeAndNext: () => void; selectNext: () => void }) => void} [props.onRegisterFocusHandlers]
 */
function TaskManager({ onTaskSelect, onRegisterFocusHandlers }) {
  const [activeTasks, setActiveTasks] = useState(/** @type {Task[]} */ ([]));
  const [completedTasks, setCompletedTasks] = useState(/** @type {Task[]} */ ([]));
  const [newTask, setNewTask] = useState('');
  const [currentTask, setCurrentTask] = useState(/** @type {Task | null} */ (null));

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setActiveTasks(prevTasks => [...prevTasks, { id: Date.now().toString(), content: newTask }]);
      setNewTask('');
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceList = source.droppableId === 'activeTasks' ? activeTasks : completedTasks;
    const destList = destination.droppableId === 'activeTasks' ? activeTasks : completedTasks;

    const [removed] = sourceList.splice(source.index, 1);
    destList.splice(destination.index, 0, removed);

    if (source.droppableId === 'activeTasks') {
      setActiveTasks([...sourceList]);
    } else {
      setCompletedTasks([...sourceList]);
    }

    if (destination.droppableId === 'activeTasks') {
      setActiveTasks([...destList]);
    } else {
      setCompletedTasks([...destList]);
    }
  };

  const selectTask = () => {
    if (activeTasks.length > 0) {
      const [selectedTask, ...remainingTasks] = activeTasks;
      setCurrentTask(selectedTask);
      setActiveTasks(remainingTasks);
      onTaskSelect(selectedTask);
    }
  };

  const completeTask = () => {
    if (currentTask) {
      setCompletedTasks(prevTasks => [currentTask, ...prevTasks]);
      setCurrentTask(null);
      onTaskSelect(null);
    }
  };

  const returnTaskToList = () => {
    if (currentTask) {
      setActiveTasks(prevTasks => [currentTask, ...prevTasks]);
      setCurrentTask(null);
      onTaskSelect(null);
    }
  };

  // Register focus mode handlers so App can complete/select tasks when in focus mode
  const completeAndNext = useCallback(() => {
    if (currentTask) {
      setCompletedTasks(prevTasks => [currentTask, ...prevTasks]);
      if (activeTasks.length > 0) {
        const [selectedTask, ...remainingTasks] = activeTasks;
        setCurrentTask(selectedTask);
        setActiveTasks(remainingTasks);
        onTaskSelect(selectedTask);
      } else {
        setCurrentTask(null);
        onTaskSelect(null);
      }
    }
  }, [currentTask, activeTasks, onTaskSelect]);

  const selectNext = useCallback(() => {
    if (activeTasks.length > 0) {
      const [selectedTask, ...remainingTasks] = activeTasks;
      setCurrentTask(selectedTask);
      setActiveTasks(remainingTasks);
      onTaskSelect(selectedTask);
    }
  }, [activeTasks, onTaskSelect]);

  useEffect(() => {
    onRegisterFocusHandlers?.({ completeAndNext, selectNext });
  }, [onRegisterFocusHandlers, completeAndNext, selectNext]);

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
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <h3 className="font-bold mb-2"> Tasks to Complete</h3>
            <Droppable droppableId="activeTasks">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef} className="bg-gray-100 p-4 rounded min-h-[100px]">
                  {activeTasks.map((task, index) => (
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
          </div>

          <div className="w-full md:w-1/2">
            <h3 className="font-bold mb-2">Completed Tasks</h3>
            <Droppable droppableId="completedTasks">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef} className="bg-gray-100 p-4 rounded min-h-[100px]">
                  {completedTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-2 mb-2 rounded shadow line-through"
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
          </div>
        </div>
      </DragDropContext>

      {currentTask ? (
        <div className="mt-4 p-4 bg-white rounded shadow">
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