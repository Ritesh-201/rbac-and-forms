import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Clock, User, Plus, Circle, AlertCircle, CheckCircle, Lock, Package, Edit } from 'lucide-react';
import { Task, Column, BoardData, User as UserType } from '../../types/rbac';
import { useAbility } from '../../hooks/useAbility';
import TaskModal from './TaskModal';
import Tooltip from '../UI/Tooltip';
import styles from './KanbanBoard.module.css';

interface KanbanBoardProps {
  boardData: BoardData;
  currentUser: UserType;
  onBoardUpdate: (newBoardData: BoardData) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ boardData, currentUser, onBoardUpdate }) => {
  const ability = useAbility(currentUser);
  const [modalState, setModalState] = React.useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    task?: Task;
    columnId?: string;
  }>({
    isOpen: false,
    mode: 'create'
  });

  const canCreateTask = ability.can('create', 'Task');
  const canUpdateAnyTask = ability.can('update', 'Task');

  const getColumnIcon = (columnId: string) => {
    switch (columnId) {
      case 'todo':
        return <Circle className={`${styles.columnIcon} ${styles.todo}`} />;
      case 'inprogress':
        return <AlertCircle className={`${styles.columnIcon} ${styles.inprogress}`} />;
      case 'done':
        return <CheckCircle className={`${styles.columnIcon} ${styles.done}`} />;
      default:
        return <Package className={styles.columnIcon} />;
    }
  };

  const canMoveTask = (task: Task): boolean => {
    if (currentUser.role === 'guest') return false;
    if (currentUser.role === 'admin') return true;
    return task.assignedTo === currentUser.id;
  };

  const isOwnTask = (task: Task): boolean => {
    return task.assignedTo === currentUser.id;
  };

  const canEditTask = (task: Task): boolean => {
    if (currentUser.role === 'guest') return false;
    if (currentUser.role === 'admin') return true;
    // Employee can edit if the task is assigned to them (matching by ID)
    return task.assignedTo === currentUser.id;
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const task = boardData.tasks[draggableId];
    if (!canMoveTask(task)) {
      return;
    }

    const start = boardData.columns[source.droppableId];
    const finish = boardData.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newBoardData = {
        ...boardData,
        columns: {
          ...boardData.columns,
          [newColumn.id]: newColumn,
        },
      };

      onBoardUpdate(newBoardData);
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const updatedTask = {
      ...task,
      status: destination.droppableId as Task['status'],
    };

    const newBoardData = {
      ...boardData,
      tasks: {
        ...boardData.tasks,
        [draggableId]: updatedTask,
      },
      columns: {
        ...boardData.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    onBoardUpdate(newBoardData);
  };

  const handleCreateTask = (columnId: string) => {
    setModalState({
      isOpen: true,
      mode: 'create',
      columnId
    });
  };

  const handleEditTask = (task: Task) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      task
    });
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (modalState.mode === 'create' && modalState.columnId) {
      const newTaskId = `task-${Date.now()}`;
      const newTask: Task = {
        id: newTaskId,
        title: taskData.title!,
        description: taskData.description!,
        assignedTo: taskData.assignedTo!,
        assignedToName: taskData.assignedToName!,
        status: modalState.columnId as Task['status'],
        priority: taskData.priority!,
        createdAt: new Date().toISOString().split('T')[0],
        dueDate: taskData.dueDate
      };

      const column = boardData.columns[modalState.columnId];
      const newColumn = {
        ...column,
        taskIds: [...column.taskIds, newTaskId],
      };

      const newBoardData = {
        ...boardData,
        tasks: {
          ...boardData.tasks,
          [newTaskId]: newTask,
        },
        columns: {
          ...boardData.columns,
          [modalState.columnId]: newColumn,
        },
      };

      onBoardUpdate(newBoardData);
    } else if (modalState.mode === 'edit' && modalState.task) {
      const updatedTask = {
        ...modalState.task,
        ...taskData
      };

      const newBoardData = {
        ...boardData,
        tasks: {
          ...boardData.tasks,
          [modalState.task.id]: updatedTask,
        },
      };

      onBoardUpdate(newBoardData);
    }
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: 'create'
    });
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.board}>
          {boardData.columnOrder.map((columnId) => {
            const column = boardData.columns[columnId];
            const tasks = column.taskIds.map((taskId) => boardData.tasks[taskId]);

            return (
              <div key={column.id} className={styles.column}>
                <div className={styles.columnHeader}>
                  <div className={styles.columnTitle}>
                    {getColumnIcon(columnId)}
                    {column.title}
                  </div>
                  <div className={styles.taskCount}>{tasks.length}</div>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={styles.taskList}
                    >
                      {tasks.length === 0 ? (
                        <div className={styles.emptyState}>
                          <Package className={styles.emptyStateIcon} />
                          <div className={styles.emptyStateText}>No tasks yet</div>
                        </div>
                      ) : (
                        tasks.map((task, index) => {
                          const canMove = canMoveTask(task);
                          const isOwn = isOwnTask(task);

                          return (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
                              index={index}
                              isDragDisabled={!canMove}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`${styles.task} ${
                                    snapshot.isDragging ? styles.dragging : ''
                                  } ${!canMove ? styles.readOnly : ''} ${
                                    isOwn ? styles.ownTask : ''
                                  }`}
                                >
                                  <div className={styles.taskHeader}>
                                    <div className={styles.taskTitle}>{task.title}</div>
                                    <div className={`${styles.priorityBadge} ${styles[task.priority]}`}>
                                      {task.priority}
                                    </div>
                                  </div>

                                  <div className={styles.taskDescription}>
                                    {task.description}
                                  </div>

                                  {canEditTask(task) && (
                                    <button
                                      className={styles.editButton}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditTask(task);
                                      }}
                                      title="Edit task"
                                    >
                                      <Edit size={14} />
                                    </button>
                                  )}

                                  <div className={styles.taskFooter}>
                                    <Tooltip content={`Assigned to: ${task.assignedToName}`}>
                                      <div className={styles.assignee}>
                                        <User className={styles.assigneeIcon} />
                                        {task.assignedToName}
                                      </div>
                                    </Tooltip>

                                    {task.dueDate && (
                                      <Tooltip content={`Due date: ${task.dueDate}`}>
                                        <div className={styles.dueDate}>
                                          <Clock className={styles.dueDateIcon} />
                                          {task.dueDate}
                                        </div>
                                      </Tooltip>
                                    )}
                                  </div>

                                  {!canMove && (
                                    <div className={styles.permissionOverlay}>
                                      <Tooltip content={`You cannot move this task. ${
                                        currentUser.role === 'guest' 
                                          ? 'Guests have read-only access.' 
                                          : 'You can only move tasks assigned to you.'
                                      }`}>
                                        <Lock className={styles.permissionIcon} />
                                      </Tooltip>
                                    </div>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          );
                        })
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                {canCreateTask && (
                  <Tooltip content={`Add a new task to ${column.title}. ${
                    currentUser.role === 'admin' 
                      ? 'As an admin, you can create tasks for any team member.' 
                      : 'You can create tasks assigned to yourself.'
                  }`}>
                    <button
                      className={styles.addTaskButton}
                      onClick={() => handleCreateTask(column.id)}
                    >
                      <Plus size={16} />
                      Add Task
                    </button>
                  </Tooltip>
                )}
              </div>
            );
          })}
        </div>
      </DragDropContext>
      
      <TaskModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onSave={handleSaveTask}
        task={modalState.task}
        currentUser={currentUser}
        mode={modalState.mode}
      />
    </>
  );
};

export default KanbanBoard;