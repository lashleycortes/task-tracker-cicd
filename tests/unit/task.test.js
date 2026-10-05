const {
    addTask,
    completeTask,
    getPendingTasks,
    tasks
} = require("../../app");

beforeEach(() => {
    tasks.length = 0;
});

test("should add a new task", () => {

    const task =
        addTask("Finish Jenkins project");

    expect(task.title)
        .toBe("Finish Jenkins project");

    expect(task.completed)
        .toBe(false);

});

test("should complete an existing task", () => {

    const task =
        addTask("Test Docker");

    const completedTask =
        completeTask(task.id);

    expect(completedTask.completed)
        .toBe(true);

});

test("should return only pending tasks", () => {

    const task1 =
        addTask("Task One");

    addTask("Task Two");

    completeTask(task1.id);

    const pendingTasks =
        getPendingTasks();

    expect(pendingTasks)
        .toHaveLength(1);

    expect(pendingTasks[0].title)
        .toBe("Task Two");

});