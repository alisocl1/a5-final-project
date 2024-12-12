import React, { useState, useEffect, useRef } from 'react';
import { FaPalette } from 'react-icons/fa';
import { Plus, Trash2, FilePenLine, CircleAlert, Palette, Sticker } from 'lucide-react';
import './task-list.css';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [isFormVisible, setFormVisible] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [newTask, setNewTask] = useState({
        description: "",
        priority: "",
        color: "",
        status: "incomplete",
        notes: "",
    })
    const [dropdownVisible, setDropdownVisible] = useState({
        priority: false,
        color: false,
    });

    // colors for color dropdown (may need to edit later)
    const colors = [
        { name: "apple red", hex: "#d62121"},
        { name: "sunset orange", hex: "#ff7e26"},
        { name: "mint green", hex: "#00d27f"},
        { name: "sky blue", hex: "#87ceeb"},
        { name: "soft violet", hex: "#cab1e3"},
        { name: "blush pink", hex: "#ff6289"},
        { name: "pastel brown", hex: "#a19584"},
        { name: "midnight black", hex: "#1e1e1e"},
    ]

    // load tasks from local storage
    useEffect(() => {
        let storedTasks;
        if (localStorage.getItem('tasks')) {
            storedTasks = JSON.parse(localStorage.getItem('tasks') || []);
        } else {
            storedTasks = localStorage.getItem('tasks') || [];
        }
        setTasks(storedTasks);
    }, []);

    const priorityRef = useRef(null);
    const colorRef = useRef(null);


    // closes input form when user clicks anywhere outside of it
    useEffect(() => {
        const clickOutside = (e) => {
            if (
                priorityRef.current &&
                !priorityRef.current.contains(e.target) &&
                colorRef.current &&
                !colorRef.current.contains(e.target)
            ) {
                setDropdownVisible({ priority: false, color: false })
            }
        };

        document.addEventListener('click', clickOutside);
        return () => {
            document.removeEventListener('click', clickOutside);
        };
    }, []);

    // gets corresponding hex to color name when repopulating color field
    const getHexColor = (colorName) => {
        const color = colors.find(c => c.name === colorName);
        return color ? color.hex : colorName;
    }

    // saves task
    const handleSaveTask = (newTasks) => {
        localStorage.setItem('tasks', JSON.stringify(newTasks));
        setTasks(newTasks);
    };

    // saves new task and resets input form
    const handleAddTask = async () => {
        if (!newTask.description.trim()) {
            alert("Title is required!")
            return;
        }
        let updatedTasks;
        if (editingTask) {
            updatedTasks = tasks.map((task) =>
                task.id === editingTask.id ? { ...newTask, id: editingTask.id } : task
            );
            setEditingTask(null);
        } else {
            updatedTasks = [...tasks, { ...newTask, id: Date.now() }];
        }

        const sortedTasks = sortTasks(updatedTasks);
        handleSaveTask(sortedTasks)
        setNewTask({ description: "", priority: "", color: "", status: "incomplete", notes: "" });
        setFormVisible(false);
    };

    // sorts tasks (by status, then priority, then alphabetically) 
    const sortTasks = (tasks) => {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return [...tasks].sort((a, b) => {

            if (a.status === 'completed' && b.status !== 'completed') return 1;
            if (b.status === 'completed' && a.status !== 'completed') return -1;

            const priorityA = priorityOrder[a.priority] || 4;
            const priorityB = priorityOrder[b.priority] || 4;

            if (priorityA !== priorityB) return priorityA - priorityB;
            return a.description.localeCompare(b.description);
        });
    };

    // changes status of a task
    const handleUpdateTaskStatus = async (taskId, status) => {
        const updatedTasks = tasks.map((task) =>
            task.id === taskId ? { ...task, status } : task
        );
        handleSaveTask(updatedTasks);
    };

    // deletes task
    const handleDeleteTask = async (taskId) => {
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        handleSaveTask(updatedTasks)
    };

    // handles changes to title and notes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask((prev) => ({ ...prev, [name]: value}));
    };

    // toggles dropdown for priority and color open
    const toggleDropdown = (field) => {
        setDropdownVisible((prev) => ({
            priority: field === "priority" ? !prev.priority : false,
            color: field === "color" ? !prev.color : false,
        }));
    };

    // handles selection of priority and color
    const handleOptionSelect = (field, value) => {
        setNewTask((prev) => ({ 
            ...prev, 
            [field]: value === "none" ? "" : value }));
        setDropdownVisible((prev) => ({ ...prev, [field]: false }));
    };

    return (
        <div className="task-list-container">
            <div className="task-list-header">
                <p>My Tasks</p>
                <div className="item-seperator"></div>
                <button className="add-task-button" onClick={() => setFormVisible(true)} title='Add new task'>
                    <Plus size={18} />
                </button>
            </div>
            <div className="task-list">
                {tasks.length === 0 ? (
                    <p>No Tasks</p>
                ) : (
                    sortTasks(tasks).map((task) => (
                        <div key={task.id} className="task-item">

                        <label class="task-checkbox-container">
                            <input type="checkbox"
                                checked={task.status === 'completed'} 
                                onChange={() => 
                                    handleUpdateTaskStatus(
                                        task.id,
                                        task.status === 'completed' ? 'incomplete' : 'completed'
                                    )
                                } />
                            <span class="checkmark" title='Mark as done'></span>
                        </label>
                        <div className="task-color-tag"
                            style={{
                                backgroundColor: getHexColor(task.color) || '#fbfbfb'
                            }}>
                        </div>
                        <span style={{ cursor: 'default', textDecoration: task.status === 'completed' ? 'line-through': '', color: task.status === 'completed' ? 'darkgrey' : '#414141' }}>
                            {task.description}
                        </span>
                        <div className="task-action-buttons">

                            {/* delete button */}
                            <button className="delete-task-icon" onClick={() => handleDeleteTask(task.id)} title='Delete task'>
                                <Trash2 size={16} />
                            </button>

                            {/* editing button (optional we can take it out */}
                            <button className="edit-task-icon" title='Edit task' onClick={() => {
                                setFormVisible(true);
                                setEditingTask(task);
                                setNewTask({
                                    description: task.description,
                                    priority: task.priority || "",
                                    color: task.color || "",
                                    status: task.status,
                                    notes: task.notes || "",
                                });
                            }}>
                                <FilePenLine size={16} />
                            </button>
                        </div>
                        <div className="item-seperator"></div>
                    </div>
                ))
            )}
            </div>
            
            {isFormVisible && (
                <div className="task-form-overlay">
                    <div className="task-form-container">
                        <button className="close-icon" 
                            onClick={() => {
                                setFormVisible(false);
                                setNewTask({
                                    description: "",
                                    priority: "",
                                    color: "",
                                    status: "incomplete",
                                    notes: "",
                                });
                                setEditingTask(null);
                            }}
                        >
                            &times;
                        </button>
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAddTask();
                            }}
                        >
                            <div className="task-form-group">
                                <input className="input-title"
                                    title='Enter task title.'
                                    type="text"
                                    name="description"
                                    value={newTask.description}
                                    onChange={handleInputChange}
                                    placeholder="Title (required)"
                                    required
                                />
                            </div>

                            {/* priority dropdown */}
                            <div className="task-form-group" ref={priorityRef}>
                                <div className="input-and-icon">
                                    <CircleAlert />
                                    <input
                                        type="text"
                                        name="priority"
                                        value={newTask.priority}
                                        readOnly
                                        onClick={() => toggleDropdown("priority")}
                                        placeholder="Priority (optional)"
                                    />
                                    {dropdownVisible.priority && (
                                        <div className="dropdown priority">
                                            <div onClick={() => handleOptionSelect("priority", "none")}>none</div>
                                            <div onClick={() => handleOptionSelect("priority", "low")}>low</div>
                                            <div onClick={() => handleOptionSelect("priority", "medium")}>medium</div>
                                            <div onClick={() => handleOptionSelect("priority", "high")}>high</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* color dropdown */}
                            <div className="task-form-group" ref={colorRef}>
                                <div className="input-and-icon">
                                    <Palette />
                                    <input
                                        type="text"
                                        name="color"
                                        value={newTask.color}
                                        readOnly
                                        onClick={() => toggleDropdown("color")}
                                        placeholder="Color (optional)"
                                    />
                                    {dropdownVisible.color && (
                                        <div className="dropdown color">
                                            <div className="dropdown-option" onClick={() => handleOptionSelect("color", "none")}>none</div>
                                            {colors.map((color, index) => (
                                                <div
                                                    key={index}
                                                    className="dropdown-option"
                                                    onClick={() => handleOptionSelect("color", color.name, color.hex)}
                                                >
                                                    <FaPalette style={{ color: color.hex }} /> {color.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="task-form-group">
                                <div className="input-and-icon">
                                    <Sticker />
                                    <textarea
                                        name="notes"
                                        value={newTask.notes}
                                        onChange={handleInputChange}
                                        placeholder="Notes (optional)"
                                        rows="4"
                                    ></textarea>
                                </div>
                                <button type="submit" className="save-task-button">Save Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskList;
