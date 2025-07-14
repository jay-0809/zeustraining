
/**
 * Represents a manager for executing and undoing commands.
 */
export class CommandManager {
    constructor() {
        this.undoStack = [];
        this.redoStack = [];
    }
    /**
     * Executes a command and adds it to the undo stack.
     * @param command The command to execute
     */
    executeCommand(command) {
        // console.log(command, "commandManager");

        command.execute();
        this.undoStack.push(command);
        this.redoStack = [];
    }
    /**
     * Undoes the last executed command and adds it to the redo stack.
     */
    undo() {
        const command = this.undoStack.pop();

        if (command) {
            command.undo();
            this.redoStack.push(command);
        }
    }
    /**
     * Redoes the last undone command and adds it to the undo stack.
     */
    redo() {
        const command = this.redoStack.pop();
        if (command) {
            command.execute();
            this.undoStack.push(command);
        }
    }
    clear() {
        this.undoStack = [];
        this.redoStack = [];
    }
}